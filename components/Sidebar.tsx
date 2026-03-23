
import React from 'react';
import { DownloadIcon } from './icons/DownloadIcon';
import { HistoryIcon } from './icons/HistoryIcon';
import { SettingsIcon } from './icons/SettingsIcon';
import { LogoIcon } from './icons/LogoIcon';

interface SidebarProps {
    handleDownload: () => void;
    canDownload: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ handleDownload, canDownload }) => {
    return (
        <nav className="w-16 bg-black border-r border-gray-800 flex flex-col items-center justify-between py-4">
            <div className="flex flex-col items-center space-y-6">
                 <LogoIcon className="h-8 w-8 text-gray-500" />
            </div>
            <div className="flex flex-col items-center space-y-6">
                <button
                    onClick={handleDownload}
                    disabled={!canDownload}
                    title="Download .zip"
                    className="p-3 rounded-full text-gray-400 hover:bg-gray-800 hover:text-white disabled:text-gray-600 disabled:bg-transparent disabled:cursor-not-allowed transition-colors duration-200"
                >
                    <DownloadIcon className="h-6 w-6" />
                </button>
                <button
                    disabled
                    title="History (coming soon)"
                    className="p-3 rounded-full text-gray-600 cursor-not-allowed"
                >
                    <HistoryIcon className="h-6 w-6" />
                </button>
                 <button
                    disabled
                    title="Settings (coming soon)"
                    className="p-3 rounded-full text-gray-600 cursor-not-allowed"
                >
                    <SettingsIcon className="h-6 w-6" />
                </button>
            </div>
        </nav>
    );
};

export default Sidebar;
