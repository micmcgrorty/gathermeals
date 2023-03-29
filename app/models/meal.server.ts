import { Configuration, OpenAIApi } from "openai";
import type { User, Meal } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Meal } from "@prisma/client";

export async function getMeal({
  id,
  userId,
}: Pick<Meal, "id"> & {
  userId: User["id"];
}) {
  return prisma.meal.findFirst({
    select: { id: true, name: true, recipe: true },
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

  const meals = await prisma.meal.findMany({
    where: { userId },
    take: number,
    skip: skip,
    orderBy: { [orderBy]: orderDir },
  });

  return meals;
}

export async function getShoppingList(meals: any) {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const mealRecipeLinks = meals.map((meal: any) => meal.recipe);

  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `Could you generate me a single shopping list as comma separated list for the following recipes. Do not include duplicates. Do not separate the shopping list by recipe. Do not include a full stop at the end of the list. ${mealRecipeLinks.join(
      ", "
    )}`,
    max_tokens: 120,
    temperature: 0.3,
    top_p: 1.0,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
  });

  return { shoppingList: completion.data.choices[0].text?.split(", ") };
}

export function createMeal({
  name,
  recipe,
  userId,
}: Pick<Meal, "name" | "recipe"> & {
  userId: User["id"];
}) {
  return prisma.meal.create({
    data: {
      name,
      recipe,
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
