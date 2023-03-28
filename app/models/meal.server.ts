import type { User, Meal } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Meal } from "@prisma/client";

export function getMeal({
  id,
  userId,
}: Pick<Meal, "id"> & {
  userId: User["id"];
}) {
  return prisma.meal.findFirst({
    select: { id: true, name: true, description: true },
    where: { id, userId },
  });
}

export function getMealListItems({ userId }: { userId: User["id"] }) {
  return prisma.meal.findMany({
    where: { userId },
    select: { id: true, name: true },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getRandomMeals({
  userId,
  number,
}: {
  userId: User["id"];
  number: number;
}) {
  const randomPick = (values: string[]) => {
    const index = Math.floor(Math.random() * values.length);
    return values[index];
  };
  const mealCount = await prisma.meal.count({ where: { userId } });
  const skip = Math.max(0, Math.floor(Math.random() * mealCount) - number);
  const orderBy = randomPick(["id", "name"]);
  const orderDir = randomPick(["asc", "desc"]);

  return prisma.meal.findMany({
    where: { userId },
    take: number,
    skip: skip,
    orderBy: { [orderBy]: orderDir },
  });
}

export function createMeal({
  name,
  description,
  userId,
}: Pick<Meal, "name" | "description"> & {
  userId: User["id"];
}) {
  return prisma.meal.create({
    data: {
      name,
      description,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export function deleteMeal({
  id,
  userId,
}: Pick<Meal, "id"> & { userId: User["id"] }) {
  return prisma.meal.deleteMany({
    where: { id, userId },
  });
}
