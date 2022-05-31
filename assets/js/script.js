var nytAPIKey = 'DRc2qz1HkMLbgp0o1kkGqcDcAG1cTfg6';
var dateEl = document.querySelector('#date');
var listEl = document.querySelector('#listEl');
var searchButtonEl = document.querySelector('#searchButton');
var booksEl = document.querySelector('#books');
var modalEl = document.querySelector("#modal");
var modalMessageEl = document.querySelector("#modal-message");
var modalDismissEl = document.querySelector("#modal-dismiss");

// Template of local object to store info
var localSourceData = {
  // Array of bestseller lists available from NYT
  lists:[],
  // Results object, includes .books array of books on the list
  bookResults: {},
  selected: -1,
  date: '',
  // Not populated on this page - on book.html
  book: {},
  reviews: []
};

modalDismissEl.addEventListener('click',function(event) {
  modalEl.style.display = 'none';
});

// On click of books area, check if it is a book and refer to book page
booksEl.addEventListener('click', function(event) {
  let bookEl = event.target.closest('.book');
  if (bookEl) {
    let Url = './book.html?isbn13=' + bookEl.getAttribute('data-isbn13');
    window.location.href = Url;
  }
});

// On click of Search button, load form values to localSourceData
searchButtonEl.addEventListener('click', function(event) {
  event.preventDefault();
  localSourceData.date = moment(dateEl.value).format('YYYY-MM-DD');
  if (listEl.value>-1) {
    localSourceData.selected = listEl.value;
    getBooks();
  } else {
    modalMessageEl.textContent = 'Please select a bestseller list!';
    modalEl.style.display='block';
  };
});

// Load drop-down selection box with options
var populateList = function() {
  listEl.innerHTML = '';

  // Starter option
  let startOptionEl = document.createElement("option");
  startOptionEl.setAttribute('value',-1);
  startOptionEl.textContent='Select a list...';
  listEl.appendChild(startOptionEl);

  // Lists with activity in the last year
  for (i=0;i<localSourceData.lists.length;i++) {
    // Some lists are very old, show only lists updated in the past year
    let newestPublishedDate = moment(localSourceData.lists[i].newest_published_date);
    if (newestPublishedDate > (moment().subtract(1,'years'))) {
      // Add this list as an option
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
  // Clear books section
  booksEl.innerHTML = '';

  // Title of list
  let titleDiv = document.createElement("div");
  titleDiv.setAttribute("class","col-span-4");
  let name = document.querySelector("#title");
  name.textContent = localSourceData.lists[localSourceData.selected].display_name;

  // Each book in the list
  for (let i=0;i<localSourceData.bookResults.books.length;i++) {
    let newBook = document.createElement("div");
    newBook.setAttribute("class","book bg-slate-100 p-1 m-2 rounded cursor-pointer");
    newBook.setAttribute("data-isbn13",localSourceData.bookResults.books[i].primary_isbn13);
    let bookTitle = document.createElement("h5");
    bookTitle.textContent = localSourceData.bookResults.books[i].title;
    bookTitle.setAttribute("class","book-title")
    let newRef = document.createElement("img");
    newRef.setAttribute("src",localSourceData.bookResults.books[i].book_image);
    newRef.setAttribute("alt",localSourceData.bookResults.books[i].title + " book cover");
    newRef.setAttribute("class","w-full");
    newBook.appendChild(bookTitle);
    newBook.appendChild(newRef);
    let bookAuthor = document.createElement("p");
    bookAuthor.textContent = localSourceData.bookResults.books[i].author;
    bookAuthor.setAttribute("class","text-sm");
    newBook.appendChild(bookAuthor);
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
      modalMessageEl.textContent = error;
      modalEl.style.display='block';
    });
    dateEl.value = localSourceData.date;
}

// First API, loads all the bestseller lists
var getList = function() {
  let Url = 'https://api.nytimes.com/svc/books/v3/lists/names.json?api-key='
    +nytAPIKey;

  fetch(Url)
    .then(function(response) {
      if (response.ok){
        response.json().then(function(data) {
          localSourceData.lists = data.results;
          populateList();
          // Call API to load books for the first list, now that we know what it is
          //getBooks();
        })
      }
    })
    //.then(data)
    .catch(function(error) {
      console.log(error);
    });

    // This part should really fire on selection of a category


}

// Loads object with local data OR loads object through API calls
var loadLocalSourceData = function() {
  let lsd = localStorage.getItem("nyt");

  // If localStorage item exists, parse it and assign it
  if (lsd) {
    localSourceData = JSON.parse(lsd);
  } else {
    // No localStorage, get data for it from API calls
    getList();
    localSourceData.date = moment().format('YYYY-MM-DD');
  };

  // If we have the bestseller lists at this point, fill the drop-down list
  if (localSourceData.lists.length>0) {
    populateList();
  };

  // If we have the bestseller list selected and books for it, show them
  if (localSourceData.bookResults.books) {
    //populateBooks();
  };

  // If there is no date yet, assign today's date
  if (!localSourceData.date || localSourceData.date === "") {
    localSourceData.date = moment().format("YYYY-MM-DD");
  };

  dateEl.value = localSourceData.date;
}

var saveLocalSourceData = function() {
  localStorage.setItem("nyt",JSON.stringify(localSourceData));
}

loadLocalSourceData();
