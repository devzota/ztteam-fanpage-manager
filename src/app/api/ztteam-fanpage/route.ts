import { NextRequest, NextResponse } from "next/server";
import { ztteam_prisma } from "@/lib/ztteam_prisma";
import { ztteam_CreateFanpageSchema } from "@/lib/ztteam_validators";
import * as cheerio from "cheerio";

/** Browser headers cho scrape */
const ZTTEAM_BROWSER_HEADERS: Record<string, string> = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9,vi;q=0.8",
  "Accept-Encoding": "gzip, deflate, br",
  "Cache-Control": "no-cache",
  Pragma: "no-cache",
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "none",
  "Sec-Fetch-User": "?1",
  "Upgrade-Insecure-Requests": "1",
};

/** Trích xuất Page ID từ HTML */
function ztteam_extractPageId(html: string): string | null {
  const patterns = [
    /"pageID":"(\d+)"/,
    /"page_id":"(\d+)"/,
    /fb:\/\/page\/(\d+)/,
    /content="fb:\/\/page\/(\d+)"/,
    /"entity_id":"(\d+)"/,
    /page_id=(\d+)/,
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return match[1];
  }
  return null;
}

/** Scrape thông tin fanpage từ URL */
async function ztteam_scrapePageInfo(url: string) {
  const response = await fetch(url, {
    headers: ZTTEAM_BROWSER_HEADERS,
    redirect: "follow",
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  let name =
    $('meta[property="og:title"]').attr("content") || $("title").text() || "";

  const description =
    $('meta[property="og:description"]').attr("content") || null;

  const imageUrl = $('meta[property="og:image"]').attr("content") || null;

  const pageId = ztteam_extractPageId(html);

  /** Loại bỏ hậu tố Facebook */
  name = name.replace(/\s*[\|–-]\s*Facebook.*$/i, "").trim();

  return { name, description, imageUrl, pageId, url };
}

/** GET - Lấy danh sách fanpages */
export async function GET() {
  try {
    const ztteam_fanpages = await ztteam_prisma.zTTeamFanpage.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: ztteam_fanpages });
  } catch (error) {
    console.error("ZTTeam GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch fanpages" },
      { status: 500 },
    );
  }
}

/** POST - Tạo fanpage mới */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = ztteam_CreateFanpageSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 },
      );
    }

    const { url, name, description, imageUrl, category, pageId } =
      validation.data;

    /** Kiểm tra URL đã tồn tại */
    const existing = await ztteam_prisma.zTTeamFanpage.findUnique({
      where: { url },
    });

    if (existing) {
      return NextResponse.json(
        { error: "This fanpage URL already exists" },
        { status: 409 },
      );
    }

    const ztteam_fanpage = await ztteam_prisma.zTTeamFanpage.create({
      data: {
        url,
        name,
        description: description || null,
        imageUrl: imageUrl || null,
        category: category || null,
        pageId: pageId || null,
      },
    });

    return NextResponse.json(
      { success: true, data: ztteam_fanpage },
      { status: 201 },
    );
  } catch (error) {
    console.error("ZTTeam POST Error:", error);
    return NextResponse.json(
      { error: "Failed to create fanpage" },
      { status: 500 },
    );
  }
}

/** PATCH - Scrape lại và cập nhật thông tin fanpage */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { error: "Fanpage ID is required" },
        { status: 400 },
      );
    }

    /** Tìm fanpage hiện tại */
    const existing = await ztteam_prisma.zTTeamFanpage.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Fanpage not found" }, { status: 404 });
    }

    /** Scrape lại thông tin mới */
    const scraped = await ztteam_scrapePageInfo(existing.url);

    /** Cập nhật vào DB */
    const updated = await ztteam_prisma.zTTeamFanpage.update({
      where: { id },
      data: {
        name: scraped.name || existing.name,
        description: scraped.description || existing.description,
        imageUrl: scraped.imageUrl || existing.imageUrl,
        pageId: scraped.pageId || existing.pageId,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("ZTTeam PATCH Error:", error);
    return NextResponse.json(
      { error: "Failed to refresh fanpage info" },
      { status: 500 },
    );
  }
}

/** DELETE - Xóa fanpage */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Fanpage ID is required" },
        { status: 400 },
      );
    }

    await ztteam_prisma.zTTeamFanpage.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: "Fanpage deleted successfully",
    });
  } catch (error) {
    console.error("ZTTeam DELETE Error:", error);
    return NextResponse.json(
      { error: "Failed to delete fanpage" },
      { status: 500 },
    );
  }
}
