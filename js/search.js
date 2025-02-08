class DictionarySearchApp {
    constructor(apiBaseUrl) {
      this.apiBaseUrl = apiBaseUrl;
      this.searchForm = document.getElementById("searchForm");
      this.searchResult = document.getElementById("searchResult");
      this.searchWordInput = document.getElementById("searchWordInput");
      this.bindEvents();
    }
  
    bindEvents() {
      if (this.searchForm) {
        this.searchForm.addEventListener("submit", this.handleSearch.bind(this));
      }
    }
  
    async handleSearch(event) {
        // prevent the default form submission
        event.preventDefault();
      
        const word = this.searchWordInput.value.trim();
      
        if (!this.isValidWord(word)) {
          alert(messages.invalidWord);
          return;
        }
      
        try {
            // get request to the backend
          const url = `${this.apiBaseUrl}?word=${encodeURIComponent(word)}`;
          const response = await fetch(url);
          const data = await response.json();
      
          // handle the response
          if (data.definition) {
            //display the word and definition
            const message = `Word: ${data.word}, Definition: ${data.definition}`;
            document.getElementById("searchResult").innerText = message;
          } else {
            // no definition found
            const message = `Not found: ${data.message || "No definition provided."}`;
            document.getElementById("searchResult").innerText = message;
          }
        } catch (error) {
          // handle network or other errors
          console.error("Error:", error);
          document.getElementById("searchResult").innerText = 
            messages.errorPrefix + error;
        }
      }
  
    isValidWord(str) {
      return /^[A-Za-z]+$/.test(str);
    }
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    const apiBaseUrl = "https://comp4537-lab4-server2-group11.onrender.com/api/definitions/";
    const searchApp = new DictionarySearchApp(apiBaseUrl);
  });