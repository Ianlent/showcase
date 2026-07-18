import { useState, useEffect } from "react";
import { Modal, DatePicker, Form, Button, Select, InputNumber, Divider, Input, Space, Typography, Radio, message, Badge } from "antd";
import { UserOutlined, SettingOutlined, WalletOutlined, EditOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

import CustomerSelect from "./components/CustomerHandling/CustomerSelect.jsx";
import CreateCustomer from "./components/CustomerHandling/CreateCustomer.jsx";
import SelectHandler from "./components/SelectHandler.jsx";

const { Option } = Select;
const { Text, Title } = Typography;

const UpdateOrderModal = ({ selectedOrder, visible, onCancel, isUpdating, isLoading, onSuccess }) => {
	const [form] = Form.useForm();
	const [customerType, setCustomerType] = useState("existing");
	//	{
	// 		"order_id": "019d8d78-59a8-78ac-8ba6-3399f6390323",
	// 		"extra_cost": 0,
	// 		"discount": 0,
	// 		"discount_type": "fixed",
	// 		"total_service_cost": 887,
	// 		"order_note": null,
	// 		"order_date": "2026-04-14T17:39:21.871Z",
	// 		"order_status": "delivered",
	// 		"customer": {
	// 			"id": "019d8d78-4696-7ff6-a9f5-51b7f8dabd99",
	// 			"name": "Lâm Bích Đức",
	// 			"phone": "0300001210",
	// 			"address": "Hẻm 81, Đường Phan Đăng Lưu, Q.11"
	// 		},
	// 		"handler": {
	// 			"id": "019d8d78-4652-7ba4-a721-7c5bb77168b5",
	// 			"name": "Phạm Nga",
	// 			"role": "employee",
	// 			"phone": "0961533492"
	// 		},
	// 		"services": [
	// 			{
	// 				"cost": 537,
	// 				"name": "Lụa Rèm cửa (Giặt sinh học)",
	// 				"type": "kg",
	// 				"units": 2,
	// 				"service_id": "019d8d78-4642-7d0a-871d-2b452c2de56f"
	// 			},
	// 			{
	// 				"cost": 350,
	// 				"name": "Lanh Áo sơ mi (Tẩy vết bẩn)",
	// 				"type": "kg",
	// 				"units": 5,
	// 				"service_id": "019d8d78-4646-748a-b500-2db40637b0e1"
	// 			}
	// 		]
	// }

	useEffect(() => {
		if (visible && selectedOrder) {
			// Map the flat selectedOrder object to the form fields
			form.setFieldsValue({
				...selectedOrder,
				// Crucial: DatePicker needs a dayjs object, not a string
				order_date: selectedOrder?.order_date ? dayjs(selectedOrder.order_date) : undefined,
				// Ensure the SelectHandler/CustomerSelect recognize the IDs
				handler_id: selectedOrder?.handler.id,
				customer_id: selectedOrder?.customer.id,
			});
		}
	}, [visible, selectedOrder, form]);


	const handleOk = async () => {
		try {
			const values = await form.validateFields();
			const patchPayload = {
				handler_id: values.handler_id === selectedOrder.handler.id ? undefined : values.handler_id,
				order_date: values.order_date.toISOString() === selectedOrder.order_date ? undefined : values.order_date.toISOString(),
				order_status: values.order_status === selectedOrder.order_status ? undefined : values.order_status,
				extra_cost: (values.extra_cost === selectedOrder.extra_cost) ? undefined : (values.extra_cost || 0),
				discount: values.discount === selectedOrder.discount ? undefined : (values.discount || 0),
				order_note: values.order_note === selectedOrder.order_note ? undefined : values.order_note,
			};

			// If switching to a brand new customer during update
			if (customerType === "new") {
				patchPayload.customerInfo = values.customerInfo;
			} else {
				patchPayload.customer_id = (values.customer_id === selectedOrder.customer.id) ? undefined : values.customer_id;
			}

			// Detect if patchPayload is all undefined
			const isOnlyUndefined = (obj) =>
				Object.values(obj).every(value => value === undefined);

			if (isOnlyUndefined(patchPayload)) {
				throw new Error("No new changes detected");
			}

			console.log(patchPayload)

			onSuccess(patchPayload);
		} catch (error) {
			message.error(error.message || error.errorFields[0].errors[0] || "Please fill in all required fields correctly.");
		}
	};

	return (
		<Modal
			title={
				<Space>
					<EditOutlined className="text-indigo-500" />
					<span>Edit Order #{selectedOrder?.order_id?.slice(-6).toUpperCase()}</span>
				</Space>
			}
			open={visible}
			onCancel={onCancel}
			footer={null}
			width={850}
			centered
			className="premium-modal"
			loading={isLoading}
			destroyOnClose
		>
			<Form form={form} layout="vertical" className="py-2">

				{/* --- Section: Order Metadata --- */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
					<Form.Item label="Scheduled Date & Time" name="order_date">
						<DatePicker
							showTime
							format="YYYY-MM-DD HH:mm"
							className="w-full rounded-xl"
							size="large"
						/>
					</Form.Item>

					<Form.Item
						label={<Text strong className="text-[11px] uppercase text-slate-500">Update Order Status</Text>}
						name="order_status"
					>
						<Select
							size="large"
							className="rounded-xl premium-select"
							popupClassName="rounded-xl shadow-xl border-slate-100"
						>
							<Select.Option value="pending">
								<Space>
									<Badge color="#f59e0b" />
									<div className="flex flex-col">
										<Text className="text-slate-700 font-medium">Pending</Text>
										<Text className="text-[10px] text-slate-400">Awaiting processing</Text>
									</div>
								</Space>
							</Select.Option>

							<Select.Option value="working">
								<Space>
									<Badge color="#3b82f6" />
									<div className="flex flex-col">
										<Text className="text-slate-700 font-medium">Working</Text>
										<Text className="text-[10px] text-slate-400">Laundry in progress</Text>
									</div>
								</Space>
							</Select.Option>

							<Select.Option value="completed">
								<Space>
									<Badge color="#10b981" />
									<div className="flex flex-col">
										<Text className="text-slate-700 font-medium">Completed</Text>
										<Text className="text-[10px] text-slate-400">Ready for pickup/delivery</Text>
									</div>
								</Space>
							</Select.Option>

							<Select.Option value="delivered">
								<Space>
									<Badge color="#6366f1" />
									<div className="flex flex-col">
										<Text className="text-slate-700 font-medium">Delivered</Text>
										<Text className="text-[10px] text-slate-400">Item reached customer</Text>
									</div>
								</Space>
							</Select.Option>

							<Select.Option value="owed">
								<Space>
									<Badge color="#ef4444" />
									<div className="flex flex-col">
										<Text className="text-rose-600 font-bold">Owed / Debt</Text>
										<Text className="text-[10px] text-rose-400 italic">Payment not yet cleared</Text>
									</div>
								</Space>
							</Select.Option>
						</Select>
					</Form.Item>
				</div>

				<Divider />

				{/* --- Section 1: Customer --- */}
				<div className="mb-8">
					<div className="flex items-center gap-2 mb-4">
						<UserOutlined className="p-2 bg-indigo-50 text-indigo-500 rounded-lg" />
						<Title level={5} className="!m-0 text-slate-700">Customer Identity</Title>
					</div>
					<Form.Item label="Selection Mode" className="mb-4">
						<Select
							size="large"
							value={customerType}
							onChange={(value) => setCustomerType(value)}
							className="w-full md:w-1/3"
						>
							<Option value="existing">Existing Customer</Option>
							<Option value="new">Register New Customer</Option>
						</Select>
					</Form.Item>

					{customerType === "existing" ? <CustomerSelect initial_selected_customer={
						selectedOrder?.customer
					} /> : <CreateCustomer />}
				</div>

				{/* --- Section 2: Handler --- */}
				<div className="mb-8">
					<div className="flex items-center gap-2 mb-4">
						<SettingOutlined className="p-2 bg-amber-50 text-amber-500 rounded-lg" />
						<Title level={5} className="!m-0 text-slate-700">Handler Assignment</Title>
					</div>
					{/* SelectHandler will show name if user_id matches its internal options */}
					<SelectHandler initial_selected_handler={
						selectedOrder?.handler
					} />
				</div>

				{/* --- Section 3: Financials --- */}
				<div className="mb-8">
					<div className="flex items-center gap-2 mb-4">
						<WalletOutlined className="p-2 bg-rose-50 text-rose-500 rounded-lg" />
						<Title level={5} className="!m-0 text-slate-700">Financial Adjustments</Title>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
						<Form.Item label={<Text strong className="text-[10px] uppercase text-rose-400">Extra Cost</Text>} name="extra_cost">
							<InputNumber
								precision={0}
								min={0}
								prefix="₫"
								suffix=".000"
								formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
								parser={(value) => value?.replace(/\./g, "")}
								className="w-full rounded-xl"
								size="large"
							/>
						</Form.Item>

						<div className="flex flex-col">
							<div className="flex justify-between items-center mb-2">
								<Text strong className="text-[10px] uppercase text-emerald-500">Discount</Text>
								<Form.Item name="discount_type" noStyle initialValue="fixed">
									<Radio.Group size="small" optionType="button" buttonStyle="solid" className="scale-90 origin-right">
										<Radio.Button value="fixed">₫</Radio.Button>
										<Radio.Button value="percentage">%</Radio.Button>
									</Radio.Group>
								</Form.Item>
							</div>

							<Form.Item
								noStyle
								shouldUpdate={(prev, curr) => prev.discount_type !== curr.discount_type}
							>
								{({ getFieldValue }) => {
									const isPct = getFieldValue('discount_type') === 'percentage';
									return (
										<Form.Item name="discount" noStyle initialValue={0}>
											<InputNumber
												precision={0}
												min={0}
												max={isPct ? 100 : undefined}
												prefix={isPct ? "" : "₫"}
												suffix={isPct ? "%" : ".000"}
												formatter={(value) => isPct ? value : `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
												parser={(value) => value?.replace(/\./g, "").replace('%', '')}
												className="w-full"
												size="large"
											/>
										</Form.Item>
									);
								}}
							</Form.Item>
						</div>
					</div>
				</div>

				{/* --- Section 4: Notes --- */}
				<Form.Item
					label={<Title level={5} className="!m-0 text-slate-700">Order Notes</Title>}
					name="order_note"
					rules={[{ max: 1000, message: "Note cannot exceed 1000 characters" }]}
				>
					<Input.TextArea
						placeholder="Update instructions..."
						autoSize={{ minRows: 3, maxRows: 6 }}
						className="rounded-xl border-slate-200"
					/>
				</Form.Item>

				{/* --- Section 5: Summary & Grand Total --- */}
				<div className="bg-slate-900 p-6 rounded-2xl mt-8 flex justify-between items-center shadow-xl">
					<div>
						<Text className="text-slate-400 block text-xs uppercase font-black tracking-widest">Payable Amount</Text>
						<Form.Item
							noStyle
							shouldUpdate={(prevValues, currentValues) =>
								prevValues.extra_cost !== currentValues.extra_cost ||
								prevValues.discount !== currentValues.discount ||
								prevValues.discount_type != currentValues.discount_type
							}
						>
							{({ getFieldValue }) => {
								const service_cost = selectedOrder.total_service_cost || 0;
								const extra = getFieldValue('extra_cost') || 0;
								const discount = getFieldValue('discount') || 0;
								const discountType = getFieldValue('discount_type') || 'fixed';

								let calculatedDiscountUnits = 0;
								if (discountType === 'percentage') {
									// If percentage, apply to (Base + Extra)
									calculatedDiscountUnits = (service_cost + extra) * (discount / 100);
								} else {
									// If fixed, use value directly as units
									calculatedDiscountUnits = discount;
								}

								const totalUnits = Math.round(service_cost + extra - calculatedDiscountUnits);
								const finalAmount = Math.max(0, totalUnits * 1000);

								return (
									<Title level={2} className="!m-0 !text-white font-mono">
										{finalAmount.toLocaleString('vi-VN')} ₫
									</Title>
								);
							}}
						</Form.Item>
					</div>

					<div className="text-right hidden md:block">
						<Text className="text-slate-500 text-xs italic">
							* Rounded to nearest 1,000 ₫
						</Text>
					</div>
				</div>

				{/* --- Action Bar --- */}
				<div className="flex justify-end gap-3 mt-8">
					<Button onClick={onCancel} size="large" className="rounded-xl px-6">
						Discard Changes
					</Button>
					<Button
						type="primary"
						size="large"
						onClick={handleOk}
						loading={isUpdating}
						className="bg-indigo-600 rounded-xl px-10 shadow-lg shadow-indigo-100"
					>
						Save Updates
					</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default UpdateOrderModal;