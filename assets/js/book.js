var nytAPIKey = 'DRc2qz1HkMLbgp0o1kkGqcDcAG1cTfg6';
var mainWrapperEl = document.querySelector("#mainWrapper");
var mainEl = document.querySelector("#main");
var viewerCanvasEl = document.querySelector("#viewerCanvas");
// book.html must be passed isbn13 parameter to identify the book to show
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const isbn13 = urlParams.get('isbn13');
// Book index within bestseller list
var book = 0;
// Modal references
var modalEl = document.querySelector("#modal");
var modalMessageEl = document.querySelector("#modal-message");
var modalDismissEl = document.querySelector("#modal-dismiss");

// Template of local object to store info
var localSourceData = {
    // Array of bestseller lists available from NYT
    lists:[],
    // Results object, includes .books array of books on the list
    bookResults: {},
    selected: 0,
    date: '',
    // Book data
    book: {},
    // NY Times reviews, if any
    reviews: []
  };

modalDismissEl.addEventListener('click',function(event) {
  modalEl.style.display = 'none';
});

// Once book is loaded, show details  
var showBook = function() {
    let title = document.querySelector("#title");
    title.textContent = localSourceData.book.items[0].volumeInfo.title;
    let subtitle = document.querySelector("#subtitle");
    subtitle.textContent = localSourceData.book.items[0].volumeInfo.subtitle;
    let pages = document.querySelector("#pages");
    pages.textContent = "Pages: "+localSourceData.book.items[0].volumeInfo.pageCount;

    // There can be more than one author, so create divs for the label and each author
    let author = document.querySelector("#author");
    author.innerHTML = "";
    let label = document.createElement("div");
    label.setAttribute("class","float-left mx-auto");
    if (localSourceData.book.items[0].volumeInfo.authors.length>1) {
        label.textContent = "Authors:";
    } else {
        label.textContent = "Author:";
    };

    let authors = document.createElement("div");
    for (let i=0;i<localSourceData.book.items[0].volumeInfo.authors.length;i++) {
        let newAuthor = document.createElement("div");
        newAuthor.setAttribute("class","");
        newAuthor.textContent = localSourceData.book.items[0].volumeInfo.authors[i];
        authors.appendChild(newAuthor);
    }
        
    authors.setAttribute("class","grid grid-cols-1 float-right mx-auto");

    author.appendChild(label);
    author.appendChild(authors);

    // Proceeding with loading the rest of the page
    let description = document.querySelector("#description");
    description.innerHTML = "";
    let coverDiv = document.createElement("div");
    coverDiv.setAttribute("class","float-right p-2");
    let cover = document.createElement("img");
    cover.setAttribute("src",localSourceData.book.items[0].volumeInfo.imageLinks.smallThumbnail.replace("http","https"));
    cover.setAttribute("alt","Book Cover");
    coverDiv.appendChild(cover);
    description.appendChild(coverDiv);
    let textDiv = document.createElement("div");
    textDiv.textContent = localSourceData.book.items[0].volumeInfo.description;
    description.appendChild(textDiv);

    // Create buy links from NY Times buy links list
    let buyLinksEl = document.querySelector("#buyLinks");
    buyLinksEl.innerHTML = "";
    let buyTitle = document.createElement("div");
    buyTitle.setAttribute("class","mb-5");
    buyTitle.textContent="Buy";
    buyLinksEl.appendChild(buyTitle);
    for (let i=0;i<localSourceData.bookResults.books[book].buy_links.length;i++) {
        let buyLinkDiv = document.createElement("div");
        buyLinkDiv.setAttribute("class","mb-5");
        let buyLink = document.createElement("a");
        buyLink.setAttribute("href",localSourceData.bookResults.books[book].buy_links[i].url);
        buyLink.setAttribute("class","bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4");
        buyLink.textContent = localSourceData.bookResults.books[book].buy_links[i].name;
        buyLinkDiv.appendChild(buyLink)
        buyLinksEl.appendChild(buyLinkDiv);
    }

    // Create borrow link, NY Public Library
    let borrowLinksEl = document.querySelector("#borrowLinks");
    borrowLinksEl.innerHTML = "";
    let borrowTitle = document.createElement("div");
    borrowTitle.setAttribute("class","mb-5");
    borrowTitle.textContent="Borrow";
    borrowLinksEl.appendChild(borrowTitle);

    let borrowLinkDiv = document.createElement("div");
    borrowLinkDiv.setAttribute("class","mb-5");
    let borrowLink = document.createElement("a");
    borrowLink.setAttribute("href",`https://browse.nypl.org/iii/encore/search/C__S${isbn13}__Orightresult__U?lang=eng&suite=def`);
    borrowLink.setAttribute("class","bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4");
    borrowLink.textContent = "NY Public Library";
    borrowLinkDiv.appendChild(borrowLink)
    borrowLinksEl.appendChild(borrowLinkDiv);
};

