// Cursor animation (disabled - using system cursor)
// export const initCursor = (cursor, trail) => {
//   document.addEventListener('mousemove', (e) => {
//     if (cursor) {
//       cursor.style.left = e.clientX + 'px';
//       cursor.style.top = e.clientY + 'px';
//     }
//     if (trail) {
//       trail.style.left = e.clientX + 'px';
//       trail.style.top = e.clientY + 'px';
//     }
//   });
// };

// Three.js background
export const initAuthBackground = (canvas) => {
  if (!canvas || !window.THREE) return;

  let renderer;
  try {
    renderer = new window.THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
  } catch(e) { console.warn('[WebGL] Auth background skipped'); return; }
  renderer.setPixelRatio(1);
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new window.THREE.Scene();
  const camera = new window.THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 200);
  camera.position.z = 35;

  // Stars
  const sg = new window.THREE.BufferGeometry();
  const N = 500;
  const sp = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    sp[i * 3] = (Math.random() - 0.5) * 180;
    sp[i * 3 + 1] = (Math.random() - 0.5) * 140;
    sp[i * 3 + 2] = (Math.random() - 0.5) * 60;
  }
  sg.setAttribute('position', new window.THREE.BufferAttribute(sp, 3));
  scene.add(new window.THREE.Points(sg, new window.THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.08,
    transparent: true,
    opacity: 0.3,
    sizeAttenuation: true
  })));

  // Floating shapes
  const shapes = [];
  const mats = [
    new window.THREE.MeshBasicMaterial({ color: 0xf0a500, wireframe: true, transparent: true, opacity: 0.06 }),
    new window.THREE.MeshBasicMaterial({ color: 0x00d4aa, wireframe: true, transparent: true, opacity: 0.05 }),
    new window.THREE.MeshBasicMaterial({ color: 0x3b82f6, wireframe: true, transparent: true, opacity: 0.04 })
  ];
  const geos = [
    new window.THREE.OctahedronGeometry(4),
    new window.THREE.TetrahedronGeometry(3),
    new window.THREE.IcosahedronGeometry(2.5)
  ];

  for (let i = 0; i < 9; i++) {
    const m = new window.THREE.Mesh(geos[i % 3], mats[i % 3]);
    m.position.set(
      (Math.random() - 0.5) * 80,
      (Math.random() - 0.5) * 60,
      (Math.random() - 0.5) * 20 - 10
    );
    m.userData = {
      rx: (Math.random() - 0.5) * 0.007,
      ry: (Math.random() - 0.5) * 0.01,
      fy: Math.random() * Math.PI * 2,
      sp: 0.3 + Math.random() * 0.4
    };
    scene.add(m);
    shapes.push(m);
  }

  // Ring
  const rm = new window.THREE.MeshBasicMaterial({ color: 0xf0a500, wireframe: true, transparent: true, opacity: 0.03 });
  const ring = new window.THREE.Mesh(new window.THREE.TorusGeometry(25, 0.15, 8, 80), rm);
  ring.rotation.x = 1;
  scene.add(ring);

  let mx = 0, my = 0, t = 0;

  document.addEventListener('mousemove', (e) => {
    mx = (e.clientX / window.innerWidth - 0.5) * 2;
    my = -(e.clientY / window.innerHeight - 0.5) * 2;
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  function loop() {
    requestAnimationFrame(loop);
    t += 0.006;
    
    ring.rotation.y = t * 0.25;
    
    shapes.forEach(s => {
      s.rotation.x += s.userData.rx;
      s.rotation.y += s.userData.ry;
      s.position.y += Math.sin(t * s.userData.sp + s.userData.fy) * 0.007;
    });
    
    camera.position.x += (mx * 4 - camera.position.x) * 0.04;
    camera.position.y += (my * 2 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
    
    renderer.render(scene, camera);
  }
  loop();
};
