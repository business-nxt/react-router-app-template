import { useSharedState } from "~/hooks/useSharedState";
import { Button } from "~/components/ui/button";
import { Clock, XCircle } from "lucide-react";
import { cn } from "~/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { useEffect, useRef } from "react";

export function LoginComponent() {
  const { state, setState, postMessage } = useSharedState();
  const proxyRef = useRef<Window | null>(null);

  useEffect(() => {
    setState({
      ui: "normal",
    });
  }, []);

  return (
    <div className="flex flex-col flex-1 justify-center items-center align-middle gap-8 max-w-md mx-auto">
      {state?.ui === "login" && (
        <>
          <Alert>
            <Clock className="h-4 w-4" />
            <AlertTitle>Login in progress</AlertTitle>
            <AlertDescription>
              Please complete the sign in process in the popup window.
            </AlertDescription>
          </Alert>
          <Button
            type="button"
            className="gap-2"
            variant="outline"
            onClick={() => {
              setState({
                ui: "normal",
              });
              proxyRef.current?.close();
              postMessage("revalidate");
            }}
          >
            <XCircle className="size-4" />
            Cancel
          </Button>
        </>
      )}
      <Button
        type="button"
        className={cn("gap-2 transition-opacity", {
          hidden: state?.ui && state.ui !== "normal",
        })}
        onClick={() => {
          setState({
            ui: "login",
          });
          const proxy = window.open(
            "/auth/login",
            "visma-login",
            "width=500,height=700"
          );
          proxyRef.current = proxy;
          const abort = new AbortController();
          const interval = setInterval(() => {
            if (!proxy?.closed) {
              return;
            }
            completed();
          }, 1000);

          const completed = () => {
            postMessage("revalidate");
            clearInterval(interval);
            abort.abort();
            setState(
              {
                ui: "normal",
              },
              {
                delay: 1000,
              }
            );
          };

          proxy?.addEventListener("beforeunload", completed, {
            signal: abort.signal,
          });
          proxy?.addEventListener("message", (e) => completed, {
            signal: abort.signal,
          });
        }}
      >
        Activate Application
      </Button>
    </div>
  );
}
