class DictionarySearch {
    constructor() {
        this.API_URL = 'http://localhost:3000/definitions';
        this.searchInput = document.getElementById('searchWord');
        this.resultDiv = document.getElementById('result');
        
        // Bind methods
        this.searchWord = this.searchWord.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        
        // Set up event listeners
        this.searchInput.onkeyup = this.handleKeyPress;
    }

    async searchWord() {
        const word = this.searchInput.value.trim();
        
        if (!word) {
            this.showResult(strings.enterWord, false);
            return;
        }

        try {
            const response = await fetch(`${this.API_URL}?word=${encodeURIComponent(word)}`);
            const data = await response.json();
            
            if (data.definition) {
                this.showResult(`${data.word}: ${data.definition}`, true);
            } else {
                this.showResult(data.message, false);
            }
        } catch (error) {
            this.showResult(strings.serverError, false);
        }
    }

    handleKeyPress(event) {
        if (event.key === 'Enter') this.searchWord();
    }

    showResult(message, isFound) {
        this.resultDiv.textContent = message;
        this.resultDiv.className = isFound ? 'found' : 'not-found';
    }
}

// Initialize on load
window.onload = () => {
    const search = new DictionarySearch();
    document.querySelector('button').onclick = () => search.searchWord();
};