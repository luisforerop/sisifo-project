## Purpose

Definir una capa de persistencia desacoplada del medio de almacenamiento, para guardar hoy en el navegador y migrar después a una app externa de JSONs sin cambiar las sub-apps.

## ADDED Requirements

### Requirement: Interfaz de almacenamiento agnóstica
El sistema SHALL exponer una interfaz de almacenamiento asíncrona de documentos JSON (leer, listar, guardar y eliminar por clave) que las sub-apps usen sin conocer el medio físico, y SHALL NOT permitir que la UI acceda directamente a `localStorage`.

#### Scenario: Guardar y leer un documento
- **WHEN** una sub-app guarda un documento con una clave y luego lo lee
- **THEN** obtiene el mismo contenido que guardó

#### Scenario: Leer una clave inexistente
- **WHEN** una sub-app lee una clave que no existe
- **THEN** el servicio indica ausencia (sin lanzar error)

### Requirement: Implementación en localStorage
El sistema SHALL proveer en esta iteración una implementación de la interfaz basada en `localStorage` del navegador.

#### Scenario: Persistencia entre recargas
- **WHEN** el usuario guarda datos y recarga la página
- **THEN** los datos siguen disponibles

#### Scenario: Datos corruptos
- **WHEN** el valor almacenado no es JSON válido
- **THEN** el servicio lo trata como ausente y no rompe la aplicación

### Requirement: Espacios de nombres por usuario y sub-app
Las claves SHALL incluir el usuario y la sub-app (formato lógico `usuario/sub-app/colección/id`), de modo que los datos de una sub-app no colisionen con los de otra ni con los de otro usuario futuro.

#### Scenario: Sin colisión entre sub-apps
- **WHEN** dos sub-apps guardan un documento con el mismo identificador
- **THEN** cada una conserva el suyo sin sobrescribir al otro

### Requirement: Migración de backend sin tocar la UI
El sistema SHALL permitir sustituir la implementación de almacenamiento por otra (API de JSONs) cambiando únicamente la configuración del proveedor, sin modificar componentes ni lógica de las sub-apps.

#### Scenario: Cambio de proveedor
- **WHEN** se configura otra implementación de la interfaz
- **THEN** las sub-apps funcionan sin cambios de código

### Requirement: Disponibilidad en cliente
El sistema SHALL manejar que `localStorage` solo existe en el navegador, evitando errores durante el renderizado en servidor y mostrando un estado de carga mientras los datos se leen.

#### Scenario: Primer render
- **WHEN** la página se renderiza en el servidor
- **THEN** no se produce error y el cliente carga los datos tras montar
