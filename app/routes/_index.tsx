import { useSelection } from "@business-nxt/app-messaging-react";
import type { MetaArgs } from "react-router";

export function meta({}: MetaArgs) {
  return [{ title: "New Business NXT App" }];
}

export default function Home() {
  const selection = useSelection();
  return (
    <main className="flex p-4">
      <div className="flex-1 flex flex-col gap-8 bg">
        <header className="flex flex-col gap-9 text-lg">
          <div className="">Business NXT App Starter</div>
        </header>
        {!selection && (
          <div className="flex flex-col gap-4">
            Are you running this app in Business NXT?
          </div>
        )}
        <div className="w-full space-y-6 px-4">
          <pre>{JSON.stringify(selection, null, 2)}</pre>
        </div>
      </div>
    </main>
  );
}
