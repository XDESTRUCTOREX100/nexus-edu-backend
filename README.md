# gestion-estudiantes

Proyecto backend de NestJS para la gestión de estudiantes.

## Autenticación

1. Copia `.env.example` como `.env` y completa las credenciales de MySQL y `JWT_SECRET`.
2. Mantén `ADMIN_EMAIL`, `ADMIN_PASSWORD` y `ADMIN_NAME` para crear automáticamente el primer administrador.
3. Inicia la aplicación con `npm run start:dev`. TypeORM creará las tablas porque `synchronize` está habilitado para desarrollo.
4. Después del primer inicio puedes quitar las variables `ADMIN_*`; el usuario ya permanecerá en la base de datos.

Endpoints principales:

- `POST /auth/login` recibe `{ "email": "...", "password": "..." }` y devuelve `accessToken` y `refreshToken`.
- `GET /auth/me` valida el access token enviado como `Authorization: Bearer <accessToken>`.
- `POST /auth/refresh` recibe `{ "refreshToken": "..." }` y rota la sesión.
- `POST /auth/logout` recibe `{ "refreshToken": "..." }` y revoca la sesión.
