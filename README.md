# project-1

## Description
Week 7-8 of Columbia Engineering Coding Bootcamp challenges us, as a team, to make an application that:

* Uses at least two server-side APIs
* Uses client-side storage to store persisent data
* Doesn't use JS alerts, prompts, or confirms (uses modals instead)
* Uses a CSS framework other than Bootstrap
* Is interactive (accepts and responds to user input)

For a demonstration, please browse to our Github pages:

[https://chrispobrien.github.io/project-1/]

Objectives include:

```
AS A reader
I WANT to browse the New York Times bestseller lists by category and date
SO THAT I may select a book to read
```

```
GIVEN a bestseller dashboard with form inputs
WHEN I search for a date and category
THEN I am presented with book titles and covers for that category list on or after that date
WHEN I click on a book
THEN I am presented with detailed information on that book, including reviews, if any
WHEN I click on a buy link
THEN I am referred to the bookseller's page for that book
WHEN I click on a borrow link
THEN I am referred to the New York Public Library
```

* The New York Times has a bestseller book list API. Some are updated more often than others. We show only bestseller lists that have been updated in the past one year.
* Data from the API call is cached in localStorage, the list of names, the list of books on that list, and the Google books API results, and reviews, if any, from the New York Times.  The objective is to call the API once and cache the data.
* User input data is also cached, the date, the list selected
* We have four HTML pages
    * index.html is a landing page introducing the site with a nav bar
    * contacts.html is an "about us" page listing team members
    * search.html is the main search engine, it includes a form soliciting date and bestseller list, and shows books on that list for that date
    * book.html takes as a parameter the isbn13 number of a book, and displays more detailed information, as well as reviews, if any, and buy links and one borrow link for the New York Public Library

## Installation

Using git issue the command

```sh
git clone https://github.com/chrispobrien/project-1.git
```

This creates the folder project-1 within which you will find the project files.

## Usage

Since this is a classroom exercise you may simply open the index.html file in a browser on your local machine.  The API key for accessing the New York Times site is included in the JavaScript, which is not best practice since it is exposed, but we have no server-side component in which to hide the API key.

## Credits

Project 1 Group 5 Team Members

Muhammad Azam
Damaris Canales
Andrew P. Lee 
Chris O'Brien

## Notes

1. Spike: Research APIs

User Story: As a user, I want to ... so ...

2. Spike: Research UI framework

Materialize? Sort of clumsy but not too bad.

I can't figure out how to use Material UI Kit

Using foundation

3. Create repository in git, give access to your teammates

4. Create mock payload from api

var payload = {
    { city: 'New York', zipCode: '10001' }
};

5. Create mock html with mock payload
6. Create css classes with mock html + payload
7. Create javascript code to build page dynamically (can be multiple functions each can be its own task or not)

If html is large then repeat task 5, 6 and 7 with other data

New York Times API
Google Books API

As a reader, I want to view a list of New York Times Bestsellers by date, SO I may read detailed descriptions, reviews, if any, and select a book to read and buy it or borrow it from the library.


MaterialUI
UIKit Apple
Tailwind

HTML
CSS
JS

design
monitoring : make sure your app is working

software development processes :
  waterfall : plan everything ahead
  agile : scrum and kanban ; always iterating

  scrum : 2 week sprints, plan for a short period
  initial planning (tuesday)
  daily standup
  end of sprint : retrospective (what went well, what did not go well)

  user story : guide to what you will deliver, don't build things that are not useful to the user
    be totally focused on what the user wants

  
