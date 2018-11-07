
let express = require('express');
let app = express();
let mongoose = require('mongoose');
let morgan = require('morgan');
let bodyParser = require('body-parser');
let port = 3000;
let book = require('./app/routes/book');
//db options
let options = { useNewUrlParser: true};

//db connection
mongoose.connect("mongodb://"+ (process.env.MONGODB_HOST|| "localhost")+"/books", options);
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

//use morgan to log at command line
app.use(morgan('combined')); //'combined' outputs the Apache style LOGs

//parse application/json and look for raw text
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/json'}));

app.get("/", (req, res) => res.json({message: "Welcome to our Bookstore!"}));

app.route("/book")
	.get(book.getBooks)
	.post(book.postBook);
app.route("/book/:id")
	.get(book.getBook)
	.delete(book.deleteBook)
	.put(book.updateBook);


app.listen(port);
console.log("Listening on port " + port);

module.exports = app; // for testing
