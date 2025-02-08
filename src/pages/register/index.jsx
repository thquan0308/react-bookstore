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
import "./register.scss";
import { Link, useNavigate } from "react-router-dom";
import { callRegister } from "../../services/api";

const RegisterPage = () => {
    const navigate = useNavigate();
    const [isSubmit, setIsSubmit] = useState(false);

    const onFinish = async (values) => {
        const { fullName, email, password, phone } = values;
        setIsSubmit(true);
        const res = await callRegister(fullName, email, password, phone);
        setIsSubmit(false);

        if (res?.data?._id) {
            message.success("Đăng ký thành công");
            navigate("/login");
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
        <div className="bg-register">
            <div
                className="register-page"
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
                <h3 style={{ textAlign: "center" }}>Đăng ký người dùng</h3>
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
                        label="Họ tên"
                        name="fullName"
                        rules={[
                            {
                                required: true,
                                message: "Please input your Full Name!",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        labelCol={{ span: 24 }}
                        label="Email"
                        name="email"
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
                    <Form.Item
                        labelCol={{ span: 24 }}
                        label="Số điện thoại"
                        name="phone"
                        rules={[
                            {
                                required: true,
                                message: "Please input your Phone!",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isSubmit}
                        >
                            Đăng ký
                        </Button>
                    </Form.Item>
                    <Divider>Or</Divider>
                    <p className="text text-normal">
                        Đã có tài khoản ?
                        <span>
                            <Link to="/login"> Đăng nhập</Link>
                        </span>
                    </p>
                </Form>
            </div>
        </div>
    );
};

export default RegisterPage;
