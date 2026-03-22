"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { useCart } from "@/contexts/cart-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

export default function CartPage() {
  const { user } = useAuth();
  const { items, updateQuantity, removeItem, clearCart, total } = useCart();
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  if (!user) {
    router.push("/login");
    return null;
  }

  const handleSubmitOrder = async () => {
    if (items.length === 0) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            menuItemId: i.menuItem.id,
            quantity: i.quantity,
          })),
          note,
        }),
      });
      if (res.ok) {
        clearCart();
        router.push("/orders");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">购物车</h1>
        <p className="text-gray-500 mb-6">购物车是空的</p>
        <Button onClick={() => router.push("/")}>去点餐</Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">购物车</h1>

      <Card>
        <CardContent className="p-4 space-y-4">
          {items.map((item) => (
            <div key={item.menuItem.id}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-medium">{item.menuItem.name}</h3>
                  <p className="text-sm text-gray-500">
                    ¥{item.menuItem.price} / 份
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      updateQuantity(item.menuItem.id, item.quantity - 1)
                    }
                  >
                    -
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      updateQuantity(item.menuItem.id, item.quantity + 1)
                    }
                  >
                    +
                  </Button>
                  <span className="w-16 text-right font-medium">
                    ¥{(item.menuItem.price * item.quantity).toFixed(2)}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(item.menuItem.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    删除
                  </Button>
                </div>
              </div>
              <Separator className="mt-4" />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-base">备注</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="有什么特殊要求吗？（可选）"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </CardContent>
      </Card>

      <div className="mt-6 flex items-center justify-between">
        <div>
          <span className="text-gray-500">合计：</span>
          <span className="text-2xl font-bold text-red-600">
            ¥{total.toFixed(2)}
          </span>
        </div>
        <Button
          size="lg"
          onClick={handleSubmitOrder}
          disabled={submitting}
        >
          {submitting ? "提交中..." : "提交订单"}
        </Button>
      </div>
    </div>
  );
}
