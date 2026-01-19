import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { WheelSegment } from '@/types/wheel';

interface SpinWheelProps {
  segments: WheelSegment[];
  rotation: number;
  isSpinning: boolean;
}

export const SpinWheel = ({ segments, rotation, isSpinning }: SpinWheelProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Responsive size - smaller on mobile
  const getSize = () => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 400 ? 260 : window.innerWidth < 640 ? 300 : 320;
    }
    return 320;
  };
  
  const [size, setSize] = useState(getSize());
  const center = size / 2;
  const radius = size / 2 - 10;

  // Handle resize
  useEffect(() => {
    const handleResize = () => setSize(getSize());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    const totalSegments = segments.length;
    const arcAngle = (2 * Math.PI) / totalSegments;

    segments.forEach((segment, index) => {
      const startAngle = index * arcAngle - Math.PI / 2;
      const endAngle = startAngle + arcAngle;

      // Draw segment
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = segment.color;
      ctx.fill();

      // Draw segment border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw text
      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(startAngle + arcAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      const fontSize = size < 280 ? 11 : size < 310 ? 12 : 13;
      ctx.font = `bold ${fontSize}px Outfit, sans-serif`;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 4;
      
      // Truncate text if too long
      const maxTextLength = size < 280 ? 10 : 12;
      const displayText = segment.name.length > maxTextLength 
        ? segment.name.slice(0, maxTextLength - 2) + '..'
        : segment.name;
      
      ctx.fillText(displayText, radius - 12, 4);
      ctx.restore();
    });

    // Draw center circle - responsive size
    const centerRadius = size < 280 ? 20 : 25;
    ctx.beginPath();
    ctx.arc(center, center, centerRadius, 0, 2 * Math.PI);
    const gradient = ctx.createRadialGradient(center, center, 0, center, center, centerRadius);
    gradient.addColorStop(0, 'hsl(45, 93%, 60%)');
    gradient.addColorStop(1, 'hsl(38, 92%, 45%)');
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw inner shadow for depth
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.lineWidth = 4;
    ctx.stroke();
  }, [segments, size, center, radius]);

  return (
    <div className="relative">
      {/* Outer glow ring */}
      <div 
        className={`absolute inset-0 rounded-full ${isSpinning ? 'glow-gold-intense' : 'glow-gold animate-pulse-glow'}`}
        style={{ 
          width: size + 20, 
          height: size + 20, 
          left: -10, 
          top: -10,
          background: 'linear-gradient(135deg, hsl(45 93% 47% / 0.1), transparent)',
          borderRadius: '50%'
        }}
      />
      
      {/* Decorative outer ring */}
      <div 
        className="absolute rounded-full border-4 border-primary/30"
        style={{ 
          width: size + 16, 
          height: size + 16, 
          left: -8, 
          top: -8 
        }}
      />

      {/* The spinning wheel */}
      <motion.div
        animate={{ rotate: rotation }}
        transition={{
          duration: isSpinning ? 5 : 0,
          ease: [0.25, 0.1, 0.25, 1],
        }}
        style={{ width: size, height: size }}
      >
        <canvas
          ref={canvasRef}
          width={size}
          height={size}
          className="rounded-full"
        />
      </motion.div>

      {/* Pointer/Arrow at top - responsive */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 wheel-pointer z-10">
        <div 
          className="w-0 h-0"
          style={{
            borderLeft: `${size < 280 ? 12 : 16}px solid transparent`,
            borderRight: `${size < 280 ? 12 : 16}px solid transparent`,
            borderTop: `${size < 280 ? 22 : 28}px solid hsl(45, 93%, 47%)`,
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))'
          }}
        />
      </div>
    </div>
  );
};
