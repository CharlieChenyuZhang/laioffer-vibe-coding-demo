import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

const VALID_TRANSITIONS: Record<string, string[]> = {
  pending: ["preparing"],
  preparing: ["completed"],
  completed: ["picked_up"],
};

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  const { id } = await params;
  const { status } = await request.json();

  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) {
    return NextResponse.json({ error: "订单不存在" }, { status: 404 });
  }

  const validNext = VALID_TRANSITIONS[order.status];
  if (!validNext || !validNext.includes(status)) {
    return NextResponse.json(
      { error: `不能从 ${order.status} 转换到 ${status}` },
      { status: 400 }
    );
  }

  const updated = await prisma.order.update({
    where: { id },
    data: { status },
    include: {
      items: { include: { menuItem: true } },
      user: { select: { username: true } },
    },
  });

  return NextResponse.json(updated);
}
