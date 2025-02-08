class SearchClient {
    constructor(apiBaseUrl) {
        this.apiBaseUrl = apiBaseUrl;
        this.searchInput = document.getElementById("searchWord");
        this.searchButton = document.getElementById("search");
        this.resultDisplay = document.getElementById("result");

        this.searchButton.addEventListener("click", () => this.searchDefinition());
    }

    async searchDefinition() {
        const word = this.searchInput.value.trim();

        if (!word || /\d/.test(word)) {
            this.displayMessage(messages.invalidInput);
            return;
        }

        try {
            const response = await fetch(`${this.apiBaseUrl}/api/definitions/?word=${encodeURIComponent(word)}`);
            const result = await response.json();

            if (result.message) {
                this.displayMessage(result.message);
            } else if (result.definition) {
                this.displayMessage(`${word}: ${result.definition}`);
            } else {
                this.displayMessage(messages.wordNotFound);
            }
        } catch (error) {
            this.displayMessage(messages.serverError);
        }
    }

    displayMessage(msg) {
        this.resultDisplay.textContent = msg;
    }
}

// set API server address
const searchClient = new SearchClient("http://localhost:3000");