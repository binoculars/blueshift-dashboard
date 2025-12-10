"use client";

import { createContext, ReactNode } from "react";

export type PathContentContextValue = {
  pathSlug?: string;
};

export const PathContentContext = createContext<PathContentContextValue>({});

interface PathContentProviderProps extends PathContentContextValue {
  children: ReactNode;
}

export function PathContentProvider({ pathSlug, children }: PathContentProviderProps) {
  return (
    <PathContentContext.Provider value={{ pathSlug }}>
      {children}
    </PathContentContext.Provider>
  );
}
