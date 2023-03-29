import { Suspense } from "react";
import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { defer } from "@remix-run/node";
import { Await, useLoaderData } from "@remix-run/react";

import { getRandomMeals, getShoppingList } from "~/models/meal.server";
import { requireUserId } from "~/session.server";

export const meta: V2_MetaFunction = () => [{ title: "Weekly Meal Plan" }];

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserId(request);
  const meals = await getRandomMeals({ userId, number: 7 });
  const shoppingListPromise = getShoppingList(meals);
  return defer({ meals, shoppingListPromise });
}

export default function MealPlanPage() {
  const { meals, shoppingListPromise } = useLoaderData<typeof loader>();

  return (
    <div>
      <h3 className="text-2xl font-bold">
        Here are your meals for the week and a shopping list
      </h3>
      <hr className="my-4" />
      <div className="flex items-start justify-between">
        <div className="w-1/2">
          <h4 className="text-xl font-bold">Meals</h4>
          {meals?.map((meal: any) => {
            return <p key={meal.id}>{meal.name}</p>;
          })}
        </div>
        <div className="w-1/2">
          <h4 className="text-xl font-bold">Shopping list</h4>
          <Suspense fallback={<p>Loading your shopping list...</p>}>
            <Await resolve={shoppingListPromise}>
              {({ shoppingList }) =>
                shoppingList?.map((item: any) => <p key={item}>{item}</p>)
              }
            </Await>
          </Suspense>
        </div>
      </div>
    </div>
  );
}
