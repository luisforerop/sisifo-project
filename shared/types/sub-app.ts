/** Descriptor que cada sub-app exporta para aparecer en el home. */
export type SubAppManifest = {
  /** Identificador estable; también es el `appId` para la persistencia. */
  id: string;
  name: string;
  description: string;
  /** Ruta de primer nivel de la sub-app, ej. "/diario". */
  href: string;
  /** Emoji que se muestra en la tarjeta. */
  icon: string;
};
