import React, { useState } from "react";
import { SiQuickbooks } from "react-icons/si";
import { FaOpencart } from "react-icons/fa";
import { VscSearchFuzzy } from "react-icons/vsc";
import { Divider, Badge, Drawer } from "antd";
import "./header.scss";
import { useSelector } from "react-redux";
import { DownOutlined } from "@ant-design/icons";
import { Dropdown, Space } from "antd";
import { useNavigate } from "react-router";

const Header = () => {
    const [openDrawer, setOpenDrawer] = useState(false);
    const isAuthenticated = useSelector(
        (state) => state.account.isAuthenticated
    );
    const user = useSelector((state) => state.account.user);
    const navigate = useNavigate();

    const items = [
        {
            label: <label>Quản lý tài khoản</label>,
            key: "account",
        },
        {
            label: <label>Đăng xuất</label>,
            key: "logout",
        },
    ];
    return (
        <>
            <div className="header-container">
                <header className="page-header">
                    <div className="page-header__top">
                        <div
                            className="page-header__toggle"
                            onClick={() => {
                                setOpenDrawer(true);
                            }}
                        >
                            ☰
                        </div>
                        <div className="page-header__logo">
                            <span className="logo">
                                <SiQuickbooks className="rotate icon-react" />
                                TQ BOOKSTORE
                                <VscSearchFuzzy className="icon-search" />
                            </span>
                            <input
                                className="input-search"
                                type={"text"}
                                placeholder="Bạn tìm gì hôm nay"
                            />
                        </div>
                    </div>
                    <nav className="page-header__bottom">
                        <ul id="navigation" className="navigation">
                            <li className="navigation__item">
                                <Badge
                                    count={5}
                                    size={"small"}
                                    offset={[0, 10]}
                                >
                                    <FaOpencart className="icon-cart" />
                                </Badge>
                            </li>
                            <li className="navigation__item mobile">
                                <Divider type="vertical" />
                            </li>
                            <li className="navigation__item mobile">
                                {!isAuthenticated ? (
                                    <span onClick={() => navigate("/login")}>
                                        {" "}
                                        Tài Khoản
                                    </span>
                                ) : (
                                    <Dropdown
                                        menu={{ items }}
                                        trigger={["click"]}
                                    >
                                        <a onClick={(e) => e.preventDefault()}>
                                            <Space>
                                                Welcome {user?.fullName}
                                                <DownOutlined />
                                            </Space>
                                        </a>
                                    </Dropdown>
                                )}
                            </li>
                        </ul>
                    </nav>
                </header>
            </div>
            <Drawer
                title="Menu chức năng"
                placement="left"
                onClose={() => setOpenDrawer(false)}
                open={openDrawer}
            >
                <p>Quản lý tài khoản</p>
                <Divider />

                <p>Đăng xuất</p>
                <Divider />
            </Drawer>
        </>
    );
};

export default Header;
