"use client";

import { LoaderCircle, Upload } from "lucide-react";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface DropzoneProps {
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
  currentFileName?: string;
}

const Dropzone = ({ onFileSelect, isLoading = false }: DropzoneProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const selectedFile = acceptedFiles[0];
      if (selectedFile) {
        onFileSelect(selectedFile);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
    multiple: false,
  });

  return (
    <div className="relative">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors duration-200 ${
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-gray-300 hover:border-primary/50"
        } ${isLoading ? "opacity-50 pointer-events-none" : ""}`}
      >
        <input {...getInputProps()} />

        {isLoading ? (
          <div className="flex items-center justify-center min-h-40">
            <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Uploading...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 text-center">
            <Upload className="h-10 w-10 text-gray-400" />
            {isDragActive ? (
              <p className="text-sm text-gray-600">Drop your PDF file here</p>
            ) : (
              <>
                <p className="text-sm text-gray-600">
                  Drag & drop your PDF file here, or click to select
                </p>
                <p className="text-xs text-gray-500">Maximum file size: 5MB</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dropzone;
