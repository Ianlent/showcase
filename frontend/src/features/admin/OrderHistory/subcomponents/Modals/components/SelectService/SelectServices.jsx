import { useState } from "react";
import { Form, Button, InputNumber, Typography, Divider } from "antd";
import { PlusOutlined, DeleteOutlined, ShoppingCartOutlined, DollarOutlined } from "@ant-design/icons";
import ServiceItemSelector from "./ServiceItemSelector.jsx";

const { Text } = Typography;

const SelectServices = ({ priceMap, onPriceDiscovered }) => {
	const servicesWatch = Form.useWatch("services") || [];
	const selectedIds = servicesWatch.map(s => s?.service_id).filter(Boolean);

	return (
		<div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
			<div className="flex items-center gap-2 mb-4">
				<ShoppingCartOutlined className="text-indigo-500" />
				<Text className="font-bold text-slate-700 uppercase tracking-tight">Order Services</Text>
			</div>

			<Form.List name="services" rules={[{ required: true, message: "Please add at least one service!" }]}>
				{(fields, { add, remove }) => (
					<>
						{fields.map(({ key, name, ...restField }) => (
							<div key={key} className="relative bg-white p-4 rounded-lg border border-slate-200 shadow-sm mb-3 transition-all hover:border-indigo-300">
								<div className="grid grid-cols-12 gap-4 items-start">

									<div className="col-span-12 md:col-span-6">
										<ServiceItemSelector
											name={name}
											restField={restField}
											selectedIds={selectedIds}
											onPriceDiscovered={onPriceDiscovered}
										/>
									</div>

									<div className="col-span-5 md:col-span-2">
										<Form.Item
											{...restField}
											name={[name, "number_of_unit"]} // Unified name
											rules={[{ required: true, message: "Required" }]}
											noStyle
										>
											<InputNumber
												min={1}
												size="large"
												className="w-full rounded-md"
												addonBefore={<span className="text-[10px]">QTY</span>}
											/>
										</Form.Item>
									</div>

									{/* ROW SUBTOTAL (Specific to this line) */}
									<div className="col-span-5 md:col-span-3 flex items-center justify-end h-10">
										<Form.Item noStyle shouldUpdate>
											{({ getFieldValue }) => {
												const serviceId = getFieldValue(['services', name, 'service_id']);
												const qty = getFieldValue(['services', name, 'number_of_unit']) || 0;
												const price = priceMap[serviceId] || 0;
												const subtotal = price * qty;

												return (
													<div className="text-right">
														<Text className="text-lg font-mono font-bold text-emerald-600">
															{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(subtotal * 1000)}
														</Text>
													</div>
												);
											}}
										</Form.Item>
									</div>

									<div className="col-span-2 md:col-span-1 flex justify-end">
										<Button
											type="text"
											size="large"
											className="text-slate-300 hover:text-red-500 hover:bg-red-50"
											onClick={() => remove(name)}
											icon={<DeleteOutlined />}
										/>
									</div>
								</div>
							</div>
						))}

						<Button
							type="dashed"
							onClick={() => add({ number_of_unit: 1 })} // Set default qty
							block
							size="large"
							icon={<PlusOutlined />}
							className="h-12 border-2 border-indigo-100 text-indigo-500 hover:text-indigo-600 hover:border-indigo-300 rounded-xl mb-4"
						>
							Add Service Line Item
						</Button>

						{/* GRAND TOTAL SECTION (Bottom of list) */}
						<div className="bg-slate-900 p-4 rounded-xl flex justify-between items-center shadow-lg shadow-slate-200">
							<div className="flex items-center gap-2 text-white">
								<DollarOutlined className="text-emerald-400" />
								<Text className="text-white uppercase text-xs font-bold tracking-widest">Total Amount</Text>
							</div>
							<Form.Item noStyle shouldUpdate>
								{({ getFieldValue }) => {
									const services = getFieldValue('services') || [];
									const grandTotal = services.reduce((acc, curr) => {
										const price = priceMap[curr?.service_id] || 0;
										const qty = curr?.number_of_unit || 0;
										return acc + (price * qty);
									}, 0);

									return (
										<Text className="text-2xl font-mono font-black text-white">
											{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(grandTotal * 1000)}
										</Text>
									);
								}}
							</Form.Item>
						</div>
					</>
				)}
			</Form.List>
		</div>
	);
};

export default SelectServices;