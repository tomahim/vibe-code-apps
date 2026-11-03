import { useEffect, useRef, useState } from 'react';
import { createScene } from './engine';

// One interactive study model. Drag to turn; slow idle spin otherwise.
// Respects prefers-reduced-motion (no automatic rotation) and pauses
// rendering while offscreen. A WebGL failure leaves a labelled frame.
export function SpecimenCanvas({ kind, variant = 'bench', spin = false, className }) {
    const ref = useRef(null);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        const cv = ref.current;
        if (!cv) return undefined;
        const sc = createScene(cv, kind, variant);
        if (!sc) { setFailed(true); return undefined; }
        setFailed(false);
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const s = { ry: 0.6, rx: -0.08, drag: false, visible: true };
        let raf = 0;
        let last = performance.now();
        const frame = (t) => {
            raf = requestAnimationFrame(frame);
            if (!s.visible) { last = t; return; }
            sc.resize();
            const dt = Math.min((t - last) / 1000, 0.1);
            last = t;
            if (!s.drag && !reduced) {
                s.ry += (spin ? 0.3 : 0.12) * dt;
                s.rx += (Math.abs(s.rx + 0.08) > 0.002 ? (-0.08 - s.rx) * dt * 2 : 0);
            }
            sc.render(s.ry, s.rx);
        };
        raf = requestAnimationFrame(frame);
        const io = new IntersectionObserver((es) => { s.visible = es[0]?.isIntersecting ?? true; }, { threshold: 0.02 });
        io.observe(cv);
        let px = 0; let py = 0;
        const down = (e) => { s.drag = true; px = e.clientX; py = e.clientY; cv.setPointerCapture(e.pointerId); };
        const move = (e) => {
            if (!s.drag) return;
            s.ry += (e.clientX - px) * 0.01;
            s.rx += (e.clientY - py) * 0.01;
            s.rx = Math.max(-1.1, Math.min(1.1, s.rx));
            px = e.clientX; py = e.clientY;
        };
        const up = () => { s.drag = false; };
        cv.addEventListener('pointerdown', down);
        cv.addEventListener('pointermove', move);
        cv.addEventListener('pointerup', up);
        cv.addEventListener('pointercancel', up);
        return () => {
            cancelAnimationFrame(raf);
            io.disconnect();
            sc.dispose();
            cv.removeEventListener('pointerdown', down);
            cv.removeEventListener('pointermove', move);
            cv.removeEventListener('pointerup', up);
            cv.removeEventListener('pointercancel', up);
        };
    }, [kind, variant, spin]);

    if (failed) {
        return <div className={className ?? 'spec-canvas'} role="img" aria-label={'3D study model of ' + kind + ' unavailable'}><span className="spec-fallback">3D unavailable on this device</span></div>;
    }
    return <canvas key={kind + '-' + variant} ref={ref} className={className ?? 'spec-canvas'} aria-label={'Interactive 3D study model of ' + kind} />;
}
