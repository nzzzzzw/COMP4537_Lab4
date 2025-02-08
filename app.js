const http = require("http");
const url = require("url");

let dictionary = [];  // Stores words and definitions
let requestCount = 0; // Tracks total requests

const server = http.createServer((req, res) => {
    requestCount++;

    // Handle CORS for cross-server communication
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
    }

    const parsedUrl = url.parse(req.url, true);

    if (req.method === "GET" && parsedUrl.pathname === "/api/definitions/") {
        const word = parsedUrl.query.word;
        if (!word || /\d/.test(word)) {
            sendResponse(res, 400, { message: "Invalid input. Please enter a valid word." });
            return;
        }

        const entry = dictionary.find(entry => entry.word.toLowerCase() === word.toLowerCase());
        if (entry) {
            sendResponse(res, 200, { word: entry.word, definition: entry.definition, requestCount });
        } else {
            sendResponse(res, 404, { message: `Request #${requestCount}, word '${word}' not found!` });
        }

    } else if (req.method === "POST" && parsedUrl.pathname === "/api/definitions") {
        let body = "";

        req.on("data", chunk => { body += chunk; });
        req.on("end", () => {
            try {
                const { word, definition } = JSON.parse(body);

                if (!word || !definition || /\d/.test(word)) {
                    sendResponse(res, 400, { message: "Invalid input. Please enter a valid word and definition." });
                    return;
                }

                if (dictionary.some(entry => entry.word.toLowerCase() === word.toLowerCase())) {
                    sendResponse(res, 409, { message: `Warning! '${word}' already exists.` });
                    return;
                }

                dictionary.push({ word, definition });
                sendResponse(res, 201, {
                    message: `Request #${requestCount}: New entry recorded:\n"${word}: ${definition}"`,
                    totalEntries: dictionary.length
                });

            } catch (error) {
                sendResponse(res, 500, { message: "Server error. Please try again later." });
            }
        });

    } else {
        sendResponse(res, 404, { message: "Endpoint not found." });
    }
});

function sendResponse(res, statusCode, data) {
    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
}

const PORT = 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

