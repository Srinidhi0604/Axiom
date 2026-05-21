"use client";

import { useEffect, useState, useRef } from "react";
import MatrixBackground from "./MatrixBackground";

export default function ResearchSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [smoothedProgress, setSmoothedProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<'solution' | 'test' | 'problem'>('solution');
  const [terminalTab, setTerminalTab] = useState<'output' | 'tests'>('tests');
  const [isPhone, setIsPhone] = useState(false);

  // Smooth out the scroll progress using requestAnimationFrame
  useEffect(() => {
    let animationFrameId: number;
    const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

    const animate = () => {
      setSmoothedProgress((prev) => {
        const next = lerp(prev, scrollProgress, 0.1);
        return Math.abs(next - scrollProgress) < 0.001 ? scrollProgress : next;
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [scrollProgress]);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scrollableDistance = rect.height - window.innerHeight;
      const scrolled = -rect.top;
      
      let progress = scrolled / scrollableDistance;
      progress = Math.max(0, Math.min(1, progress));
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => setIsPhone(window.innerWidth < 700);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Calculate animation values using the smoothed progress
  const textOpacity = Math.max(0, 1 - smoothedProgress * 4);
  const textOffsetY = smoothedProgress * -50;
  
  // Back layers fade out
  const backLayerOpacity = Math.max(0, 1 - smoothedProgress * 3);
  
  // Front layer (paper) moves left
  const paperOffsetX = smoothedProgress > 0.1 ? (smoothedProgress - 0.1) * -400 : 0;
  
  // Editor slides in on the right
  const editorOpacity = smoothedProgress > 0.3 ? (smoothedProgress - 0.3) * 2 : 0;
  const editorOffsetX = smoothedProgress > 0.3 ? 50 - (smoothedProgress - 0.3) * 100 : 50;

  return (
    <section ref={containerRef} style={{ height: isPhone ? "180vh" : "300vh", position: "relative", marginInline: "calc(50% - 50vw)" }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#000", overflow: "hidden" }}>
        <MatrixBackground />
        
        {/* Text content */}
        <div style={{ position: "absolute", top: "15%", textAlign: "center", opacity: textOpacity, transform: `translateY(${textOffsetY}px)`, transition: "opacity 0.1s ease-out, transform 0.1s ease-out" }}>
           <h2 style={{ fontSize: 32, fontWeight: 600, color: "white", marginBottom: 8 }}>The Research</h2>
           <p style={{ color: "#9ca3af", fontSize: 15 }}>Dense. Intimidating. Abstract.</p>
        </div>

        <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: isPhone ? 360 : 1000, display: "flex", justifyContent: "center", alignItems: "center", padding: isPhone ? "0 14px" : 0 }}>
          
          {/* Stacked document icon */}
          <div style={{ position: "absolute", width: isPhone ? 100 : 140, height: isPhone ? 130 : 180, transition: "transform 0.1s ease-out", opacity: isPhone ? Math.max(0, 1 - smoothedProgress * 4) : 1 }}>
            {/* Back layers */}
            <div style={{ position: "absolute", top: 0, left: 20, right: -20, bottom: -10, background: "#0a0a0a", border: "1px solid #222", borderRadius: 12, opacity: backLayerOpacity }}></div>
            <div style={{ position: "absolute", top: 10, left: 10, right: -10, bottom: -20, background: "#111", border: "1px solid #2a2a2a", borderRadius: 12, opacity: backLayerOpacity }}></div>
            
            {/* Front layer (Paper) */}
            <div style={{ position: "absolute", top: 20, left: 0, right: 0, bottom: -30, background: "#151515", border: "1px solid #333", borderRadius: 12, padding: "24px 16px", display: "flex", flexDirection: "column", gap: 12, transform: `translateX(${paperOffsetX}px)`, transition: "transform 0.1s ease-out" }}>
              <div style={{ height: 6, background: "#333", borderRadius: 3, width: "70%" }}></div>
              <div style={{ height: 6, background: "#333", borderRadius: 3, width: "100%" }}></div>
              <div style={{ height: 6, background: "#333", borderRadius: 3, width: "90%" }}></div>
              <div style={{ height: 6, background: "#333", borderRadius: 3, width: "100%" }}></div>
              <div style={{ height: 6, background: "#333", borderRadius: 3, width: "85%" }}></div>
              <div style={{ height: 6, background: "#333", borderRadius: 3, width: "95%" }}></div>
              <div style={{ height: 6, background: "#333", borderRadius: 3, width: "75%" }}></div>
              
              <div style={{ marginTop: "auto", background: "#000", border: "1px solid #222", padding: "8px", borderRadius: 6, textAlign: "left", display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ color: "#666", fontSize: 10 }}>∑</span>
                <span style={{ color: "#666", fontSize: 9, fontFamily: "monospace" }}>lnq P(x_t | x_&lt;t)</span>
              </div>
            </div>
          </div>

          {/* Editor Mockup */}
          <div style={{ 
            position: "absolute", 
            right: isPhone ? "50%" : 0,
            width: isPhone ? "calc(100vw - 28px)" : "55%",
            maxWidth: isPhone ? 360 : "none",
            height: isPhone ? 330 : 400,
            background: "#1e1e1e", 
            border: "1px solid #333", 
            borderRadius: 12, 
            opacity: editorOpacity,
            transform: isPhone ? `translateX(50%) translateY(34px)` : `translateX(${editorOffsetX}px)`,
            transition: "opacity 0.1s ease-out, transform 0.1s ease-out",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 20px 40px rgba(0,0,0,0.5)"
          }}>
             {/* Editor Header */}
             <div style={{ display: "flex", gap: 8, padding: 12, borderBottom: "1px solid #333", background: "#252526", borderRadius: "12px 12px 0 0", alignItems: "center" }}>
                <div style={{ display: "flex", gap: 6 }}>
                  <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ef4444" }}></div>
                  <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#f59e0b" }}></div>
                  <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#10b981" }}></div>
                </div>
                <div style={{ marginLeft: 16, display: "flex", gap: 16, userSelect: "none" }}>
                  <span onClick={() => setActiveTab('solution')} style={{ fontSize: 13, cursor: "pointer", color: activeTab === 'solution' ? "#d4d4d4" : "#858585", borderBottom: activeTab === 'solution' ? "1px solid #007acc" : "none", paddingBottom: 2 }}>solution.py</span>
                  <span onClick={() => setActiveTab('test')} style={{ fontSize: 13, cursor: "pointer", color: activeTab === 'test' ? "#d4d4d4" : "#858585", borderBottom: activeTab === 'test' ? "1px solid #007acc" : "none", paddingBottom: 2 }}>test.py</span>
                  <span onClick={() => setActiveTab('problem')} style={{ fontSize: 13, cursor: "pointer", color: activeTab === 'problem' ? "#d4d4d4" : "#858585", borderBottom: activeTab === 'problem' ? "1px solid #007acc" : "none", paddingBottom: 2 }}>problem.md</span>
                </div>
             </div>
             
             {/* Editor Content */}
             <div style={{ padding: "16px 0", fontFamily: "monospace", fontSize: 14, color: "#d4d4d4", flex: 1, display: "flex", flexDirection: "column", overflowY: "auto" }}>
                {activeTab === 'solution' && (
                  <>
                    <div style={{ display: "flex", padding: "2px 16px" }}>
                      <span style={{ color: "#858585", width: 24, textAlign: "right", marginRight: 16, userSelect: "none" }}>1</span>
                      <span><span style={{ color: "#c586c0" }}>import</span> torch</span>
                    </div>
                    <div style={{ display: "flex", padding: "2px 16px" }}>
                      <span style={{ color: "#858585", width: 24, textAlign: "right", marginRight: 16, userSelect: "none" }}>2</span>
                      <span><span style={{ color: "#c586c0" }}>import</span> torch.nn.functional <span style={{ color: "#c586c0" }}>as</span> F</span>
                    </div>
                    <div style={{ display: "flex", padding: "2px 16px", marginTop: 8 }}>
                      <span style={{ color: "#858585", width: 24, textAlign: "right", marginRight: 16, userSelect: "none" }}>4</span>
                      <span><span style={{ color: "#c586c0" }}>def</span> <span style={{ color: "#dcdcaa" }}>scaled_dot_product_attention</span>(Q, K, V):</span>
                    </div>
                    <div style={{ display: "flex", padding: "2px 16px" }}>
                      <span style={{ color: "#858585", width: 24, textAlign: "right", marginRight: 16, userSelect: "none" }}>5</span>
                      <span>    d_k = Q.size(-1)</span>
                    </div>
                    <div style={{ display: "flex", padding: "2px 16px" }}>
                      <span style={{ color: "#858585", width: 24, textAlign: "right", marginRight: 16, userSelect: "none" }}>6</span>
                      <span>    scores = torch.matmul(Q, K.transpose(-2, -1)) / math.sqrt(d_k)</span>
                    </div>
                    <div style={{ display: "flex", padding: "2px 16px" }}>
                      <span style={{ color: "#858585", width: 24, textAlign: "right", marginRight: 16, userSelect: "none" }}>7</span>
                      <span>    p_attn = F.softmax(scores, dim=-1)</span>
                    </div>
                    <div style={{ display: "flex", padding: "2px 16px" }}>
                      <span style={{ color: "#858585", width: 24, textAlign: "right", marginRight: 16, userSelect: "none" }}>8</span>
                      <span>    <span style={{ color: "#c586c0" }}>return</span> torch.matmul(p_attn, V)</span>
                    </div>
                  </>
                )}
                {activeTab === 'test' && (
                  <>
                    <div style={{ display: "flex", padding: "2px 16px" }}>
                      <span style={{ color: "#858585", width: 24, textAlign: "right", marginRight: 16, userSelect: "none" }}>1</span>
                      <span><span style={{ color: "#c586c0" }}>def</span> <span style={{ color: "#dcdcaa" }}>test_attention_weights</span>():</span>
                    </div>
                    <div style={{ display: "flex", padding: "2px 16px" }}>
                      <span style={{ color: "#858585", width: 24, textAlign: "right", marginRight: 16, userSelect: "none" }}>2</span>
                      <span>    q = torch.randn(1, 4, 64)</span>
                    </div>
                    <div style={{ display: "flex", padding: "2px 16px" }}>
                      <span style={{ color: "#858585", width: 24, textAlign: "right", marginRight: 16, userSelect: "none" }}>3</span>
                      <span>    k = torch.randn(1, 4, 64)</span>
                    </div>
                    <div style={{ display: "flex", padding: "2px 16px" }}>
                      <span style={{ color: "#858585", width: 24, textAlign: "right", marginRight: 16, userSelect: "none" }}>4</span>
                      <span>    v = torch.randn(1, 4, 64)</span>
                    </div>
                    <div style={{ display: "flex", padding: "2px 16px" }}>
                      <span style={{ color: "#858585", width: 24, textAlign: "right", marginRight: 16, userSelect: "none" }}>5</span>
                      <span>    out = scaled_dot_product_attention(q, k, v)</span>
                    </div>
                    <div style={{ display: "flex", padding: "2px 16px" }}>
                      <span style={{ color: "#858585", width: 24, textAlign: "right", marginRight: 16, userSelect: "none" }}>6</span>
                      <span>    <span style={{ color: "#c586c0" }}>assert</span> out.shape == (1, 4, 64)</span>
                    </div>
                  </>
                )}
                {activeTab === 'problem' && (
                  <div style={{ padding: "0 24px", color: "#d4d4d4", fontFamily: "sans-serif", overflowY: "auto" }}>
                    <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, color: "white" }}>Scaled Dot-Product Attention</h3>
                    <p style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>Implement the scaled dot-product attention mechanism as described in the Attention Is All You Need paper.</p>
                    <p style={{ fontSize: 14, lineHeight: 1.6, color: "#9ca3af" }}>The function should compute:<br/> <code style={{ background: "#2d2d2d", padding: "2px 6px", borderRadius: 4, fontFamily: "monospace", fontSize: 12, color: "#d4d4d4" }}>Attention(Q, K, V) = softmax(QK^T / sqrt(d_k))V</code></p>
                  </div>
                )}
             </div>
             
             {/* Bottom terminal/console mockup */}
             <div style={{ height: 120, borderTop: "1px solid #333", background: "#1e1e1e", display: "flex", flexDirection: "column" }}>
               <div style={{ display: "flex", gap: 16, padding: "8px 16px", borderBottom: "1px solid #333", userSelect: "none" }}>
                 <span onClick={() => setTerminalTab('output')} style={{ fontSize: 12, cursor: "pointer", color: terminalTab === 'output' ? "#d4d4d4" : "#858585", borderBottom: terminalTab === 'output' ? "1px solid #d4d4d4" : "none", paddingBottom: 2 }}>OUTPUT</span>
                 <span onClick={() => setTerminalTab('tests')} style={{ fontSize: 12, cursor: "pointer", color: terminalTab === 'tests' ? "#d4d4d4" : "#858585", borderBottom: terminalTab === 'tests' ? "1px solid #d4d4d4" : "none", paddingBottom: 2 }}>TEST RESULTS</span>
               </div>
               <div style={{ padding: 12, fontFamily: "monospace", fontSize: 13, color: terminalTab === 'tests' ? "#10b981" : "#d4d4d4", overflowY: "auto" }}>
                 {terminalTab === 'tests' ? (
                   <>
                     ✓ Test 1: Attention weights sum to 1<br/>
                     ✓ Test 2: Output dimensions correct<br/>
                     ✓ Test 3: Causal mask applied (optional)<br/>
                     <br/>
                     <span style={{ color: "#d4d4d4" }}>All tests passed.</span>
                   </>
                 ) : (
                   <>
                     <span style={{ color: "#858585" }}>Running solution.py...</span><br/>
                     tensor([[[ 0.1423, -0.4412,  0.5199]]])<br/>
                     <span style={{ color: "#858585" }}>Execution complete in 0.04s.</span>
                   </>
                 )}
               </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
