import React, { useState, useEffect } from "react";
import { Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import {EuroOutlined} from '@ant-design/icons';
import axios from "axios";
import Spinner from "../components/Spinner";
const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  //from submit
  const submitHandler = async (values) => {
    try {
      setLoading(true);
      const { data } = await axios.post("/users/login", values);
      setLoading(false);
      message.success("login success");
      localStorage.setItem(
        "user",
        JSON.stringify({ ...data.user, password: "" })
      );
      navigate("/");
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
      <div className="login-page ">
        {loading && <Spinner />}
        <Form  className="login-form" layout="vertical" onFinish={submitHandler}>
          <h4>Personal <span> EXPENSE TRACKER </span><EuroOutlined/></h4>
          <p>Log in to view your personal expenses:</p>

          <Form.Item label="Email" name="email">
            <Input type="email" />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <Input type="password" />
          </Form.Item>
          <div className="login-button">
            <button className="btn btn-secondary">Login</button>
          </div>
          <div className="login-register">
            <Link to="/register">New user? Click Here to Register</Link>
          </div>
         
        </Form>
      </div>
    </>
  );
};

export default Login;