
import React, { useState, useEffect } from 'react';
import FileExplorer from './FileExplorer';
import CodeDisplay from './CodeDisplay';
import PreviewWindow from './PreviewWindow';
import { EyeIcon } from './icons/EyeIcon';
import { CodeIcon } from './icons/CodeIcon';
import type { GeneratedCode, ActiveView } from '../types';

interface OutputPanelProps {
    code: GeneratedCode | null;
    onCodeChange: (path: string, value: string) => void;
    isLoading: boolean;
    error: string | null;
}

const getCodeForView = (code: GeneratedCode | null, view: ActiveView): string => {
    if (view === 'preview' || !code) return '';
    const pathParts = view.split('/');
    if (pathParts.length !== 2) return 'Invalid file path.';

    const [folder, fileName] = pathParts as [keyof GeneratedCode, string];

    if (code[folder] && typeof code[folder] === 'object' && fileName in (code[folder] as object)) {
        return (code[folder] as any)[fileName];
    }
    
    return `File not found: ${view}`;
};


const OutputPanel: React.FC<OutputPanelProps> = ({ code, onCodeChange, isLoading, error }) => {
    const [activeView, setActiveView] = useState<ActiveView>('public/index.html');
    const [viewMode, setViewMode] = useState<'code' | 'preview'>('preview');
    
    useEffect(() => {
        // When new code is generated, switch to preview
        if (code && !isLoading) {
            setViewMode('preview');
            setActiveView('preview');
        }
    }, [code, isLoading]);


    const handleFileSelect = (path: ActiveView) => {
        setActiveView(path);
        if(path === 'preview') {
            setViewMode('preview');
        } else {
            setViewMode('code');
        }
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex-grow flex items-center justify-center bg-gray-900/50">
                    <div className="text-center text-gray-400">
                        <svg className="animate-spin mx-auto h-10 w-10 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="mt-4 text-lg">Generating Your Full-Stack App...</p>
                        <p className="text-sm text-gray-500">This might take a moment.</p>
                    </div>
                </div>
            );
        }

        if (error) {
            return <div className="flex-grow flex items-center justify-center bg-gray-900/50 text-red-400 p-4">{error}</div>;
        }
        
        if (!code) {
             return (
                <div className="flex-grow flex items-center justify-center bg-gray-900/50 text-gray-500 p-4 text-center">
                   Describe your vibe and generate code to see the output here.
                </div>
            );
        }

        if (viewMode === 'preview') {
            return <PreviewWindow html={code.public['index.html']} css={code.public['style.css']} js={code.public['script.js']} />;
        }

        return (
            <div className="flex-grow flex min-h-0 bg-gray-900">
                <FileExplorer code={code} activeView={activeView} setActiveView={handleFileSelect} />
                <div className="flex-grow flex flex-col min-w-0">
                     <CodeDisplay
                        fileName={activeView === 'preview' ? '' : activeView}
                        code={getCodeForView(code, activeView)}
                        onChange={(value) => onCodeChange(activeView, value)}
                    />
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full bg-gray-800">
             <div className="flex items-center bg-[#111] border-b border-gray-800 pl-2">
                <button
                    onClick={() => {
                        setViewMode('code');
                        if (activeView === 'preview') setActiveView('public/index.html');
                    }}
                    className={`relative px-4 py-2 text-sm font-medium flex items-center gap-2 transition-colors ${viewMode === 'code' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                >
                    <CodeIcon className="h-4 w-4" />
                    Code
                    {viewMode === 'code' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500"></div>}
                </button>
                <button
                    onClick={() => {
                        setViewMode('preview');
                        setActiveView('preview');
                    }}
                     className={`relative px-4 py-2 text-sm font-medium flex items-center gap-2 transition-colors ${viewMode === 'preview' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                >
                    <EyeIcon className="h-4 w-4" />
                    Preview
                     {viewMode === 'preview' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500"></div>}
                </button>
            </div>
            {renderContent()}
        </div>
    );
};

export default OutputPanel;
