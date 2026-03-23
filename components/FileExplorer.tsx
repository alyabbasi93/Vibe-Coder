
import React, { useState } from 'react';
import type { GeneratedCode, ActiveView } from '../types';
import { CodeIcon } from './icons/CodeIcon';
import { TerminalIcon } from './icons/TerminalIcon';
import { EyeIcon } from './icons/EyeIcon';

interface FileExplorerProps {
    code: GeneratedCode;
    activeView: ActiveView;
    setActiveView: (view: ActiveView) => void;
}

const getIconForFile = (fileName: string): React.ReactElement => {
    if (fileName.endsWith('.sh')) return <TerminalIcon className="h-4 w-4 mr-2 flex-shrink-0" />;
    // Add more specific icons here if needed, e.g., for .php, .sql
    return <CodeIcon className="h-4 w-4 mr-2 flex-shrink-0" />;
};

const FileItem: React.FC<{
    filePath: string;
    fileName: string;
    icon: React.ReactElement;
    isActive: boolean;
    onClick: () => void;
}> = ({ fileName, icon, isActive, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`flex items-center w-full text-left px-3 py-1.5 text-sm rounded-md transition-colors duration-200 ${
                isActive ? 'bg-purple-600/30 text-gray-100' : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
            }`}
        >
            {icon}
            <span className="truncate">{fileName}</span>
        </button>
    );
};

const Folder: React.FC<{
    folderName: string;
    files: { [key: string]: string };
    activeView: ActiveView;
    setActiveView: (view: ActiveView) => void;
}> = ({ folderName, files, activeView, setActiveView }) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center w-full text-left px-2 py-1 text-xs font-bold text-gray-400 uppercase tracking-wider hover:bg-gray-800 rounded-md"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 mr-1 transition-transform ${isOpen ? 'rotate-90' : ''}`}>
                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 0 1 .02-1.06L11.168 10 7.23 6.29a.75.75 0 1 1 1.04-1.08l4.5 4.25a.75.75 0 0 1 0 1.08l-4.5 4.25a.75.75 0 0 1-1.06-.02Z" clipRule="evenodd" />
                </svg>
                {folderName}
            </button>
            {isOpen && (
                <div className="pl-4 border-l border-gray-700 ml-2.5 my-1 space-y-1">
                    {Object.keys(files).map(fileName => (
                        <FileItem
                            key={fileName}
                            filePath={`${folderName}/${fileName}`}
                            fileName={fileName}
                            icon={getIconForFile(fileName)}
                            isActive={activeView === `${folderName}/${fileName}`}
                            onClick={() => setActiveView(`${folderName}/${fileName}`)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

const FileExplorer: React.FC<FileExplorerProps> = ({ code, activeView, setActiveView }) => {
    const folderOrder: (keyof GeneratedCode)[] = ['public', 'admin', 'backend', 'database', 'installer'];

    return (
        <div className="w-64 bg-gray-900 border-r border-gray-800 p-2 space-y-2 overflow-y-auto">
            <div className="px-2 py-1 text-xs font-bold text-gray-500 uppercase tracking-wider">FILES</div>
            {folderOrder.map(folderName => {
                const files = code[folderName];
                if (!files) return null;
                return (
                    <Folder
                        key={folderName}
                        folderName={folderName}
                        files={files as { [key: string]: string }}
                        activeView={activeView}
                        setActiveView={setActiveView}
                    />
                )
            })}
        </div>
    );
};

export default FileExplorer;
