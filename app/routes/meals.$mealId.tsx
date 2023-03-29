import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import invariant from "tiny-invariant";

import { deleteMeal, getMeal } from "~/models/meal.server";
import { requireUserId } from "~/session.server";

export const meta: V2_MetaFunction = () => [{ title: "Meal Detail" }];

export async function loader({ request, params }: LoaderArgs) {
  const userId = await requireUserId(request);
  invariant(params.mealId, "mealId not found");

  const meal = await getMeal({ userId, id: params.mealId });
  if (!meal) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ meal });
}

export async function action({ request, params }: ActionArgs) {
  const userId = await requireUserId(request);
  invariant(params.mealId, "mealId not found");

  await deleteMeal({ userId, id: params.mealId });

  return redirect("/meals");
}

export default function MealDetailsPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <h3 className="text-2xl font-bold">{data.meal.name}</h3>
      {data.meal.recipe && (
        <div className="pt-3">
          <a target="_blank" rel="noreferrer" href={data.meal.recipe}>
            Link to recipe
          </a>
        </div>
      )}
      <hr className="my-4" />
      <Form method="post">
        <button
          type="submit"
          className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Delete
        </button>
      </Form>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (error instanceof Error) {
    return <div>An unexpected error occurred: {error.message}</div>;
  }

  if (!isRouteErrorResponse(error)) {
    return <h1>Unknown Error</h1>;
  }

  if (error.status === 404) {
    return <div>Meal not found</div>;
  }

  return <div>An unexpected error occurred: {error.statusText}</div>;
}
