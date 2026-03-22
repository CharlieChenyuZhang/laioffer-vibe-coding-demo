"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import type { Order } from "@/lib/types";
import { ORDER_STATUS_MAP, ORDER_STATUS_COLORS } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const NEXT_STATUS: Record<string, string> = {
  pending: "preparing",
  preparing: "completed",
  completed: "picked_up",
};

const NEXT_STATUS_LABEL: Record<string, string> = {
  pending: "开始制作",
  preparing: "制作完成",
  completed: "确认取餐",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState("all");
  const { user } = useAuth();
  const router = useRouter();

  const fetchOrders = useCallback(async () => {
    const url =
      filter === "all" ? "/api/orders" : `/api/orders?status=${filter}`;
    const res = await fetch(url);
    if (res.ok) setOrders(await res.json());
  }, [filter]);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/login");
      return;
    }
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, [user, router, fetchOrders]);

  const updateStatus = async (orderId: string, currentStatus: string) => {
    const nextStatus = NEXT_STATUS[currentStatus];
    if (!nextStatus) return;

    await fetch(`/api/orders/${orderId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });
    fetchOrders();
  };

  if (!user || user.role !== "admin") return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">订单管理</h1>

      <Tabs value={filter} onValueChange={setFilter} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">全部</TabsTrigger>
          <TabsTrigger value="pending">已下单</TabsTrigger>
          <TabsTrigger value="preparing">制作中</TabsTrigger>
          <TabsTrigger value="completed">已完成</TabsTrigger>
          <TabsTrigger value="picked_up">已取餐</TabsTrigger>
        </TabsList>
      </Tabs>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500 py-12">暂无订单</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-medium">
                      订单号：{order.id.slice(-8)}
                    </p>
                    <p className="text-sm text-gray-500">
                      用户：{order.user?.username}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleString("zh-CN")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={ORDER_STATUS_COLORS[order.status]}>
                      {ORDER_STATUS_MAP[order.status]}
                    </Badge>
                    {NEXT_STATUS[order.status] && (
                      <Button
                        size="sm"
                        onClick={() => updateStatus(order.id, order.status)}
                      >
                        {NEXT_STATUS_LABEL[order.status]}
                      </Button>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between text-sm"
                    >
                      <span>
                        {item.menuItem.name} x{item.quantity}
                      </span>
                      <span>¥{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {order.note && (
                  <p className="text-sm text-orange-600 mt-2">
                    备注：{order.note}
                  </p>
                )}

                <div className="text-right mt-3 pt-3 border-t">
                  <span className="font-bold">
                    合计：¥{order.total.toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
