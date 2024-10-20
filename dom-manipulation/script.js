let quotes = [
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "Get busy living or get busy dying.", category: "Motivation" },
    { text: "You have to be odd to be number one.", category: "Humor" }
];

function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quoteDisplay = document.getElementById('quoteDisplay');
    const randomQuote = quotes[randomIndex];
    quoteDisplay.innerHTML = `${randomQuote.text} <br> <i>- ${randomQuote.category}</i>`;
}

// Event listener for "Show New Quote" button
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

function addQuote() {
    const quoteText = document.getElementById('newQuoteText').value;
    const quoteCategory = document.getElementById('newQuoteCategory').value;

    if (quoteText && quoteCategory) {
        quotes.push({ text: quoteText, category: quoteCategory });
        saveQuotes(); // Save to Local Storage
        alert('Quote added successfully!');
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
    } else {
        alert('Please enter both the quote and the category.');
    }
}


function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

function loadQuotes() {
    const storedQuotes = localStorage.getItem('quotes');
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes); // Load quotes from Local Storage
    }
}

window.onload = loadQuotes; // Load the quotes on page load

function exportToJson() {
    const dataStr = JSON.stringify(quotes);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(e) {
        const importedQuotes = JSON.parse(e.target.result);
        quotes.push(...importedQuotes); // Add imported quotes
        saveQuotes(); // Save updated quotes to Local Storage
        alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
}

function populateCategories() {
    const categoryFilter = document.getElementById('categoryFilter');
    const categories = [...new Set(quotes.map(quote => quote.category))]; // Get unique categories

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

function filterQuotes() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    const filteredQuotes = quotes.filter(quote => 
        selectedCategory === 'all' ? true : quote.category === selectedCategory
    );

    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = filteredQuotes.map(quote => 
        `${quote.text} <br> <i>- ${quote.category}</i>`).join('<br><br>');
}

window.onload = function() {
    loadQuotes(); // Load quotes from Local Storage
    populateCategories(); // Populate category filter
};


const serverUrl = 'https://jsonplaceholder.typicode.com/posts';

// Fetch quotes from server
async function fetchQuotesFromServer() {
    const response = await fetch(serverUrl);
    const serverQuotes = await response.json();
    return serverQuotes.slice(0, 5); // Example limit
}

// Post a new quote to server
async function postQuoteToServer(quote) {
    const response = await fetch(serverUrl, {
        method: 'POST',
        body: JSON.stringify(quote),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    });
    return await response.json();
}

// Sync local quotes with server
async function syncWithServer() {
    const serverQuotes = await fetchQuotesFromServer();

    // Conflict resolution: Server data overwrites local data
    quotes = serverQuotes;

    // Save the updated quotes to local storage
    saveQuotes();

    alert('Data synchronized with server (server takes precedence)');
}

// Periodic sync every 60 seconds
setInterval(syncWithServer, 60000);

// Post new quote and sync with server
async function addQuote() {
    const quote = { text: 'New Quote', category: 'Motivation' };
    quotes.push(quote);
    saveQuotes(); // Save locally
    await postQuoteToServer(quote); // Post to server
    alert('New quote added and synced with server!');
}

function filterQuote(category) {
    return quotes.filter(quote => quote.category === category);
}
