import React from 'react';
import type { ImageFile } from '../types';
import { UploadIcon } from './icons/UploadIcon';

interface InputPanelProps {
    prompt: string;
    setPrompt: (prompt: string) => void;
    image: ImageFile | null;
    setImage: (image: ImageFile | null) => void;
}

const InputPanel: React.FC<InputPanelProps> = ({
    prompt,
    setPrompt,
    image,
    setImage,
}) => {
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = (reader.result as string).split(',')[1];
                setImage({
                    name: file.name,
                    data: base64String,
                    mimeType: file.type,
                });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="bg-gray-900 flex flex-col space-y-4 h-full">
            <h2 className="text-xl font-semibold text-gray-200">Describe Your Vibe</h2>
            
            <div className="flex-grow flex flex-col min-h-0">
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., 'A modern, minimalist portfolio for a photographer with a dark theme and neon accents...'"
                    className="w-full flex-grow p-3 bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 resize-none placeholder-gray-500"
                    rows={8}
                />
            </div>
            
            <div className="h-48 flex flex-col">
                <label htmlFor="image-upload" className="block text-sm font-medium text-gray-300 mb-2">Upload a reference image (optional)</label>
                <div className="mt-1 flex-grow flex justify-center items-center px-6 pt-5 pb-6 border-2 border-gray-700 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                        <UploadIcon className="mx-auto h-10 w-10 text-gray-500" />
                        <div className="flex text-sm text-gray-500">
                            <label htmlFor="file-upload" className="relative cursor-pointer bg-gray-900 rounded-md font-medium text-purple-400 hover:text-purple-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 focus-within:ring-purple-500">
                                <span className="p-1">Upload a file</span>
                                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                        </div>
                        {image ? (
                            <p className="text-xs text-green-400 mt-2 truncate max-w-xs">{image.name}</p>
                        ) : (
                            <p className="text-xs text-gray-500">PNG, JPG, GIF</p>
                        )}
                    </div>
                </div>
                 {image && <button onClick={() => setImage(null)} className="text-xs text-red-400 hover:text-red-300 mt-2 w-full text-center">Remove image</button>}
            </div>
        </div>
    );
};

export default InputPanel;
