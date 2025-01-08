import { LANGUAGE_CONFIG } from "./config";

export const runCode = async (language, code) => {

    if (!code) {
        set({ error: "Please enter some code" });
        return;
    }

    try {
        const runtime = LANGUAGE_CONFIG[language].pistonRuntime;
        const response = await fetch("https://emkc.org/api/v2/piston/execute", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                language: runtime.language,
                version: runtime.version,
                files: [{ content: code }],
            }),
        });

        const data = await response.json();

        console.log("data back from piston:", data);

        // handle API-level erros
        if (data.message) {
            return { error: data.message, executionResult: { code, output: "", error: data.message } };

        }

        // handle compilation errors
        if (data.compile && data.compile.code !== 0) {
            const error = data.compile.stderr || data.compile.output;
            return {
                error,
                executionResult: {
                    code,
                    output: "",
                    error,
                },
            };
        }

        if (data.run && data.run.code !== 0) {
            const error = data.run.stderr || data.run.output;
            return {
                error,
                executionResult: {
                    code,
                    output: "",
                    error,
                },
            };
        }

        // if we get here, execution was successful
        const output = data.run.output;

        return {
            output: output.trim(),
            error: null,
            executionResult: {
                code,
                output: output.trim(),
                error: null,
            },
        };
    } catch (error) {
        console.log("Error running code:", error);
        return {
            error: "Error running code",
            executionResult: { code, output: "", error: "Error running code" },
        };
    } finally {
        return { isRunning: false };
    }
}