import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  const items = await prisma.menuItem.findMany({
    include: { category: true },
    orderBy: { category: { sortOrder: "asc" } },
  });
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  const data = await request.json();
  const item = await prisma.menuItem.create({
    data: {
      name: data.name,
      description: data.description || "",
      price: data.price,
      image: data.image || "",
      available: data.available ?? true,
      categoryId: data.categoryId,
    },
    include: { category: true },
  });
  return NextResponse.json(item);
}
