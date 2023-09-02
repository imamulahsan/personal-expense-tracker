const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const colors = require("colors");
const connectDb = require("./config/connectDb");


//configure dot env
dotenv.config(); 

//databse call
connectDb();

//create rest object
const app = express();

//middlewares
app.use(morgan);
app.use(express.json());
app.use(cors);

//routes
app.get('/', (req, res) => {
    res.send("<h1>Hello World!</h1>")
  })

//port
const PORT = 8080 || process.env.PORT;

//listen server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });