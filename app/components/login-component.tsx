import { useSharedState } from "~/hooks/useSharedState";
import { Button } from "~/components/ui/button";
import { Clock, XCircle, AlertCircle, ShieldCheck } from "lucide-react";
import { cn } from "~/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { useEffect, useRef, useState } from "react";
import { useStorageAccess } from "~/hooks/useStorageAccess";

export function LoginComponent() {
  const { state, setState, postMessage } = useSharedState();
  const proxyRef = useRef<Window | null>(null);
  const { needsRequest, hasAccess, requestAccess, isLoading } = useStorageAccess();
  const [isRequestingAccess, setIsRequestingAccess] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    // Only set initial state if it's not already set
    // This prevents overriding the state from other iframes
    if (!state || !state.ui) {
      console.log("[LoginComponent] Setting initial state to normal");
      setState({
        ui: "normal",
      });
    }
  }, [setState, state]);

  const handleActivateClick = async () => {
    console.log("[LoginComponent] handleActivateClick called", {
      needsRequest,
      hasAccess,
    });

    // If we need storage access (Safari in iframe), request it first
    if (needsRequest && !hasAccess) {
      console.log("[LoginComponent] Requesting storage access...");
      setIsRequestingAccess(true);
      const granted = await requestAccess();
      setIsRequestingAccess(false);
      console.log("[LoginComponent] Storage access result:", granted);

      if (!granted) {
        console.log("[LoginComponent] Storage access denied, aborting");
        setAccessDenied(true);
        return;
      }
    }

    // Proceed with login
    console.log("[LoginComponent] Setting state to login");
    setState({
      ui: "login",
    });

    console.log("[LoginComponent] Opening popup...");
    const proxy = window.open(
      "/auth/login",
      "visma-login",
      "width=500,height=700"
    );

    console.log("[LoginComponent] Popup opened:", {
      proxy: proxy,
      isNull: proxy === null,
      closed: proxy?.closed,
    });

    proxyRef.current = proxy;
    const abort = new AbortController();
    let checkCount = 0;

    const interval = setInterval(() => {
      checkCount++;
      const isClosed = proxy?.closed;
      console.log(`[LoginComponent] Interval check #${checkCount}:`, {
        proxyIsNull: proxy === null,
        closed: isClosed,
      });

      if (!isClosed) {
        return;
      }

      console.log("[LoginComponent] Popup detected as closed, calling completed()");
      completed();
    }, 1000);

    const completed = () => {
      console.log("[LoginComponent] completed() called - resetting to normal state");
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

    if (proxy) {
      console.log("[LoginComponent] Attaching message listener to popup (not using beforeunload - it fires on navigation!)");

      // Listen for message from popup when auth completes
      window.addEventListener("message", (event) => {
        console.log("[LoginComponent] message event received from popup:", event.data);
        if (event.data === "auth-complete" || event.data?.type === "auth-complete") {
          console.log("[LoginComponent] Auth complete message received");
          completed();
        }
      }, {
        signal: abort.signal,
      });
    } else {
      console.error("[LoginComponent] Popup is null, cannot attach event listeners - Safari may have blocked it");
    }
  };

  return (
    <div className="flex flex-col flex-1 justify-center items-center align-middle gap-8 max-w-md mx-auto">
      {/* Storage access denied alert */}
      {accessDenied && (
        <Alert variant="error">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Storage Access Required</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>
              This application needs cookie and storage access to function properly in Safari.
            </p>
            <p className="text-sm">
              Please allow storage access when prompted, or use Chrome/Edge for the best experience.
            </p>
          </AlertDescription>
        </Alert>
      )}

      {/* Storage access request in progress */}
      {isRequestingAccess && (
        <Alert>
          <ShieldCheck className="h-4 w-4" />
          <AlertTitle>Requesting Storage Access</AlertTitle>
          <AlertDescription>
            Please allow storage access in the browser prompt to continue.
          </AlertDescription>
        </Alert>
      )}

      {/* Login in progress */}
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
            variant="secondary"
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

      {/* Main activation button */}
      <Button
        type="button"
        className={cn("gap-2 transition-opacity", {
          hidden: state?.ui && state.ui !== "normal",
        })}
        onClick={handleActivateClick}
        disabled={isLoading || isRequestingAccess}
      >
        {needsRequest && !hasAccess && !accessDenied ? "Enable & Activate Application" : "Activate Application"}
      </Button>

      {/* Retry button if access was denied */}
      {accessDenied && (
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            setAccessDenied(false);
            handleActivateClick();
          }}
        >
          Try Again
        </Button>
      )}
    </div>
  );
}
