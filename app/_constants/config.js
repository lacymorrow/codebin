export const LANGUAGE_CONFIG = {
    javascript: {
        id: "javascript",
        label: "JavaScript",
        logoPath: "/javascript.png",
        pistonRuntime: { language: "javascript", version: "18.15.0" }, // api that we're gonna be using
        monacoLanguage: "javascript",
        defaultCode: `// JavaScript Playground`,
    },
    python: {
        id: "python",
        label: "Python",
        logoPath: "/python.png",
        pistonRuntime: { language: "python", version: "3.10.0" },
        monacoLanguage: "python",
        defaultCode: `# Python Playground`,
    },
    java: {
        id: "java",
        label: "Java",
        logoPath: "/java.png",
        pistonRuntime: { language: "java", version: "15.0.2" },
        monacoLanguage: "java",
        defaultCode: `# Java Playground`,
    },
    cpp: {
        id: "cpp",
        label: "C++",
        logoPath: "/cpp.png",
        pistonRuntime: { language: "cpp", version: "10.2.0" },
        monacoLanguage: "cpp",
        defaultCode: `// C++ Playground`,
    },
};