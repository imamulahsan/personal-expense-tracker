const express = require("express");
const {
  addTransaction,
  getAllTransaction,
  editTransaction,
} = require("../controllers/transactionController");

//router object
const router = express.Router();

//routes
//add transection POST MEthod
router.post("/add-transaction", addTransaction);

router.post("/edit-transaction", editTransaction);

//get transections
router.post("/get-transaction", getAllTransaction);

module.exports = router;