'use client';

import { useToast } from '@/hooks/use-toast';
import { ChangeEvent, useRef } from 'react';
import { ImageUp } from 'lucide-react';

interface PhotoUploadProps {
  onPhotoUpload: (file: File) => void;
}

const PhotoUpload = ({ onPhotoUpload }: PhotoUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      toast({
        title: 'Gagal',
        description: 'Tidak ada file yang dipilih',
        variant: 'destructive',
      });
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Gagal',
        description: 'File yang dipilih bukan gambar',
        variant: 'destructive',
      });
      return;
    }

    onPhotoUpload(file);
    toast({
      title: 'Sukses',
      description: 'Gambar berhasil diunggah',
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFileChange({
      target: { files: [file] },
    } as ChangeEvent<HTMLInputElement>);
  };

  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center text-center p-4 border border-2 border-dashed rounded-3"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="mb-3">
        <ImageUp size={48} />
      </div>
      <p className="lead">
        Drag and drop gambar Anda di sini, atau klik tombol di bawah untuk
        mengunggah.
      </p>
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => fileInputRef.current?.click()}
      >
        Unggah Gambar
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="d-none"
        accept="image/*"
      />
    </div>
  );
};

export default PhotoUpload;