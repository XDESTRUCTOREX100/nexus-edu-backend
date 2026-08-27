# Dependencias pendientes de integración

## Dependencias externas

No se dejaron entidades, interfaces o llaves foráneas en modo tolerante u omitido. Las siete tablas del módulo académico se relacionan únicamente entre sí:

- `asignaturas.plan_estudio_id` -> `planes_estudio.id`
- `prerrequisitos.asignatura_id` -> `asignaturas.id`
- `prerrequisitos.asignatura_prerrequisito_id` -> `asignaturas.id`
- `calendario_academico.periodo_id` -> `periodos_academicos.id`
- `horarios.asignatura_id` -> `asignaturas.id`
- `horarios.espacio_fisico_id` -> `espacios_fisicos.id`
- `horarios.periodo_id` -> `periodos_academicos.id`

No se detectaron referencias a `usuarios`, `matriculas` ni a otros módulos de compañeros.

## Saltos de validación

No se generaron saltos de validación. Los DTOs aplican validación estricta para campos obligatorios, tipos numéricos, fechas ISO, enums, longitudes de texto y formato de horas. Las reglas que comparen fechas entre sí, eviten ciclos de prerrequisitos o comprueben disponibilidad de espacios deben resolverse en la capa de servicio cuando se implemente.

## Requisitos para el merge final

No hay dependencias externas pendientes para compilar esta capa. Para una integración 100% estricta en `main`, el equipo debe registrar las entidades en el módulo académico o mantener `autoLoadEntities: true`, ejecutar migraciones contra MySQL y añadir las validaciones de reglas de negocio indicadas anteriormente en sus servicios.
