import { Outlet, useRevalidator, type LoaderFunctionArgs } from "react-router";
import type { Route } from "./+types/_protected";
import { getUserWithAccessToken } from "~/.server/services/auth";
import { useEffect } from "react";
import { useSharedWorker } from "~/hooks/useSharedWorker";
import { useSharedState } from "~/hooks/useSharedState";
import { LoginComponent } from "~/components/login-component";
import { destroySession } from "~/.server/services/session";
import { match } from "ts-pattern";
import { UserProvider } from "~/hooks/useUser";
import { useEditStatus } from "@business-nxt/app-messaging-react";
import { cn } from "~/lib/utils";

export async function loader(ctx: Route.LoaderArgs) {
  const { user, cookie } = await getUserWithAccessToken(ctx);
  const params = new URL(ctx.request.url).searchParams;
  const sub = params.get("sub");

  if (user && sub && sub !== user?.sub) {
    const cookie = await destroySession(ctx);
    return Response.json(
      {
        user: null,
      },
      {
        headers: {
          "Set-Cookie": cookie,
        },
      }
    );
  }

  return Response.json(
    {
      user,
    },
    {
      headers: cookie
        ? {
            "Set-Cookie": cookie,
          }
        : {},
    }
  );
}

export default function Protected({ loaderData }: Route.ComponentProps) {
  const { user } = loaderData;
  const { revalidate } = useRevalidator();
  const editStatus = useEditStatus();

  useSharedWorker({
    actions: {
      revalidate: () => {
        revalidate();
      },
    },
  });

  useEffect(() => {
    if (user) {
      // revalidate when there's 3 minutes left
      // @ts-ignore
      const time = user.expires_at - Date.now() - 180000;
      if (time > 0) {
        const timeout = setTimeout(() => {
          revalidate();
        }, time);
        return () => {
          clearTimeout(timeout);
        };
      } else {
        revalidate();
      }
    }
  }, [user, revalidate]);

  const { state } = useSharedState();

  return (
    <>
      <div
        className={cn(
          "flex flex-1 flex-col h-screen transition-opacity relative overflow-x-hidden scrollbar-",
          {
            "pointer-events-none": editStatus?.editing,
            "opacity-0": editStatus?.messageType !== "edit-session",
          }
        )}
      >
        {match({
          isUserSignedIn: !!user,
          ui: state?.ui,
        })
          .when(
            (x) => x.isUserSignedIn,
            () => (
              <UserProvider value={user}>
                <Outlet />
              </UserProvider>
            )
          )
          .otherwise(() => (
            <LoginComponent />
          ))}
      </div>
    </>
  );
}
