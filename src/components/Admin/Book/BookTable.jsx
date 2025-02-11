import React, { useEffect, useState } from "react";
import {
    Table,
    Row,
    Col,
    Popconfirm,
    Button,
    message,
    notification,
} from "antd";
import InputSearch from "./InputSearch";
import { callDeleteBook, callFetchListBook } from "../../../services/api";
import {
    DeleteTwoTone,
    EditTwoTone,
    ExportOutlined,
    PlusOutlined,
    ReloadOutlined,
} from "@ant-design/icons";
import BookModalCreate from "./BookModalCreate";
import BookViewDetail from "./BookViewDetail";
import moment from "moment/moment";
import { FORMAT_DATE_DISPLAY } from "../../../utils/constant";
import BookModalUpdate from "./BookModalUpdate";
import * as XLSX from "xlsx";

const BookTable = () => {
    const [listBook, setListBook] = useState([]);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);

    const [isLoading, setIsLoading] = useState(false);
    const [filter, setFilter] = useState("");
    const [sortQuery, setSortQuery] = useState("sort=-updatedAt");

    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openViewDetail, setOpenViewDetail] = useState(false);
    const [dataViewDetail, setDataViewDetail] = useState(null);

    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [dataUpdate, setDataUpdate] = useState(null);

    useEffect(() => {
        fetchBook();
    }, [current, pageSize, filter, sortQuery]);

    const fetchBook = async () => {
        setIsLoading(true);
        let query = `current=${current}&pageSize=${pageSize}`;
        if (filter) {
            query += `&${filter}`;
        }
        if (sortQuery) {
            query += `&${sortQuery}`;
        }

        const res = await callFetchListBook(query);
        if (res && res.data) {
            setListBook(res.data.result);
            setTotal(res.data.meta.total);
        }
        setIsLoading(false);
    };

    const columns = [
        {
            title: "Id",
            dataIndex: "_id",
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
            title: "Tên sách",
            dataIndex: "mainText",
            sorter: true,
        },
        {
            title: "Thể loại",
            dataIndex: "category",
            sorter: true,
        },
        {
            title: "Tác giả",
            dataIndex: "author",
            sorter: true,
        },
        {
            title: "Giá tiền",
            dataIndex: "price",
            sorter: true,
            // https://stackoverflow.com/questions/37985642/vnd-currency-formatting
            render: (text, record, index) => {
                return (
                    <>
                        {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                        }).format(record.price)}
                    </>
                );
            },
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
                            title={"Xác nhận xóa book"}
                            description={"Bạn có chắc chắn muốn xóa book này ?"}
                            onConfirm={() => handleDeleteBook(record._id)}
                            okText="Xác nhận"
                            cancelText="Hủy"
                        >
                            <span
                                style={{ cursor: "pointer", margin: "0 20px" }}
                            >
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
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current);
        }
        if (pagination && pagination.pageSize !== pageSize) {
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
    };

    const handleDeleteBook = async (id) => {
        const res = await callDeleteBook(id);
        if (res && res.data) {
            message.success("Xóa book thành công");
            fetchBook();
        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                description: res.message,
            });
        }
    };

    // change button color: https://ant.design/docs/react/customize-theme#customize-design-token
    const renderHeader = () => {
        return (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Table List Books</span>
                <span style={{ display: "flex", gap: 15 }}>
                    <Button
                        icon={<ExportOutlined />}
                        type="primary"
                        onClick={() => handleExportData()}
                    >
                        Export
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

    const handleExportData = () => {
        // https://stackoverflow.com/questions/70871254/how-can-i-export-a-json-object-to-excel-using-nextjs-react
        if (listBook.length > 0) {
            const worksheet = XLSX.utils.json_to_sheet(listBook);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
            XLSX.writeFile(workbook, "ExportBook.csv");
        }
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
                        columns={columns}
                        dataSource={listBook}
                        onChange={onChange}
                        rowKey="_id"
                        pagination={{
                            current: current,
                            pageSize: pageSize,
                            showSizeChanger: true,
                            total: total,
                            showTotal: (total, range) => {
                                return (
                                    <div>
                                        {" "}
                                        {range[0]}-{range[1]} trên {total} rows
                                    </div>
                                );
                            },
                        }}
                    />
                </Col>
            </Row>
            <BookModalCreate
                openModalCreate={openModalCreate}
                setOpenModalCreate={setOpenModalCreate}
                fetchBook={fetchBook}
            />

            <BookViewDetail
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
                setDataViewDetail={setDataViewDetail}
            />

            <BookModalUpdate
                openModalUpdate={openModalUpdate}
                setOpenModalUpdate={setOpenModalUpdate}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
                fetchBook={fetchBook}
            />
        </>
    );
};

export default BookTable;
