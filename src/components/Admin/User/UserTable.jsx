import React, { useEffect, useState } from "react";
import {
    Table,
    Row,
    Col,
    Popconfirm,
    Button,
    message,
    notification,
    Divider,
} from "antd";

import InputSearch from "./InputSearch";
import { render } from "react-dom";
import { callDeleteUser, callFetchListUser } from "../../../services/api";
import {
    CloudDownloadOutlined,
    CloudUploadOutlined,
    DeleteTwoTone,
    EditTwoTone,
    ExportOutlined,
    ImportOutlined,
    PlusOutlined,
    ReloadOutlined,
} from "@ant-design/icons";
import UserViewDetail from "./UserViewDetail";
import UserModalCreate from "./UserModalCreate";
import moment from "moment/moment";
import { FORMAT_DATE_DISPLAY } from "../../../utils/constant";
import UserImport from "./Data/UserImport";
import * as XLSX from "xlsx";
import UserModalUpdate from "./UserModalUpdate";

// https://stackblitz.com/run?file=demo.tsx
const UserTable = () => {
    const [listUser, setListUser] = useState([]);

    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);

    const [isLoading, setIsLoading] = useState(false);

    const [filter, setFilter] = useState("");
    const [sortQuery, setSortQuery] = useState("sort=-updatedAt");

    const [dataViewDetail, setDataViewDetail] = useState({});
    const [openViewDetail, setOpenViewDetail] = useState(false);

    const [openModalCreate, setOpenModalCreate] = useState(false);

    const [openModalImport, setOpenModalImport] = useState(false);

    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [dataUpdate, setDataUpdate] = useState(null);

    useEffect(() => {
        fetchUser();
    }, [current, pageSize, filter, sortQuery]);

    const fetchUser = async () => {
        setIsLoading(true);
        let query = `current=${current}&pageSize=${pageSize}`;

        if (filter) {
            query += `&${filter}`;
        }

        if (sortQuery) {
            query += `&${sortQuery}`;
        }

        const res = await callFetchListUser(query);
        if (res && res.data) {
            setListUser(res.data.result);
            setTotal(res.data.meta.total);
        }
        setIsLoading(false);
    };

    const handleDeleteUser = async (userId) => {
        const res = await callDeleteUser(userId);
        if (res && res.data) {
            message.success("Xóa thành công");
            fetchUser();
        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                description: res.message,
            });
        }
    };

    const columns = [
        {
            title: "Id",
            dataIndex: "_id",
            sorter: true,
            render: (text, record, index) => {
                return (
                    <a
                        href="#"
                        onClick={() => {
                            setDataViewDetail(record);
                            setOpenViewDetail(true);
                        }}
                    >
                        {record._id}
                    </a>
                );
            },
        },
        {
            title: "Họ tên",
            dataIndex: "fullName",
            sorter: true,
        },
        {
            title: "Email",
            dataIndex: "email",
            sorter: true,
        },
        {
            title: "Số điện thoại",
            dataIndex: "phone",
            sorter: true,
        },
        {
            title: "Ngày cập nhật",
            dataIndex: "updatedAt",
            sorter: true,
            render: (text, record, index) => {
                return (
                    <>{moment(record.updatedAt).format(FORMAT_DATE_DISPLAY)}</>
                );
            },
        },

        {
            title: "Action",
            render: (text, record, index) => {
                return (
                    <>
                        <Popconfirm
                            placement="leftTop"
                            title={"Xác nhận xóa user"}
                            description={"Bạn có chắc chắn muốn xóa user này ?"}
                            onConfirm={() => handleDeleteUser(record._id)}
                            okText="Xác nhận"
                            cancelText="Hủy"
                        >
                            <span style={{ cursor: "pointer" }}>
                                <DeleteTwoTone twoToneColor="#ff4d4f" />
                            </span>
                        </Popconfirm>

                        <EditTwoTone
                            twoToneColor="#f57800"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                                setOpenModalUpdate(true);
                                setDataUpdate(record);
                            }}
                        />
                    </>
                );
            },
        },
    ];

    const onChange = (pagination, filters, sorter, extra) => {
        if (pagination && pagination.current != current) {
            setCurrent(pagination.current);
        }
        if (pagination && pagination.pageSize != pageSize) {
            setPageSize(pagination.pageSize);
            setCurrent(1);
        }
        if (sorter && sorter.field) {
            const q =
                sorter.order === "ascend"
                    ? `sort=${sorter.field}`
                    : `sort=-${sorter.field}`;
            setSortQuery(q);
        }

        console.log("params", pagination, filters, sorter, extra);
    };

    const handleExportData = () => {
        // https://stackoverflow.com/questions/70871254/how-can-i-export-a-json-object-to-excel-using-nextjs-react
        if (listUser.length > 0) {
            const worksheet = XLSX.utils.json_to_sheet(listUser);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
            XLSX.writeFile(workbook, "ExportUser.csv");
        }
    };

    const renderHeader = () => {
        return (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Table List Users</span>
                <span style={{ display: "flex", gap: 15 }}>
                    <Button
                        icon={<ExportOutlined />}
                        type="primary"
                        onClick={() => handleExportData()}
                    >
                        Export
                    </Button>

                    <Button
                        icon={<CloudUploadOutlined />}
                        type="primary"
                        onClick={() => setOpenModalImport(true)}
                    >
                        Import
                    </Button>

                    <Button
                        icon={<PlusOutlined />}
                        type="primary"
                        onClick={() => setOpenModalCreate(true)}
                    >
                        Thêm mới
                    </Button>

                    <Button
                        type="ghost"
                        onClick={() => {
                            setFilter("");
                            setSortQuery("");
                        }}
                    >
                        <ReloadOutlined />
                    </Button>
                </span>
            </div>
        );
    };

    const handleSearch = (query) => {
        setFilter(query);
    };

    return (
        <>
            <Row gutter={[20, 20]}>
                <Col span={24}>
                    <InputSearch
                        handleSearch={handleSearch}
                        setFilter={setFilter}
                    />
                </Col>
                <Col span={24}>
                    <Table
                        title={renderHeader}
                        loading={isLoading}
                        className="def"
                        columns={columns}
                        dataSource={listUser.map((user) => ({
                            ...user,
                            key: user._id,
                        }))}
                        onChange={onChange}
                        pagination={{
                            current: current,
                            pageSize: pageSize,
                            showSizeChanger: true,
                            total: total,
                            showTotal: (total, range) => {
                                return (
                                    <div>
                                        {range[0]}-{range[1]} trên {total} rows
                                    </div>
                                );
                            },
                        }}
                        scroll={{
                            y: 380,
                        }}
                    />
                </Col>
            </Row>

            <UserViewDetail
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
                setDataViewDetail={setDataViewDetail}
            />

            <UserModalCreate
                openModalCreate={openModalCreate}
                setOpenModalCreate={setOpenModalCreate}
                fetchUser={fetchUser}
            />

            <UserImport
                openModalImport={openModalImport}
                setOpenModalImport={setOpenModalImport}
            />

            <UserModalUpdate
                openModalUpdate={openModalUpdate}
                setOpenModalUpdate={setOpenModalUpdate}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
                fetchUser={fetchUser}
            />
        </>
    );
};

export default UserTable;
