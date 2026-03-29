import * as THREE from "three";
import { createRenderer } from "../../../utils/safeWebGL";

export function useBgScene(canvasRef) {
  const { useEffect } = require('react');
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const R = createRenderer(canvas);
    if (!R) return;
    R.setSize(window.innerWidth, window.innerHeight);
    
    const S = new THREE.Scene();
    const C = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 500);
    C.position.z = 50;

    // Star field generator
    const makeStars = (n, sp, sz, op, col) => {
      const g = new THREE.BufferGeometry();
      const p = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) { 
        p[i*3] = (Math.random() - .5) * sp; 
        p[i*3+1] = (Math.random() - .5) * sp * .7; 
        p[i*3+2] = (Math.random() - .5) * 80; 
      }
      g.setAttribute('position', new THREE.BufferAttribute(p, 3));
      return new THREE.Points(g, new THREE.PointsMaterial({ 
        color: col || 0xffffff, 
        size: sz, 
        transparent: true, 
        opacity: op, 
        sizeAttenuation: true 
      }));
    };

    // Add star layers
    S.add(makeStars(2200, 260, .08, .28));
    S.add(makeStars(600, 160, .18, .12));
    S.add(makeStars(280, 200, .06, .42, 0xf0a500));
    S.add(makeStars(180, 180, .05, .32, 0x00d4aa));

    // Animated rings
    const ringColors = [0xf0a500, 0x00d4aa, 0x3b82f6, 0xa78bfa];
    const rings = ringColors.map((col, i) => {
      const m = new THREE.Mesh(
        new THREE.TorusGeometry(26 + i * 13, .07 + i * .025, 6, 120),
        new THREE.MeshBasicMaterial({ 
          color: col, 
          wireframe: true, 
          transparent: true, 
          opacity: .018 + i * .004 
        })
      );
      m.rotation.x = .6 + i * .4; 
      m.rotation.z = i * .5;
      m.userData = { ry: .0012 + i * .0008, rz: .0005 };
      S.add(m); 
      return m;
    });

    // Floating geometric shapes
    const floatColors = [0xf0a500, 0x00d4aa, 0x3b82f6, 0xa78bfa, 0xf472b6, 0xff7a30, 0x4ade80];
    const floats = floatColors.map((col, i) => {
      const mesh = new THREE.Mesh(
        new THREE.IcosahedronGeometry(2.5 + i * .5, 0),
        new THREE.MeshBasicMaterial({ 
          color: col, 
          wireframe: true, 
          transparent: true, 
          opacity: .04 + i * .008 
        })
      );
      mesh.position.set(
        (Math.random() - .5) * 100, 
        (Math.random() - .5) * 70, 
        (Math.random() - .5) * 30 - 10
      );
      mesh.userData = { 
        rx: (Math.random() - .5) * .006, 
        ry: (Math.random() - .5) * .009, 
        fy: Math.random() * Math.PI * 2, 
        sp: .18 + Math.random() * .25 
      };
      S.add(mesh); 
      return mesh;
    });

    // Lighting
    const pl = new THREE.PointLight(0xf0a500, 1.8, 80); 
    pl.position.set(0, 15, 20); 
    S.add(pl);
    S.add(new THREE.AmbientLight(0x070c1a, 2));

    // Mouse interaction and animation variables
    let pmx = 0, pmy = 0, t = 0, raf;
    
    const onMouse = e => { 
      pmx = (e.clientX / window.innerWidth - .5) * 2; 
      pmy = -(e.clientY / window.innerHeight - .5) * 2; 
    };
    
    const onResize = () => { 
      C.aspect = window.innerWidth / window.innerHeight; 
      C.updateProjectionMatrix(); 
      R.setSize(window.innerWidth, window.innerHeight); 
    };
    
    window.addEventListener('mousemove', onMouse);
    window.addEventListener('resize', onResize);

    // Animation loop
    const loop = () => {
      raf = requestAnimationFrame(loop); 
      t += .005;
      
      // Animate rings
      rings.forEach(m => { 
        m.rotation.y += m.userData.ry; 
        m.rotation.z += m.userData.rz; 
      });
      
      // Animate floating shapes
      floats.forEach(f => { 
        f.rotation.x += f.userData.rx; 
        f.rotation.y += f.userData.ry; 
        f.position.y += Math.sin(t * f.userData.sp + f.userData.fy) * .007; 
      });
      
      // Camera follows mouse
      C.position.x += (pmx * 6 - C.position.x) * .035;
      C.position.y += (pmy * 4 - C.position.y) * .035;
      C.lookAt(0, 0, 0); 
      
      R.render(S, C);
    };
    
    loop();

    // Cleanup function
    return () => { 
      cancelAnimationFrame(raf); 
      window.removeEventListener('mousemove', onMouse); 
      window.removeEventListener('resize', onResize); 
      R.dispose(); 
    };
  }, [canvasRef]);
}