var mainEl = document.querySelector("#main");
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const isbn13 = urlParams.get('isbn13');
var book = 0;

// Template of local object to store info
var localSourceData = {
    // Array of bestseller lists available from NYT
    lists:[],
    // Results object, includes .books array of books on the list
    bookResults: {},
    selected: 0,
    date: '',
    // Book data
    book: {}
  };

var showBook = function() {
    let title = document.createElement("h1");
    title.textContent = localSourceData.bookResults.books[book].title;
    mainEl.appendChild(title);
    let author = document.createElement("h2");
    author.textContent = 'Author: '+localSourceData.bookResults.books[book].author;
    mainEl.appendChild(author);
    let description = document.createElement("p");
    //description.textContent = localSourceData.bookResults.books[book].description;
    description.textContent = localSourceData.book.items[0].volumeInfo.description;
    description.setAttribute("class","mb-5");
    mainEl.appendChild(description);
    let buyLink = document.createElement("a");
    buyLink.setAttribute("href",localSourceData.bookResults.books[book].amazon_product_url);
    buyLink.setAttribute("class","m-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800");
    buyLink.textContent = "Buy";
    mainEl.appendChild(buyLink);
    let borrowLink = document.createElement("a");
    let NYPLUrl = "https://browse.nypl.org/iii/encore/search/C__S"
        + isbn13 + "__Orightresult__U?lang=eng&suite=def";
    borrowLink.setAttribute("href",NYPLUrl);
    borrowLink.setAttribute("class","m-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800");
    borrowLink.textContent = "Borrow";
    mainEl.appendChild(borrowLink);
    let viewerEl = document.createElement("div");
    viewerEl.setAttribute("style","mt-5 width: 600px; height: 500px");
    viewerEl.setAttribute("id","viewerCanvas");
    mainEl.appendChild(viewerEl);
};

var initViewer = function() {
    let viewer = new google.books.DefaultViewer(document.querySelector("#viewerCanvas"));
    viewer.load('ISBN:'+isbn13, console.log("Book not found"));
}

// Inserts a script function to call Google Books API - callback function handleGBResponse
var addGoogleBooks = function() {
    let gbUrl = "https://books.google.com/books?jscmd=viewapi&bibkeys=ISBN:"
        + isbn13 + "&callback=handleGBResponse";
    let gbEl = document.createElement("script");
    gbEl.setAttribute("src",gbUrl);
    gbEl.setAttribute("type","text/javascript");
    document.querySelector("body").appendChild(gbEl);
};

// Has some interesting data but mostly links
var handleGBResponse = function(data) {
    console.log(data);
}

// Google Books API, gathers more info on this book
var getBook = function() {
    let Url = 'https://www.googleapis.com/books/v1/volumes?q=isbn:'
    + isbn13;
  
    fetch(Url)
      .then(function(response) {
        console.log(response);
        if (response.ok){
          response.json().then(function(data) {
            localSourceData.book = data;
            saveLocalSourceData();
            // Now that we have a list of books, show them
            //populateBooks();
          })
        }
      })
      //.then(data)
      .catch(function(error) {
        console.log(error);
      });
  
  }

// So this localStorage should be filled whenever user browses to book page
var loadLocalSourceData = function() {
    google.books.load();
    google.books.setOnLoadCallback(initViewer);
    let lsd = localStorage.getItem("nyt");
    if (lsd) {
      localSourceData = JSON.parse(lsd);
    };
    if (!lsd.book || lsd.book.items[0].volumeInfo.industryIdentifiers[0].identifier != isbn13) {
        getBook();
    }
    book = localSourceData.bookResults.books.findIndex(books => books.primary_isbn13 === isbn13);
    showBook();
    addGoogleBooks();
};

var saveLocalSourceData = function() {
    localStorage.setItem("nyt",JSON.stringify(localSourceData));
};

loadLocalSourceData();