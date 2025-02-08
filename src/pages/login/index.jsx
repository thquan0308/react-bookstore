import React, { useState } from "react";
import {
    Form,
    Input,
    Button,
    Checkbox,
    Divider,
    message,
    notification,
} from "antd";
import "./login.scss";
import { Link, useNavigate } from "react-router-dom";
import { callLogin } from "../../services/api";
import { useDispatch } from "react-redux";
import { doLoginAction } from "../../redux/account/accountSlice";

const LoginPage = () => {
    const navigate = useNavigate();
    const [isSubmit, setIsSubmit] = useState(false);

    const dispatch = useDispatch();

    const onFinish = async (values) => {
        const { username, password } = values;
        setIsSubmit(true);
        const res = await callLogin(username, password);
        setIsSubmit(false);

        if (res?.data) {
            localStorage.setItem("access_token", res.data.access_token);
            dispatch(doLoginAction(res.data.user));
            // console.log("check res", res.data);
            message.success("Đăng nhập thành công");
            navigate("/");
        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                description:
                    res.message && Array.isArray(res.message)
                        ? res.message[0]
                        : res.message,
                duration: 5,
            });
        }
    };

    return (
        <div className="bg-login">
            <div
                className="login-page"
                style={{
                    margin: "0 auto",
                    padding: "30px",
                    border: "1px solid #d9d9d9",
                    borderRadius: "15px",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    backgroundColor: "#fff",
                    maxWidth: "500px",
                    width: "100%",
                }}
            >
                <h3 style={{ textAlign: "center" }}>Đăng nhập</h3>
                <Divider />
                <Form
                    name="basic"
                    labelCol={{
                        span: 6,
                    }}
                    style={{
                        maxWidth: 600,
                        margin: "0 auto",
                    }}
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        labelCol={{ span: 24 }}
                        label="Email"
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: "Please input your !",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        labelCol={{ span: 24 }}
                        label="Mật khẩu"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: "Please input your Password!",
                            },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isSubmit}
                        >
                            Đăng nhập
                        </Button>
                    </Form.Item>
                    <Divider>Or</Divider>
                    <p className="text text-normal">
                        Chưa có tài khoản ?
                        <span>
                            <Link to="/register"> Đăng ký</Link>
                        </span>
                    </p>
                </Form>
            </div>
        </div>
    );
};

export default LoginPage;
