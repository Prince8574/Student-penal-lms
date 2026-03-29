import { useEffect } from 'react';

export function useGSAP(fn, deps = []) {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const gsap = window.gsap;
    if (!gsap) return;
    fn(gsap);
  }, deps);
}

