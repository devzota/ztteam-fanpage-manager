import { NextRequest, NextResponse } from "next/server";
import { ztteam_prisma } from "@/lib/ztteam_prisma";
import { ztteam_CreateFanpageSchema } from "@/lib/ztteam_validators";

/** GET — Lấy danh sách tất cả fanpage */
export async function GET() {
  try {
    const ztteam_fanpages = await ztteam_prisma.zTTeamFanpage.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: ztteam_fanpages,
    });
  } catch (error) {
    console.error("ZTTeam GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch fanpages" },
      { status: 500 }
    );
  }
}

/** POST — Thêm fanpage mới vào database */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    /** Validate dữ liệu bằng Zod */
    const validation = ztteam_CreateFanpageSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    /** Kiểm tra trùng lặp */
    const ztteam_existing = await ztteam_prisma.zTTeamFanpage.findUnique({
      where: { url: validation.data.url },
    });

    if (ztteam_existing) {
      return NextResponse.json(
        { error: "This fanpage URL already exists" },
        { status: 409 }
      );
    }

    const ztteam_fanpage = await ztteam_prisma.zTTeamFanpage.create({
      data: {
        url: validation.data.url,
        name: validation.data.name,
        description: validation.data.description || null,
        imageUrl: validation.data.imageUrl || null,
        category: validation.data.category || null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: ztteam_fanpage,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("ZTTeam POST Error:", error);
    return NextResponse.json(
      { error: "Failed to create fanpage" },
      { status: 500 }
    );
  }
}

/** DELETE — Xóa fanpage theo ID */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID is required" },
        { status: 400 }
      );
    }

    await ztteam_prisma.zTTeamFanpage.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Fanpage deleted successfully",
    });
  } catch (error) {
    console.error("ZTTeam DELETE Error:", error);
    return NextResponse.json(
      { error: "Failed to delete fanpage" },
      { status: 500 }
    );
  }
}
