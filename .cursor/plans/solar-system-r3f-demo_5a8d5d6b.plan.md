---
name: solar-system-r3f-demo
overview: Create a highly interactive, visually rich solar system demo using React, Vite, TypeScript, and React Three Fiber, including stars, asteroid belt, and a full planetary system with UI controls.
todos:
  - id: setup-vite-app
    content: Create a new Vite + React + TypeScript project and configure strict TypeScript and linting rules for the solar system demo.
    status: completed
  - id: canvas-and-layout
    content: Implement the main app layout and a reusable SceneCanvas component with React Three Fiber Canvas and camera/controls.
    status: completed
    dependencies:
      - setup-vite-app
  - id: data-models-and-state
    content: Define TypeScript models for solar system bodies and implement shared state for selection, time scale, and UI toggles.
    status: completed
    dependencies:
      - setup-vite-app
  - id: solar-system-core
    content: Build the SolarSystemScene with Sun, planets, orbits, and basic rotation/orbit animations using a global time value.
    status: in_progress
    dependencies:
      - canvas-and-layout
      - data-models-and-state
  - id: asteroid-belt-and-stars
    content: Implement an efficient asteroid belt with instanced meshes and a performant starfield background.
    status: pending
    dependencies:
      - solar-system-core
  - id: time-and-camera-interactions
    content: Add global time controls, selection interactions, and smooth camera transitions/presets.
    status: pending
    dependencies:
      - solar-system-core
  - id: ui-overlay
    content: Create UI overlay components for controls, toggles, and detailed info panels for selected bodies.
    status: pending
    dependencies:
      - data-models-and-state
      - time-and-camera-interactions
  - id: polish-and-performance
    content: Optimize performance, refine visuals, add accessibility improvements, and finalize documentation/comments.
    status: pending
    dependencies:
      - asteroid-belt-and-stars
      - ui-overlay
---

# Solar System React Three Fiber Demo

## Overview

- Build a new **Vite + React + TypeScript** app that renders a highly interactive 3D solar system using **React Three Fiber** and **@react-three/drei**.
- Include the **Sun, all major planets, moons (selectively), asteroid belt, and starfield**, plus rich UI controls (time speed, camera presets, info panels).

## Step 1 – Project Setup

- Initialize a new **Vite React TypeScript** project using bun (e.g., `solar-system-demo`) and enable strict TypeScript settings.
- Install core dependencies: `react`, `react-dom`, `@react-three/fiber`, `@react-three/drei`, and optionally `zustand` for state and `leva` for developer/debug controls.
- Configure **ESLint/TSConfig** to enforce strict typing (no `any`, no non-null assertions) and consistent string style.

## Step 2 – App Layout & Canvas Shell

- In `src/main.tsx` and `src/App.tsx`, set up a **full-viewport layout** with a top-level layout wrapper and a central 3D canvas area plus a UI overlay area.
- Create a `SceneCanvas` component (e.g., `src/components/SceneCanvas.tsx`) that wraps `Canvas` from `@react-three/fiber` with:
- Appropriate **camera position/FOV**, **shadow** and **color** settings.
- `OrbitControls` (or custom controls) for intuitive zoom/rotate/pan.
- Basic **environment** and **fog** if needed for depth.

## Step 3 – Data Model & State Management

- Define strong TypeScript **data models** for solar system bodies, e.g., `Planet`, `Star`, `Moon`, `AsteroidBeltConfig`, including orbital radius, size, rotation/orbital periods, colors/textures, etc.
- Create a `solarSystemData.ts` module containing approximate (scaled) physical data for the Sun and planets and optional key moons.
- Implement a small **global store** (e.g., with `zustand` or React context) to manage:
- Selected body, camera target, time scale, play/pause state.
- UI toggles (show orbits, labels, asteroid belt density, etc.).

## Step 4 – Core 3D Solar System Scene

- Implement `SolarSystemScene` (`src/components/solar/SolarSystemScene.tsx`) rendered inside `SceneCanvas`.
- Add a **Sun** mesh:
- Emissive material (glowing), optional subtle animation (pulsing noise or shader).
- Point light(s) to illuminate planets, with realistic falloff.
- Add **planet orbits** as circular/elliptical line meshes around the Sun for visual clarity.
- For each planet:
- Create a reusable `Planet` component that:
- Positions itself based on **orbital radius** and **current time** (for revolution).
- Rotates around its own axis based on **rotation period**.
- Uses **textures or colors** and appropriate material (Phong/Standard) with configurable shininess.
- Emits **pointer events** (`onPointerOver`, `onClick`) to support interactivity.
- Optionally attach key **moons** as child objects orbiting their planet with similar logic.

## Step 5 – Asteroid Belt & Starfield

- Add an **asteroid belt** component using **instanced meshes** for performance (e.g., `InstancedMesh` with random distributions in a torus-like volume between Mars and Jupiter):
- Configurable asteroid count, size range, and noise in orbital parameters.
- Subtle rotation/revolution animations tied to global time.
- Implement a **starfield** background:
- Use `Stars` from `@react-three/drei` plus, if needed, a custom particle cloud for added depth.
- Ensure it is rendered in the background and does not interfere with interaction.

## Step 6 – Time & Animation System

- Implement a **time controller** using `useFrame` and a shared time state:
- Manage a `time` value advanced on each frame by `delta * timeScale` (where `timeScale` is user-controlled).
- Expose controls for **play/pause**, **time speed slider**, and presets ("realistic", "fast", "very fast").
- Base all orbital and rotational animations (Sun surface noise, planet orbits/rotations, asteroid belt motion) on this time value for consistent behavior.

## Step 7 – Interactivity & Camera Experience

- Implement a **selection system**:
- Clicking a planet (or Sun) sets it as the **selected body** in global state.
- Hovering shows a small label; clicking triggers detailed info in the UI panel.
- Implement **camera target transitions**:
- Smooth tweening of camera position and look-at target when the selected body changes (manual interpolation in `useFrame` or a simple animation helper).
- Provide **camera preset buttons**: Solar system overview, inner planets, outer planets, and focus-on-selected.
- Optionally add a short **guided tour** mode that auto-cycles through planets, animating the camera and updating the info panel.

## Step 8 – UI Overlay & Information Panels

- Build a UI overlay (`src/components/ui/ControlPanel.tsx`, `InfoPanel.tsx`) using standard React + CSS (or a simple utility framework if you prefer later):
- **Time controls**: play/pause, slider for time speed, maybe a reset button.
- **Display toggles**: show/hide orbits, labels, asteroid belt, and starfield density presets.
- **Body info panel**: when a body is selected, show name, type, approximate radius, orbital period, distance from Sun, brief description, and perhaps fun facts.
- Ensure the UI is **responsive** and does not obstruct critical 3D content (e.g., use a semi-transparent side panel).

## Step 9 – Polish, Performance & Accessibility

- Optimize performance:
- Use instancing where appropriate (asteroid belt, maybe stars).
- Keep geometry and texture sizes reasonable; consider lazy-loading high-res textures.
- Limit shadow quality to what is visually pleasing but performant.
- Add **basic accessibility** features:
- Keyboard alternatives for core interactions (cycle selected body, toggle play/pause).
- Clear focus outlines and ARIA labels for UI controls.
- Add tooltips or a short **help overlay** explaining controls (camera movement, selection, time controls).

## Step 10 – Final Review & Refinement

- Verify the scene works well on typical desktop hardware and behaves acceptably on modern laptops.
- Tweak scales, orbit speeds, and lighting to balance **visual clarity** and **educational realism**.
- Clean up comments and JSDoc across components to clearly explain logic, math for orbits, and design decisions.