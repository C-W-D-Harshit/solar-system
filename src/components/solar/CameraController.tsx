import { useFrame, useThree } from "@react-three/fiber";
import { Vector3, Euler, MathUtils } from "three";
import { useStore } from "../../store/useStore";
import { useRef, useEffect, useCallback } from "react";

interface CameraControllerProps {
  /** Reference to current simulation time */
  timeRef: React.MutableRefObject<number>;
  /** Reference to the Sun's current world position (for galactic motion) */
  sunPositionRef: React.MutableRefObject<Vector3>;
}

/** Keyboard state for tracking pressed keys */
interface KeyState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
  boost: boolean;
}

/**
 * CameraController handles both orbit and free camera modes
 * - Orbit mode: follows selected celestial bodies with OrbitControls
 * - Free mode: WASD movement, Space/Shift for vertical, mouse for look
 * 
 * Galactic Motion:
 * - Camera follows Sun's position when galactic motion is enabled
 * - Maintains proper tracking of celestial bodies as they move
 */
export function CameraController({ timeRef, sunPositionRef }: CameraControllerProps) {
  /** Use individual selectors to prevent re-renders from unrelated state changes */
  const selectedBody = useStore((state) => state.selectedBody);
  const cameraMode = useStore((state) => state.cameraMode);
  const { camera, controls, gl } = useThree();
  const currentTarget = useRef(new Vector3(0, 0, 0));

  /** Current rotation angles for free camera (yaw, pitch) */
  const rotation = useRef({ yaw: 0, pitch: 0 });

  /** Keyboard input state */
  const keys = useRef<KeyState>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    up: false,
    down: false,
    boost: false,
  });

  /** Whether pointer is currently locked (free camera mouse look active) */
  const isPointerLocked = useRef(false);

  /** Movement speed constants */
  const BASE_SPEED = 50;
  const BOOST_MULTIPLIER = 3;
  const MOUSE_SENSITIVITY = 0.002;

  /**
   * Handle keyboard key down events
   */
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (cameraMode !== "free") return;

      switch (event.code) {
        case "KeyW":
          keys.current.forward = true;
          break;
        case "KeyS":
          keys.current.backward = true;
          break;
        case "KeyA":
          keys.current.left = true;
          break;
        case "KeyD":
          keys.current.right = true;
          break;
        case "Space":
          event.preventDefault();
          keys.current.up = true;
          break;
        case "ShiftLeft":
        case "ShiftRight":
          keys.current.down = true;
          break;
        case "ControlLeft":
        case "ControlRight":
          keys.current.boost = true;
          break;
      }
    },
    [cameraMode]
  );

  /**
   * Handle keyboard key up events
   */
  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    switch (event.code) {
      case "KeyW":
        keys.current.forward = false;
        break;
      case "KeyS":
        keys.current.backward = false;
        break;
      case "KeyA":
        keys.current.left = false;
        break;
      case "KeyD":
        keys.current.right = false;
        break;
      case "Space":
        keys.current.up = false;
        break;
      case "ShiftLeft":
      case "ShiftRight":
        keys.current.down = false;
        break;
      case "ControlLeft":
      case "ControlRight":
        keys.current.boost = false;
        break;
    }
  }, []);

  /**
   * Handle mouse movement for camera look (only when pointer is locked)
   */
  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!isPointerLocked.current || cameraMode !== "free") return;

      rotation.current.yaw -= event.movementX * MOUSE_SENSITIVITY;
      rotation.current.pitch -= event.movementY * MOUSE_SENSITIVITY;

      // Clamp pitch to prevent camera flipping
      rotation.current.pitch = MathUtils.clamp(
        rotation.current.pitch,
        -Math.PI / 2 + 0.1,
        Math.PI / 2 - 0.1
      );
    },
    [cameraMode]
  );

  /**
   * Handle pointer lock state changes
   */
  const handlePointerLockChange = useCallback(() => {
    isPointerLocked.current = document.pointerLockElement === gl.domElement;
  }, [gl.domElement]);

  /**
   * Request pointer lock when clicking canvas in free mode
   */
  const handleCanvasClick = useCallback(() => {
    if (cameraMode === "free" && !isPointerLocked.current) {
      gl.domElement.requestPointerLock();
    }
  }, [cameraMode, gl.domElement]);

  // Set up event listeners
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("pointerlockchange", handlePointerLockChange);
    gl.domElement.addEventListener("click", handleCanvasClick);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener(
        "pointerlockchange",
        handlePointerLockChange
      );
      gl.domElement.removeEventListener("click", handleCanvasClick);
    };
  }, [
    handleKeyDown,
    handleKeyUp,
    handleMouseMove,
    handlePointerLockChange,
    handleCanvasClick,
    gl.domElement,
  ]);

  // Sync camera rotation when switching to free mode
  useEffect(() => {
    if (cameraMode === "free") {
      // Extract current camera euler angles
      const euler = new Euler().setFromQuaternion(camera.quaternion, "YXZ");
      rotation.current.yaw = euler.y;
      rotation.current.pitch = euler.x;
    }

    // Release pointer lock when switching away from free mode
    if (cameraMode !== "free" && isPointerLocked.current) {
      document.exitPointerLock();
    }
  }, [cameraMode, camera.quaternion]);

  // Disable/enable OrbitControls based on camera mode
  useEffect(() => {
    const orbitControls = controls as { enabled?: boolean } | null;
    if (orbitControls && "enabled" in orbitControls) {
      orbitControls.enabled = cameraMode === "orbit";
    }
  }, [cameraMode, controls]);

  useFrame((_, delta) => {
    if (cameraMode === "free") {
      // Free camera mode: WASD + mouse look
      handleFreeCameraMovement(delta);
    } else {
      // Orbit camera mode: follow selected body or center
      handleOrbitCameraMovement(delta);
    }
  });

  /**
   * Handle free camera movement with WASD keys and mouse look
   */
  function handleFreeCameraMovement(delta: number) {
    // Calculate movement speed
    const speed = keys.current.boost
      ? BASE_SPEED * BOOST_MULTIPLIER
      : BASE_SPEED;

    // Create movement vector based on key states
    const moveDirection = new Vector3();

    if (keys.current.forward) moveDirection.z -= 1;
    if (keys.current.backward) moveDirection.z += 1;
    if (keys.current.left) moveDirection.x -= 1;
    if (keys.current.right) moveDirection.x += 1;
    if (keys.current.up) moveDirection.y += 1;
    if (keys.current.down) moveDirection.y -= 1;

    // Normalize diagonal movement
    if (moveDirection.length() > 0) {
      moveDirection.normalize();
    }

    // Apply rotation to movement direction
    const euler = new Euler(
      rotation.current.pitch,
      rotation.current.yaw,
      0,
      "YXZ"
    );
    moveDirection.applyEuler(euler);

    // Apply movement to camera position
    camera.position.add(moveDirection.multiplyScalar(speed * delta));

    // Update camera rotation
    camera.quaternion.setFromEuler(euler);
  }

  /**
   * Handle orbit camera movement - follows selected body or returns to center
   * Includes Sun's position for galactic motion support
   */
  function handleOrbitCameraMovement(delta: number) {
    const orbitControls = controls as {
      target: Vector3;
      update: () => void;
    } | null;

    if (selectedBody) {
      /** Calculate current orbital position of the selected body */
      const time = timeRef.current;
      const angle = time * selectedBody.orbitSpeed;
      const orbitalX = Math.cos(angle) * selectedBody.distance;
      const orbitalZ = Math.sin(angle) * selectedBody.distance;

      /** Add Sun's position for galactic motion (creates proper tracking) */
      const worldX = orbitalX + sunPositionRef.current.x;
      const worldY = sunPositionRef.current.y;
      const worldZ = orbitalZ + sunPositionRef.current.z;

      const targetPosition = new Vector3(worldX, worldY, worldZ);

      /** Smoothly move the controls target to the body's position */
      const lerpFactor = 5 * delta;
      currentTarget.current.lerp(targetPosition, lerpFactor);

      if (orbitControls) {
        orbitControls.target.copy(currentTarget.current);
        orbitControls.update();
      }
    } else {
      /** If nothing selected, follow the Sun's position (galactic motion center) */
      const targetPosition = sunPositionRef.current.clone();
      const lerpFactor = 2 * delta;
      currentTarget.current.lerp(targetPosition, lerpFactor);

      if (orbitControls) {
        orbitControls.target.copy(currentTarget.current);
        orbitControls.update();
      }
    }
  }

  return null;
}
