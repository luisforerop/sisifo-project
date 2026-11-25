## Purpose

Permitir registrar en pocos segundos un resumen estructurado de cada día, para tener un historial consistente que luego un agente pueda analizar y así detectar puntos de fricción y mejora.

## ADDED Requirements

### Requirement: Registro rápido del día
La sub-app SHALL ofrecer un formulario en `/diario` pensado para completarse en aproximadamente 25 segundos, priorizando selección rápida y números sobre texto. El único texto libre SHALL ser una frase ultra-corta (máximo 80 caracteres) sobre el trabajo; la sub-app SHALL NOT ofrecer notas libres largas ni notas por proyecto.

#### Scenario: Registrar con pocos toques
- **WHEN** el usuario completa los campos obligatorios de selección y números
- **THEN** puede guardar el día sin escribir texto libre

#### Scenario: Texto demasiado largo
- **WHEN** el usuario escribe más de 80 caracteres en la frase corta del trabajo
- **THEN** el sistema impide exceder el límite e indica cuántos caracteres restan

#### Scenario: Sin campos de texto largo
- **WHEN** el usuario abre el formulario
- **THEN** no existe un campo de nota libre ni campos de nota por proyecto

### Requirement: Campos del registro
El registro SHALL organizarse en cuatro bloques y SHALL incluir, en este orden:
1. Cuerpo y descanso: fecha; horas de sueño (obligatorio); calidad del sueño de 1 a 5 (obligatorio); energía de 1 a 5 (obligatorio).
2. Trabajo: picos (selección múltiple de etiquetas); valles (selección múltiple de etiquetas); frase corta del trabajo en 2-3 palabras. Todos opcionales.
3. Proyectos clave: para cada proyecto configurado (inicialmente "Lote MVP" y "Proyecto de salud"), un nivel entre «Sin tocar», «Poco», «Bueno» y «Muy bueno». Opcional; «Sin tocar» SHALL presentarse como una opción neutral, sin connotación negativa.
4. Balance y cierre: actividades que recargan (selección múltiple); fugas / dispersión fuera del trabajo (selección múltiple, ej. Shorts / iPad, Celular en la noche, Dispersión); y horas de pantalla de ocio, es decir, fuera del trabajo (número, opcional).

El registro SHALL NOT incluir estado de ánimo, principal fricción del día ni nota libre.

#### Scenario: Campos obligatorios
- **WHEN** el usuario intenta guardar sin energía, horas de sueño o calidad del sueño
- **THEN** el sistema señala los campos faltantes y no guarda

#### Scenario: Campos opcionales
- **WHEN** el usuario deja vacíos picos, valles, frase del trabajo, proyectos, recargadores, fugas y pantalla de ocio
- **THEN** el registro se guarda correctamente

#### Scenario: Valores por defecto sensatos
- **WHEN** el usuario toca por primera vez el control de horas de sueño
- **THEN** el valor salta a 7,5 h y desde ahí cambia en pasos de 0,5 h

#### Scenario: Pantalla acotada al ocio
- **WHEN** el usuario ve el campo de pantalla
- **THEN** la etiqueta aclara que son horas de ocio fuera del trabajo y no el total del día

#### Scenario: Proyecto sin tocar
- **WHEN** el usuario elige «Sin tocar» en un proyecto
- **THEN** se registra el nivel 0 sin mensajes de advertencia ni culpa

### Requirement: Una entrada por día y edición
El sistema SHALL mantener como máximo una entrada por fecha; la fecha SHALL ser hoy por defecto y editable para registrar días anteriores; guardar sobre una fecha existente SHALL actualizar esa entrada.

#### Scenario: Registro de hoy
- **WHEN** el usuario abre `/diario` y aún no hay entrada de hoy
- **THEN** ve un formulario nuevo con la fecha de hoy

#### Scenario: Editar el día
- **WHEN** ya existe una entrada de la fecha elegida
- **THEN** el formulario aparece con sus valores y al guardar los actualiza

### Requirement: Historial
La sub-app SHALL listar las entradas guardadas ordenadas de la más reciente a la más antigua, con un resumen legible de cada una (energía, sueño, pantalla de ocio y fugas), y permitir abrir una para editarla o eliminarla con confirmación.

#### Scenario: Ver historial
- **WHEN** existen entradas guardadas
- **THEN** el usuario las ve ordenadas por fecha descendente

#### Scenario: Eliminar una entrada
- **WHEN** el usuario elimina una entrada y confirma
- **THEN** desaparece del historial

### Requirement: Exportación para análisis
La sub-app SHALL permitir exportar todas las entradas (o un rango de fechas) como JSON con estructura estable y versionada, para entregarlo a un agente de análisis.

#### Scenario: Exportar todo
- **WHEN** el usuario pulsa exportar
- **THEN** obtiene un JSON con el número de versión del esquema y la lista de entradas

### Requirement: Uso de la capa de persistencia
La sub-app SHALL guardar y leer sus datos exclusivamente mediante el servicio de persistencia compartido.

#### Scenario: Datos tras recargar
- **WHEN** el usuario guarda un registro y recarga la página
- **THEN** el registro sigue visible
