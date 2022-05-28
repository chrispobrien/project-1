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

var insertLineBreaks = function(text) {
    var postText = "";
    for (let i=0;i<text.length;i++) {
        if (text.substring(i,i+1) === '\n' || text.substring(i,i+1) === '\r')
            postText += '<p>'
        else
            postText += text.substring(i,i+1)
    }
    return postText;
}

var showBook = function() {
    let title = document.querySelector("#title");
    title.textContent = localSourceData.book.items[0].volumeInfo.title;
    let subtitle = document.querySelector("#subtitle");
    subtitle.textContent = localSourceData.book.items[0].volumeInfo.subtitle
    let pages = document.querySelector("#pages");
    pages.textContent = "Pages: "+localSourceData.book.items[0].volumeInfo.pageCount;

    // There can be more than one author
    // TODO: Style multiple authors, <br /> ?
    let author = document.querySelector("#author");
    if (localSourceData.book.items[0].volumeInfo.authors.length>1) {
        author.textContent = 'Authors: ';
        for (let i=0;i<localSourceData.book.items[0].volumeInfo.authors.length;i++)
            author.textContent += localSourceData.book.items[0].volumeInfo.authors[i] + ", ";
        author.textContent = author.textContent.substring(0,author.textContent.length-2);
    } else {
        author.textContent = 'Author: ' + localSourceData.book.items[0].volumeInfo.authors[0]
    }

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
    textDiv.textContent = insertLineBreaks(localSourceData.book.items[0].volumeInfo.description);
    description.appendChild(textDiv);

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

    let borrowLinksEl = document.querySelector("#borrowLinks");
    borrowLinksEl.innerHTML = "";
    let borrowTitle = document.createElement("div");
    borrowTitle.setAttribute("class","mb-5");
    borrowTitle.textContent="Borrow";
    borrowLinksEl.appendChild(borrowTitle);

    let borrowLinkDiv = document.createElement("div");
    borrowLinkDiv.setAttribute("class","mb-5");
    let borrowLink = document.createElement("a");
    borrowLink.setAttribute("href","https://browse.nypl.org/iii/encore/search/C__S"
         + isbn13 + "__Orightresult__U?lang=eng&suite=def");
    borrowLink.setAttribute("class","bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4");
    borrowLink.textContent = "NY Public Library";
    borrowLinkDiv.appendChild(borrowLink)
    borrowLinksEl.appendChild(borrowLinkDiv);

    // let buyLink = document.createElement("a");
    // buyLink.setAttribute("href",localSourceData.bookResults.books[book].amazon_product_url);
    // buyLink.setAttribute("class","m-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800");
    // buyLink.textContent = "Buy";
    // mainEl.appendChild(buyLink);
    // let borrowLink = document.createElement("a");
    // let NYPLUrl = "https://browse.nypl.org/iii/encore/search/C__S"
    //     + isbn13 + "__Orightresult__U?lang=eng&suite=def";
    // borrowLink.setAttribute("href",NYPLUrl);
    // borrowLink.setAttribute("class","m-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800");
    // borrowLink.textContent = "Borrow";
    // mainEl.appendChild(borrowLink);
    // let viewerEl = document.createElement("div");
    // viewerEl.setAttribute("style","mt-5 width: 600px; height: 500px");
    // viewerEl.setAttribute("id","viewerCanvas");
    // mainEl.appendChild(viewerEl);
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
            book = localSourceData.bookResults.books.findIndex(books => books.primary_isbn13 === isbn13);
            showBook();
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
    //google.books.load();
    //google.books.setOnLoadCallback(initViewer);
    let lsd = localStorage.getItem("nyt");
    if (lsd) {
      localSourceData = JSON.parse(lsd);
    };
    if (!lsd.book || lsd.book.items[0].volumeInfo.industryIdentifiers[0].identifier != isbn13) {
        getBook();
    } else {
        book = localSourceData.bookResults.books.findIndex(books => books.primary_isbn13 === isbn13);
        showBook();
    }
    book = localSourceData.bookResults.books.findIndex(books => books.primary_isbn13 === isbn13);
    showBook();
    //addGoogleBooks();
};

var saveLocalSourceData = function() {
    localStorage.setItem("nyt",JSON.stringify(localSourceData));
};

loadLocalSourceData();