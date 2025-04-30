import {
  SendMessage,
  useEditStatus,
  useSelection,
} from "@business-nxt/app-messaging-react";
import { Button } from "~/components/ui/button";
import { useUser } from "~/hooks/useUser";

import { useQuery } from "@tanstack/react-query";
import { createGraphQLSDK } from "~/gql/createGraphQLSDK";

export default function ProtectedDemo() {
  const user = useUser();

  const selection = useSelection();
  const editStatus = useEditStatus();

  const availableCompanies = useQuery({
    queryKey: ["availableCompanies", user?.sub],
    queryFn: async () => {
      const sdk = createGraphQLSDK();
      const companies = await sdk.getAvailableCompanies();
      return companies.availableCompanies?.items;
    },
    enabled: !!user?.sub,
  });

  return (
    <main className="flex p-4 flex-col gap-8">
      <header className="flex flex-col gap-4">
        <div className="text-lg">Business NXT App Starter - Protected Page</div>
      </header>
      <p>Welcome {user?.name}</p>
      <div className="flex flex-row">
        {selection && (
          <Button
            type="button"
            disabled={editStatus?.editing}
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
      </div>
      <pre>
        {JSON.stringify(
          {
            selection,
            editStatus,
            availableCompanies: availableCompanies.data,
          },
          null,
          2
        )}
      </pre>
    </main>
  );
}
