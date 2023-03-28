import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { getRandomMeals } from "~/models/meal.server";
import { requireUserId } from "~/session.server";

import type { Meal } from "~/models/meal.server";

export const meta: V2_MetaFunction = () => [{ title: "Weekly Meal Plan" }];

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserId(request);
  const meals = await getRandomMeals({ userId, number: 7 });
  return json({ meals });
}

export default function MealPlanPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <h3 className="text-2xl font-bold">Here are your meals for the week!</h3>
      <hr className="my-4" />
      {data.meals.map((meal: any) => {
        return <p key={meal.id}>{meal.name}</p>;
      })}
    </div>
  );
}
