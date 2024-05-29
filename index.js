import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

// Middleware
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Data arrays
var bookData = [];
var tbrList = [];

// Book entry creation 
function Book(title, author, synopsis, owned, read) {
    this.title = title;
    this.author = author;
    this.synopsis = synopsis;
    this.owned = owned;
    this.read = read;
    this.date = new Date().toLocaleString();
}


// Add book to owned books
function addBook(title, content, synopsis, owned, read) {
    let newBook = new Book(title, content, synopsis, owned, read);
    bookData.push(newBook);
}

// Add book to tbr books
function addTBRBook(title, content, synopsis, owned, read) {
  let newBook = new Book(title, content, synopsis, owned, read);
  tbrList.push(newBook);
}

// Delete Post
function deletePost(index) {
    bookData.splice(index, 1);
}


app.get("/", (req, res) => {
  res.render("index.ejs", { posts: bookData });
});

app.get("/main-library.ejs", (req, res) => {
  res.render("main-library.ejs", 
  { name: "Eve", 
    ownedBooks: bookData
   }
  )
})

// Enter library
app.post("/enter-library", (req, res) => {
  res.render("main-library.ejs", 
  { name: "Eve", 
    ownedBooks: bookData
   }
  )
  console.log(bookData[0]);
})

app.get("/new-book.ejs", (req, res) => {
    res.render("new-book.ejs");
  });

app.get("/tbr.ejs", (req, res) => {
  res.render("tbr.ejs", 
    {
      name: "Eve",
      tbr: tbrList
    }
  );
});



// View clicked book entry
app.get("/book-info/:id", (req, res) => {
    let index = req.params.id;
    let book = bookData[index];
    res.render("book-info.ejs", {
        entryTitle : book.title,
        entryAuthor : book.author,
        entrySynopsis : book.synopsis,
        entryIndex : index
    });
});




app.post("/submit", (req, res) => {
    addBook(req.body["title"], req.body["author"], req.body["synopsis"]); 
    
    res.render("new-book.ejs",
      { posts: bookData }
    )
  });

  app.post("/submitTBR", (req, res) => {
    addTBRBook(req.body["title"], req.body["author"], req.body["synopsis"]); 
    
    res.render("tbr.ejs", 
    {
      name: "Eve",
      tbr: tbrList
    })
  });

app.post("/deletePost", (req, res) => {
  deletePost(req.body["index"]); 
  
  res.render("main-library.ejs",
    { name: "Eve",
      posts: bookData }
  )
});



// Test data 
addBook("Pride and Prejudice", "Jane Austin", "Boy meets girl", true, true);
addBook("Day of the Triffids", "John Wyndham", "Everyone's blind, scary plants kill kill", true, true);
addTBRBook("Standard Deviation", "Katherine Heiny", "Graham's second wife, Audra, is an unrestrained force of good nature. She talks non-stop through her epidural, labour and delivery, invites the doorman to move in and the eccentric members of their son's Origami Club to Thanksgiving. When she decides to make friends with Elsbeth - Graham's first wife and Audra's polar opposite - Graham starts to wonder: how can anyone love two such different women? And did he make the right choice?", false, false);




app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});