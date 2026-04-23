# Rutina App 🏋️‍♂️

Una aplicación web moderna, rápida y minimalista para gestionar tus rutinas de entrenamiento semanal de forma dinámica. Construida con **Astro**, **Tailwind CSS** y **Vanilla JavaScript**.

## ✨ Características Principales

- **Gestión Dinámica de Rutinas**: Crea tantas rutinas como necesites (Día 1, Pecho, Piernas, etc.). No estás limitado a los 7 días de la semana.
- **Seguimiento de Ejercicios**: Agrega ejercicios a cada rutina, define el número de series y marca tu progreso en tiempo real.
- **Rastreador de Series**: Sistema intuitivo de checkboxes con contadores automáticos de progreso (ej. 2/4 series completadas).
- **Persistencia Local**: Tus datos se guardan automáticamente en el `localStorage` del navegador. Nada se pierde al recargar o cerrar la página.
- **Reinicio Inteligente**:
  - **Global**: Borra todo para empezar de cero.
  - **Por Rutina**: Reinicia solo el progreso de un día específico manteniendo los ejercicios.
  - **Por Ejercicio**: Desmarca todas las series de un ejercicio individual con un solo click.
- **Diseño Premium & Responsive**: 
  - Interfaz oscura (dark mode) con estética cuidada.
  - Totalmente optimizada para dispositivos móviles con targets táctiles aumentados.
  - Modales de confirmación personalizados para una experiencia más fluida.

## 🛠️ Tecnologías

- **Framework**: [Astro](https://astro.build/) (Minimal template)
- **Estilos**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Lógica**: Vanilla JavaScript (ES6+)
- **Iconos**: SVG inline (Lucide-inspired)
- **Persistencia**: LocalStorage API

## 📂 Estructura del Proyecto

```text
/src
├── components/       # Componentes Astro (Header, Footer, Slot, Modal, etc.)
├── layouts/          # Layout principal con configuración SEO
├── pages/            # Página principal (index.astro)
├── scripts/          # Lógica de negocio (routines.js) y persistencia (store.js)
└── styles/           # Estilos globales y tokens de diseño
```

## 🚀 Cómo Empezar

1. **Instalar dependencias**:
   ```sh
   npm install
   ```

2. **Iniciar servidor de desarrollo**:
   ```sh
   npm run dev
   ```
   Abre [http://localhost:4321/](http://localhost:4321/) en tu navegador.

3. **Construir para producción**:
   ```sh
   npm run build
   ```

## 📖 Guía de Uso

1. **Crear una Rutina**: Haz clic en el botón superior "+ Agregar Rutina".
2. **Personalizar**: Cambia el nombre de la rutina haciendo clic sobre el título predeterminado.
3. **Añadir Ejercicios**: Usa el botón "+ Agregar ejercicio" dentro de cada tarjeta.
4. **Gestionar Series**: Usa los botones **+** y **-** para ajustar el volumen de trabajo.
5. **Marcar Progreso**: Haz clic en los checkboxes a medida que completes tus series. El contador se actualizará automáticamente.
6. **Limpiar**: Usa los iconos de papelera para eliminar ejercicios o rutinas completas. Usa el icono de flecha circular para reiniciar el progreso sin borrar los nombres.

---
Hecho con ❤️ para optimizar tus entrenamientos.
