import React, { useState, useCallback } from 'react';
import JSZip from 'jszip';
import saveAs from 'file-saver';

import Sidebar from './components/Sidebar';
import InputPanel from './components/InputPanel';
import OutputPanel from './components/OutputPanel';
import ConfigPanel from './components/ConfigPanel';
import Header from './components/Header';

import type { ImageFile, GeneratedCode } from './types';
import { generateCode } from './services/geminiService';

function App() {
  const [prompt, setPrompt] = useState<string>("A modern, minimalist portfolio for a photographer with a dark theme and neon accents. It should have a gallery page, an about page, and a contact form.");
  const [image, setImage] = useState<ImageFile | null>(null);
  const [code, setCode] = useState<GeneratedCode | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isConfigPanelVisible, setIsConfigPanelVisible] = useState<boolean>(true);

  const toggleConfigPanel = () => {
    setIsConfigPanelVisible(prev => !prev);
  };

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await generateCode(prompt, image);
      setCode(result);
    } catch (e: any) {
      setError(e.message || "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [prompt, image]);

  const handleDownload = useCallback(() => {
    if (!code) return;
    
    const zip = new JSZip();

    Object.keys(code).forEach(folderName => {
        const folder = code[folderName as keyof GeneratedCode];
        if (folder && typeof folder === 'object') {
            const folderZip = zip.folder(folderName);
            if (folderZip) {
                Object.keys(folder).forEach(fileName => {
                    folderZip.file(fileName, (folder as any)[fileName]);
                });
            }
        }
    });

    zip.generateAsync({ type: 'blob' }).then((content) => {
        saveAs(content, 'vibe-coder-project.zip');
    });
  }, [code]);
  
  const handleCodeChange = useCallback((path: string, value: string) => {
    const [folder, fileName] = path.split('/') as [keyof GeneratedCode, string];

    setCode(prevCode => {
        if (!prevCode) return null;
        if (folder && fileName && prevCode[folder] && typeof prevCode[folder] === 'object') {
            const updatedFolder = {
                ...(prevCode[folder] as object),
                [fileName]: value,
            };
            return {
                ...prevCode,
                [folder]: updatedFolder
            };
        }
        return prevCode;
    });
  }, []);


  return (
    <div className="flex h-screen bg-[#111] text-gray-200 font-sans antialiased overflow-hidden">
        <Sidebar handleDownload={handleDownload} canDownload={!!code} />
        <div className="flex-1 flex flex-col min-w-0">
            <Header toggleConfigPanel={toggleConfigPanel} isConfigPanelVisible={isConfigPanelVisible} />
            <div className="flex flex-1 min-h-0">
                <div className="flex flex-1 min-w-0">
                    <div className="w-[clamp(300px,25%,480px)] p-4 border-r border-gray-800 flex flex-col bg-gray-900">
                        <InputPanel prompt={prompt} setPrompt={setPrompt} image={image} setImage={setImage} />
                    </div>

                    <main className="flex-1 flex flex-col min-w-0">
                        <OutputPanel 
                            code={code} 
                            onCodeChange={handleCodeChange} 
                            isLoading={isLoading} 
                            error={error} 
                        />
                    </main>
                </div>
                <ConfigPanel 
                    handleGenerate={handleGenerate} 
                    isLoading={isLoading} 
                    isVisible={isConfigPanelVisible} 
                />
            </div>
        </div>
    </div>
  );
}

export default App;
