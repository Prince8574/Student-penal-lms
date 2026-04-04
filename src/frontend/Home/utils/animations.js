import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

// Bento card mouse glow effect (keeping this for hover effects)
export const initBentoCardGlow = () => {
  document.querySelectorAll('.bento-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
      card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
    });
  });
};

// Three.js background canvas
export const initBackgroundCanvas = (canvas) => {
  if (!canvas) return;
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
  } catch(e) { console.warn('[WebGL] Home bg skipped'); return; }
  renderer.setPixelRatio(1);
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 300);
  camera.position.z = 40;

  // Stars
  const sg = new THREE.BufferGeometry();
  const N = 700;
  const sp = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    sp[i * 3] = (Math.random() - 0.5) * 200;
    sp[i * 3 + 1] = (Math.random() - 0.5) * 160;
    sp[i * 3 + 2] = (Math.random() - 0.5) * 80;
  }
  sg.setAttribute('position', new THREE.BufferAttribute(sp, 3));
  scene.add(new THREE.Points(sg, new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.09,
    transparent: true,
    opacity: 0.35
  })));

  // Lines
  const lm = new THREE.LineBasicMaterial({ color: 0xf0a500, transparent: true, opacity: 0.025 });
  for (let i = 0; i < 8; i++) {
    const pts = [];
    const cx = (Math.random() - 0.5) * 80;
    const cy = (Math.random() - 0.5) * 50;
    for (let j = 0; j < 50; j++) {
      pts.push(new THREE.Vector3(
        cx + (Math.random() - 0.5) * 40,
        cy + (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 20
      ));
    }
    scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), lm));
  }

  // Torus rings
  const rm = new THREE.MeshBasicMaterial({ color: 0xf0a500, wireframe: true, transparent: true, opacity: 0.04 });
  const r1 = new THREE.Mesh(new THREE.TorusGeometry(30, 0.2, 8, 80), rm);
  r1.rotation.x = 1.1;
  scene.add(r1);
  
  const r2 = new THREE.Mesh(new THREE.TorusGeometry(22, 0.15, 6, 60), rm);
  r2.rotation.x = 0.6;
  r2.rotation.z = 0.4;
  scene.add(r2);

  let mx = 0, my = 0;
  document.addEventListener('mousemove', (e) => {
    mx = (e.clientX / window.innerWidth - 0.5) * 2;
    my = -(e.clientY / window.innerHeight - 0.5) * 2;
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  let t = 0;
  function loop() {
    requestAnimationFrame(loop);
    t += 0.005;
    r1.rotation.y = t * 0.3;
    r2.rotation.y = t * 0.2;
    camera.position.x += (mx * 6 - camera.position.x) * 0.04;
    camera.position.y += (my * 3 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  }
  loop();
};

// Three.js hero canvas
export const initHeroCanvas = (canvas) => {
  if (!canvas) return;

  // Wait for canvas to have actual dimensions
  const w = canvas.offsetWidth || canvas.parentElement?.offsetWidth || 500;
  const h = canvas.offsetHeight || canvas.parentElement?.offsetHeight || 600;
  if (w === 0 || h === 0) return;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
  } catch(e) { console.warn('[WebGL] Home hero canvas skipped'); return; }
  renderer.setPixelRatio(1);

  function resize() {
    const w = canvas.offsetWidth || 500;
    const h = canvas.offsetHeight || 600;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.z = 18;
  resize();
  window.addEventListener('resize', resize);

  const NODE_COUNT = 80;
  const RADIUS = 6.5;
  const nodePos = [];
  const phi = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < NODE_COUNT; i++) {
    const y = 1 - (i / (NODE_COUNT - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = phi * i;
    nodePos.push(new THREE.Vector3(
      Math.cos(theta) * r * RADIUS,
      y * RADIUS,
      Math.sin(theta) * r * RADIUS
    ));
  }

  // Edges between nodes
  const edgeMat = new THREE.LineBasicMaterial({ color: 0xf0a500, transparent: true, opacity: 0.18 });
  const edgeGroup = new THREE.Group();
  for (let i = 0; i < NODE_COUNT; i++) {
    for (let j = i + 1; j < NODE_COUNT; j++) {
      if (nodePos[i].distanceTo(nodePos[j]) < 4.5) {
        edgeGroup.add(new THREE.Line(
          new THREE.BufferGeometry().setFromPoints([nodePos[i], nodePos[j]]),
          edgeMat.clone()
        ));
      }
    }
  }
  scene.add(edgeGroup);

  // Node spheres
  const nodeGroup = new THREE.Group();
  const smallSphere = new THREE.SphereGeometry(0.1, 8, 8);
  const nodeMats = [
    new THREE.MeshPhongMaterial({ color: 0xf0a500, emissive: 0xf0a500, emissiveIntensity: 0.6 }),
    new THREE.MeshPhongMaterial({ color: 0x00d4aa, emissive: 0x00d4aa, emissiveIntensity: 0.5 }),
    new THREE.MeshPhongMaterial({ color: 0x3b82f6, emissive: 0x3b82f6, emissiveIntensity: 0.4 })
  ];
  
  nodePos.forEach((pos, i) => {
    const mesh = new THREE.Mesh(smallSphere, nodeMats[i % nodeMats.length]);
    mesh.position.copy(pos);
    const s = 0.8 + Math.random() * 0.8;
    mesh.scale.setScalar(s);
    mesh.userData = { baseScale: s, phase: Math.random() * Math.PI * 2 };
    nodeGroup.add(mesh);
  });
  scene.add(nodeGroup);

  // Wireframe icosahedron
  scene.add(new THREE.Mesh(
    new THREE.IcosahedronGeometry(7, 2),
    new THREE.MeshBasicMaterial({ color: 0xf0a500, wireframe: true, transparent: true, opacity: 0.05 })
  ));

  // Core sphere
  const coreMat = new THREE.MeshPhongMaterial({
    color: 0xf0a500,
    emissive: 0xf0a500,
    emissiveIntensity: 1,
    transparent: true,
    opacity: 0.6
  });
  const core = new THREE.Mesh(new THREE.SphereGeometry(1.2, 32, 32), coreMat);
  scene.add(core);

  // Lights
  scene.add(new THREE.AmbientLight(0x0d1117, 1));
  
  const pl1 = new THREE.PointLight(0xf0a500, 3, 30);
  pl1.position.set(5, 5, 5);
  scene.add(pl1);
  
  const pl2 = new THREE.PointLight(0x00d4aa, 2, 25);
  pl2.position.set(-8, -5, 8);
  scene.add(pl2);
  
  const pl3 = new THREE.PointLight(0x3b82f6, 1.5, 20);
  pl3.position.set(0, 8, -5);
  scene.add(pl3);

  // Ring
  const ringMat = new THREE.MeshBasicMaterial({ color: 0xf0a500, transparent: true, opacity: 0.25 });
  const ring = new THREE.Mesh(new THREE.TorusGeometry(7.2, 0.04, 8, 120), ringMat);
  ring.rotation.x = Math.PI / 2;
  scene.add(ring);

  let t = 0;
  let dragging = false;
  let prevX = 0;
  let rotY = 0;
  let rotX = 0.3;

  canvas.addEventListener('mousedown', (e) => {
    dragging = true;
    prevX = e.clientX;
  });

  document.addEventListener('mouseup', () => {
    dragging = false;
  });

  document.addEventListener('mousemove', (e) => {
    if (dragging) {
      rotY += (e.clientX - prevX) * 0.01;
      prevX = e.clientX;
    }
  });

  function loop() {
    requestAnimationFrame(loop);
    t += 0.012;
    if (!dragging) rotY += 0.004;
    
    // Rotate groups
    nodeGroup.rotation.y = rotY;
    nodeGroup.rotation.x = rotX + Math.sin(t * 0.3) * 0.05;
    edgeGroup.rotation.y = rotY;
    edgeGroup.rotation.x = rotX + Math.sin(t * 0.3) * 0.05;
    
    // Animate nodes
    nodeGroup.children.forEach(m => {
      const s = m.userData.baseScale * (1 + 0.15 * Math.sin(t * 0.8 + m.userData.phase));
      m.scale.setScalar(s);
    });
    
    // Animate core
    const cp = 0.9 + 0.2 * Math.sin(t * 1.5);
    core.scale.setScalar(cp);
    coreMat.emissiveIntensity = 0.7 + 0.3 * Math.sin(t * 1.5);
    
    // Animate ring
    ring.scale.set(1 + 0.05 * Math.sin(t), 1 + 0.05 * Math.sin(t), 1);
    ringMat.opacity = 0.15 + 0.1 * Math.sin(t * 1.2);
    
    // Animate lights
    pl1.intensity = 3 + Math.sin(t * 0.9);
    
    renderer.render(scene, camera);
  }
  loop();
};

// GSAP animations
export const initGSAPAnimations = () => {
  gsap.to('#site-header', { y: 0, duration: 0.8, ease: 'power3.out', delay: 0.1 });

  const htl = gsap.timeline({ delay: 0.4 });
  htl.to('#h-tag', { opacity: 1, y: 0, duration: 0.7, ease: 'back.out(1.7)' })
    .to('#h-title', { y: 0, opacity: 1, duration: 1, ease: 'power4.out' }, '-=0.2')
    .to('#h-desc', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.3')
    .to('#h-actions', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.4')
    .to('#h-trust', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.3')
    .to(['#fc1', '#fc2', '#fc3'], { opacity: 1, y: 0, duration: 0.7, stagger: 0.15, ease: 'back.out(1.4)' }, '-=0.2')
    .to('#scroll-ind', { opacity: 1, duration: 0.6 }, '-=0.2');

  function revealSec(eye, h2, trig) {
    gsap.to(eye, { opacity: 1, y: 0, duration: 0.6, scrollTrigger: { trigger: trig, start: 'top 82%' } });
    gsap.to(h2, { opacity: 1, y: 0, duration: 0.7, delay: 0.1, scrollTrigger: { trigger: trig, start: 'top 82%' } });
  }

  revealSec('#feat-eye', '#feat-h2', '#features');
  revealSec('#c-eye', '#c-h2', '#courses');
  revealSec('#t-eye', '#t-h2', '#testimonials');

  // Counter animation
  ScrollTrigger.create({
    trigger: '#cnt1',
    start: 'top 85%',
    once: true,
    onEnter: () => {
      gsap.to({ v: 0 }, {
        v: 240,
        duration: 2.2,
        ease: 'power2.out',
        onUpdate: function() {
          const el = document.getElementById('cnt1');
          if (el) el.textContent = Math.round(this.targets()[0].v) + '+';
        }
      });
    }
  });

  gsap.utils.toArray('.bento-card').forEach((c, i) => {
    gsap.to(c, { opacity: 1, y: 0, duration: 0.7, delay: i * 0.06, ease: 'power3.out', scrollTrigger: { trigger: c, start: 'top 88%' } });
  });

  gsap.utils.toArray('.course-card').forEach((c, i) => {
    gsap.to(c, {
      opacity: 1, y: 0, duration: 0.65, delay: i * 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: c, start: 'top 88%' },
      onComplete: () => {
        const bar = c.querySelector('.cc-fill');
        if (bar) bar.style.width = bar.dataset.w + '%';
      }
    });
  });

  gsap.utils.toArray('.testi-card').forEach((c, i) => {
    gsap.to(c, { opacity: 1, y: 0, duration: 0.65, delay: i * 0.12, ease: 'power3.out', scrollTrigger: { trigger: c, start: 'top 88%' } });
  });

  gsap.to('#cta-strip', { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: '#cta-strip', start: 'top 82%' } });

  // Scroll header background change
  ScrollTrigger.create({
    start: 'top -60',
    onUpdate: s => {
      const header = document.getElementById('site-header');
      if (header) {
        header.style.background = s.direction === 1 ? 'rgba(3,6,15,.9)' : 'rgba(3,6,15,.6)';
      }
    }
  });

  // Floating cards animation
  document.querySelectorAll('.float-card').forEach(c => {
    gsap.to(c, {
      y: '-=8',
      duration: 2 + Math.random(),
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: Math.random() * 1.5
    });
  });

  // Refresh ScrollTrigger after all animations set up
  ScrollTrigger.refresh();
};
