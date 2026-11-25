/** Agrupa los documentos de una colección de una sub-app para un usuario. */
export type StorageScope = {
  userId: string;
  appId: string;
  collection: string;
};

/** Identifica un documento dentro de una colección. */
export type StorageKey = StorageScope & { id: string };

/** Envoltorio versionado de cada documento (facilita migraciones y sync). */
export type StoredDocument<T> = {
  schemaVersion: number;
  updatedAt: string; // ISO 8601
  data: T;
};

/**
 * Contrato de persistencia de documentos JSON. Es asíncrono a propósito:
 * hoy se implementa con localStorage, mañana con una API remota.
 */
export interface StorageService {
  get<T>(key: StorageKey): Promise<StoredDocument<T> | null>;
  list<T>(scope: StorageScope): Promise<StoredDocument<T>[]>;
  set<T>(key: StorageKey, data: T, schemaVersion?: number): Promise<StoredDocument<T>>;
  remove(key: StorageKey): Promise<void>;
}
