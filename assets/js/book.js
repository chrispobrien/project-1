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
    date: ''
  };

var showBook = function() {
    let title = document.createElement("h1");
    title.textContent = localSourceData.bookResults.books[book].title;
    mainEl.appendChild(title);
    let author = document.createElement("h2");
    author.textContent = 'Author: '+localSourceData.bookResults.books[book].author;
    mainEl.appendChild(author);
    let description = document.createElement("p");
    description.textContent = localSourceData.bookResults.books[book].description;
    mainEl.appendChild(description);
    let buyLink = document.createElement("a");
    buyLink.setAttribute("href",localSourceData.bookResults.books[book].amazon_product_url);
    buyLink.setAttribute("class","button");
    buyLink.textContent = "Buy";
    mainEl.appendChild(buyLink);
    let borrowLink = document.createElement("a");
    var NYPLUrl = "https://browse.nypl.org/iii/encore/search/C__S"
        + isbn13 + "__Orightresult__U?lang=eng&suite=def";
    borrowLink.setAttribute("href",NYPLUrl);
    borrowLink.setAttribute("class","button");
    borrowLink.textContent = "Borrow";
    mainEl.appendChild(borrowLink);


};

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

// So this localStorage should be filled whenever user browses to book page
var loadLocalSourceData = function() {
    let lsd = localStorage.getItem("nyt");
    if (lsd) {
      localSourceData = JSON.parse(lsd);
    };
    book = localSourceData.bookResults.books.findIndex(books => books.primary_isbn13 === isbn13);
    showBook();
    addGoogleBooks();
};

loadLocalSourceData();