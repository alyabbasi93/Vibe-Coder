
import React, { useMemo } from 'react';

interface PreviewWindowProps {
    html: string;
    css: string;
    js: string;
}

const PreviewWindow: React.FC<PreviewWindowProps> = ({ html, css, js }) => {
    const srcDoc = useMemo(() => {
        return `
            <html>
                <head>
                    <style>${css}</style>
                </head>
                <body>
                    ${html}
                    <script>${js}</script>
                </body>
            </html>
        `;
    }, [html, css, js]);

    return (
        <iframe
            srcDoc={srcDoc}
            title="preview"
            sandbox="allow-scripts allow-same-origin"
            className="w-full h-full border-0 bg-white"
        />
    );
};

export default PreviewWindow;
