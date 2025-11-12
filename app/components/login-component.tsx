import { useSharedState } from "~/hooks/useSharedState";
import { Button } from "~/components/ui/button";
import { Clock, XCircle, AlertCircle, ShieldCheck } from "lucide-react";
import { cn } from "~/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { useEffect, useRef, useState } from "react";
import { useStorageAccess } from "~/hooks/useStorageAccess";
import { useRevalidator } from "react-router";

export function LoginComponent() {
  const { state, setState, postMessage } = useSharedState();
  const proxyRef = useRef<Window | null>(null);
  const messageHandlerRef = useRef<((event: MessageEvent) => void) | null>(
    null
  );
  const abortControllerRef = useRef<AbortController | null>(null);
  const { needsRequest, hasAccess, requestAccess, isLoading } =
    useStorageAccess();
  const [isRequestingAccess, setIsRequestingAccess] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);
  const { revalidate } = useRevalidator();

  useEffect(() => {
    // Only set initial state if it's not already set
    // This prevents overriding the state from other iframes
    if (!state || !state.ui) {
      setState({
        ui: "normal",
      });
    }
  }, [setState, state]);

  const handleActivateClick = async () => {
    // Clean up any existing event listeners and abort controllers
    if (messageHandlerRef.current) {
      window.removeEventListener("message", messageHandlerRef.current);
      messageHandlerRef.current = null;
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    // If we need storage access (Safari in iframe), request it first
    if (needsRequest && !hasAccess) {
      setIsRequestingAccess(true);
      const granted = await requestAccess();
      setIsRequestingAccess(false);

      if (!granted) {
        setAccessDenied(true);
        return;
      }
    }

    // Proceed with login
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
    abortControllerRef.current = abort;

    const interval = setInterval(() => {
      if (!proxy?.closed) {
        return;
      }

      completed();
    }, 1000);

    const completed = () => {
      revalidate();
      postMessage("revalidate");
      clearInterval(interval);
      abort.abort();

      // Clean up message handler
      if (messageHandlerRef.current) {
        window.removeEventListener("message", messageHandlerRef.current);
        messageHandlerRef.current = null;
      }

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
      // Listen for message from popup when auth completes
      const messageHandler = (event: MessageEvent) => {
        // Validate origin to prevent XSS
        if (event.origin !== window.location.origin) return;

        if (
          event.data === "auth-complete" ||
          event.data?.type === "auth-complete"
        ) {
          completed();
        }
      };

      messageHandlerRef.current = messageHandler;
      window.addEventListener("message", messageHandler, {
        signal: abort.signal,
      });
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
              This application needs cookie and storage access to function
              properly in Safari.
            </p>
            <p className="text-sm">
              Please allow storage access when prompted, or use Chrome/Edge for
              the best experience.
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
        {needsRequest && !hasAccess && !accessDenied
          ? "Enable & Activate Application"
          : "Activate Application"}
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
