import React, { useState, useEffect } from "react";
import { Form, Input, message, Modal, Select, Table, DatePicker, Col, Row, Card, Progress } from "antd";
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import Spinner from "./../components/Spinner";
import { UserOutlined,  EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import moment from "moment";
const { RangePicker } = DatePicker;


const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allTransaction, setAllTransaction] = useState([]);
  const [frequency, setFrequency] = useState("7");
  const [selectedDate, setSelectedate] = useState([]);
  const [type, setType] = useState("all");
  const [loginUser, setLoginUser] = useState("");
  const [editable, setEditable] = useState(null);

  //number of transactions
  const totalTransaction = allTransaction.length;
  const totalIncomeTransactions = allTransaction.filter(
    (transaction) => transaction.type === "income"
  );

  const totalExpenseTransactions = allTransaction.filter(
    (transaction) => transaction.type === "expense"
  );

  const totalIncomePercent = (totalIncomeTransactions.length / totalTransaction) * 100;
  const totalExpensePercent = (totalExpenseTransactions.length / totalTransaction) * 100;

  //total turnover
  const totalTurnover = allTransaction.reduce(
    (acc, transaction) => acc + transaction.amount,
    0
  );
  const totalIncomeTurnover = allTransaction
    .filter((transaction) => transaction.type === "income")
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  const totalExpenseTurnover = allTransaction
    .filter((transaction) => transaction.type === "expense")
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  const totalIncomeTurnoverPercent = (totalIncomeTurnover / totalTurnover) * 100;
  const totalExpenseTurnoverPercent = (totalExpenseTurnover / totalTurnover) * 100;
 

  //table data
  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      render: (text) => <span>{moment(text).format("YYYY-MM-DD")}</span>,
    },
    {
      title: "Amount",
      dataIndex: "amount",
    },
    {
      title: "Type",
      dataIndex: "type",
    },
    {
      title: "Category",
      dataIndex: "category",
    },
    {
      title: "Refrence",
      dataIndex: "refrence",
    },
    {
      title: "Actions",
      render: (text, record) => (
        <div>
          <EditOutlined
            onClick={() => {
              setEditable(record);
              setShowModal(true);
            }}
          />
          <DeleteOutlined
            className="mx-2"
            onClick={() => {
              handleDelete(record);
            }}
          />
        </div>
      ),
    },
  ];

  // category
  const categories = [
    "salary",
    "tip",
    "project",
    "food",
    "movie",
    "bills",
    "medical",
    "fee",
    "tax",
  ];

  //getall transactions


  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setLoginUser(user);
    }
    const getAllTransactions = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        setLoading(true);
        const res = await axios.post("/transactions/get-transaction", {
          userid: user._id,
          frequency,
          selectedDate,
          type,
        });
        setLoading(false);
        setAllTransaction(res.data);
        console.log(res.data);
      } catch (error) {
        console.log(error);
        message.error("Fetch Issue With Transaction!");
      }
    };
    getAllTransactions();
  }, [frequency, selectedDate, type]);

  //delete handler
  const handleDelete = async (record) => {
    try {
      setLoading(true);
      await axios.post("/transactions/delete-transaction", {
        transacationId: record._id,
      });
      setLoading(false);
      message.success("Transaction Deleted!");
    } catch (error) {
      setLoading(false);
      console.log(error);
      message.error("Unable to delete!");
    }
  };

  // form handling
  const handleSubmit = async (values) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      setLoading(true);
      if(editable){
        await axios.post("/transactions/edit-transaction", {
          payload: {
            ...values,
            userId: user._id,
          },
          transacationId: editable._id,
        });
        setLoading(false);
        message.success("Transaction Updateded Successfully!");

      }
      else{
        await axios.post("/transactions/add-transaction", {
          ...values,
          userid: user._id,
        });
        setLoading(false);
        message.success("Transaction Added Successfully!");
      }
      setShowModal(false);
      setEditable(null);
    } catch (error) {
      setLoading(false);
      message.error("Faild to add transaction!");
    }
  };

  return (
    <Layout>
      {loading && <Spinner />}
      <Row>
      <Col span={4}>
        <Card title="Expense Manager"
        headStyle={{ backgroundColor: '#1B4F72', color: '#ffffff' }}
        style={{ height: "120vh" , backgroundColor: '#EAF2F8' }}
        >
        <div className="user-area"> 
        <Avatar size={32} icon={<UserOutlined />} />
        <p className="h4">{loginUser && loginUser.name}</p>{" "}
        </div>
        
        <div className="user-button">
          <button
            className="btn btn-outline-dark" 
            onClick={() => setShowModal(true)}
          >
            Add Income/ Expense
          </button>
        </div>

        <h5>Filter by date</h5>
       
        <div className="date-filter">
          <Select value={frequency} onChange={(values) => setFrequency(values)}>
            <Select.Option value="7">Past Week</Select.Option>
            <Select.Option value="30">Past Month</Select.Option>
            <Select.Option value="365">Past year</Select.Option>
            <Select.Option value="custom">Custom</Select.Option>
          </Select>
          {frequency === "custom" && (
            <RangePicker
              value={selectedDate}
              onChange={(values) => setSelectedate(values)}
            />
          )}
         
        </div>
        <h5>Filter by type</h5>
        <div className="type-filter">
          <Select value={type} onChange={(values) => setType(values)}>
            <Select.Option value="income">Income</Select.Option>
            <Select.Option value="expense">Expense</Select.Option>
            <Select.Option value="all">Both</Select.Option>
          </Select>
          
           
        </div>

        <h5>Total Transactions : {totalTransaction}</h5> 

        </Card>
      </Col>

      <Col span={20}>
        <Card title="History"
        headStyle={{ backgroundColor: '#1B4F72', color: '#ffffff' }}
        style={{ height: "55vh" , backgroundColor: '#D6EAF8' }}>
        <div className="content">
        <Table columns={columns} 
         dataSource={allTransaction}
         pagination={{ defaultPageSize: 4, showSizeChanger: true, pageSizeOptions: ['4', '5']}} />
        </div>
        <Modal
        title={editable ? "Edit Transaction" : "Add New Transaction"}
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={false}
        style={{ backgroundColor: '#1F618D' }}
        >
        <Form 
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={editable}
        style={{ backgroundColor: '#D6EAF8' }}
        >
          <Form.Item label="Amount" name="amount">
            <Input type="text" />
          </Form.Item>
          <Form.Item label="type" name="type">
            <Select>
              <Select.Option value="income">Income</Select.Option>
              <Select.Option value="expense">Expense</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Category" name="category">
            <Select>
              <Select.Option value="salary">Salary</Select.Option>
              <Select.Option value="tip">Tip</Select.Option>
              <Select.Option value="project">Project</Select.Option>
              <Select.Option value="food">Food</Select.Option>
              <Select.Option value="movie">Movie</Select.Option>
              <Select.Option value="bills">Bills</Select.Option>
              <Select.Option value="medical">Medical</Select.Option>
              <Select.Option value="fee">Fee</Select.Option>
              <Select.Option value="tax">TAX</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Date" name="date">
            <Input type="date" />
          </Form.Item>
          <Form.Item label="Refrence" name="refrence">
            <Input type="text" />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input type="text" />
          </Form.Item>
          <div className="d-flex justify-content-end">
            <button type="submit" className="btn btn-primary">
              {" "}
              SAVE
            </button>
          </div>
          </Form>
        </Modal>

        </Card>

        <Card title="Analytics"
        headStyle={{ backgroundColor: '#1B4F72', color: '#ffffff' }}
        style={{ height: "65vh" , backgroundColor: '#D6EAF8' }}>
        <Row>
          <Col span={6}>
              <h6 className="text-success">
                No. of Income : {totalIncomeTransactions.length}
              </h6>
              <h6 className="text-danger">
                No. of Expense : {totalExpenseTransactions.length}
              </h6>
              <div>
                <Progress
                  type="circle"
                  strokeColor={"green"}
                  className="mx-2"
                  percent={totalIncomePercent.toFixed(0)}
                />
                <Progress
                  type="circle"
                  strokeColor={"red"}
                  className="mx-2 mt-3"
                  percent={totalExpensePercent.toFixed(0)}
                />
              </div>

              <hr/>

              <h6 className="text-success">Total Income : {totalIncomeTurnover}</h6>
              <h6 className="text-danger">Total Expense : {totalExpenseTurnover}</h6>
              <div>
                <Progress
                  type="circle"
                  strokeColor={"green"}
                  className="mx-2"
                  percent={totalIncomeTurnoverPercent.toFixed(0)}
                />
                <Progress
                  type="circle"
                  strokeColor={"red"}
                  className="mx-2 mt-3"
                  percent={totalExpenseTurnoverPercent.toFixed(0)}
                />
              </div>
          </Col>
          
          <Col span={9}>
          <h6>Categorywise Income</h6>
          {categories.map((category) => {
            const amount = allTransaction
              .filter(
                (transaction) =>
                  transaction.type === "income" &&
                  transaction.category === category
              )
              .reduce((acc, transaction) => acc + transaction.amount, 0);
            return (
              amount > 0 && (
                <div className="card mt-1">
                  <div className="card-body-income">
                    <h6>{category}</h6>
                    <Progress
                      percent={((amount / totalIncomeTurnover) * 100).toFixed(
                        0
                      )}
                    />
                  </div>
                </div>
              )
            );
          })}
          </Col>
          <Col span={9}>
          <h6>Categorywise Expense</h6>
          {categories.map((category) => {
            const amount = allTransaction
              .filter(
                (transaction) =>
                  transaction.type === "expense" &&
                  transaction.category === category
              )
              .reduce((acc, transaction) => acc + transaction.amount, 0);
            return (
              amount > 0 && (
                <div className="card mt-2">
                  <div className="card-body-expense">
                    <h6>{category}</h6>
                    <Progress
                      percent={((amount / totalExpenseTurnover) * 100).toFixed(
                        0
                      )}
                    />
                  </div>
                </div>
              )
            );
          })}
          </Col>
        </Row>

        </Card>

      </Col>
  </Row>
       
    </Layout>
  );
};

export default HomePage;