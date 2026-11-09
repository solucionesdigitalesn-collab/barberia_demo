# AUREUM Barber Club — Demo Frontend de Barbería Premium

Una aplicación web de barbería de alta gama con estética ultra-premium, moderna, masculina y sofisticada. Desarrollada exclusivamente como **DEMO FRONTEND** (sin backend, sin bases de datos externas, sin dependencias de Nest ni servicios de terceros), con persistencia reactiva en `localStorage`.

---

## 🌟 Identidad Visual & Diseño

- **Paleta de Color**: Negro obsidiana profundo (`#0A0A0D`), gris carbón ahumado (`#121217`, `#181822`), blanco terciopelo (`#FAF6EE`) y acentos de oro champagne / dorado envejecido (`#DFBE74`, `#C5A059`, `#A27B2B`).
- **Tipografías**: *Playfair Display* & *Cinzel* para títulos ceremoniales y números serif de lujo, combinados con *Plus Jakarta Sans* para una lectura geométrica impecable.
- **Fotografía de Autor**: Curada en alta resolución para barberías tradicionales, sillones de cuero vintage, rituales de toallas al vapor, navajas japonesas Kamisori y tijeras de precisión.
- **Microinteracciones & Transiciones**: Efectos hover dorados, bordes con brillo sutil y retroalimentación mediante notificaciones Toast.

---

## 🚀 Arquitectura & Módulos Implementados

### 1. Landing Page Pública (`/`)
- **Navbar Flotante & Responsive**: Logotipo en oro con tijeras heráldicas, enlaces de navegación rápida, botón "Reservar Cita", botón "Acceso Staff" y cajón desplegable móvil para pantallas pequeñas.
- **Hero Principal Cinematográfico**: Presentación con distintivo de autor, titular de impacto, doble llamada a la acción y métricas de confianza (4.98★ en más de 850 clientes, 100% puntualidad, 4 maestros barberos).
- **Barra de Indicadores en Vivo**: Estado "Abierto Hoy", barra de whisky single malt y café de especialidad de cortesía.
- **Carta de Servicios & Rituales**: Filtrado por categorías (*Combos VIP*, *Cortes de Autor*, *Rituales de Barba*, *Tratamientos Capilares*). Precios, duración en minutos, lista de detalles incluidos y botón directo de reserva.
- **Lookbook / Galería de Acabados**: Galería interactiva con filtros (*Degradados Fade*, *Estilos Clásicos*, *Barba Esculpida*, *Rituales*) y modal de vista previa en alta resolución.
- **Maestros Barberos**: Perfiles de Marcos Vance, Julián Rossi, Mateo Silva y Diego Alarcón con especialidades, experiencia, valoración y reserva directa.
- **Nuestra Filosofía**: Historia del club, los tres pilares del servicio (Navaja & Acero, Vapor Botánico, Lounge Privado) y firma de los fundadores.
- **Ubicación & Horarios**: Horarios detallados por día, mapa interactivo de Salamanca (Madrid), contacto telefónico y WhatsApp directo.
- **Opiniones Verificadas**: Reseñas de clientes con insignia de verificación y valoración de 5 estrellas.
- **Membresía Black Gold**: Módulo de suscripción exclusiva para clientes recurrentes.
- **Preguntas Frecuentes (FAQ)**: Acordeón interactivo con respuestas sobre puntualidad, bebidas de cortesía y política de citas.
- **Footer Distinguido**: Suscripción a invitaciones privadas, enlaces rápidos y botón para restaurar datos demo.

