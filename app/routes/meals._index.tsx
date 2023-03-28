import { Link } from "@remix-run/react";
import type { V2_MetaFunction } from "@remix-run/node";

export const meta: V2_MetaFunction = () => [{ title: "GatherMeals" }];

export default function MealIndexPage() {
  return (
    <p>
      No meal selected. Select a meal on the left,{" "}
      <Link to="new" className="text-blue-500 underline">
        create a new meal
      </Link>
      , or{" "}
      <Link to="plan" className="text-blue-500 underline">
        plan a week of meals.
      </Link>
    </p>
  );
}
