# 🪐 Interactive 3D Solar System

A high-performance, physically-inspired 3D visualization of our solar system built with React, Three.js, and TypeScript. This project offers an immersive journey through space, featuring accurate orbital mechanics, realistic textures, and a unique "Galactic Motion" mode that simulates the Sun's travel through the Milky Way.

Experience the scale of our cosmic neighborhood with smooth navigation, interactive planetary data, and advanced rendering techniques that bring the celestial bodies to life directly in your browser. This application leverages modern WebGL capabilities to deliver a smooth 60 FPS experience even on mobile devices.

**Live Demo:** [https://c-w-d-harshit.github.io/solar-system/](https://c-w-d-harshit.github.io/solar-system/)

---

## Features

### Celestial Mechanics & Realism
- **Accurate Simulation**: 9 celestial bodies (Sun + 8 planets) modeled with real relative orbital periods and scaled distances to maintain visual clarity while respecting astronomical proportions.
- **High-Fidelity Textures**: Realistic 2K/4K textures for all planetary bodies, featuring custom height maps and specularity for terrestrial planets.
- **Atmospheric Effects**: Multi-layered Sun glow with custom noise shaders, atmospheric scattering approximations, and a procedural 4,000-starfield background.
- **Ring Systems**: Detailed rendering of Saturn and Uranus ring systems with transparency, realistic particle density simulation, and shadow-casting capabilities.
- **Asteroid Belt**: 2,500 GPU-instanced asteroids with procedural textures and randomized rotations, providing a dense and performance-efficient belt between Mars and Jupiter.

### Simulation & Navigation
- **Playback Controls**: Complete control over simulation time with Play/Pause functionality and a precise variable speed slider (0-50x, defaulting to 20x).
- **Galactic Motion Mode**: A specialized visualization mode where the Sun moves forward at constant velocity while planets follow their complex helical paths, reflecting the solar system's motion through the galaxy.
- **Dual Camera Systems**:
  - **Orbit Mode**: Default cinematic camera that tracks selected bodies with smooth interpolation, damping, and collision avoidance for seamless planet-to-planet transitions.
  - **Free Mode**: Full 6DOF first-person navigation using standard WASD controls, pointer lock for mouse look, and movement boosts for vast distance travel.

### Interactive UI & Experience
- **Planet Selection**: Click-to-focus interaction on any planet to open comprehensive information panels containing orbital, physical, and historical data.
- **Visual Toggles**: Granular control over the viewport including orbit line visibility, planet labels, asteroid belt rendering, and background music.
- **Responsive Design**: Adaptive interface that shifts between a desktop-optimized horizontal control bar and a mobile-friendly collapsible bottom sheet.
- **Atmospheric Audio**: Immersive background space journey music with dedicated toggle controls, volume management, and high-quality audio compression.

### Performance & Engineering
- **GPU Instancing**: Thousands of unique asteroids rendered in a single draw call using instance arrays to maintain high frame rates even on lower-end hardware.
- **LOD Geometry**: Dynamic Level of Detail management (24-48 segments) based on object scale and camera distance to optimize triangle count and rendering throughput.
- **State Efficiency**: Centralized simulation state using Zustand to prevent unnecessary React re-renders while maintaining reactive UI updates across the entire application.
- **Optimized Assets**: Compressed textures and optimized 3D assets to ensure fast initial load times and minimal memory footprint during extended simulation sessions.

---

## Tech Stack

### Frontend & Language
- **React 19.2.0**: Utilizing the latest concurrent rendering features and improved resource loading for a fluid and performant user interface.
- **TypeScript 5.9.3**: Ensuring strict type safety across the 3D scene, state management, and UI components to minimize runtime errors and improve developer productivity.

### 3D Rendering
- **Three.js 0.181.2**: The industry-standard core WebGL engine for professional 3D graphics, providing the foundation for all spatial calculations, shaders, and rendering.
- **React Three Fiber 9.4.2**: Modern React-based reconciler for Three.js, enabling declarative 3D development and efficient scene graph management.
- **@react-three/drei 10.7.7**: Essential helper library for standard 3D components, camera controllers, and performance utilities that accelerate 3D development workflows.

### State & Styling
- **Zustand 5.0.9**: Lightweight, high-performance state management solution tailored for complex simulation engines requiring frequent state updates without overhead.
- **Tailwind CSS 4.1.17**: Utility-first styling framework for the interactive overlays, responsive panels, and navigation menus with a modern design aesthetic.
- **Lucide React 0.556.0**: Clean, consistent vector iconography for the user interface, control systems, and status indicators across the application.

### Development Tools
- **Vite 7.2.4**: Next-generation frontend build tool providing ultra-fast Hot Module Replacement (HMR) and highly optimized production builds.
- **ESLint 9.39.1**: Rigorous static analysis for maintaining high code quality, architectural consistency, and adherence to modern JavaScript standards.
- **Bun**: High-performance JavaScript package manager and runtime environment that significantly reduces installation times and build durations.

---

## Installation & Setup

### Prerequisites
Before starting, ensure you have [Bun](https://bun.sh/) installed on your local development machine. This project relies on Bun for package management and script execution due to its superior speed and reliability compared to traditional managers like npm or yarn.

### 1. Clone the Repository
Begin by cloning the project repository from GitHub to your local environment:
```bash
git clone https://github.com/C-W-D-Harshit/solar-system.git
cd solar-system
```

### 2. Install Dependencies
Install all required project dependencies using the Bun package manager. This step will also verify the `bun.lock` integrity and ensure a consistent environment across different machines:
```bash
bun install
```

### 3. Start Development Server
Launch the local development server with Hot Module Replacement (HMR) enabled for a responsive and rapid development experience:
```bash
bun dev
```

### 4. Build for Production
Generate a highly optimized production build in the `dist/` directory, ready for deployment to static hosting services like GitHub Pages or Vercel:
```bash
bun run build
```

### 5. Preview Production Build
Locally preview the generated production build to verify performance, assets, and functionality before final deployment to your hosting provider:
```bash
bun run preview
```

---

## Project Structure

The codebase is organized into a modular component-based architecture, separating 3D scene logic from the React UI layer for better maintainability and scalability.

```text
src/
├── assets/               # Static assets, branding, and background audio files
├── components/
│   ├── solar/            # 3D Scene Components
│   │   ├── AsteroidBelt.tsx      # GPU Instanced asteroid field rendering logic
│   │   ├── CameraController.tsx  # Dual-mode camera system and transition logic
│   │   ├── OrbitLines.tsx        # Planetary path and trajectory visualization
│   │   ├── Planet.tsx            # Planet mesh, textures, and ring system logic
│   │   ├── SolarSystemScene.tsx  # Main R3F Canvas and overall scene orchestration
│   │   └── Sun.tsx               # Sun mesh with complex multi-layer glow shaders
│   └── ui/               # Interface Overlay Components
│       ├── ControlPanel.tsx      # Playback, speed, and visual toggle interface
│       ├── InfoPanel.tsx         # Planetary data display and educational content
│       └── Overlay.tsx           # Main UI layout and responsive container wrapper
├── constants/            # Physical constants and galactic motion datasets
├── data/
│   └── solarSystem.ts    # Comprehensive astronomical datasets for all bodies
├── hooks/                # Custom React hooks for scene interaction and device detection
├── store/
│   └── useStore.ts       # Centralized Zustand simulation state and actions
├── types/
│   └── index.ts          # Shared TypeScript interfaces, types, and enums
└── public/
    └── textures/         # High-resolution planetary and space background textures
```

---

## Controls & Usage Guide

### Desktop Controls

```text
PLAYBACK
  Space         - Toggle Play/Pause for the entire celestial simulation
  Speed Slider  - Fine-tune simulation speed from 0x to 50x (20x default)

CAMERA (Orbit Mode - Default)
  Left Click    - Rotate the view around the currently selected target body
  Right Click   - Pan the camera across the scene to view wider perspectives
  Scroll        - Dynamic zoom in and out of the focused celestial body
  
CAMERA (Free Mode)
  W / A / S / D - Move forward, left, backward, or right through the scene
  Space         - Move upward relative to the current camera orientation
  Shift         - Move downward relative to the current camera orientation
  Ctrl          - Apply speed boost for rapid long-distance travel through space
  Mouse         - Look around freely (Pointer Lock mode active for immersion)

INTERACTION
  Click Planet  - Select and smoothly focus the camera on a specific planet
  Esc           - Exit mouse pointer lock mode or deselect current planet target
  
TOGGLES
  Orbits        - Toggle visibility of planetary orbital trajectories in the scene
  Labels        - Toggle visibility of celestial body names and distance markers
  Asteroids     - Toggle rendering of the high-performance instanced asteroid belt
  Music         - Enable or disable the background atmospheric space journey audio
```

### Mobile Controls

```text
Touch         - Single finger to rotate, multi-finger to pan the viewport
Pinch         - Pinch gesture to zoom in and out of the focused planets
Tap           - Tap a planet to select it and view its comprehensive data sheet
UI Panel      - Tap the collapsible bottom sheet to expand or collapse details
```

---

## Contributing

We welcome contributions from the community that help improve the scientific accuracy, visual fidelity, or performance of this visualization. Whether it's a bug fix, a new feature, or an optimization, your help is appreciated.

### How to Contribute

1. **Fork** the repository to your own GitHub account to start your changes.
2. **Create** a new feature branch: `git checkout -b feature/amazing-feature`.
3. **Commit** your changes with descriptive messages: `git commit -m 'Add some amazing feature'`.
4. **Push** your branch to your forked repository: `git push origin feature/amazing-feature`.
5. **Open** a Pull Request for review and discussion with the maintainers.

Please ensure all new code follows the project's ESLint rules and includes proper TypeScript type definitions for all components and utilities to maintain code quality.

---

## License

This project is licensed under the terms and conditions specified in the [LICENSE](LICENSE) file. All planetary textures and audio assets are used in accordance with their respective creators' licenses and permissions.

Copyright (c) 2026 C-W-D-Harshit. All rights reserved.
For more information, please refer to the documentation in the source files.