### 2. Sistema de Reservas Funcional (`/reservar`)
- Flujo interactivo paso a paso:
  1. **Servicio**: Selección con tarjeta resaltada, precio y duración.
  2. **Barbero**: Selección entre profesional preferido o *"Cualquier barbero disponible"*.
  3. **Fecha & Hora**: Selector de fecha para los próximos 14 días y matriz de franjas horarias que **comprueba la disponibilidad en tiempo real**. Los horarios ya reservados con ese barbero o las horas pasadas de hoy quedan automáticamente deshabilitados.
  4. **Tus Datos**: Formulario de nombre, teléfono móvil, correo electrónico y notas especiales.
  5. **Confirmación VIP**: Generación instantánea de localizador (`BK-XXXX`), tarjeta de embarque digital con simulación de código QR, copia al portapapeles y enlace al panel administrativo.
- **Persistencia en LocalStorage**: Toda reserva creada se guarda al instante y permanece tras recargar la página.

### 3. Panel Privado del Administrador (`/admin`)
- **Tarjetas KPI**: Citas de Hoy, Total de Reservas, Citas Pendientes, Citas Confirmadas e Ingresos Estimados acumulados en euros.
- **Gestión de Reservas**:
  - Filtros dinámicos por fecha (*Todas*, *Hoy*, *Mañana*, *Fecha Personalizada*), por barbero y por estado (*Pendiente*, *Confirmada*, *Completada*, *Cancelada*).
  - Búsqueda en vivo por nombre del cliente, teléfono o localizador.
  - Tabla completa en escritorio y **tarjetas adaptadas para móvil sin desbordamiento horizontal**.
  - Acciones: Confirmar, Completar, Cancelar, Editar horario/servicio y Eliminar cita.
  - **Nueva Cita Manual / Walk-In**: Modal para que el administrador registre clientes presenciales espontáneos.
- **Gestión de Servicios**: Catálogo de servicios con activación/desactivación, edición de precios y creación de nuevos servicios.
- **Gestión de Barberos**: Estado de disponibilidad (activo/descanso), horarios asignados y acceso directo a la estación de cada barbero.
- **Configuración Visual del Negocio**: Nombre, horarios, dirección, teléfonos, moneda y activación del banner de anuncios superior.

### 4. Panel Individual para Barberos (`/barbero` o `/barbero/:id`)
- Estación de trabajo personalizada para cada profesional (Marcos, Julián, Mateo, Diego).
- Selector rápido en cabecera para alternar entre perfiles con 1 clic.
- Ficha de perfil: Foto, apodo, rol, valoración y ganancias del día.
- **Tarjeta de Próximo Cliente**: Destacado con cuenta atrás de hora, servicio solicitado, notas y botones de contacto (Llamar / WhatsApp).
- Pestañas de agenda: *Citas de Hoy*, *Próximos Días* e *Historial*.
- Acciones de sillón: *Completar servicio* y *Marcar no asistió*.

### 5. Simulación de Acceso (`/login`)
- Pantalla elegante con accesos rápidos de 1 clic para la demo:
  - 👑 **Administrador** (Alexander Sterling) -> Redirige a `/admin`
  - ✂️ **Barbero 1** (Marcos Vance) -> Redirige a `/barbero/barber-1`
  - ✂️ **Barbero 2** (Julián Rossi) -> Redirige a `/barbero/barber-2`
  - ✂️ **Barbero 3** (Mateo Silva) -> Redirige a `/barbero/barber-3`
  - ✂️ **Barbero 4** (Diego Alarcón) -> Redirige a `/barbero/barber-4`
- Formulario de credenciales manuales para simulación real con usuarios `admin`, `marcos`, `julian`, `mateo`, `diego`.

---

## 🛠️ Tecnologías

- **Framework**: React 19 + TypeScript
- **Bundler**: Vite 8
- **Estilos**: Tailwind CSS v4 con variables CSS personalizadas
- **Animaciones**: Framer Motion
- **Enrutamiento**: React Router 7
- **Iconos**: Lucide React + SVGs heráldicos de autor
- **Persistencia**: LocalStorage con sincronización por eventos en tiempo real

---

## 💻 Instrucciones para Ejecutar

```bash
cd frontend

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Previsualizar la compilación de producción
npm run preview
```

