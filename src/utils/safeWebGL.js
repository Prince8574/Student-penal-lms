import * as THREE from "three";

/**
 * Safely create a WebGLRenderer — returns null if context limit hit.
 * Prevents "Error creating WebGL context" crashes across the app.
 */
export function createRenderer(canvas, opts = {}) {
  try {
    const R = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,          // off by default — saves memory
      powerPreference: "low-power",
      failIfMajorPerformanceCaveat: false,
      ...opts,
    });
    R.setPixelRatio(1);          // always 1x — biggest context memory saver
    return R;
  } catch (e) {
    console.warn("[WebGL] Context creation failed — skipping 3D background.", e.message);
    return null;
  }
}
