import { Upload, FileCode } from 'lucide-react';
import { useState, useRef } from 'react';

interface UploadSectionProps {
  onFileUpload: (file: File, content: string) => void;
}

export default function UploadSection({ onFileUpload }: UploadSectionProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file: File) => {
    const validExtensions = ['.cob', '.cbl', '.cobol', '.txt'];
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

    if (!validExtensions.includes(fileExtension)) {
      alert('Please upload a valid COBOL file (.cob, .cbl, .cobol, .txt)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      onFileUpload(file, content);
    };
    reader.readAsText(file);
  };

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <div
        className={`
          bg-white rounded-2xl border-2 border-dashed p-12 text-center
          transition-all duration-200 cursor-pointer hover:border-blue-400
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".cob,.cbl,.cobol,.txt"
          onChange={handleFileInput}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-4">
          <div className="bg-blue-100 p-6 rounded-full">
            <Upload className="w-12 h-12 text-blue-600" />
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-slate-900 mb-2">
              Upload Your COBOL File
            </h3>
            <p className="text-slate-600 mb-4">
              Drag and drop your file here, or click to browse
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-500">
            <FileCode className="w-4 h-4" />
            <span>Supports: .cob, .cbl, .cobol, .txt</span>
          </div>

          <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors">
            Select File
          </button>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-slate-500">
          Your files are processed locally and securely. We respect your privacy.
        </p>
      </div>
    </section>
  );
}
