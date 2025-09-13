"use client";

import React from "react";

import { useEffect, useRef } from "react";
import type { PhotoState } from "@/components/twibbon-editor";

import { Skeleton } from "@/components/ui/skeleton";

interface FrameState {
  id: string;
  name: string;
  url: string;
  category: string;
}

interface PhotoEditorProps {
  photo: PhotoState;
  selectedFrame: FrameState | null;
  onPhotoUpdate: (updates: Partial<PhotoState>) => void;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  isPhotoUploaded: boolean;
}

export function PhotoEditor({
  photo,
  selectedFrame,
  onPhotoUpdate,
  canvasRef,
  isPhotoUploaded,
}: PhotoEditorProps) {
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const isDragging = useRef(false);
  const lastPosition = useRef({ x: 0, y: 0 });
  const [isFrameLoading, setIsFrameLoading] = React.useState(true);

  useEffect(() => {
    if (!previewCanvasRef.current) return;

    const canvas = previewCanvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 2160;
    canvas.height = 2700;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (photo.url) {
      // Load and draw photo
      const photoImg = new Image();
      photoImg.crossOrigin = "anonymous";

      photoImg.onload = () => {
        // Save context
        ctx.save();

        // Apply transformations exactly like download
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

        // Draw photo with exact same logic as download
        ctx.drawImage(
          photoImg,
          photo.x + offsetX,
          photo.y + offsetY,
          drawWidth,
          drawHeight
        );

        // Restore context
        ctx.restore();

        // Load and draw frame if selected
        if (selectedFrame) {
          setIsFrameLoading(true);
          const frameImg = new Image();
          frameImg.crossOrigin = "anonymous";
          frameImg.onload = () => {
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = "high";
            ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);
            setIsFrameLoading(false);
          };
          frameImg.src = selectedFrame.url;
        }
      };

      photoImg.src = photo.url;
    }
  }, [photo, selectedFrame]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isPhotoUploaded) return;
    if (!photo.url) return;
    isDragging.current = true;
    const rect = previewCanvasRef.current?.getBoundingClientRect();
    if (rect) {
      lastPosition.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !previewCanvasRef.current) return;

    const rect = previewCanvasRef.current.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    const deltaX = currentX - lastPosition.current.x;
    const deltaY = currentY - lastPosition.current.y;

    const scaleX = previewCanvasRef.current.width / rect.width;
    const scaleY = previewCanvasRef.current.height / rect.height;

    onPhotoUpdate({
      x: photo.x + deltaX * scaleX,
      y: photo.y + deltaY * scaleY,
    });

    lastPosition.current = { x: currentX, y: currentY };
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isPhotoUploaded) return;
    e.preventDefault();
    const touch = e.touches[0];
    const rect = previewCanvasRef.current?.getBoundingClientRect();
    if (rect) {
      isDragging.current = true;
      lastPosition.current = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (!isDragging.current || !previewCanvasRef.current) return;

    const touch = e.touches[0];
    const rect = previewCanvasRef.current.getBoundingClientRect();
    const currentX = touch.clientX - rect.left;
    const currentY = touch.clientY - rect.top;

    const deltaX = currentX - lastPosition.current.x;
    const deltaY = currentY - lastPosition.current.y;

    const scaleX = previewCanvasRef.current.width / rect.width;
    const scaleY = previewCanvasRef.current.height / rect.height;

    onPhotoUpdate({
      x: photo.x + deltaX * scaleX,
      y: photo.y + deltaY * scaleY,
    });

    lastPosition.current = { x: currentX, y: currentY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    isDragging.current = false;
  };

  if (!photo.url && selectedFrame) {
    return (
      <div className="space-y-4">
        <div className="aspect-[4/5] bg-muted rounded-lg overflow-hidden relative">
          <canvas
            ref={previewCanvasRef}
            className="w-full h-full"
            style={{ imageRendering: "crisp-edges" }}
          />
        </div>
        <p className="text-sm text-muted-foreground text-center">
          Upload foto untuk mulai mengedit twibbon Anda
        </p>
      </div>
    );
  }

  if (!photo.url) {
    return (
      <div className="aspect-[4/5] bg-muted rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">
          Upload foto untuk mulai mengedit
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="aspect-[4/5] bg-muted rounded-lg overflow-hidden relative">
        {isFrameLoading && <Skeleton className="w-full h-full absolute" />}
        <canvas
          ref={previewCanvasRef}
          className="w-full h-full cursor-move select-none"
          style={{ imageRendering: "crisp-edges" }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />
      </div>

      {photo.url && (
        <p className="text-sm text-muted-foreground text-center">
          Drag foto untuk mengatur posisi, gunakan kontrol di samping untuk zoom
          dan rotasi
        </p>
      )}
    </div>
  );
}
