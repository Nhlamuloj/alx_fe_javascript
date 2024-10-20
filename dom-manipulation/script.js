const quotes = JSON.parse(localStorage.getItem('quotes')) || [];

// Function to save quotes to local storage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to display a random quote
function showRandomQuote() {
    if (quotes.length === 0) {
        document.getElementById('quoteDisplay').textContent = 'No quotes available.';
        return;
    }
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const selectedQuote = quotes[randomIndex];
    document.getElementById('quoteDisplay').textContent = selectedQuote.text;

    // Save last viewed quote in session storage
    sessionStorage.setItem('lastQuote', JSON.stringify(selectedQuote));
}

// Function to load quotes from local storage
function loadQuotes() {
    const storedQuotes = JSON.parse(localStorage.getItem('quotes'));
    if (storedQuotes) {
        storedQuotes.forEach(quote => quotes.push(quote));
    }
}

// Function to create the form for adding a new quote
function createAddQuoteForm() {
    const formDiv = document.createElement('div');

    // Create input elements
    const quoteInput = document.createElement('input');
    quoteInput.id = 'newQuoteText';
    quoteInput.type = 'text';
    quoteInput.placeholder = 'Enter a new quote';

    const categoryInput = document.createElement('input');
    categoryInput.id = 'newQuoteCategory';
    categoryInput.type = 'text';
    categoryInput.placeholder = 'Enter quote category';

    // Create the add quote button
    const addQuoteButton = document.createElement('button');
    addQuoteButton.id = 'addQuoteButton';
    addQuoteButton.textContent = 'Add Quote';

    // Append inputs and button to the formDiv
    formDiv.appendChild(quoteInput);
    formDiv.appendChild(categoryInput);
    formDiv.appendChild(addQuoteButton);

    // Append the formDiv to the body
    document.body.appendChild(formDiv);

    // Add event listener to the button
    addQuoteButton.addEventListener('click', addQuote);
}

// Function to add a new quote
function addQuote() {
    const quoteText = document.getElementById('newQuoteText').value;
    const quoteCategory = document.getElementById('newQuoteCategory').value;

    if (quoteText && quoteCategory) {
        quotes.push({ text: quoteText, category: quoteCategory });
        saveQuotes();
        showRandomQuote(); // Optionally show the new quote
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
    } else {
        alert('Please fill in both fields.');
    }
}

// Function to export quotes to JSON
function exportQuotes() {
    const quotesJSON = JSON.stringify(quotes, null, 2);
    const blob = new Blob([quotesJSON], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    a.click();
    URL.revokeObjectURL(url);
}

// Function to import quotes from JSON
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes.push(...importedQuotes);
        saveQuotes();
        showRandomQuote(); // Optionally show a random quote
        alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
}

// Load quotes and create the add quote form on page load
window.onload = () => {
    loadQuotes();
    createAddQuoteForm();
    document.getElementById('exportQuotes').addEventListener('click', exportQuotes);
};

quoteDisplay.innerHTML = `<p>${selectedQuote.text}</p><small>Category: ${selectedQuote.category}</small>`;
quoteDisplay.innerHTML = '<p>No quotes available.</p>';


function populateCategories(categories) {
  const categorySelect = document.getElementById("categorySelect");
  categorySelect.innerHTML = ""; // Clear existing options
  categories.forEach(category => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      categorySelect.appendChild(option);
  });
}
function categoryFilter(selectedCategory, quotes) {
  const filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
  displayQuotes(filteredQuotes); // Assume displayQuotes is a function that renders quotes
}

const quoteTexts = quotes.map(quote => quote.text);


