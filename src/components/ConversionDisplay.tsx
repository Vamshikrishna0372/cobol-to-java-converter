import { Download, RefreshCw, ArrowRight, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface ConversionDisplayProps {
  cobolCode: string;
  javaCode: string;
  fileName: string | File;
  isConverting: boolean;
  onConvert: () => void;
  onReset: () => void;
}

export default function ConversionDisplay({
  cobolCode,
  javaCode,
  fileName,
  isConverting,
  onConvert,
  onReset,
}: ConversionDisplayProps) {
  const [copiedCobol, setCopiedCobol] = useState(false);
  const [copiedJava, setCopiedJava] = useState(false);

  const handleCopy = async (code: string, type: 'cobol' | 'java') => {
    if (!code) return;
    await navigator.clipboard.writeText(code);

    if (type === 'cobol') {
      setCopiedCobol(true);
      setTimeout(() => setCopiedCobol(false), 2000);
    } else {
      setCopiedJava(true);
      setTimeout(() => setCopiedJava(false), 2000);
    }
  };

  /* ================= DOWNLOAD (FINAL FIX) ================= */

  const handleDownload = () => {
    if (!javaCode) return;

    const rawName =
      typeof fileName === 'string'
        ? fileName
        : fileName?.name ?? 'Converted';

    const baseName = rawName.replace(/\.(cob|cbl|cobol|txt|java)$/i, '');
    const finalFileName = `${baseName}.java`;

    // ✔ Use text/plain (most reliable across browsers)
    const blob = new Blob([javaCode], {
      type: 'text/plain;charset=utf-8;',
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = finalFileName;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Code Conversion</h2>
          <p className="text-slate-600 mt-1">
            File:{' '}
            {typeof fileName === 'string'
              ? fileName
              : fileName?.name ?? '—'}
          </p>
        </div>

        <button
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          New Conversion
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* COBOL SOURCE */}
        <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
          <div className="bg-slate-800 px-4 py-3 flex items-center justify-between">
            <span className="text-slate-300 font-medium">COBOL Source</span>
            <button
              onClick={() => handleCopy(cobolCode, 'cobol')}
              className="text-slate-400 hover:text-white"
              title="Copy COBOL code"
            >
              {copiedCobol ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
          <div className="p-4 bg-slate-900 overflow-auto max-h-96">
            <pre className="text-sm text-green-400 font-mono">
              {cobolCode || 'No code loaded'}
            </pre>
          </div>
        </div>

        {/* JAVA OUTPUT */}
        <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
          <div className="bg-slate-800 px-4 py-3 flex items-center justify-between">
            <span className="text-slate-300 font-medium">Java Output</span>
            {javaCode && (
              <button
                onClick={() => handleCopy(javaCode, 'java')}
                className="text-slate-400 hover:text-white"
                title="Copy Java code"
              >
                {copiedJava ? <Check size={16} /> : <Copy size={16} />}
              </button>
            )}
          </div>
          <div className="p-4 bg-slate-900 overflow-auto max-h-96">
            {javaCode ? (
              <pre className="text-sm text-blue-400 font-mono">
                {javaCode}
              </pre>
            ) : (
              <div className="flex items-center justify-center h-64 text-slate-500">
                Click "Convert to Java" to start conversion
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ACTION BUTTON */}
      <div className="flex justify-center">
        {!javaCode ? (
          <button
            onClick={onConvert}
            disabled={isConverting}
            className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg shadow-lg"
          >
            {isConverting ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Converting...
              </>
            ) : (
              <>
                Convert to Java
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        ) : (
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-lg"
          >
            <Download className="w-5 h-5" />
            Download Java File
          </button>
        )}
      </div>
    </section>
  );
}
