var nytAPIKey = 'DRc2qz1HkMLbgp0o1kkGqcDcAG1cTfg6';
var dateEl = document.querySelector('#date');
var listEl = document.querySelector('#listEl');
var searchButtonEl = document.querySelector('#searchButton');
var booksEl = document.querySelector('#books');

// Template of local object to store info
var localSourceData = {
  // Array of bestseller lists available from NYT
  lists:[],
  // Results object, includes .books array of books on the list
  bookResults: {},
  selected: 0,
  date: ''
};

// On click of books area, check if it is a book and refer to book page
booksEl.addEventListener('click', function(event) {
  let bookEl = event.target.closest('.book');
  console.log(bookEl);
  if (bookEl) {
    let Url = './book.html?isbn13=' + bookEl.getAttribute('data-isbn13');
    window.location.href = Url;
  }
});

// On click of Search button, load form values to localSourceData
searchButtonEl.addEventListener('click', function(event) {
  event.preventDefault();
  localSourceData.date = moment(dateEl.value).format('YYYY-MM-DD');
  localSourceData.selected = listEl.value;
  getBooks();
});

// Load drop-down selection box with options
var populateList = function() {
  listEl.innerHTML = '';
  for (i=0;i<localSourceData.lists.length;i++) {
    // Some lists are very old, show only lists updated in the past year
    let newestPublishedDate = moment(localSourceData.lists[i].newest_published_date);
    if (newestPublishedDate > (moment().subtract(1,'years'))) {
      let optionEl = document.createElement("option");
      optionEl.setAttribute('value',i);
      optionEl.textContent = localSourceData.lists[i].display_name;
      listEl.appendChild(optionEl);
    }
  };
  listEl.value = localSourceData.selected;
}

// Load books to the main window
var populateBooks = function() {
  booksEl.innerHTML = '';
  let titleDiv = document.createElement("div");
  titleDiv.setAttribute("class","col-span-4");
  let name = document.createElement("h3");
  name.textContent = localSourceData.lists[localSourceData.selected].display_name;
  name.setAttribute("class","text-xl block");
  titleDiv.appendChild(name);
  booksEl.appendChild(titleDiv);
  //let bookList = document.createElement("div");
  //bookList.setAttribute("class","flex-auto")
  for (let i=0;i<localSourceData.bookResults.books.length;i++) {
    let newBook = document.createElement("div");
    newBook.setAttribute("class","w-48 block book");
    newBook.setAttribute("data-isbn13",localSourceData.bookResults.books[i].primary_isbn13);
    let bookTitle = document.createElement("h5");
    bookTitle.textContent = localSourceData.bookResults.books[i].title;
    bookTitle.setAttribute("class","book-title")
    let newRef = document.createElement("img");
    newRef.setAttribute("src",localSourceData.bookResults.books[i].book_image);
    newRef.setAttribute("alt",localSourceData.bookResults.books[i].title + " book cover");
    newRef.setAttribute("class","w-48 aspect-auto");
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
