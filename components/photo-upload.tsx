"use client"

import { useCallback } from "react"
import { useDropzone, FileRejection } from "react-dropzone"
import { Upload, ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface PhotoUploadProps {
  onPhotoUpload: (file: File) => void
}

export function PhotoUpload({ onPhotoUpload }: PhotoUploadProps) {
  const { toast } = useToast()

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (acceptedFiles.length > 0) {
        onPhotoUpload(acceptedFiles[0])
      }

      if (fileRejections.length > 0) {
        const rejection = fileRejections[0]
        const errorMessage = rejection.errors[0].message
        toast({
          variant: "destructive",
          title: "Gagal Upload Foto",
          description: `Ukuran file terlalu besar. Maksimal 10MB.`,
        })
      }
    },
    [onPhotoUpload, toast],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024, // 10MB
  })

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer transition-colors hover:border-primary/50",
        isDragActive && "border-primary bg-primary/5",
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-4">
        {isDragActive ? (
          <>
            <Upload className="h-12 w-12 text-primary animate-bounce" />
            <p className="text-primary font-medium">Lepaskan foto di sini...</p>
          </>
        ) : (
          <>
            <ImageIcon className="h-12 w-12 text-muted-foreground" />
            <div>
              <p className="font-medium text-foreground mb-1">Klik atau drag foto ke sini</p>
              <p className="text-sm text-muted-foreground">Mendukung JPG, PNG, GIF, WebP (Max 10MB)</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
