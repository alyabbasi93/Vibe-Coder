import React from 'react';
import { GenerateIcon } from './icons/GenerateIcon';

interface ConfigPanelProps {
    handleGenerate: () => void;
    isLoading: boolean;
    isVisible: boolean;
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({ handleGenerate, isLoading, isVisible }) => {
    return (
        <aside 
            className={`bg-gray-900 border-l border-gray-800 p-4 flex flex-col transition-all duration-300 ease-in-out ${
                isVisible ? 'w-64' : 'w-0 p-0 overflow-hidden'
            }`}
        >
            <div className="min-w-[224px]">
                <h3 className="text-lg font-semibold text-gray-200 mb-4">Configuration</h3>
                <div className="flex-grow">
                    {/* Placeholder for future model settings */}
                    <p className="text-sm text-gray-500">Model settings will appear here.</p>
                </div>
                <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="w-full mt-4 inline-flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Generating...
                        </>
                    ) : (
                        <>
                            <GenerateIcon className="h-5 w-5 mr-2" />
                            Generate Code
                        </>
                    )}
                </button>
            </div>
        </aside>
    );
};

export default ConfigPanel;
