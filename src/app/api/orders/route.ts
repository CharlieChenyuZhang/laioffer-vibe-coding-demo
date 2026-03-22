import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  const where =
    session.role === "admin"
      ? status
        ? { status }
        : {}
      : status
        ? { userId: session.userId, status }
        : { userId: session.userId };

  const orders = await prisma.order.findMany({
    where,
    include: {
      items: { include: { menuItem: true } },
      user: { select: { username: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  const { items, note } = await request.json();

  if (!items || items.length === 0) {
    return NextResponse.json({ error: "订单不能为空" }, { status: 400 });
  }

  // Fetch menu items to get current prices
  const menuItemIds = items.map((i: { menuItemId: string }) => i.menuItemId);
  const menuItems = await prisma.menuItem.findMany({
    where: { id: { in: menuItemIds } },
  });

  const menuItemMap = new Map(menuItems.map((mi) => [mi.id, mi]));

  let total = 0;
  const orderItems = items.map(
    (item: { menuItemId: string; quantity: number }) => {
      const menuItem = menuItemMap.get(item.menuItemId);
      if (!menuItem) throw new Error(`菜品不存在: ${item.menuItemId}`);
      const price = menuItem.price;
      total += price * item.quantity;
      return {
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        price,
      };
    }
  );

  const order = await prisma.order.create({
    data: {
      userId: session.userId,
      total,
      note: note || "",
      items: { create: orderItems },
    },
    include: {
      items: { include: { menuItem: true } },
    },
  });

  return NextResponse.json(order);
}
