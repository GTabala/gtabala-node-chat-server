const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());
//app.use(express.urlencoded({ extended: false }));
app.use(bodyParser());
const welcomeMessage = {
  id: 0,
  from: "Bart",
  text: "Welcome to CYF chat system!"
};
let nextId = 1;
welcomeMessage.timeSent = new Date();
//This array is our "data store".
//We will start with one message in the array.
//Note: messages will be lost when Glitch restarts our server.
const messages = [welcomeMessage];

// Show all messages
app.get("/messages", (request, response) => {
  response.json(messages);
});

// Serach for messages contain a search ctring
app.get("/messages/search", (request, response) => {
  const searchText = request.query.text;
  response.json(
    messages.filter(item =>
      item.text.toLowerCase().includes(searchText.toLowerCase())
    )
  );
});

// Search for only the most recent 10 messages
app.get("/messages/latest", (request, response) => {
  response.json(messages.slice(-10));
});

// Search for only the most recent <nmb> messages
app.get("/messages/latest/:nmb", (request, response) => {
  const numb = request.params.nmb;
  response.json(messages.slice(-numb));
});

//Show the certain message by id
app.get("/messages/:id", (request, response) => {
  const { id } = request.params;
  response.json(messages.filter(item => item.id == id));
});

//Add a new message
app.post("/messages", (request, response) => {
  const message = request.body;
  if (message.from.length && message.text.length) {
    message.id = nextId;
    message.timeSent = new Date();
    nextId++;
    messages.push(message);
    response.json(message);
  } else
    response.status(400).json({ mess: "Please fill in all the fields." });
});

// Change a message by id
app.put("/messages/:id", (request, response) => {
  const { id } = request.params;
  const msg = request.body;
  const found = messages.find(item =>item.id == id);
  if (found){
  found.from = msg.from; 
  found.text = msg.text;
  response.json(msg);
  } else { response
      .status(400)
      .json({ mess: `The massage with id ${id} not found` });}
});


//Delete the message with the certain id
app.delete("/messages/:id", (request, response) => {
  const id = request.params.id;
  const findById = messages.findIndex(item => item.id == id);
  if (findById > -1) {
    messages.splice(findById, 1);
    response.json({ mess: "Sucsess!" });
  } else {
    response
      .status(400)
      .json({ mess: `The massage with id ${id} not found` });
  }
});

app.get("/", function(request, response) {
  response.sendFile(__dirname + "/index.html");
});

app.listen(process.env.PORT);
