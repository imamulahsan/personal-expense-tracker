import React, { useState, useEffect } from "react";
import { Form, Input, message, Modal, Select, Table, DatePicker, Col, Row, Card } from "antd";
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import Spinner from "./../components/Spinner";
import { UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import moment from "moment";
const { RangePicker } = DatePicker;


const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allTransection, setAllTransection] = useState([]);
  const [frequency, setFrequency] = useState("7");
  const [selectedDate, setSelectedate] = useState([]);
  const [type, setType] = useState("all");
  const [loginUser, setLoginUser] = useState("");
 

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
    },
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
        setAllTransection(res.data);
        console.log(res.data);
      } catch (error) {
        console.log(error);
        message.error("Ftech Issue With Tranction");
      }
    };
    getAllTransactions();
  }, [frequency, selectedDate, type]);

  // form handling
  const handleSubmit = async (values) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      setLoading(true);
      await axios.post("/transactions/add-transaction", {
        ...values,
        userid: user._id,
      });
      setLoading(false);
      message.success("Transaction Added Successfully");
      setShowModal(false);
    } catch (error) {
      setLoading(false);
      message.error("Faild to add transection");
    }
  };

  return (
    <Layout>
      {loading && <Spinner />}
      <Row>
      <Col span={4}>
        <Card title="Expense Manager"
        headStyle={{ backgroundColor: '#1B4F72', color: '#ffffff' }}
        style={{ height: "87%" , backgroundColor: '#EAF2F8' }}
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

        </Card>
      </Col>

      <Col span={20}>
        <Card title="History"
        headStyle={{ backgroundColor: '#1B4F72', color: '#ffffff' }}
        style={{ height: "87%" , backgroundColor: '#D6EAF8' }}>
        <div className="content">
        <Table columns={columns} dataSource={allTransection} />
        </div>
        <Modal
        title="Add Transaction"
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={false}
        >
        <Form layout="vertical" onFinish={handleSubmit}>
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

          
      </Col>
  </Row>
       
    </Layout>
  );
};

export default HomePage;