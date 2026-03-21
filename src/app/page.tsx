"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useCart } from "@/contexts/cart-context";
import type { Category, MenuItem } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

export default function MenuPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const { user, loading: authLoading } = useAuth();
  const { addItem, items: cartItems } = useCart();
  const router = useRouter();

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data: Category[]) => {
        setCategories(data);
        if (data.length > 0) setActiveCategory(data[0].id);
      });
  }, []);

  useEffect(() => {
    if (!authLoading && user?.role === "admin") {
      router.push("/admin/orders");
    }
  }, [user, authLoading, router]);

  const getCartQuantity = (menuItemId: string) => {
    return cartItems.find((i) => i.menuItem.id === menuItemId)?.quantity || 0;
  };

  const handleAddItem = (item: MenuItem) => {
    if (!user) {
      router.push("/login");
      return;
    }
    addItem(item);
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <p className="text-gray-500">加载中...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">菜单</h1>

      {/* Category tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <Button
            key={cat.id}
            variant={activeCategory === cat.id ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(cat.id)}
          >
            {cat.name}
          </Button>
        ))}
      </div>

      {/* Menu items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories
          .find((c) => c.id === activeCategory)
          ?.items.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                  {getCartQuantity(item.id) > 0 && (
                    <Badge variant="secondary">
                      x{getCartQuantity(item.id)}
                    </Badge>
                  )}
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-lg font-bold text-red-600">
                    ¥{item.price}
                  </span>
                  <Button size="sm" onClick={() => handleAddItem(item)}>
                    加入购物车
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      {categories.find((c) => c.id === activeCategory)?.items.length === 0 && (
        <p className="text-center text-gray-500 py-12">该分类暂无菜品</p>
      )}
    </div>
  );
}
