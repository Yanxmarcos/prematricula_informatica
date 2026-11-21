# Prematrícula Informática

Aplicación web de prematrícula académica creada como proyecto de software para la Escuela Profesional de Informática de la Universidad Nacional de Trujillo. Este repositorio muestra una implementación de portafolio y **no es un portal oficial de la universidad**.

## Funciones

- Acceso con código estudiantil y contraseña asignada individualmente.
- Consulta de cursos, créditos y prerrequisitos.
- Registro y consulta del historial de prematrículas.
- Panel administrativo con estadísticas, fechas académicas y gestión de sesiones.
- Acceso a la API restringido por sesión, rol y propiedad del registro.

## Tecnologías

Next.js 15 (App Router), React 19, Tailwind CSS 4, NextAuth 4, Prisma 6, MySQL 8 y Docker Compose.

## Desarrollo local

Requisitos: Node.js 20 o superior y una base de datos MySQL 8. Copia `.env.example` a `.env.local`, configura credenciales **propias y nuevas**, y ejecuta:

```bash
npm ci
npx prisma generate
npx prisma db push
npm run dev
```

El esquema define las tablas, pero no incluye datos reales de estudiantes ni un catálogo académico de ejemplo. Para acceder, primero debes crear un usuario de prueba en tu propia base de datos y asignarle un código; después puedes generar una contraseña segura con:

```bash
node --env-file=.env.local scripts/set-user-password.mjs CODIGO_ESTUDIANTE
```

El comando imprime una contraseña una sola vez. Entrégala al usuario por un canal privado. Para el panel administrativo, configura el rol `secretaria` o `director` en la base de datos antes de iniciar sesión. **No uses datos personales reales en entornos de demostración.**

## Configuración

Consulta [.env.example](.env.example). Las credenciales y las exportaciones de la base de datos no deben añadirse a Git. Si despliegas la aplicación, define las variables en tu plataforma y limita el acceso a MySQL. El archivo `docker-compose.yml` espera también `DB_PASSWORD` para el servicio local de MySQL.

## Seguridad y alcance

Las rutas privadas validan la sesión activa en la base de datos, el rol y la propiedad de cada prematrícula. El acceso con código estudiantil como contraseña predeterminada está deshabilitado. Para una instalación institucional se necesitan además políticas de aprovisionamiento y recuperación de cuentas, pruebas integrales, revisión de infraestructura y autorización para tratar datos personales.

## Comprobación

```bash
npm run lint
npm run build
```

Proyecto de portafolio. Las marcas institucionales utilizadas en la interfaz identifican el contexto académico y no implican respaldo oficial.
