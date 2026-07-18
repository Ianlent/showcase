import { useState, useEffect } from "react";
import { Modal, Form, Button, Select, InputNumber, Divider, Input, Space, Typography, Radio, message } from "antd";
import {
	UserOutlined,
	AppstoreAddOutlined,
	SettingOutlined,
	WalletOutlined,
	CheckCircleOutlined
} from "@ant-design/icons";

import CustomerSelect from "./components/CustomerHandling/CustomerSelect.jsx";
import CreateCustomer from "./components/CustomerHandling/CreateCustomer.jsx";
import SelectHandler from "./components/SelectHandler.jsx";
import SelectServices from "./components/SelectService/SelectServices.jsx";

const { Option } = Select;
const { Text, Title } = Typography;

const CreateOrderModal = ({ visible, onCancel, onSuccess, isCreatingOrder }) => {
	const [form] = Form.useForm();
	const [customerType, setCustomerType] = useState("existing");
	const [priceMap, setPriceMap] = useState({});

	useEffect(() => {
		// When creating, reset form and set default values
		form.resetFields();
		setPriceMap({});
	}, [visible, form]);

	const handleServicePriceDiscovery = (id, price) => {
		setPriceMap(prev => ({ ...prev, [id]: price }));
	};


	const handleOk = async () => {
		try {
			const values = await form.validateFields();

			const initialPayload = {
				handler_id: values.handler_id, // From SelectHandler
				points_earned: values.points_earned || 0,
				points_used: values.points_used || 0,
				extra_cost: values.extra_cost || 0,
				discount: values.discount || 0,
				order_note: values.order_note,
				services: values.services.map(s => ({
					...s,
					service_price_per_unit: priceMap[s.service_id] || 0
				}))
			};

			// 2. Prepare the order payload
			let finalPayload = {}

			if (customerType === "new") {
				finalPayload = {
					...initialPayload,
					customerInfo: values.customerInfo,
				};
			} else {
				finalPayload = {
					...initialPayload,
					customer_id: values.customer_id,
				};
			}

			// 3. Submit Order
			onSuccess(finalPayload);
		} catch (error) {
			message.error(error.message || error.errorFields[0].errors[0] || "Please fill in all required fields correctly.");
		}
	};

	return (
		<Modal
			title={
				<Space>
					<CheckCircleOutlined className="text-emerald-500" />
					<span>Create New Order</span>
				</Space>
			}
			open={visible}
			onCancel={onCancel}
			footer={null}
			width={850}
			destroyOnClose
			centered
		>
			<Form form={form} layout="vertical" className="py-2">

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

					{customerType === "existing" ? <CustomerSelect /> : <CreateCustomer />}
				</div>

				{/* --- Section 2: Handler --- */}
				<div className="mb-8">
					<div className="flex items-center gap-2 mb-4">
						<SettingOutlined className="p-2 bg-amber-50 text-amber-500 rounded-lg" />
						<Title level={5} className="!m-0 text-slate-700">Handler Assignment</Title>
					</div>
					<SelectHandler />
				</div>

				{/* --- Section 3: Services --- */}
				<div className="mb-8">
					<div className="flex items-center gap-2 mb-4">
						<AppstoreAddOutlined className="p-2 bg-emerald-50 text-emerald-500 rounded-lg" />
						<Title level={5} className="!m-0 text-slate-700">Service Line Items</Title>
					</div>
					<SelectServices priceMap={priceMap} onPriceDiscovered={handleServicePriceDiscovery} />
				</div>

				{/* --- Section 4: Adjustments --- */}
				<div className="mb-8">
					<div className="flex items-center gap-2 mb-4">
						<WalletOutlined className="p-2 bg-rose-50 text-rose-500 rounded-lg" />
						<Title level={5} className="!m-0 text-slate-700">Financial Adjustments</Title>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
						<Form.Item label={<Text strong className="text-[10px] uppercase text-slate-400">Pts Earned</Text>} name="points_earned" initialValue={0}>
							<InputNumber min={0} precision={0} className="w-full" size="large" />
						</Form.Item>

						<Form.Item label={<Text strong className="text-[10px] uppercase text-slate-400">Pts Used</Text>} name="points_used" initialValue={0}>
							<InputNumber min={0} precision={0} className="w-full" size="large" />
						</Form.Item>

						<Form.Item label={<Text strong className="text-[10px] uppercase text-rose-400">Extra Cost</Text>} name="extra_cost" initialValue={0}>
							<InputNumber
								precision={0}
								min={0}
								prefix="₫"
								suffix=".000"
								formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
								parser={(value) => value?.replace(/\./g, "")}
								className="w-full"
								size="large"
							/>
						</Form.Item>

						{/* --- Styled Discount Column --- */}
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

				{/* --- Section 5: Notes --- */}
				<div className="mt-6">
					<div className="flex items-center gap-2 mb-3">
						<span className="p-2 bg-slate-100 text-slate-500 rounded-lg">
							<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
							</svg>
						</span>
						<Title level={5} className="!m-0 text-slate-700">Internal Notes</Title>
					</div>

					<Form.Item
						name="order_note"
						rules={[{ max: 1000, message: "Note cannot exceed 1000 characters" }]}
					>
						<Input.TextArea
							placeholder="Add any special instructions, delivery notes, or service specifics here..."
							autoSize={{ minRows: 3, maxRows: 6 }}
							className="rounded-xl border-slate-200 hover:border-indigo-300 focus:border-indigo-500 transition-all"
						/>
					</Form.Item>
				</div>

				{/* --- Section 6: Summary & Grand Total --- */}
				<div className="bg-slate-900 p-6 rounded-2xl mt-8 flex justify-between items-center shadow-xl">
					<div>
						<Text className="text-slate-400 block text-xs uppercase font-black tracking-widest">Payable Amount</Text>
						<Form.Item
							noStyle
							shouldUpdate={(prevValues, currentValues) =>
								prevValues.services !== currentValues.services ||
								prevValues.extra_cost !== currentValues.extra_cost ||
								prevValues.discount !== currentValues.discount ||
								prevValues.discount_type !== currentValues.discount_type
							}
						>
							{({ getFieldValue }) => {
								const services = getFieldValue('services') || [];
								const extra = getFieldValue('extra_cost') || 0;
								const discount = getFieldValue('discount') || 0;
								const discountType = getFieldValue('discount_type') || 'fixed';

								// 1. Calculate base from services
								const subtotalUnits = services.reduce((acc, curr) => {
									const price = priceMap[curr?.service_id] || 0;
									const qty = curr?.number_of_unit || 0;
									return acc + (price * qty);
								}, 0);

								// 2. Calculate actual discount amount in units
								let calculatedDiscount = 0;
								if (discountType === 'fixed') {
									calculatedDiscount = discount;
								} else {
									// Percentage: (Subtotal + Extra) * %
									calculatedDiscount = (subtotalUnits + extra) * (discount / 100);
								}

								// 3. Final Business Logic
								const totalUnits = Math.round(subtotalUnits + extra - calculatedDiscount);
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
				<Divider className="my-6" />
				<div className="flex justify-between">
					<Button size="large" onClick={onCancel} className="px-8 rounded-xl border-slate-200">
						Cancel
					</Button>
					<Button
						type="primary"
						size="large"
						onClick={handleOk}
						loading={isCreatingOrder}
						className="px-10 rounded-xl bg-indigo-600 shadow-lg shadow-indigo-100 h-12"
					>
						Confirm & Create Order
					</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default CreateOrderModal;