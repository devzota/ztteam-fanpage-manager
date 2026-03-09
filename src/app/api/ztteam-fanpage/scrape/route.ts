import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { ztteam_FacebookUrlSchema } from "@/lib/ztteam_validators";

/** Interface kết quả scrape */
interface ZTTeamScrapeResult {
  name: string;
  description: string | null;
  imageUrl: string | null;
  pageId: string | null;
  url: string;
}

/** Headers giả lập browser thực */
const ZTTEAM_BROWSER_HEADERS: Record<string, string> = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  "Accept-Encoding": "gzip, deflate, br",
  "Cache-Control": "no-cache",
  Pragma: "no-cache",
  "Sec-Ch-Ua": '"Not_A Brand";v="8", "Chromium";v="131", "Google Chrome";v="131"',
  "Sec-Ch-Ua-Mobile": "?0",
  "Sec-Ch-Ua-Platform": '"macOS"',
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "none",
  "Sec-Fetch-User": "?1",
  "Upgrade-Insecure-Requests": "1",
};

/** Trích xuất Page ID từ HTML */
function ztteam_extractPageId(html: string): string | null {
  /** Tìm page_id trong meta tags hoặc script data */
  const patterns = [
    /\"pageID\":\"(\d+)\"/,
    /\"page_id\":\"(\d+)\"/,
    /fb:\/\/page\/(\d+)/,
    /content=\"fb:\/\/page\/(\d+)\"/,
    /\"entity_id\":\"(\d+)\"/,
    /al:android:url\" content=\"fb:\/\/page\/(\d+)\"/,
    /al:ios:url\" content=\"fb:\/\/page\/(\d+)\"/,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/** Scrape OG metadata từ Facebook page URL bằng fetch + cheerio */
async function ztteam_scrapePageInfo(
  url: string
): Promise<ZTTeamScrapeResult> {
  const response = await fetch(url, {
    headers: ZTTEAM_BROWSER_HEADERS,
    redirect: "follow",
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  /** Lấy OG tags */
  const ogTitle =
    $('meta[property="og:title"]').attr("content") ||
    $('meta[name="og:title"]').attr("content") ||
    "";

  const ogDescription =
    $('meta[property="og:description"]').attr("content") ||
    $('meta[name="og:description"]').attr("content") ||
    $('meta[name="description"]').attr("content") ||
    "";

  const ogImage =
    $('meta[property="og:image"]').attr("content") ||
    $('meta[name="og:image"]').attr("content") ||
    "";

  /** Lấy Page ID từ app link meta tags hoặc HTML */
  const appLinkPageId =
    $('meta[property="al:android:url"]').attr("content")?.match(/fb:\/\/page\/(\d+)/)?.[1] ||
    $('meta[property="al:ios:url"]').attr("content")?.match(/fb:\/\/page\/(\d+)/)?.[1] ||
    null;

  const pageId = appLinkPageId || ztteam_extractPageId(html);

  /** Fallback: lấy từ title tag */
  const pageTitle = $("title").text().trim();

  /** Xác định tên page */
  let name = ogTitle || pageTitle || "Unknown Page";

  /** Loại bỏ suffix " | Facebook" hoặc " - Facebook" */
  name = name.replace(/\s*[|\-–]\s*Facebook\s*$/i, "").trim();

  return {
    name,
    description: ogDescription || null,
    imageUrl: ogImage || null,
    pageId,
    url,
  };
}

/** POST — nhận URL và trả về thông tin page */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    /** Validate URL bằng Zod */
    const validation = ztteam_FacebookUrlSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const pageInfo = await ztteam_scrapePageInfo(validation.data.url);

    /** Kiểm tra có lấy được tên không */
    if (!pageInfo.name || pageInfo.name === "Unknown Page") {
      return NextResponse.json(
        { error: "Could not extract page name. The page may be private or restricted." },
        { status: 422 }
      );
    }

    return NextResponse.json({
      success: true,
      data: pageInfo,
    });
  } catch (error) {
    console.error("ZTTeam Scrape Error:", error);
    return NextResponse.json(
      {
        error:
          "Failed to fetch page information. Please check the URL and try again.",
      },
      { status: 500 }
    );
  }
}
