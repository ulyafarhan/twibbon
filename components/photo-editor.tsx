'use client';

import { useRef, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Slider } from '@/components/ui/slider'; // Ganti dengan slider kustom Bootstrap jika ada
import { RotateCcw, ZoomIn, ZoomOut, Download } from 'lucide-react';
import htmlToImage from 'html-to-image';
import { useMobile } from '@/hooks/use-mobile';

const PhotoEditor = () => {
  const [photo, setPhoto] = useState<File | null>(null);
  const [twibbonUrl, setTwibbonUrl] = useState<string>('');
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [twibbonPosition, setTwibbonPosition] = useState({ x: 0, y: 0 });
  const [isTwibbonDragging, setIsTwibbonDragging] = useState(false);
  const [isImageDragging, setIsImageDragging] = useState(false);
  const twibbonEditorRef = useRef<HTMLDivElement>(null);
  const twibbonFrameRef = useRef<HTMLImageElement>(null);
  const { toast } = useToast();
  const isMobile = useMobile();

  useEffect(() => {
    const handleMouseUp = () => {
      setIsImageDragging(false);
      setIsTwibbonDragging(false);
    };

    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const handleTwibbonEditorMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsTwibbonDragging(true);
  };

  const handleTwibbonEditorMouseMove = (e: React.MouseEvent) => {
    if (isTwibbonDragging) {
      setTwibbonPosition((prev) => ({
        x: prev.x + e.movementX,
        y: prev.y + e.movementY,
      }));
    }
  };

  const handleImageMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsImageDragging(true);
  };

  const handleImageMouseMove = (e: React.MouseEvent) => {
    if (isImageDragging) {
      setPosition((prev) => ({
        x: prev.x + e.movementX,
        y: prev.y + e.movementY,
      }));
    }
  };

  const handleZoomIn = () => {
    setScale((prev) => prev + 0.1);
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(1, prev - 0.1));
  };

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setTwibbonPosition({ x: 0, y: 0 });
  };

  const handleExport = async () => {
    if (!twibbonEditorRef.current) {
      toast({
        title: 'Gagal',
        description: 'Terjadi kesalahan saat mengekspor gambar',
        variant: 'destructive',
      });
      return;
    }

    try {
      const dataUrl = await htmlToImage.toPng(twibbonEditorRef.current);
      const link = document.createElement('a');
      link.download = 'twibbon.png';
      link.href = dataUrl;
      link.click();
      toast({
        title: 'Sukses',
        description: 'Twibbon berhasil diunduh',
      });
    } catch (err) {
      toast({
        title: 'Gagal',
        description: `Terjadi kesalahan saat mengekspor: ${err}`,
        variant: 'destructive',
      });
    }
  };

  if (!photo) {
    return (
      <PhotoUpload
        onPhotoUpload={(file) => {
          setPhoto(file);
        }}
      />
    );
  }

  const twibbonStyles = {
    transform: `translate(${twibbonPosition.x}px, ${twibbonPosition.y}px)`,
    cursor: isTwibbonDragging ? 'grabbing' : 'grab',
  };

  const imageStyles = {
    transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
    cursor: isImageDragging ? 'grabbing' : 'grab',
  };

  return (
    <div className="d-flex flex-column align-items-center w-100 h-100">
      <div className="position-relative overflow-hidden w-100 ratio ratio-1x1" style={{ maxWidth: '500px' }}>
        <div
          ref={twibbonEditorRef}
          className="position-relative w-100 h-100"
          onMouseMove={handleTwibbonEditorMouseMove}
        >
          <img
            src={URL.createObjectURL(photo)}
            alt="Uploaded"
            className="w-100 h-100 object-cover position-absolute top-0 start-0"
            style={imageStyles}
            onMouseDown={handleImageMouseDown}
          />
          <img
            src="/images/twibbon-frame.png"
            alt="Twibbon Frame"
            className="w-100 h-100 position-absolute top-0 start-0 z-2"
            style={twibbonStyles}
            onMouseDown={handleTwibbonEditorMouseDown}
          />
        </div>
      </div>

      <div className="d-flex justify-content-center align-items-center mt-3 w-100 flex-wrap gap-2">
        <button className="btn btn-secondary me-2" onClick={handleReset}>
          <RotateCcw size={16} className="me-2" /> Reset
        </button>
        <div className="d-flex align-items-center">
          <button className="btn btn-outline-secondary me-2" onClick={handleZoomOut}>
            <ZoomOut size={16} />
          </button>
          <input
            type="range"
            className="form-range"
            min="1"
            max="2"
            step="0.1"
            value={scale}
            onChange={(e) => setScale(parseFloat(e.target.value))}
            style={{ width: isMobile ? '100px' : '200px' }}
          />
          <button className="btn btn-outline-secondary ms-2" onClick={handleZoomIn}>
            <ZoomIn size={16} />
          </button>
        </div>
        <button className="btn btn-primary" onClick={handleExport}>
          <Download size={16} className="me-2" /> Unduh
        </button>
      </div>
    </div>
  );
};

export default PhotoEditor;