import { MigrationInterface, QueryRunner } from 'typeorm';

export class AuditoriaTriggers1700000000000 implements MigrationInterface {
  name = 'AuditoriaTriggers1700000000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        tabla_afectada VARCHAR(100) NOT NULL,
        accion VARCHAR(30) NOT NULL,
        id_registro BIGINT NOT NULL,
        datos_anteriores JSON NULL,
        datos_nuevos JSON NULL,
        usuario VARCHAR(255) NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        INDEX idx_audit_logs_tabla_registro (tabla_afectada, id_registro),
        INDEX idx_audit_logs_created_at (created_at)
      ) ENGINE=InnoDB
    `);

    await queryRunner.query('DROP TRIGGER IF EXISTS trg_calificaciones_audit_update');
    await queryRunner.query(`
      CREATE TRIGGER trg_calificaciones_audit_update
      AFTER UPDATE ON calificaciones
      FOR EACH ROW
      BEGIN
        IF NOT (OLD.nota <=> NEW.nota) THEN
          INSERT INTO audit_logs (
            tabla_afectada,
            accion,
            id_registro,
            datos_anteriores,
            datos_nuevos,
            usuario
          ) VALUES (
            'calificaciones',
            'UPDATE',
            OLD.id,
            JSON_OBJECT('nota', OLD.nota),
            JSON_OBJECT('nota', NEW.nota),
            CURRENT_USER()
          );
        END IF;
      END
    `);

    await queryRunner.query('DROP TRIGGER IF EXISTS trg_usuarios_audit_update');
    await queryRunner.query(`
      CREATE TRIGGER trg_usuarios_audit_update
      AFTER UPDATE ON usuarios
      FOR EACH ROW
      BEGIN
        IF NOT (OLD.activo <=> NEW.activo)
          OR NOT (OLD.email <=> NEW.email)
          OR NOT (OLD.password_hash <=> NEW.password_hash) THEN
          INSERT INTO audit_logs (
            tabla_afectada,
            accion,
            id_registro,
            datos_anteriores,
            datos_nuevos,
            usuario
          ) VALUES (
            'usuarios',
            'UPDATE_USUARIO',
            OLD.id,
            JSON_OBJECT(
              'email', OLD.email,
              'activo', OLD.activo,
              'passwordChanged', NOT (OLD.password_hash <=> NEW.password_hash)
            ),
            JSON_OBJECT(
              'email', NEW.email,
              'activo', NEW.activo,
              'passwordChanged', NOT (OLD.password_hash <=> NEW.password_hash)
            ),
            CURRENT_USER()
          );
        END IF;
      END
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TRIGGER IF EXISTS trg_usuarios_audit_update');
    await queryRunner.query('DROP TRIGGER IF EXISTS trg_calificaciones_audit_update');
    await queryRunner.query('DROP TABLE IF EXISTS audit_logs');
  }
}