// This code is not used at the moment, it is to load a preview from Google
var initViewer = function() {
    let viewer = new google.books.DefaultViewer(document.querySelector("#viewerCanvas"));
    viewer.load('ISBN:'+isbn13, function() {
        // Sadly no preview available
        viewerCanvasEl.style.display = 'none';
        mainWrapperEl.setAttribute("class","grid grid-cols-1");
    });
};

// Inserts a script function to call Google Books API - callback function handleGBResponse
var addGoogleBooks = function() {
    let gbUrl = `https://books.google.com/books?jscmd=viewapi&bibkeys=ISBN:${isbn13}&callback=handleGBResponse`
    let gbEl = document.createElement("script");
    gbEl.setAttribute("src",gbUrl);
    gbEl.setAttribute("type","text/javascript");
    document.querySelector("body").appendChild(gbEl);
};

// Has some interesting data but mostly links
var handleGBResponse = function(data) {
    modalMessageEl.textContent = data;
    modalEl.style.display='block';
};

// Show reviews if any
var showReviews = function() {
    let reviewsEl = document.querySelector("#reviews");
    reviewsEl.innerHTML = "";
    if (localSourceData.reviews.num_results) {
        let reviewTitle = document.createElement("div");
        reviewTitle.textContent = "Reviews";
        reviewTitle.setAttribute("class","mx-auto border-t-4 border-slate-800");
        reviewsEl.appendChild(reviewTitle);
        for (i=0;i<localSourceData.reviews.num_results;i++) {
            let newReview = document.createElement("div");
            newReview.setAttribute("class","");
            newReview.textContent = localSourceData.reviews.results[i].byline + ': '
                + localSourceData.reviews.results[i].summary;
            let newLinkWrapper = document.createElement("div");
            newLinkWrapper.setAttribute("class","mx-auto py-2");
            let newLink = document.createElement("a");
            newLink.setAttribute("href",localSourceData.reviews.results[i].url);
            newLink.setAttribute("class","bg-slate-500 hover:bg-slate-700 text-white font-bold py-2 px-4");
            newLink.textContent = "Review";
            newLinkWrapper.appendChild(newLink);
            newReview.appendChild(newLinkWrapper);
            reviewsEl.appendChild(newReview);
        }
    }
};

// Get review(s) from NY Times for this book - often there are no reviews
var getReviews = function() {
    let Url = `https://api.nytimes.com/svc/books/v3/reviews.json?isbn=${isbn13}&api-key=${nytAPIKey}`;

    fetch(Url)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    localSourceData.reviews = data;
                    saveLocalSourceData();
                    showReviews();
                })
            } else {
                // Fail silently
                localSourceData.reviews = {};
            }
        })
        .catch(function(error) {
            // Fail silently
            localSourceData.reviews = {};
        })
};

// Google Books API, gathers more info on this book
var getBook = function() {
    let Url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn13}`
  
    fetch(Url)
      .then(function(response) {
        if (response.ok){
          response.json().then(function(data) {
            localSourceData.book = data;
            saveLocalSourceData();
            book = localSourceData.bookResults.books.findIndex(books => books.primary_isbn13 === isbn13);
            showBook();
          })
        } else {
            modalMessageEl.textContent = response.statusText;
            modalEl.style.display='block';
        }
      })
      //.then(data)
      .catch(function(error) {
        modalMessageEl.textContent = error;
        modalEl.style.display='block';
  });
};

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
        getReviews();
    } else {
        // Find and set book index within Bestseller list array by isbn13 number
        book = localSourceData.bookResults.books.findIndex(books => books.primary_isbn13 === isbn13);
        showBook();
        addGoogleBooks();
    }
    book = localSourceData.bookResults.books.findIndex(books => books.primary_isbn13 === isbn13);
    //showBook();
    //addGoogleBooks();
};

// Save local data to localStorage
var saveLocalSourceData = function() {
    localStorage.setItem("nyt",JSON.stringify(localSourceData));
};

// Start loading data, preferably from localStorage but from API if necessary
loadLocalSourceData();