import React, { useState, useRef } from "react";
import { motion } from "motion/react";
import { Sparkles, Play, Shield, Cpu, RotateCw, Layers } from "lucide-react";

interface ThreeDViewProps {
  lang: "ar" | "en";
}

export default function ThreeDView({ lang }: ThreeDViewProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Mouse coordinates relative to card center
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    
    // Calculate rotation angles (cap max at 22 degrees for professional aesthetic)
    const rotateY = (mouseX / (width / 2)) * 22;
    const rotateX = -(mouseY / (height / 2)) * 22;
    
    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
  };

  return (
    <div className="w-full flex flex-col items-center justify-center p-4">
      
      {/* 3D Perspective Container */}
      <div 
        className="relative w-full max-w-[420px] aspect-[4/3] cursor-pointer"
        style={{ perspective: "1000px" }}
      >
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
          style={{
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${isHovered ? 1.05 : 1})`,
            transition: isHovered ? "none" : "all 0.6s cubic-bezier(0.23, 1, 0.32, 1)",
            transformStyle: "preserve-3d"
          }}
          className="relative w-full h-full bg-[#0a0f1d]/90 rounded-2xl border border-white/10 p-6 flex flex-col justify-between shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] hover:border-cyan-400/50 hover:shadow-cyan-500/10"
        >
          {/* Neon Grid Layer */}
          <div 
            className="absolute inset-0 rounded-2xl bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none opacity-40" 
            style={{ transform: "translateZ(10px)" }}
          />
          
          {/* Interactive Aura Glow */}
          <div
            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-400/5 via-transparent to-emerald-400/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
            style={{ transform: "translateZ(20px)" }}
          />

          {/* Top Panel Flag */}
          <div 
            className="flex items-center justify-between z-10"
            style={{ transform: "translateZ(40px)" }}
          >
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyan-500/15 border border-cyan-400/30 text-[10px] font-mono font-bold text-cyan-400 animate-pulse">
              <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "6s" }} />
              <span>3D HOLOGRAM DECK</span>
            </div>
            <div className="text-[9px] font-mono text-gray-500 bg-white/5 px-2 py-0.5 rounded border border-white/5">
              PERSPECTIVE ACTIVED
            </div>
          </div>

          {/* Center 3D Simulated Cyber World / Media Object */}
          <div 
            className="relative flex items-center justify-center my-6 h-36"
            style={{ transform: "translateZ(60px)" }}
          >
            {/* Center Outer Dials */}
            <div className="absolute w-32 h-32 rounded-full border border-dashed border-cyan-400/20 animate-[spin_12s_linear_infinite]" />
            <div className="absolute w-24 h-24 rounded-full border border-double border-emerald-400/30 animate-[spin_8s_linear_infinite_reverse]" />
            
            {/* Cyber Sphere Plate */}
            <div className="absolute w-16 h-16 rounded-full bg-gradient-to-tr from-[#151f3c] via-cyan-550/20 to-[#0e274b] border border-cyan-400/40 flex items-center justify-center shadow-lg shadow-cyan-500/20 backdrop-blur-sm">
              <Play className="w-6 h-6 text-cyan-400 fill-cyan-400/25 ml-0.5" />
            </div>

            {/* Simulated 3D Bar graphs rotating */}
            <div className="absolute -top-2 left-6 bg-cyan-400/90 text-[9px] text-black font-black px-1.5 py-0.5 rounded shadow">
              1080p Ultra HD
            </div>
            <div className="absolute -bottom-2 right-6 bg-emerald-400/90 text-[9px] text-black font-black px-1.5 py-0.5 rounded shadow">
              60 FPS Stereo
            </div>
          </div>

          {/* Bottom interactive guide message */}
          <div 
            className="text-center z-10"
            style={{ transform: "translateZ(30px)" }}
          >
            <p className="text-xs font-semibold text-gray-200">
              {lang === "ar" ? "حرك الماوس لتفاعل الأبعاد الثلاثية" : "Tilt device or hover mouse to view 3D parallax"}
            </p>
            <p className="text-[10px] text-cyan-400 font-mono mt-1">
              X-Axis: {Math.round(rotation.x)}° | Y-Axis: {Math.round(rotation.y)}°
            </p>
          </div>

        </div>
      </div>

      {/* Small 3D stats banner */}
      <div className="w-full max-w-[420px] grid grid-cols-3 gap-3 mt-4">
        <div className="bg-[#0b101f] rounded-xl p-3 border border-white/5 text-center shadow-md">
          <p className="text-[9px] text-gray-500 font-bold uppercase">{lang === "ar" ? "عمق الدقة" : "Depth Quality"}</p>
          <p className="text-xs font-black text-cyan-400 mt-0.5 font-mono">100% Lossless</p>
        </div>
        <div className="bg-[#0b101f] rounded-xl p-3 border border-white/5 text-center shadow-md">
          <p className="text-[9px] text-gray-500 font-bold uppercase">{lang === "ar" ? "سرعة الاستجابة" : "Processing Speed"}</p>
          <p className="text-xs font-black text-emerald-400 mt-0.5 font-mono">&lt; 0.4s</p>
        </div>
        <div className="bg-[#0b101f] rounded-xl p-3 border border-white/5 text-center shadow-md">
          <p className="text-[9px] text-gray-500 font-bold uppercase">{lang === "ar" ? "حماية مضاعفة" : "Safety Shield"}</p>
          <p className="text-xs font-black text-amber-400 mt-0.5 font-mono">Anti-Malware</p>
        </div>
      </div>

    </div>
  );
}
