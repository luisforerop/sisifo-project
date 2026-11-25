"use client";

import { createContext, useContext, type ReactNode } from "react";

export type CurrentUser = { userId: string };

/** Usuario fijo mientras no exista autenticación. */
const LOCAL_USER: CurrentUser = { userId: "local" };

const UserContext = createContext<CurrentUser>(LOCAL_USER);

/**
 * Entrega el usuario actual. Al agregar login, se reemplaza este provider
 * por uno real; las sub-apps no cambian porque solo usan `useCurrentUser`.
 */
export function UserProvider({ children }: { children: ReactNode }) {
  return <UserContext.Provider value={LOCAL_USER}>{children}</UserContext.Provider>;
}

export function useCurrentUser(): CurrentUser {
  return useContext(UserContext);
}
