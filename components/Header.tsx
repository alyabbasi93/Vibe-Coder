
import React from 'react';
import { TuneIcon } from './icons/TuneIcon';

interface HeaderProps {
    toggleConfigPanel: () => void;
    isConfigPanelVisible: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleConfigPanel, isConfigPanelVisible }) => {
    return (
        <header className="flex items-center justify-between p-4 border-b border-gray-800 h-16 flex-shrink-0 bg-gray-900">
            <div className="flex items-center space-x-3">
                <h1 className="text-xl font-bold text-gray-100">Vibe Coder</h1>
            </div>
             <button
                onClick={toggleConfigPanel}
                title={isConfigPanelVisible ? "Hide config" : "Show config"}
                className={`p-2 rounded-md transition-colors ${isConfigPanelVisible ? 'bg-purple-600/20 text-purple-400' : 'text-gray-400 hover:bg-gray-800'}`}
             >
                <TuneIcon className="h-5 w-5" />
             </button>
        </header>
    );
};

export default Header;
