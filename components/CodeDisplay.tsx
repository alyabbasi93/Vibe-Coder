
import React from 'react';

interface CodeDisplayProps {
    fileName: string;
    code: string;
    onChange: (value: string) => void;
}

const CodeDisplay: React.FC<CodeDisplayProps> = ({ code, onChange, fileName }) => {
    return (
        <textarea
            key={fileName} // Add key to force re-render on file change
            value={code}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-full p-4 bg-gray-900 text-gray-300 font-mono text-sm border-0 focus:ring-0 focus:outline-none resize-none"
            spellCheck="false"
        />
    );
};

export default CodeDisplay;
