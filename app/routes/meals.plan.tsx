import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { getRandomMeals } from "~/models/meal.server";
import { requireUserId } from "~/session.server";

export const meta: V2_MetaFunction = () => [{ title: "Weekly Meal Plan" }];

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserId(request);
  const { meals, shoppingList } = await getRandomMeals({ userId, number: 7 });
  return json({ meals, shoppingList });
}

export default function MealPlanPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <h3 className="text-2xl font-bold">
        Here are your meals for the week and a shopping list
      </h3>
      <hr className="my-4" />
      <div className="flex items-start justify-between">
        <div className="w-1/2">
          <h4 className="text-xl font-bold">Meals</h4>
          {data.meals.map((meal: any) => {
            return <p key={meal.id}>{meal.name}</p>;
          })}
        </div>
        <div className="w-1/2">
          <h4 className="text-xl font-bold">Shopping list</h4>
          {data?.shoppingList?.map((item: any) => {
            return <p key={item}>{item}</p>;
          })}
        </div>
      </div>
    </div>
  );
}
