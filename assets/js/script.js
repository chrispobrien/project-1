var nytAPIKey = 'DRc2qz1HkMLbgp0o1kkGqcDcAG1cTfg6';
var dateEl = document.querySelector('#date');
var listEl = document.querySelector('#listEl');
var searchButtonEl = document.querySelector('#searchButton');
var booksEl = document.querySelector('#books');

var localSourceData = {
  lists:[],
  bookResults: {},
  selected: 0,
  date: ''
};

var onClickSearch = function () {

}

booksEl.addEventListener('click', function(target) {
  
});

searchButtonEl.addEventListener('click', function() {
  localSourceData.date = moment(dateEl.value).format('YYYY-MM-DD');
  localSourceData.selected = listEl.value;
  //console.log(localSourceData.date, localSourceData.selected);
  getBooks();
});

// Load drop-down selection box with options
var populateList = function() {
  listEl.innerHTML = '';
  for (i=0;i<localSourceData.lists.length;i++) {
    let newestPublishedDate = moment(localSourceData.lists[i].newest_published_date);
    if (newestPublishedDate > (moment().subtract(1,'years'))) {
      let optionEl = document.createElement("option");
      optionEl.setAttribute('value',i);
      optionEl.textContent = localSourceData.lists[i].display_name;
      listEl.appendChild(optionEl);
    }
  };
}

// Load books to the main window
var populateBooks = function() {
  booksEl.innerHTML = '';
  let titleDiv = document.createElement("div");
  titleDiv.setAttribute("class","small-12 cell");
  let name = document.createElement("h3");
  name.textContent = localSourceData.lists[localSourceData.selected].display_name;
  titleDiv.appendChild(name);
  booksEl.appendChild(titleDiv);
  let bookList = document.createElement("div");
  bookList.setAttribute("class","small-3 medium-3 large-3 cell")
  for (let i=0;i<localSourceData.bookResults.books.length;i++) {
    let newBook = document.createElement("div");
    newBook.setAttribute("class","small-6 medium-4 large-3 cell book");
    let bookTitle = document.createElement("h5");
    bookTitle.textContent = localSourceData.bookResults.books[i].title;
    bookTitle.setAttribute("class","book-title")
    let newRef = document.createElement("img");
    newRef.setAttribute("src",localSourceData.bookResults.books[i].book_image);
    newRef.setAttribute("alt",localSourceData.bookResults.books[i].title + " book cover");
    newRef.setAttribute("height","20");
    newBook.appendChild(bookTitle);
    newBook.appendChild(newRef);
    booksEl.appendChild(newBook);
  };
  //booksEl.appendChild(bookList);
}

// Second API, loads all the books in the selected bestseller list
var getBooks = function() {
  let Url = 'https://api.nytimes.com/svc/books/v3/lists/'
  + localSourceData.date + '/'
  + localSourceData.lists[localSourceData.selected].list_name_encoded +'.json?'
  +'api-key=' +nytAPIKey;

  fetch(Url)
    .then(function(response) {
      console.log(response);
      if (response.ok){
        response.json().then(function(data) {
          localSourceData.bookResults = data.results;
          saveLocalSourceData();
          // Now that we have a list of books, show them
          populateBooks();
        })
      }
    })
    //.then(data)
    .catch(function(error) {
      console.log(error);
    });

}

// First API, loads all the bestseller lists
var getList = function() {
  let Url = 'https://api.nytimes.com/svc/books/v3/lists/names.json?api-key='
    +nytAPIKey;

  fetch(Url)
    .then(function(response) {
      console.log(response);
      if (response.ok){
        response.json().then(function(data) {
          localSourceData.lists = data.results;
          // Call API to load books for the first list, now that we know what it is
          getBooks();
        })
      }
    })
    //.then(data)
    .catch(function(error) {
      console.log(error);
    });

    // This part should really fire on selection of a category


}

var loadLocalSourceData = function() {
  let lsd = localStorage.getItem("nyt");
  if (lsd) {
    localSourceData = JSON.parse(lsd);
  } else {
    // No localStorage, get data for it from API calls
    getList();
    localSourceData.date = moment().format('YYYY-MM-DD');
  };
  if (localSourceData.lists) {
    populateList();
  };
  if (localSourceData.bookResults) {
    populateBooks();
  };
  if (!localSourceData.date || localSourceData.date === "") {
    localSourceData.date = moment().format("YYYY-MM-DD");
  };
  dateEl.value = localSourceData.date;
}

var saveLocalSourceData = function() {
  localStorage.setItem("nyt",JSON.stringify(localSourceData));
}

loadLocalSourceData();
