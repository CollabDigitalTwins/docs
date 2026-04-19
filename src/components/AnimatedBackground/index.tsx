import { useEffect, useRef, useState, type ReactNode } from 'react';
import styles from './styles.module.css';

/**
 * Ported from the CDT homepage AnimatedBackground.
 * - Dependencies stripped (no framer-motion, no Next.js env vars)
 * - Syncs to Docusaurus dark mode via html[data-theme="dark"]
 */
export default function AnimatedBackground(): ReactNode {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDark, setIsDark] = useState(false);

  // Sync with Docusaurus color mode
  useEffect(() => {
    const sync = () =>
      setIsDark(document.documentElement.getAttribute('data-theme') === 'dark');
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    let animationFrameId: number;
    let time = 0;
    let offsetX = 0;

    interface DataNode {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      connections: number[];
      pulse: number;
    }

    const dataNodes: DataNode[] = [];
    const gridSize = 100;
    const nodeSpacing = 150;
    const nodeCols = Math.ceil(canvas.width / nodeSpacing) + 2;
    const nodeRows = Math.ceil(canvas.height / nodeSpacing);

    for (let row = 0; row < nodeRows; row++) {
      for (let col = 0; col < nodeCols; col++) {
        const baseX = col * nodeSpacing + nodeSpacing / 2;
        const baseY = row * nodeSpacing + nodeSpacing / 2;
        dataNodes.push({
          x: baseX,
          y: baseY,
          baseX,
          baseY,
          connections: [],
          pulse: (row + col) * 0.5,
        });
      }
    }

    dataNodes.forEach((node, i) => {
      const col = i % nodeCols;
      const row = Math.floor(i / nodeCols);
      if (col < nodeCols - 1) node.connections.push(i + 1);
      if (row < nodeRows - 1) node.connections.push(i + nodeCols);
    });

    const draw = () => {
      time += 0.008;
      offsetX += 0.1;
      if (offsetX > nodeSpacing) offsetX -= nodeSpacing;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const bgGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      if (isDark) {
        bgGradient.addColorStop(0, 'rgba(239, 145, 97, 0.025)');
        bgGradient.addColorStop(1, 'rgba(180, 90, 40, 0.02)');
      } else {
        bgGradient.addColorStop(0, 'rgba(239, 146, 98, 0.08)');
        bgGradient.addColorStop(1, 'rgba(239, 146, 98, 0.06)');
      }
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Float + horizontal scroll
      dataNodes.forEach((node) => {
        const floatX = Math.sin(time * 0.3 + node.pulse) * 2;
        const floatY = Math.cos(time * 0.2 + node.pulse) * 2;
        let x = node.baseX - offsetX + floatX;
        x = (x + nodeCols * nodeSpacing) % (nodeCols * nodeSpacing);
        node.x = x;
        node.y = node.baseY + floatY;
      });

      // Horizontal perspective grid lines
      ctx.strokeStyle = isDark ? 'rgba(239, 145, 97, 0.08)' : 'rgba(239, 146, 98, 0.3)';
      ctx.lineWidth = 0.5;

      for (let y = canvas.height; y > canvas.height * 0.3; y -= gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      const verticalSpacing = gridSize * 1.5;
      const gridCols = Math.ceil(canvas.width / verticalSpacing) + 2;
      for (let i = 0; i < gridCols; i++) {
        let x = i * verticalSpacing - (offsetX % verticalSpacing) - verticalSpacing;
        x = (x + gridCols * verticalSpacing) % (gridCols * verticalSpacing);
        ctx.beginPath();
        ctx.moveTo(x, canvas.height);
        ctx.lineTo(x + (x - canvas.width / 2) * 0.3, canvas.height * 0.3);
        ctx.stroke();
      }

      // Connections + flowing particles
      ctx.lineWidth = 0.8;
      dataNodes.forEach((node) => {
        node.connections.forEach((targetIndex) => {
          const target = dataNodes[targetIndex];
          const pulse = (Math.sin(time + node.pulse) + 1) / 2;

          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(target.x, target.y);
          ctx.strokeStyle = isDark
            ? `rgba(239, 145, 97, ${0.1 + pulse * 0.08})`
            : `rgba(239, 146, 98, ${0.35 + pulse * 0.2})`;
          ctx.stroke();

          const flowProgress = (time * 0.3 + node.pulse) % 1;
          const particleX = node.x + (target.x - node.x) * flowProgress;
          const particleY = node.y + (target.y - node.y) * flowProgress;

          ctx.beginPath();
          ctx.arc(particleX, particleY, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = isDark
            ? `rgba(239, 145, 97, ${0.5 + pulse * 0.3})`
            : `rgba(239, 146, 98, ${0.7 + pulse * 0.3})`;
          ctx.fill();
        });
      });

      // Nodes with halo
      dataNodes.forEach((node) => {
        const pulse = (Math.sin(time + node.pulse) + 1) / 2;
        const size = 2.5 + pulse * 1;

        ctx.beginPath();
        ctx.arc(node.x, node.y, size * 2, 0, Math.PI * 2);
        ctx.fillStyle = isDark
          ? `rgba(239, 145, 97, ${0.12 + pulse * 0.1})`
          : `rgba(239, 146, 98, ${0.3 + pulse * 0.15})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(node.x, node.y, size, 0, Math.PI * 2);
        ctx.fillStyle = isDark
          ? `rgba(239, 145, 97, ${0.55 + pulse * 0.25})`
          : `rgba(239, 146, 98, ${0.75 + pulse * 0.2})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, [isDark]);

  return (
    <>
      <div className={styles.tint} aria-hidden="true" />
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }}
        aria-hidden="true"
      />
      <div className={styles.fade} aria-hidden="true" />
    </>
  );
}
