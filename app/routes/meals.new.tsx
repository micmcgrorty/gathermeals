import type { ActionArgs, V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import * as React from "react";

import { createMeal } from "~/models/meal.server";
import { requireUserId } from "~/session.server";

export const meta: V2_MetaFunction = () => [{ title: "New Meal" }];

export async function action({ request }: ActionArgs) {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const name = formData.get("name");
  const recipe = formData.get("recipe");

  if (typeof name !== "string" || name.length === 0) {
    return json(
      { errors: { name: "Name is required", recipe: null } },
      { status: 400 }
    );
  }

  if (typeof recipe !== "string" || recipe.length === 0) {
    return json(
      { errors: { recipe: "Recipe is required", name: null } },
      { status: 400 }
    );
  }

  const meal = await createMeal({ name, userId, recipe });

  return redirect(`/meals/${meal.id}`);
}

export default function NewMealPage() {
  const actionData = useActionData<typeof action>();
  const nameRef = React.useRef<HTMLInputElement>(null);
  const recipeRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.name) {
      nameRef.current?.focus();
    } else if (actionData?.errors?.recipe) {
      recipeRef.current?.focus();
    }
  }, [actionData]);

  return (
    <>
      <p className="mb-2">
        Use this form to add a new meal to your list of favourites. We'll need
        the name of the recipe and also a link to the recipe. The link will be
        used when generating your weekly shopping list.
      </p>
      <Form
        method="post"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          width: "100%",
        }}
      >
        <div>
          <label className="flex w-full flex-col gap-1">
            <span>Name: </span>
            <input
              ref={nameRef}
              name="name"
              className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
              aria-invalid={actionData?.errors?.name ? true : undefined}
              aria-errormessage={
                actionData?.errors?.name ? "name-error" : undefined
              }
            />
          </label>
          {actionData?.errors?.name && (
            <div className="pt-1 text-red-700" id="title-error">
              {actionData.errors.name}
            </div>
          )}
        </div>

        <div>
          <label className="flex w-full flex-col gap-1">
            <span>Link to recipe: </span>
            <input
              ref={recipeRef}
              name="recipe"
              className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
              aria-invalid={actionData?.errors?.recipe ? true : undefined}
              aria-errormessage={
                actionData?.errors?.recipe ? "recipe-error" : undefined
              }
            />
          </label>
          {actionData?.errors?.recipe && (
            <div className="pt-1 text-red-700" id="title-error">
              {actionData.errors.recipe}
            </div>
          )}
        </div>

        <div className="text-right">
          <button
            type="submit"
            className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
          >
            Save
          </button>
        </div>
      </Form>
    </>
  );
}
