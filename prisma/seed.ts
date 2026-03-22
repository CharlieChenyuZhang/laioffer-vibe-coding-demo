import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { hashSync } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      password: hashSync("admin123", 10),
      role: "admin",
    },
  });

  // Create customer user
  await prisma.user.upsert({
    where: { username: "customer" },
    update: {},
    create: {
      username: "customer",
      password: hashSync("customer123", 10),
      role: "customer",
    },
  });

  // Create categories
  const mainDish = await prisma.category.upsert({
    where: { name: "主食" },
    update: {},
    create: { name: "主食", sortOrder: 1 },
  });

  const sideDish = await prisma.category.upsert({
    where: { name: "小吃" },
    update: {},
    create: { name: "小吃", sortOrder: 2 },
  });

  const drink = await prisma.category.upsert({
    where: { name: "饮料" },
    update: {},
    create: { name: "饮料", sortOrder: 3 },
  });

  const dessert = await prisma.category.upsert({
    where: { name: "甜点" },
    update: {},
    create: { name: "甜点", sortOrder: 4 },
  });

  // Create menu items
  const items = [
    { name: "宫保鸡丁", description: "经典川菜，鸡肉搭配花生米", price: 28, categoryId: mainDish.id },
    { name: "鱼香肉丝", description: "酸甜口味，猪肉丝搭配木耳", price: 26, categoryId: mainDish.id },
    { name: "红烧牛肉面", description: "浓郁牛肉汤底，手工拉面", price: 32, categoryId: mainDish.id },
    { name: "扬州炒饭", description: "经典蛋炒饭，配虾仁火腿", price: 22, categoryId: mainDish.id },
    { name: "麻婆豆腐", description: "麻辣鲜香，嫩豆腐配肉末", price: 20, categoryId: mainDish.id },
    { name: "春卷", description: "酥脆外皮，蔬菜猪肉馅", price: 12, categoryId: sideDish.id },
    { name: "煎饺", description: "底部金黄酥脆的猪肉饺子", price: 15, categoryId: sideDish.id },
    { name: "凉拌黄瓜", description: "清爽开胃，蒜香调味", price: 10, categoryId: sideDish.id },
    { name: "珍珠奶茶", description: "经典台式奶茶，Q弹珍珠", price: 15, categoryId: drink.id },
    { name: "柠檬水", description: "新鲜柠檬，清凉解渴", price: 8, categoryId: drink.id },
    { name: "可乐", description: "冰镇可口可乐", price: 6, categoryId: drink.id },
    { name: "芒果布丁", description: "新鲜芒果制作，香滑细腻", price: 16, categoryId: dessert.id },
    { name: "红豆汤圆", description: "软糯汤圆配红豆沙", price: 14, categoryId: dessert.id },
  ];

  for (const item of items) {
    await prisma.menuItem.create({ data: item });
  }

  console.log("Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
