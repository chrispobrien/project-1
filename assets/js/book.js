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


};

// So this localStorage should be filled whenever user browses to book page
var loadLocalSourceData = function() {
    let lsd = localStorage.getItem("nyt");
    if (lsd) {
      localSourceData = JSON.parse(lsd);
    };
    book = localSourceData.bookResults.books.findIndex(books => books.primary_isbn13 === isbn13);
    showBook();
};

loadLocalSourceData();