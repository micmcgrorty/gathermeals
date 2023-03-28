import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";

import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";
import { getMealListItems } from "~/models/meal.server";

import type { Meal } from "~/models/meal.server";

export const meta: V2_MetaFunction = () => [{ title: "GatherMeals" }];

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserId(request);
  const meals = await getMealListItems({ userId });
  return json({ meals });
}

export default function NotesPage() {
  const data = useLoaderData<typeof loader>();
  const user = useUser();

  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
        <h1 className="text-3xl font-bold">
          <Link to=".">Meals</Link>
        </h1>
        <p>{user.email}</p>
        <Form action="/logout" method="post">
          <button
            type="submit"
            className="rounded bg-slate-600 py-2 px-4 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
          >
            Logout
          </button>
        </Form>
      </header>

      <main className="flex h-full bg-white">
        <div className="h-full w-80 border-r bg-gray-50">
          <Link to="plan" className="block p-4 text-xl text-blue-500">
            Plan your week
          </Link>
          <Link to="new" className="block p-4 text-xl text-blue-500">
            + New Meal
          </Link>

          <hr />

          {data?.meals.length === 0 ? (
            <p className="p-4">No meals yet</p>
          ) : (
            <ol>
              {data?.meals.map((meal: Meal) => (
                <li key={meal.id}>
                  <NavLink
                    className={({ isActive }) =>
                      `block border-b p-4 text-xl ${isActive ? "bg-white" : ""}`
                    }
                    to={meal.id}
                  >
                    {meal.name}
                  </NavLink>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
