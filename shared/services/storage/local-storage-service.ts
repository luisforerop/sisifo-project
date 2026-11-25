import type {
  StorageKey,
  StorageScope,
  StorageService,
  StoredDocument,
} from "./types";

const ROOT = "sisifo";

function scopePrefix(scope: StorageScope): string {
  return `${ROOT}:${scope.userId}/${scope.appId}/${scope.collection}/`;
}

function toStorageKey(key: StorageKey): string {
  return `${scopePrefix(key)}${key.id}`;
}

function isStoredDocument(value: unknown): value is StoredDocument<unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    "data" in value &&
    "schemaVersion" in value
  );
}

function parse<T>(raw: string | null): StoredDocument<T> | null {
  if (raw === null) return null;
  try {
    const value: unknown = JSON.parse(raw);
    return isStoredDocument(value) ? (value as StoredDocument<T>) : null;
  } catch {
    return null; // JSON corrupto: se trata como ausente
  }
}

/** Implementación basada en `window.localStorage`. Solo funciona en el cliente. */
export class LocalStorageService implements StorageService {
  private get store(): Storage | null {
    try {
      return typeof window === "undefined" ? null : window.localStorage;
    } catch {
      return null;
    }
  }

  async get<T>(key: StorageKey): Promise<StoredDocument<T> | null> {
    return parse<T>(this.store?.getItem(toStorageKey(key)) ?? null);
  }

  async list<T>(scope: StorageScope): Promise<StoredDocument<T>[]> {
    const store = this.store;
    if (!store) return [];
    const prefix = scopePrefix(scope);
    const docs: StoredDocument<T>[] = [];
    for (let i = 0; i < store.length; i++) {
      const k = store.key(i);
      if (k?.startsWith(prefix)) {
        const doc = parse<T>(store.getItem(k));
        if (doc) docs.push(doc);
      }
    }
    return docs;
  }

  async set<T>(
    key: StorageKey,
    data: T,
    schemaVersion = 1,
  ): Promise<StoredDocument<T>> {
    const doc: StoredDocument<T> = {
      schemaVersion,
      updatedAt: new Date().toISOString(),
      data,
    };
    const store = this.store;
    if (!store) throw new Error("El almacenamiento local no está disponible");
    store.setItem(toStorageKey(key), JSON.stringify(doc));
    return doc;
  }

  async remove(key: StorageKey): Promise<void> {
    this.store?.removeItem(toStorageKey(key));
  }
}
