export interface ImageFile {
    name: string;
    data: string; // base64 encoded
    mimeType: string;
}

// Represents the generated code structure with folders
export interface GeneratedCode {
    public: {
        'index.html': string;
        'style.css': string;
        'script.js': string;
    };
    backend: {
        [key: string]: string; // e.g., 'api.php', 'db_connect.php'
    };
    database: {
        'schema.sql': string;
    };
    admin?: { // Admin panel is optional
        'index.html': string;
        'style.css': string;
        'script.js': string;
        [key: string]: string; // e.g., 'auth.php'
    };
    installer: {
        'install.sh': string;
    };
}

// Active view can be the preview or a path to a specific file
export type ActiveView = 'preview' | string; // string is a path like 'public/index.html'
