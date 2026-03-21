"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { useCart } from "@/contexts/cart-context";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold">
          🍜 点餐系统
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              {user.role === "customer" && (
                <>
                  <Link href="/" className="text-sm hover:text-gray-600">
                    菜单
                  </Link>
                  <Link
                    href="/cart"
                    className="text-sm hover:text-gray-600 relative"
                  >
                    购物车
                    {itemCount > 0 && (
                      <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {itemCount}
                      </span>
                    )}
                  </Link>
                  <Link
                    href="/orders"
                    className="text-sm hover:text-gray-600"
                  >
                    我的订单
                  </Link>
                </>
              )}
              {user.role === "admin" && (
                <>
                  <Link
                    href="/admin/menu"
                    className="text-sm hover:text-gray-600"
                  >
                    菜单管理
                  </Link>
                  <Link
                    href="/admin/orders"
                    className="text-sm hover:text-gray-600"
                  >
                    订单管理
                  </Link>
                </>
              )}
              <span className="text-sm text-gray-500">{user.username}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                退出
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline" size="sm">
                  登录
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">注册</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
