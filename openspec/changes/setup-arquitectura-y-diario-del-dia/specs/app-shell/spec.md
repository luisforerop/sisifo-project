## Purpose

Define la estructura base de Sísifo como marketplace personal de sub-apps: cómo se organizan, se registran y se muestran, y cómo se comporta la interfaz común en celular, iPad y Mac.

## ADDED Requirements

### Requirement: Sub-apps aisladas por ruta
El sistema SHALL organizar cada sub-app bajo su propio segmento de ruta de primer nivel (por ejemplo `/diario`), de modo que todo lo necesario para esa sub-app (páginas, componentes, tipos, lógica) esté contenido en su propio módulo y no dependa de otras sub-apps.

#### Scenario: Acceso a una sub-app por su ruta
- **WHEN** el usuario navega a `/diario`
- **THEN** el sistema muestra la sub-app Diario del día dentro del layout común

#### Scenario: Una sub-app no importa de otra
- **WHEN** se revisa el código de una sub-app
- **THEN** solo importa de su propio módulo y del espacio compartido, nunca de otra sub-app

### Requirement: Espacio compartido
El sistema SHALL ofrecer un espacio compartido para tipos, componentes de UI, hooks y servicios reutilizables, y las sub-apps SHALL usarlo únicamente para elementos genéricos que no pertenezcan a una sola sub-app.

#### Scenario: Reutilizar un componente genérico
- **WHEN** una sub-app necesita un botón, chip selector o campo numérico
- **THEN** los toma del espacio compartido en lugar de duplicarlos

### Requirement: Registro central de sub-apps
El sistema SHALL mantener un registro central en el que cada sub-app declara su nombre, descripción, ruta e ícono, y SHALL usar ese registro como única fuente para construir el home y la navegación.

#### Scenario: Home lista las sub-apps registradas
- **WHEN** el usuario abre `/`
- **THEN** ve una tarjeta por cada sub-app registrada con su nombre y descripción, y al tocarla navega a su ruta

#### Scenario: Agregar una sub-app nueva
- **WHEN** se agrega una sub-app y se registra en el registro central
- **THEN** aparece automáticamente en el home sin modificar el componente del home

### Requirement: Interfaz mobile-first y responsiva
El sistema SHALL diseñarse primero para pantallas de celular y SHALL adaptarse a tablet y escritorio sin romper el diseño, usando un contenedor de ancho máximo centrado, áreas táctiles de al menos 44 px y respetando las áreas seguras (safe areas) del dispositivo.

#### Scenario: Uso en celular
- **WHEN** la pantalla tiene ancho de ~390 px
- **THEN** el contenido ocupa todo el ancho útil, sin scroll horizontal, y los controles son táctiles cómodos

#### Scenario: Uso en iPad o Mac
- **WHEN** la pantalla tiene ancho de 768 px o más
- **THEN** el contenido se muestra centrado con ancho máximo y sin elementos estirados ni cortados

### Requirement: Idioma y metadatos
El sistema SHALL presentar la interfaz en español y SHALL definir título y metadatos propios de Sísifo en lugar de los del scaffold.

#### Scenario: Idioma del documento
- **WHEN** se carga cualquier página
- **THEN** el documento declara `lang="es"` y el título corresponde a Sísifo

### Requirement: Preparación para autenticación futura
El sistema SHALL estar estructurado para incorporar inicio de sesión más adelante sin reescribir las sub-apps, identificando siempre al usuario actual mediante un contexto de usuario (hoy un usuario local fijo) y SHALL NOT implementar autenticación en esta iteración.

#### Scenario: Sin login hoy
- **WHEN** el usuario abre cualquier ruta
- **THEN** accede directamente sin pantalla de inicio de sesión

#### Scenario: Acceso al usuario actual
- **WHEN** una sub-app necesita saber quién es el usuario
- **THEN** lo obtiene del contexto de usuario compartido, no de valores fijos propios

### Requirement: Guía para agregar nuevas sub-apps
El repositorio SHALL incluir documentación clara, referenciada desde `AGENTS.md`, que describa la estructura, las reglas de aislamiento, cómo registrar una sub-app y cómo usar la persistencia.

#### Scenario: Un agente agrega una sub-app
- **WHEN** un agente o persona lee la guía
- **THEN** puede crear una nueva sub-app siguiendo una lista de pasos concretos sin inspeccionar el código existente
