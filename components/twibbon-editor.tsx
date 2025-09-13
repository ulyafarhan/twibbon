"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { PhotoUpload } from "@/components/photo-upload";
import { PhotoEditor } from "@/components/photo-editor";
import {
  Download,
  RotateCw,
  Move,
  ZoomIn,
  ZoomOut,
  Upload,
} from "lucide-react";

export interface PhotoState {
  file: File | null;
  url: string | null;
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

const FIXED_FRAME = {
  id: "milad-16",
  name: "Milad Ke-16 UKM PTQ",
  url: "/images/twibbon-frame.png",
  category: "Event",
};

export function TwibbonEditor() {
  const [photo, setPhoto] = useState<PhotoState>({
    file: null,
    url: "/placeholder.jpg",
    x: 0,
    y: 0,
    scale: 1,
    rotation: 0,
  });
  const [isPhotoUploaded, setIsPhotoUploaded] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handlePhotoUpload = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    setPhoto({
      file,
      url,
      x: 0,
      y: 0,
      scale: 1,
      rotation: 0,
    });
    setIsPhotoUploaded(true);
  }, []);

  const updatePhoto = useCallback((updates: Partial<PhotoState>) => {
    setPhoto((prev) => ({ ...prev, ...updates }));
  }, []);

  const downloadTwibbon = useCallback(async () => {
    if (!photo.url || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Use same dimensions as preview but scaled up for high quality
    canvas.width = 2160; // 400 * 3 for high quality
    canvas.height = 2700; // 500 * 3 for high quality

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Load and draw photo
    const photoImg = new Image();
    photoImg.crossOrigin = "anonymous";

    photoImg.onload = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Save context
      ctx.save();

      // Apply same transformations as preview but scaled up
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((photo.rotation * Math.PI) / 180);
      ctx.scale(photo.scale, photo.scale);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);

      const photoAspect = photoImg.width / photoImg.height;
      let drawWidth = canvas.width;
      let drawHeight = canvas.height;

      if (photoAspect > 1) {
        drawHeight = drawWidth / photoAspect;
      } else {
        drawWidth = drawHeight * photoAspect;
      }

      const offsetX = (canvas.width - drawWidth) / 2;
      const offsetY = (canvas.height - drawHeight) / 2;

      const scaledX = photo.x;
      const scaledY = photo.y;

      ctx.drawImage(
        photoImg,
        scaledX + offsetX,
        scaledY + offsetY,
        drawWidth,
        drawHeight
      );

      // Restore context
      ctx.restore();

      // Load and draw frame
      const frameImg = new Image();
      frameImg.crossOrigin = "anonymous";
      frameImg.onload = () => {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);

        // Download
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `twibbon-milad-16-${Date.now()}.png`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }
          },
          "image/png",
          1.0
        );
      };
      frameImg.src = FIXED_FRAME.url;
    };

    photoImg.src = photo.url;
  }, [photo]);

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Twibbon Milad Ke-16 UKM PTQ</h1>
          </div>

          <div className="space-y-8">
            {/* Edit & Preview Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Edit & Preview</h2>
                <PhotoEditor
                  photo={photo}
                  selectedFrame={FIXED_FRAME}
                  onPhotoUpdate={updatePhoto}
                  canvasRef={canvasRef}
                  isPhotoUploaded={isPhotoUploaded}
                />
              </div>

              {/* Controls */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Kontrol Editor</h2>

                {isPhotoUploaded ? (
                  <div className="space-y-4">
                    <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        💡 <strong>Tips:</strong> Drag foto langsung di preview
                        untuk mengatur posisi dengan mudah!
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-sm font-medium">Zoom</label>
                          <span className="text-sm text-muted-foreground">
                            {photo.scale.toFixed(1)}x
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ZoomOut className="h-4 w-4" />
                          <Slider
                            value={[photo.scale]}
                            onValueChange={([value]) =>
                              updatePhoto({ scale: value })
                            }
                            min={0.5}
                            max={3}
                            step={0.1}
                            className="flex-1"
                          />
                          <ZoomIn className="h-4 w-4" />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-sm font-medium">Rotasi</label>
                          <span className="text-sm text-muted-foreground">
                            {photo.rotation}°
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <RotateCw className="h-4 w-4" />
                          <Slider
                            value={[photo.rotation]}
                            onValueChange={([value]) =>
                              updatePhoto({ rotation: value })
                            }
                            min={-180}
                            max={180}
                            step={1}
                            className="flex-1"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-sm font-medium">
                            Posisi X
                          </label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Move className="h-4 w-4" />
                          <Slider
                            value={[photo.x]}
                            onValueChange={([value]) =>
                              updatePhoto({ x: value })
                            }
                            min={-1080}
                            max={1080}
                            step={1}
                            className="flex-1"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-sm font-medium">
                            Posisi Y
                          </label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Move className="h-4 w-4" />
                          <Slider
                            value={[photo.y]}
                            onValueChange={([value]) =>
                              updatePhoto({ y: value })
                            }
                            min={-1350}
                            max={1350}
                            step={1}
                            className="flex-1"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Upload className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Upload foto untuk mulai mengedit twibbon</p>
                  </div>
                )}
              </div>
            </div>

            {/* Upload Section */}
            <div className="border-t pt-6">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload Foto Anda
                </h2>
                <PhotoUpload onPhotoUpload={handlePhotoUpload} />
              </div>
            </div>

            {/* Download Section */}
            <div className="border-t pt-6">
              <Button
                onClick={downloadTwibbon}
                className="w-full gap-2 cursor-pointer"
              >
                <Download className="h-4 w-4" />
                Download Twibbon
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hidden canvas for download */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
