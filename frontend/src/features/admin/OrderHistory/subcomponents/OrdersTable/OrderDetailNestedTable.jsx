import { Table, Tag, Spin, Empty } from 'antd';
import { UserOutlined, ShopOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useGetOrderDetailsQuery } from '../../ordersApiSlice.js';

const OrderDetailNestedFragment = ({ id }) => {
	const { data, isLoading, isFetching } = useGetOrderDetailsQuery({ order_id: id });

	if (isLoading || isFetching) return <div className="p-6 text-center"><Spin /></div>;
	if (!data) return <div className="p-6"><Empty description="No details found" /></div>;

	const {
		customer,
		handler,
		discount,
		discount_type,
		extra_cost,
		total_service_cost,
		order_note,
		services
	} = data;

	const serviceColumns = [
		{
			title: 'Service Name',
			dataIndex: 'name',
			key: 'name',
			render: (text) => <span className="font-medium text-slate-700">{text}</span>
		},
		{
			title: 'Units',
			dataIndex: 'units',
			key: 'units',
			align: 'center',
			className: 'text-slate-500'
		},
		{
			title: 'Total',
			dataIndex: 'cost',
			key: 'cost',
			align: 'right',
			render: (price) => <span className="font-mono">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price * 1000)}</span>
		},
	];

	return (
		<div className="bg-slate-50 p-5 border-y border-slate-200">
			{/* Top Row: Meta Information */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

				{/* Customer Section */}
				<section className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
					<div className="flex items-center gap-2 mb-3 text-indigo-600 font-bold text-xs uppercase tracking-wider">
						<UserOutlined /> Customer Info
					</div>
					<div className="space-y-2 text-sm text-slate-600">
						<div className="flex justify-between border-b border-slate-50 pb-1">
							<span className="text-slate-400">Name</span>
							<span className="font-semibold text-slate-800">{customer?.name || 'N/A'}</span>
						</div>
						<div className="flex justify-between border-b border-slate-50 pb-1">
							<span className="text-slate-400">Phone</span>
							<span>{customer?.phone || 'N/A'}</span>
						</div>
						<div className="pt-1">
							<span className="text-slate-400 block text-xs">Delivery Address</span>
							<span className="text-slate-700 leading-relaxed">{customer?.address || 'N/A'}</span>
						</div>
					</div>
				</section>

				{/* Handler Section */}
				<section className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
					<div className="flex items-center gap-2 mb-3 text-emerald-600 font-bold text-xs uppercase tracking-wider">
						<ShopOutlined /> Assigned Handler
					</div>
					<div className="space-y-2 text-sm text-slate-600">
						<div className="flex justify-between border-b border-slate-50 pb-1">
							<span className="text-slate-400">Staff</span>
							<span className="font-semibold text-slate-800">{handler?.name || 'N/A'}</span>
						</div>
						<div className="flex justify-between border-b border-slate-50 pb-1">
							<span className="text-slate-400">Role</span>
							<Tag color="default" className="m-0 text-[10px] uppercase">{handler?.role}</Tag>
						</div>
						<div className="flex justify-between">
							<span className="text-slate-400">Contact</span>
							<span>{handler?.phone || 'N/A'}</span>
						</div>
					</div>
				</section>

				{/* Notes & Summary */}
				<section className="flex flex-col justify-between">
					<div className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex-grow mb-4">
						<div className="flex items-center gap-2 mb-1 text-amber-700 font-bold text-xs uppercase tracking-wider">
							<InfoCircleOutlined /> Order Note
						</div>
						<p className="text-sm text-amber-800/80 italic line-clamp-3">
							{order_note || "No specific instructions provided."}
						</p>
					</div>
					<div className="px-2">
						<div className="flex justify-between text-xs text-slate-400">
							<span>Adjustment (Extra/Disc):</span>
							<span className="text-slate-600 text-sm">
								+{`${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(extra_cost * 1000)}`} /
								-{(discount_type === 'fixed' || discount === 0) ? `${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(discount * 1000)}` :
									`${discount}%`}
							</span>
						</div>
						<div className="flex justify-between items-baseline mt-1">
							<span className="text-sm font-bold text-slate-700">Service Total:</span>
							<span className="text-xl font-black text-indigo-600">{`${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total_service_cost * 1000)}`}</span>
						</div>
					</div>
				</section>
			</div>

			{/* Services Table */}
			<div className="rounded-lg border border-slate-200 overflow-hidden shadow-sm bg-white">
				<Table
					dataSource={services || []}
					rowKey="service_id"
					columns={serviceColumns}
					pagination={false}
					size="middle"
					className="ant-table-custom-header"
				/>
			</div>
		</div>
	);
};

export default OrderDetailNestedFragment;