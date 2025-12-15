import { useState } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import UploadSection from './components/UploadSection';
import ConversionDisplay from './components/ConversionDisplay';
import { convertCobolToJava } from './utils/cobolConverter';

function App() {
  const [cobolCode, setCobolCode] = useState<string>('');
  const [javaCode, setJavaCode] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [isConverting, setIsConverting] = useState(false);

  const handleFileUpload = async (file: File, content: string) => {
    setCobolCode(content);
    setFileName(file.name);
    setJavaCode('');
  };

  const handleConvert = async () => {
    if (!cobolCode) return;

    setIsConverting(true);

    await new Promise(resolve => setTimeout(resolve, 1500));

    const convertedJava = convertCobolToJava(cobolCode, fileName);

    setJavaCode(convertedJava);
    setIsConverting(false);
  };

  const handleReset = () => {
    setCobolCode('');
    setJavaCode('');
    setFileName('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />

      {!cobolCode && !javaCode ? (
        <>
          <HeroSection />
          <UploadSection onFileUpload={handleFileUpload} />
        </>
      ) : (
        <ConversionDisplay
          cobolCode={cobolCode}
          javaCode={javaCode}
          fileName={fileName}
          isConverting={isConverting}
          onConvert={handleConvert}
          onReset={handleReset}
        />
      )}
    </div>
  );
}

export default App;
