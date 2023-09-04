const transactionModel = require("../models/transactionModel");

const getAllTransaction = async (req, res) => {
  try {
    const transactions = await transactionModel.find({
      userid: req.body.userid,
    });
    res.status(200).json(transactions);
  } catch (error) {
    console.log(error);
    res.status(500).json(erorr);
  }
};

const addTransaction = async (req, res) => {
  try {
    // const newTransection = new transectionModel(req.body);
    const newTransaction = new transactionModel(req.body);
    await newTransaction.save();
    res.status(201).send("Transaction Created");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports = { getAllTransaction, addTransaction };