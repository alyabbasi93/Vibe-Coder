import { GoogleGenAI, Type, Part } from "@google/genai";
import type { ImageFile, GeneratedCode } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const codeGenerationSchema = {
    type: Type.OBJECT,
    properties: {
        public: {
            type: Type.OBJECT,
            description: "Files for the public-facing part of the website.",
            properties: {
                'index.html': { type: Type.STRING, description: "The main HTML file body content." },
                'style.css': { type: Type.STRING, description: "The main CSS file." },
                'script.js': { type: Type.STRING, description: "The main JavaScript file." }
            },
            required: ['index.html', 'style.css', 'script.js']
        },
        backend: {
            type: Type.OBJECT,
            description: "PHP files for the server-side logic.",
            properties: {
                'api.php': { type: Type.STRING, description: "Main API endpoint file for fetching data." },
                'db_connect.php': { type: Type.STRING, description: "Database connection handler using PDO." }
            },
            additionalProperties: { type: Type.STRING }
        },
        database: {
            type: Type.OBJECT,
            description: "Database schema file.",
            properties: {
                'schema.sql': { type: Type.STRING, description: "The SQL schema for all necessary tables (CREATE TABLE statements)." }
            },
            required: ['schema.sql']
        },
        admin: {
            type: Type.OBJECT,
            description: "Optional: Files for the admin panel. Only generate this if the prompt implies a need for content management (e.g., a blog, portfolio, e-commerce site).",
            properties: {
                'index.html': { type: Type.STRING, description: "The admin panel's main HTML file body content." },
                'style.css': { type: Type.STRING, description: "The admin panel's CSS file." },
                'script.js': { type: Type.STRING, description: "The admin panel's JavaScript file for interactivity (e.g., fetching and displaying data)." },
                'api.php': { type: Type.STRING, description: "Admin-specific API endpoints for CRUD operations." }
            },
            additionalProperties: { type: Type.STRING }
        },
        installer: {
            type: Type.OBJECT,
            description: "Installation script.",
            properties: {
                'install.sh': { type: Type.STRING, description: "A shell script with clear instructions and commands to set up a local development environment (e.g., installing dependencies, setting up the database from schema.sql)." }
            },
            required: ['install.sh']
        }
    },
    required: ["public", "backend", "database", "installer"]
};


export const generateCode = async (prompt: string, image: ImageFile | null): Promise<GeneratedCode> => {
    const model = 'gemini-2.5-pro';

    const systemInstruction = `You are an expert full-stack web developer. Your task is to generate a complete web application based on the user's prompt.
- You must generate a JSON object that represents a file structure with folders: 'public', 'backend', 'database', and 'installer'.
- If the user's prompt suggests a need for an admin panel (like for a blog, e-commerce, or CMS), you must also generate the necessary files for it in a separate 'admin' folder. Otherwise, omit the 'admin' key.
- For all HTML files, provide only the content that would go inside the <body> tag.
- Backend code must be in PHP. Use modern practices like PDO for database connections.
- The 'schema.sql' file should contain all necessary 'CREATE TABLE' statements.
- The 'install.sh' script should contain helpful comments and commands to set up a local LAMP/LEMP server, create the database, and run the schema.
- Ensure all parts of the application (frontend, backend, admin) are consistent and work together.
- If an image is provided, use it as a strong visual guide for the design of the public-facing site.`;

    const parts: Part[] = [{ text: prompt }];

    if (image) {
        parts.unshift({
            inlineData: {
                data: image.data,
                mimeType: image.mimeType,
            }
        });
    }
    
    const contents = { parts };

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: contents,
            config: {
                responseMimeType: "application/json",
                responseSchema: codeGenerationSchema,
                systemInstruction: systemInstruction,
            },
        });
        
        const text = response.text;
        const parsedJson = JSON.parse(text);

        // Basic validation to ensure the structure is roughly correct
        if (parsedJson.public && parsedJson.backend && parsedJson.database) {
            return parsedJson as GeneratedCode;
        } else {
            console.error("Generated JSON does not match expected structure:", parsedJson);
            throw new Error("The AI returned an invalid project structure.");
        }
    } catch (error) {
        console.error("Error generating code:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to generate code from the Gemini API: ${error.message}`);
        }
        throw new Error("Failed to generate code from the Gemini API.");
    }
};
