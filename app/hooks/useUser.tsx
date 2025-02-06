import { createContext, useContext } from "react";
import type { UserInfo } from "~/.server/services/auth";
const userContext = createContext<UserInfo | null>(null);

export const UserProvider = userContext.Provider;

export function useUser() {
  return useContext(userContext);
}
