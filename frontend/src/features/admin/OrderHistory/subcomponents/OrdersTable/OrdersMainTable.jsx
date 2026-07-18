import { useCallback, useEffect, useRef } from "react";
import { Table, Button, Space, Tag, Typography, Tooltip } from "antd";
import {
	EditOutlined,
	DeleteOutlined,
	UserOutlined,
	CalendarOutlined,
	ClockCircleOutlined,
	SyncOutlined,
	CheckCircleOutlined,
	CarOutlined,
	WarningOutlined,
} from "@ant-design/icons";

import OrderDetailNestedFragment from "./OrderDetailNestedTable.jsx"; // Assuming naming

const { Text } = Typography;

const OrdersTable = ({
	data,
	fetchNextPage,
	hasNextPage,
	isFetchingNextPage,
	isLoading,
	handler_id,
	customer_id,
	order_status,
	date,
	setSelectedOrder,
	setEdittingOrder,
	setEditModalVisible,
	setDeleteModalVisible,
}) => {
	const allOrders = data?.pages.flatMap((page) => page.results) || [];
	console.log(allOrders);
	const tableRef = useRef(null);

	const handleScroll = useCallback(
		(e) => {
			const { scrollTop, scrollHeight, clientHeight } = e.target;

			if (scrollHeight - scrollTop <= clientHeight + 50) {
				if (hasNextPage && !isFetchingNextPage) {
					fetchNextPage();
				}
			}
		},
		[fetchNextPage, hasNextPage, isFetchingNextPage],
	);

	useEffect(() => {
		const tableBody = tableRef.current?.querySelector(".ant-table-body");
		if (tableBody) {
			tableBody.addEventListener("scroll", handleScroll);
			return () => tableBody.removeEventListener("scroll", handleScroll);
		}
	}, [handleScroll]);

	useEffect(() => {
		// Reset scroll to top whenever filters change
		const tableBody = tableRef.current?.querySelector(".ant-table-body");
		if (tableBody) {
			tableBody.scrollTop = 0;
		}
	}, [handler_id, customer_id, order_status, date]);

	// UI states ///////////////////////////////////////////////////////////////////////////////
	const columns = [
		{
			title: "Customer",
			dataIndex: "customer_name",
			key: "customer_name",
			render: (text, record) => (
				<div className="flex flex-col">
					<Text className="font-semibold text-slate-800">
						{text || "Unknown"}
					</Text>
					<Text
						type="secondary"
						className="text-xs"
					>
						{record.customer_phone}
					</Text>
				</div>
			),
		},
		{
			title: "Order Date",
			dataIndex: "order_start_date",
			key: "order_date",
			width: 350,
			render: (date) => (
				<div className="flex items-center gap-2 text-slate-600">
					<CalendarOutlined className="text-slate-400" />
					<span>{new Date(date).toLocaleDateString("vi-VN")}</span>
					<span className="text-xs text-slate-400">
						{new Date(date).toLocaleTimeString("vi-VN", {
							hour: "2-digit",
							minute: "2-digit",
						})}
					</span>
				</div>
			),
		},
		{
			title: "Handler",
			dataIndex: "handler_name",
			key: "handler_name",
			render: (text) => (
				<Space>
					<div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] text-indigo-600 border border-indigo-200">
						<UserOutlined />
					</div>
					<Text className="text-slate-700">{text || "Unknown"}</Text>
				</Space>
			),
		},
		{
			title: "Closer",
			dataIndex: "closed_by_name",
			key: "closer_name",
			render: (text) => (
				<Space>
					<div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] text-indigo-600 border border-indigo-200">
						<UserOutlined />
					</div>
					<Text className="text-slate-700">{text || "Unknown"}</Text>
				</Space>
			),
		},
		{
			title: (
				<Text
					strong
					className="text-slate-400 text-[11px] uppercase"
				>
					Status
				</Text>
			),
			dataIndex: "order_status",
			key: "order_status",
			align: "center",
			render: (status) => {
				const config = {
					pending: {
						color: "#f59e0b", // Amber
						bg: "#fffbeb",
						icon: <ClockCircleOutlined className="text-[10px]" />,
						label: "Chờ xử lý",
					},
					working: {
						color: "#3b82f6", // Blue
						bg: "#eff6ff",
						icon: (
							<SyncOutlined
								spin
								className="text-[10px]"
							/>
						),
						label: "Đang giặt",
					},
					completed: {
						color: "#10b981", // Emerald
						bg: "#ecfdf5",
						icon: <CheckCircleOutlined className="text-[10px]" />,
						label: "Hoàn thành",
					},
					delivered: {
						color: "#6366f1", // Indigo
						bg: "#eef2ff",
						icon: <CarOutlined className="text-[10px]" />,
						label: "Đã giao",
					},
					owed: {
						color: "#ef4444", // Rose
						bg: "#fff1f2",
						icon: <WarningOutlined className="text-[10px]" />,
						label: "Còn nợ",
					},
				};

				const style = config[status] || {
					color: "#64748b",
					bg: "#f8fafc",
					label: status,
				};

				return (
					<Tag
						bordered={false}
						style={{
							color: style.color,
							backgroundColor: style.bg,
							display: "inline-flex",
							alignItems: "center",
							gap: "6px",
						}}
						className="uppercase font-bold text-[10px] px-3 py-0.5 rounded-full tracking-wider shadow-sm"
					>
						{style.icon}
						{style.label}
					</Tag>
				);
			},
		},
		{
			title: "Total Price",
			dataIndex: "total_cost",
			key: "total_cost",
			align: "right",
			render: (val) => (
				<Text className="font-mono font-bold text-slate-900">
					{`${new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val * 1000)}`}
				</Text>
			),
		},
		{
			title: "Actions",
			key: "actions",
			align: "center",
			width: 100,
			render: (_, record) => (
				<Space size="small">
					<Tooltip title="Edit Order">
						<Button
							type="text"
							className="text-blue-600 hover:bg-blue-50"
							icon={<EditOutlined />}
							onClick={(e) => {
								e.stopPropagation(); // Prevent row expansion when clicking button
								setEdittingOrder(record.order_id);
								setEditModalVisible(true);
							}}
						/>
					</Tooltip>
					<Tooltip title="Delete Order">
						<Button
							type="text"
							danger
							className="hover:bg-red-50"
							icon={<DeleteOutlined />}
							onClick={(e) => {
								e.stopPropagation();
								setSelectedOrder(record);
								setDeleteModalVisible(true);
							}}
						/>
					</Tooltip>
				</Space>
			),
		},
	];
	return (
		<div
			ref={tableRef}
			className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
		>
			<Table
				columns={columns}
				dataSource={allOrders}
				rowKey="order_id"
				loading={isLoading}
				pagination={false}
				scroll={{ y: "60vh", x: 800 }}
				className="orders-custom-table"
				expandable={{
					expandedRowRender: (record) => (
						<OrderDetailNestedFragment id={record.order_id} />
					),
					expandRowByClick: true, // User clicks anywhere on row to see details
					columnWidth: 48,
				}}
				rowClassName={(record, index) =>
					`cursor-pointer transition-colors ${index % 2 === 0 ? "bg-white" : "bg-slate-50/30"} hover:bg-indigo-50/50`
				}
			/>

			{/* Footer / Fetching Indicator */}
			{isFetchingNextPage && (
				<div className="p-4 text-center border-t border-slate-100 bg-slate-50/50">
					<Text
						type="secondary"
						className="text-xs animate-pulse"
					>
						Loading more orders...
					</Text>
				</div>
			)}
		</div>
	);
};

export default OrdersTable;
