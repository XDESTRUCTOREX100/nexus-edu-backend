import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
  name: 'vw_estudiantes_bajo_rendimiento',
  expression: `
    SELECT
      matricula.id AS matricula_id,
      matricula.estudiante_id AS estudiante_id,
      matricula.periodo_academico AS periodo_academico,
      AVG(calificacion.nota) AS promedio,
      COUNT(calificacion.id) AS cantidad_calificaciones
    FROM matriculas AS matricula
    INNER JOIN inscripciones AS inscripcion
      ON inscripcion.matricula_id = matricula.id
    INNER JOIN calificaciones AS calificacion
      ON calificacion.inscripcion_id = inscripcion.id
    GROUP BY
      matricula.id,
      matricula.estudiante_id,
      matricula.periodo_academico
    HAVING AVG(calificacion.nota) < 3.0
  `,
})
export class VwEstudiantesBajoRendimiento {
  @ViewColumn({ name: 'matricula_id' })
  matriculaId!: number;

  @ViewColumn({ name: 'estudiante_id' })
  estudianteId!: number;

  @ViewColumn({ name: 'periodo_academico' })
  periodoAcademico!: string;

  @ViewColumn()
  promedio!: string;

  @ViewColumn({ name: 'cantidad_calificaciones' })
  cantidadCalificaciones!: number;
}
