# AppSmartt - Prueba Técnica

Aplicación completa de gestión de operaciones financieras con autenticación JWT.

## Estructura del Proyecto

```
AppSmartt-app/
├── backend/          # API REST con Node.js, Express, TypeORM, PostgreSQL
├── frontend/         # Aplicación React con Context API
└── README.md
```

## Backend

### Tecnologías
- Node.js + Express
- TypeORM + PostgreSQL
- JWT para autenticación
- Zod para validación
- bcryptjs para hash de contraseñas

### Endpoints

#### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Login de usuario

#### Operaciones
- `POST /api/operations` - Crear operación (requiere autenticación)

### Configuración

### Ngnix

### Configuración Nginx

1. Instalar Nginx: `sudo apt install nginx`
2. Crear archivo `/etc/nginx/sites-available/appsmartt` con:
   - React (frontend) en `/var/www/appsmartt/frontend/dist`
   - API (backend) en `http://127.0.0.1:3001`
3. Activar config:  
   ```bash
   sudo ln -s /etc/nginx/sites-available/appsmartt /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx


1. Instalar dependencias:
```bash
cd backend
npm install
```

2. Configurar variables de entorno:
```bash
cp env.example .env
# Editar .env con tus credenciales de PostgreSQL
```

3. Configurar base de datos PostgreSQL:

Asegúrate de tener PostgreSQL instalado y ejecutándose.

Crea la base de datos manualmente:

psql -U postgres -c "CREATE DATABASE appsmartt_db;"


Verifica que en tu .env la variable DATABASE_URL apunte a tu base creada, por ejemplo:

DATABASE_URL=postgres://postgres:tu_password@localhost:5432/appsmartt_db


Si deseas usar pgAdmin o DBeaver, crea una base con el nombre appsmartt_db y un usuario con permisos.

```bash
npm run dev
```

## Frontend

### Tecnologías
- React 19
- React Router DOM
- React Hook Form + Zod
- Context API para gestión de estado
- Axios para API calls

### Funcionalidades
- Login/Logout con persistencia en localStorage
- Protected Routes
- Formulario de operaciones con validación
- Gestión de estado de autenticación

### Configuración

1. Instalar dependencias:
```bash
cd frontend
npm install
```

2. Configurar variables de entorno:
```bash
cp env.example .env
# Editar .env con la URL de tu API
```

3. Ejecutar:
```bash
npm run dev
```

## Criterios de Aceptación Cumplidos

### Backend ✅
- [x] Endpoint `/operations` en módulo separado
- [x] Arquitectura Controller → Service → Repository
- [x] Middleware de autenticación JWT
- [x] Validación con Zod
- [x] Transacciones TypeORM con rollback
- [x] Restricciones de integridad (amount > 0)
- [x] Respuestas HTTP apropiadas (201, 400, 401, 500)

### Frontend ✅
- [x] Formulario de login con validación
- [x] Integración con API `/auth/login`
- [x] Context API para gestión de sesión
- [x] Persistencia en localStorage
- [x] ProtectedRoute con redirección
- [x] Flujo completo de login/logout

### DevOps ✅
- [x] Variables de entorno (.env)
- [x] Scripts npm run dev y npm run build
- [x] Configuración TypeScript
- [x] Gestión de dependencias

## Uso

1. Iniciar backend: `cd backend && npm run dev`
2. Iniciar frontend: `cd frontend && npm run dev`
3. Acceder a http://localhost:5173
4. Registrar usuario o hacer login
5. Crear operaciones desde el dashboard
