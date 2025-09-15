'use client';

import React from 'react';
import PhotoEditor from '@/components/photo-editor';
import TwibbonEditor from '@/components/twibbon-editor';
import PhotoUpload from '@/components/photo-upload';
import { useMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import { ToastContainer } from 'react-bootstrap';

export default function HomePage() {
  const isMobile = useMobile();
  const { toast } = useToast();

  return (
    <div className="container py-5">
      <div className="row g-4 justify-content-center">
        <div className="col-12 col-md-6 d-flex">
          <div className="card shadow-lg w-100">
            <div className="card-body d-flex flex-column align-items-center justify-content-center">
              {isMobile ? <PhotoUpload /> : <PhotoEditor />}
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6 d-flex">
          <div className="card shadow-lg w-100">
            <div className="card-body d-flex flex-column align-items-center justify-content-center">
              {isMobile ? <PhotoEditor /> : <TwibbonEditor />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}