import { useEffect } from 'react';
import * as THREE from 'three';
import { createRenderer } from '../../../utils/safeWebGL';

export function useBackground(ref) {
  useEffect(() => {
    if (!ref.current) return;
    const R = createRenderer(ref.current);
    if (!R) return;
    R.setSize(window.innerWidth, window.innerHeight);

    const S = new THREE.Scene();
    const C = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 500);
    C.position.z = 50;

    // Stars — multi-color
    const mkP = (n, sp, sz, op, col) => {
      const g = new THREE.BufferGeometry();
      const p = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) {
        p[i * 3] = (Math.random() - 0.5) * sp;
        p[i * 3 + 1] = (Math.random() - 0.5) * sp * 0.7;
        p[i * 3 + 2] = (Math.random() - 0.5) * 80;
      }
      g.setAttribute('position', new THREE.BufferAttribute(p, 3));
      return new THREE.Points(
        g,
        new THREE.PointsMaterial({
          color: col || 0xffffff,
          size: sz,
          transparent: true,
          opacity: op,
          sizeAttenuation: true,
        })
      );
    };

    S.add(mkP(1800, 240, 0.07, 0.18));
    S.add(mkP(400, 160, 0.12, 0.08));
    S.add(mkP(200, 210, 0.055, 0.32, 0xf0a500));
    S.add(mkP(130, 190, 0.045, 0.2, 0xa78bfa));

    // Torus rings
    [
      [0xf0a500, 28],
      [0xa78bfa, 40],
      [0x3b82f6, 33],
    ].forEach(([col, r], i) => {
      const m = new THREE.Mesh(
        new THREE.TorusGeometry(r, 0.06, 6, 100),
        new THREE.MeshBasicMaterial({
          color: col,
          wireframe: true,
          transparent: true,
          opacity: 0.013 + i * 0.003,
        })
      );
      m.rotation.x = 0.6 + i * 0.4;
      m.rotation.z = i * 0.55;
      m.userData = { ry: 0.0009 + i * 0.0005 };
      S.add(m);
    });

    // Floating icosahedra
    [
      [0xf0a500, 2.8],
      [0x3b82f6, 2.2],
      [0xa78bfa, 3.2],
      [0x00d4aa, 1.9],
      [0xf472b6, 2.5],
    ].forEach(([col, sz], i) => {
      const mesh = new THREE.Mesh(
        new THREE.IcosahedronGeometry(sz, 0),
        new THREE.MeshBasicMaterial({
          color: col,
          wireframe: true,
          transparent: true,
          opacity: 0.028 + i * 0.006,
        })
      );
      mesh.position.set(
        (Math.random() - 0.5) * 92,
        (Math.random() - 0.5) * 65,
        (Math.random() - 0.5) * 30 - 8
      );
      mesh.userData = {
        rx: (Math.random() - 0.5) * 0.005,
        ry: (Math.random() - 0.5) * 0.008,
        fy: Math.random() * Math.PI * 2,
        sp: 0.12 + Math.random() * 0.18,
      };
      S.add(mesh);
    });

    // Octahedra
    [
      [0xf0a500, 1.2],
      [0x00d4aa, 0.9],
    ].forEach(([col, sz], i) => {
      const mesh = new THREE.Mesh(
        new THREE.OctahedronGeometry(sz, 0),
        new THREE.MeshBasicMaterial({
          color: col,
          wireframe: true,
          transparent: true,
          opacity: 0.06,
        })
      );
      mesh.position.set(i === 0 ? -12 : 14, i === 0 ? 4 : -5, -3);
      mesh.userData = { self: true, speed: 0.012 + i * 0.008 };
      S.add(mesh);
    });

    let pmx = 0,
      pmy = 0,
      t = 0,
      raf;

    const onM = (e) => {
      pmx = (e.clientX / window.innerWidth - 0.5) * 2;
      pmy = -(e.clientY / window.innerHeight - 0.5) * 2;
    };

    const onR = () => {
      C.aspect = window.innerWidth / window.innerHeight;
      C.updateProjectionMatrix();
      R.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('mousemove', onM);
    window.addEventListener('resize', onR);

    const loop = () => {
      raf = requestAnimationFrame(loop);
      t += 0.005;

      S.children.forEach((m) => {
        if (m.isMesh && m.geometry.type === 'TorusGeometry') {
          m.rotation.y += m.userData.ry;
          m.rotation.z += 0.0003;
        }
        if (m.isMesh && m.geometry.type === 'IcosahedronGeometry') {
          m.rotation.x += m.userData.rx || 0;
          m.rotation.y += m.userData.ry || 0;
          m.position.y += Math.sin(t * (m.userData.sp || 0.15) + (m.userData.fy || 0)) * 0.006;
        }
        if (m.isMesh && m.userData.self) {
          m.rotation.x += m.userData.speed;
          m.rotation.y += m.userData.speed * 0.7;
        }
      });

      C.position.x += (pmx * 5 - C.position.x) * 0.03;
      C.position.y += (pmy * 3 - C.position.y) * 0.03;
      C.lookAt(0, 0, 0);
      R.render(S, C);
    };

    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onM);
      window.removeEventListener('resize', onR);
      R.dispose();
    };
  }, []);
}

