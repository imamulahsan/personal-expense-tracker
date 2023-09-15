import React, { useState, useEffect } from "react";
import { Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import {EuroOutlined} from '@ant-design/icons';
import axios from "axios";
import Spinner from "../components/Spinner";
const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  //from submit
  const submitHandler = async (values) => {
    try {
      setLoading(true);
      await axios.post("/users/register", values);
      message.success("Registeration Successfull");
      setLoading(false);
      navigate("/login");
    } catch (error) {
      setLoading(false);
      message.error("something went wrong");
    }
  };

  //prevent for login user
  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/");
    }
  }, [navigate]);
  return (
    <>
      <div className="resgister-page ">
        {loading && <Spinner />}
        <Form layout="vertical" className="register-form" onFinish={submitHandler}>
        <h4>Personal <span> EXPENSE TRACKER </span><EuroOutlined/></h4>
        <p>SIGN UP to manage your personal expenses:</p>
          <Form.Item label="Name" name="name">
            <Input type="name" />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input type="email" />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <Input type="password" />
          </Form.Item>
          <div className="register-button">
            <button className="btn btn-secondary">Sign Up</button>
          </div>
          <div className="login-register">
            <Link to="/login">Already Registered? Click Here to Login</Link>
          </div>
        </Form>
      </div>
    </>
  );
};

export default Register;