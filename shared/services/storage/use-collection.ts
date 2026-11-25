"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useCurrentUser } from "@/shared/user/user-context";
import { useStorage } from "./storage-provider";
import type { StorageScope } from "./types";

/**
 * Hook que usan las sub-apps para leer/escribir una colección de documentos.
 * Los datos se cargan tras montar en cliente (`loading` es true al inicio).
 */
export function useCollection<T>(
  appId: string,
  collection: string,
  schemaVersion = 1,
) {
  const storage = useStorage();
  const { userId } = useCurrentUser();
  const scope = useMemo<StorageScope>(
    () => ({ userId, appId, collection }),
    [userId, appId, collection],
  );

  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    storage
      .list<T>(scope)
      .then((docs) => {
        if (!cancelled) {
          setItems(docs.map((d) => d.data));
          setLoading(false);
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setError(e instanceof Error ? e : new Error(String(e)));
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [storage, scope]);

  const save = useCallback(
    async (id: string, data: T) => {
      await storage.set({ ...scope, id }, data, schemaVersion);
      setItems(await storage.list<T>(scope).then((docs) => docs.map((d) => d.data)));
    },
    [storage, scope, schemaVersion],
  );

  const remove = useCallback(
    async (id: string) => {
      await storage.remove({ ...scope, id });
      setItems(await storage.list<T>(scope).then((docs) => docs.map((d) => d.data)));
    },
    [storage, scope],
  );

  return { items, loading, error, save, remove };
}
