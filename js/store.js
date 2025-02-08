class StoreClient {
    constructor(apiBaseUrl) {
        this.apiBaseUrl = apiBaseUrl;
        this.wordInput = document.getElementById("word");
        this.definitionInput = document.getElementById("definition");
        this.submitButton = document.getElementById("submit");
        this.messageDisplay = document.getElementById("message");

        this.submitButton.addEventListener("click", () => this.storeDefinition());
    }

    async storeDefinition() {
        const word = this.wordInput.value.trim();
        const definition = this.definitionInput.value.trim();

        if (!this.validateInput(word, definition)) return;

        try {
            const response = await fetch(`${this.apiBaseUrl}/api/definitions`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ word, definition })
            });

            const result = await response.json();
            this.displayMessage(result.message || messages.success);
        } catch (error) {
            this.displayMessage(messages.serverError);
        }
    }

    validateInput(word, definition) {
        if (!word || !definition || /\d/.test(word)) {
            this.displayMessage(messages.invalidInput);
            return false;
        }
        return true;
    }

    displayMessage(msg) {
        this.messageDisplay.textContent = msg;
    }
}

//set API server address
const storeClient = new StoreClient("http://localhost:3000");