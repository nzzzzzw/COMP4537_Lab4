class DictionaryStoreApp {
    constructor(apiBaseUrl) {
        this.apiBaseUrl = apiBaseUrl;
        this.storeForm = document.getElementById("storeForm");
        this.resultDiv = document.getElementById("result");
        this.wordInput = document.getElementById("wordInput");
        this.definitionInput = document.getElementById("definitionInput");
        this.bindEvents();
    }

    bindEvents() {
        if (this.storeForm) {
            this.storeForm.addEventListener("submit", this.handleSubmit.bind(this));
        }
    }

    async handleSubmit(event) {
        event.preventDefault();
        const word = this.wordInput.value.trim();
        const definition = this.definitionInput.value.trim();

        // check for empty word and definition
        if (!this.isValidWord(word)) {
            alert(messages.invalidWord);
            return;
        }
        if (!definition) {
            alert(messages.invalidWordAndDefinition);
            return;
        }

        // request body
        const requestBody = { word, definition };

        try {
            // post request to the backend
            const response = await fetch(this.apiBaseUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestBody)
            });

            const data = await response.json();

            // 
            if (data && data.word) {
                // if return { word, definition, message, ... }
                this.resultDiv.textContent = `New word stored:\n${data.word} - ${data.definition}`;
            } else if (data && data.message) {
                // if only message "word already exists"
                this.resultDiv.textContent = data.message;
            } else {
                this.resultDiv.textContent = "No valid response from server.";
            }

        } catch (error) {
            // network error or other errors
            console.error("Error:", error);
            this.resultDiv.textContent = messages.errorPrefix + error;
        }
    }

    // only letters and non-empty
    isValidWord(str) {
        return /^[A-Za-z]+$/.test(str);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const apiBaseUrl = "https://comp4537-lab4-server2-group11.onrender.com/api/definitions/";
    const storeApp = new DictionaryStoreApp(apiBaseUrl);
});