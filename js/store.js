class DictionaryStore {
    constructor() {
        this.API_URL = 'http://localhost:3000/definitions';
        this.wordInput = document.getElementById('word');
        this.definitionInput = document.getElementById('definition');
        this.messageDiv = document.getElementById('message');
        
        // Bind methods
        this.addWord = this.addWord.bind(this);
        this.showMessage = this.showMessage.bind(this);
    }

    async addWord() {
        const word = this.wordInput.value.trim();
        const definition = this.definitionInput.value.trim();
        
        if (!this.isValidInput(word, definition)) return;

        try {
            const response = await fetch(this.API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ word, definition })
            });
            const data = await response.json();
            
            this.showMessage(data.message, !data.error);
            if (!data.error) this.clearForm();
        } catch (error) {
            this.showMessage(strings.serverError, false);
        }
    }

    isValidInput(word, definition) {
        if (!word || !definition) {
            this.showMessage(strings.fillAllFields, false);
            return false;
        }
        if (/\d/.test(word)) {
            this.showMessage(strings.noNumbers, false);
            return false;
        }
        return true;
    }

    clearForm() {
        this.wordInput.value = '';
        this.definitionInput.value = '';
    }

    showMessage(message, isSuccess) {
        this.messageDiv.textContent = message;
        this.messageDiv.className = isSuccess ? 'success' : 'error';
    }
}

// Initialize on load
window.onload = () => {
    const store = new DictionaryStore();
    document.querySelector('button').onclick = () => store.addWord();
};