import { useEffect } from "react";
import * as THREE from "three";
import { createRenderer } from "../../../utils/safeWebGL";

export function useBg(ref) {
  useEffect(() => {
    if (!ref.current) return;
    const R = createRenderer(ref.current);
    if (!R) return;
    R.setSize(window.innerWidth, window.innerHeight);
    
    const S = new THREE.Scene();
    const C = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, .1, 500);
    C.position.z = 50;

    const makePts = (n, sp, sz, op, col) => {
      const g = new THREE.BufferGeometry();
      const p = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) { 
        p[i*3] = (Math.random()-.5)*sp; 
        p[i*3+1] = (Math.random()-.5)*sp*.7; 
        p[i*3+2] = (Math.random()-.5)*80; 
      }
      g.setAttribute('position', new THREE.BufferAttribute(p, 3));
      return new THREE.Points(g, new THREE.PointsMaterial({ 
        color: col||0xffffff, 
        size: sz, 
        transparent:true, 
        opacity:op, 
        sizeAttenuation:true 
      }));
    };

    S.add(makePts(1800,240,.08,.22)); 
    S.add(makePts(400,160,.14,.1));
    S.add(makePts(200,200,.06,.35,0xf0a500)); 
    S.add(makePts(150,180,.05,.25,0x00d4aa));

    const rings = [0xf0a500,0x00d4aa,0x3b82f6].map((col,i) => {
      const m = new THREE.Mesh(
        new THREE.TorusGeometry(28+i*14,.06,6,110),
        new THREE.MeshBasicMaterial({
          color:col,
          wireframe:true,
          transparent:true,
          opacity:.015+i*.003
        })
      );
      m.rotation.x = .6+i*.4; 
      m.rotation.z = i*.5; 
      m.userData = {ry:.001+i*.0007}; 
      S.add(m); 
      return m;
    });

    const floats = [0xf0a500,0x3b82f6,0xa78bfa,0x00d4aa,0xf472b6].map((col,i) => {
      const mesh = new THREE.Mesh(
        new THREE.IcosahedronGeometry(2.2+i*.5,0),
        new THREE.MeshBasicMaterial({
          color:col,
          wireframe:true,
          transparent:true,
          opacity:.035+i*.007
        })
      );
      mesh.position.set(
        (Math.random()-.5)*90,
        (Math.random()-.5)*65,
        (Math.random()-.5)*28-8
      );
      mesh.userData = {
        rx:(Math.random()-.5)*.005,
        ry:(Math.random()-.5)*.008,
        fy:Math.random()*Math.PI*2,
        sp:.15+Math.random()*.2
      };
      S.add(mesh); 
      return mesh;
    });

    let pmx=0,pmy=0,t=0,raf;
    
    const onMouse = e => {
      pmx = (e.clientX/window.innerWidth-.5)*2;
      pmy = -(e.clientY/window.innerHeight-.5)*2;
    };
    
    const onResize = () => {
      C.aspect = window.innerWidth/window.innerHeight;
      C.updateProjectionMatrix();
      R.setSize(window.innerWidth,window.innerHeight);
    };

    window.addEventListener('mousemove',onMouse); 
    window.addEventListener('resize',onResize);

    const loop = () => {
      raf = requestAnimationFrame(loop);
      t += .005;
      
      rings.forEach(m => {
        m.rotation.y += m.userData.ry;
        m.rotation.z += .0004;
      });
      
      floats.forEach(f => {
        f.rotation.x += f.userData.rx;
        f.rotation.y += f.userData.ry;
        f.position.y += Math.sin(t*f.userData.sp+f.userData.fy)*.006;
      });
      
      C.position.x += (pmx*5-C.position.x)*.03;
      C.position.y += (pmy*3-C.position.y)*.03;
      C.lookAt(0,0,0);
      R.render(S,C);
    };
    
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove',onMouse);
      window.removeEventListener('resize',onResize);
      R.dispose();
    };
  }, [ref]);
}
