import { SendMessage, useSelection } from "@business-nxt/app-messaging-react";
import { Lock } from "lucide-react";
import { Link, useSearchParams, type MetaArgs } from "react-router";
import { Button } from "~/components/ui/button";

export function meta({}: MetaArgs) {
  return [{ title: "New Business NXT App" }];
}

export default function Home() {
  const selection = useSelection();
  const [searchParams] = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());

  return (
    <main className="flex p-4">
      <div className="flex-1 flex flex-col gap-8 bg">
        <header className="flex flex-col gap-4">
          <div className="text-lg">Business NXT App Starter</div>
          <p>
            This is a starter template for a Business NXT app. You can use this
            template to get started with your app.
          </p>
          {selection && (
            <p>
              Below you should see the selection and params from Business NXT.
            </p>
          )}
          {!selection && (
            <p>
              If you are running this app in Business NXT, you should see the
              selection and params. If you don't see a selection, make sure to
              add a table view in the layout.
            </p>
          )}
        </header>
        {!selection && (
          <div className="flex flex-col gap-4">
            Are you running this app in Business NXT?
          </div>
        )}
        <div className="flex flex-row gap-4">
          {selection && (
            <Button
              type="button"
              onClick={async () => {
                await SendMessage({
                  messageType: "refresh-data-request",
                  table: selection?.table,
                });
              }}
            >
              Refresh Data in {selection?.table}
            </Button>
          )}
          <Button asChild>
            <Link
              to={`/protected-demo?${searchParams.toString()}`}
              className="gap-2"
            >
              <Lock className="size-4" />
              Go to protected page
            </Link>
          </Button>
        </div>
        <div className="w-full space-y-6 px-4">
          <pre className="text-sm">
            {JSON.stringify({ selection, params }, null, 2)}
          </pre>
        </div>
      </div>
    </main>
  );
}
