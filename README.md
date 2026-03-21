# 点餐系统

全栈点餐服务 Web App，使用 Next.js + SQLite + Prisma 构建。

## 功能

- 菜单浏览（按分类展示）
- 购物车 + 下单
- 用户注册/登录
- 订单状态实时更新（轮询）
- 管理员后台（菜单管理、订单管理）

## Tech Stack

- **前端**: Next.js 16 (App Router) + Tailwind CSS + shadcn/ui
- **后端**: Next.js API Routes
- **数据库**: SQLite + Prisma ORM
- **认证**: JWT (jose)

## 快速开始

```bash
# 安装依赖
npm install

# 复制环境变量
cp .env.example .env

# 初始化数据库
npx prisma generate
npx prisma migrate dev

# 导入测试数据
npx tsx prisma/seed.ts

# 启动开发服务器
npm run dev
```

打开 http://localhost:3000

## 测试账号

| 角色 | 用户名 | 密码 |
|------|--------|------|
| 管理员 | admin | admin123 |
| 顾客 | customer | customer123 |
