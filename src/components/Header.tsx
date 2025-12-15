import { Code2 } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Code2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              COBOL to Java Converter
            </h1>
            <p className="text-sm text-slate-600">
              Modernize your legacy code instantly
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
