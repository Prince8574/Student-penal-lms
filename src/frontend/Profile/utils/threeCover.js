import * as THREE from "three";
import { createRenderer } from "../../../utils/safeWebGL";

export function useCoverScene(canvasRef) {
  const { useEffect } = require('react');
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const R = createRenderer(canvas);
    if (!R) return;
    
    const S = new THREE.Scene();
    const C = new THREE.PerspectiveCamera(52, 1, 0.1, 100);
    C.position.z = 18;

    // Responsive canvas sizing
    const resize = () => { 
      const w = canvas.clientWidth;
      const h = canvas.clientHeight || 1; 
      R.setSize(w, h, false); 
      C.aspect = w / h; 
      C.updateProjectionMatrix(); 
    };
    
    resize(); 
    window.addEventListener('resize', resize);

    // Animated ribbon waves
    const LINES = 14, PTS = 140;
    const cols = [0xf0a500, 0x00d4aa, 0x3b82f6, 0xff7a30, 0xa78bfa, 0xf472b6, 0x4ade80];
    
    const ribbons = Array.from({ length: LINES }, (_, l) => {
      const pts = Array.from({ length: PTS }, (_, p) => 
        new THREE.Vector3(p * .25 - PTS * .125, 0, 0)
      );
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ 
        color: cols[l % cols.length], 
        transparent: true, 
        opacity: .09 + l * .012 
      }));
      
      line.userData = { 
        off: l * .42, 
        amp: 1 + l * .22, 
        freq: .55 + l * .07, 
        spd: .7 + l * .08, 
        y: (l - LINES / 2) * .5 
      };
      
      S.add(line); 
      return line;
    });

    // Particle field
    const pg = new THREE.BufferGeometry();
    const pn = 600;
    const pp = new Float32Array(pn * 3);
    
    for (let i = 0; i < pn; i++) { 
      pp[i*3] = (Math.random() - .5) * 38; 
      pp[i*3+1] = (Math.random() - .5) * 14; 
      pp[i*3+2] = (Math.random() - .5) * 8; 
    }
    
    pg.setAttribute('position', new THREE.BufferAttribute(pp, 3));
    S.add(new THREE.Points(pg, new THREE.PointsMaterial({ 
      color: 0xf0a500, 
      size: .055, 
      transparent: true, 
      opacity: .5, 
      sizeAttenuation: true 
    })));

    // Floating orbs
    const orbs = [0xf0a500, 0x00d4aa, 0x3b82f6].map((col, i) => {
      const orb = new THREE.Mesh(
        new THREE.SphereGeometry(.65, 24, 24), 
        new THREE.MeshPhongMaterial({ 
          color: col, 
          emissive: col, 
          emissiveIntensity: 1.2, 
          transparent: true, 
          opacity: .22 
        })
      );
      orb.position.set(-8 + i * 8, 0, 0); 
      S.add(orb); 
      return orb;
    });

    // Lighting
    S.add(new THREE.AmbientLight(0x080f18, 1.2));
    const cpl = new THREE.PointLight(0xf0a500, 4, 24); 
    cpl.position.set(0, 6, 6); 
    S.add(cpl);

    // Animation variables
    let t = 0, pmx = 0, raf;
    
    const onMouse = e => { 
      pmx = (e.clientX / window.innerWidth - .5) * 2; 
    };
    
    window.addEventListener('mousemove', onMouse);

    // Animation loop
    const loop = () => {
      raf = requestAnimationFrame(loop); 
      t += .015;
      
      // Animate ribbon waves
      ribbons.forEach(r => {
        const pos = r.geometry.attributes.position;
        for (let i = 0; i < PTS; i++) { 
          pos.setY(i, r.userData.y + Math.sin(i * r.userData.freq * .1 + t * r.userData.spd + r.userData.off) * r.userData.amp); 
          pos.setZ(i, Math.cos(i * r.userData.freq * .06 + t * r.userData.spd * .65) * 1.5); 
        }
        pos.needsUpdate = true;
      });
      
      // Animate orbs
      orbs.forEach((orb, i) => { 
        orb.position.x = -8 + i * 8 + Math.sin(t * .4 + i * 1.2) * 2.5; 
        orb.position.y = Math.cos(t * .3 + i * .8) * 2; 
      });
      
      // Camera follows mouse
      C.position.x += ((pmx * 4) - C.position.x) * .04;
      C.lookAt(0, 0, 0); 
      
      R.render(S, C);
    };
    
    loop();

    // Cleanup function
    return () => { 
      cancelAnimationFrame(raf); 
      window.removeEventListener('mousemove', onMouse); 
      window.removeEventListener('resize', resize); 
      R.dispose(); 
    };
  }, [canvasRef]);
}