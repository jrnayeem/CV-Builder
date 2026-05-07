import { useRef, useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCV } from "@/contexts/cv-context";
import { Upload, Trash2, Pen } from "lucide-react";

export function SignaturePad() {
  const { cvData, updateCV } = useCV();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  const getPos = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ("touches" in e) {
      const t = e.touches[0];
      return { x: (t.clientX - rect.left) * scaleX, y: (t.clientY - rect.top) * scaleY };
    }
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  };

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#1a1a1a";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  useEffect(() => { initCanvas(); }, [initCanvas]);

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    setIsDrawing(true);
    lastPos.current = getPos(e, canvas);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx || !lastPos.current) return;
    const pos = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    lastPos.current = pos;
    setHasDrawn(true);
  };

  const stopDraw = () => {
    setIsDrawing(false);
    lastPos.current = null;
  };

  const clearCanvas = () => {
    initCanvas();
    setHasDrawn(false);
  };

  const saveDrawnSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasDrawn) return;
    const dataUrl = canvas.toDataURL("image/png");
    updateCV({ signature: dataUrl });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => { updateCV({ signature: reader.result as string }); };
    reader.readAsDataURL(file);
  };

  const removeSignature = () => { updateCV({ signature: null }); };

  return (
    <div className="space-y-3">
      {cvData.signature && (
        <div className="border rounded-lg p-3 bg-gray-50 flex items-center justify-between gap-3">
          <img src={cvData.signature} alt="Signature" className="h-12 w-auto object-contain" />
          <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-600 shrink-0" onClick={removeSignature}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )}

      <Tabs defaultValue="draw">
        <TabsList className="grid grid-cols-2 h-8">
          <TabsTrigger value="draw" className="text-xs gap-1"><Pen className="w-3 h-3" />Draw</TabsTrigger>
          <TabsTrigger value="upload" className="text-xs gap-1"><Upload className="w-3 h-3" />Upload</TabsTrigger>
        </TabsList>

        <TabsContent value="draw" className="mt-2 space-y-2">
          <div className="text-xs text-gray-500">Draw your signature in the box below</div>
          <div className="relative border rounded-lg overflow-hidden bg-white" style={{ touchAction: "none" }}>
            <canvas
              ref={canvasRef}
              width={480}
              height={120}
              className="w-full cursor-crosshair block"
              onMouseDown={startDraw}
              onMouseMove={draw}
              onMouseUp={stopDraw}
              onMouseLeave={stopDraw}
              onTouchStart={startDraw}
              onTouchMove={draw}
              onTouchEnd={stopDraw}
            />
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-2/3 border-b border-dashed border-gray-300 pointer-events-none" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={clearCanvas}>Clear</Button>
            <Button size="sm" className="flex-1 text-xs" onClick={saveDrawnSignature} disabled={!hasDrawn}>
              Use This Signature
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="upload" className="mt-2 space-y-2">
          <div className="text-xs text-gray-500">Upload a PNG/JPG image of your signature (transparent background works best)</div>
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
          <Button variant="outline" size="sm" className="w-full gap-2" onClick={() => fileInputRef.current?.click()}>
            <Upload className="w-4 h-4" /> Choose Signature Image
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}
