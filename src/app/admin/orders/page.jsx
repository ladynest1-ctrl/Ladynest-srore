import { PrismaClient } from "@prisma/client";
import ConfirmOrderButton from "../../../components/admin/ConfirmOrderButton"; 
import StatusDropdown from "../../../components/admin/StatusDropdown";
import ExportExcelButton from "../../../components/admin/ExportExcelButton";

const prisma = new PrismaClient();
export const revalidate = 0;

export default async function AdminOrders() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="p-6 md:p-10 text-white min-h-screen bg-[#050505]">
      <header className="border-b border-white/5 pb-8 mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-serif text-[#C5A25D] uppercase tracking-tighter">
            Sales <span className="text-white italic">Ledger</span>
          </h1>
          <p className="text-gray-500 text-[10px] uppercase tracking-[0.4em] mt-2 font-bold italic">
            Real-time order tracking and analytics
          </p>
        </div>
        <div className="flex flex-col items-end gap-4">
          <div className="text-right">
            <p className="text-[#C5A25D] text-[10px] uppercase tracking-widest font-bold">Total Orders</p>
            <p className="text-2xl font-mono">{orders.length}</p>
          </div>
          {orders.length > 0 && <ExportExcelButton data={orders} />}
        </div>
      </header>

      {orders.length > 0 ? (
        <div className="overflow-x-auto bg-[#0A0A0A] border border-white/5 rounded-sm shadow-2xl">
          <table className="w-full text-left border-collapse min-w-[1100px]">
            <thead>
              <tr className="border-b border-white/10 text-[#C5A25D] text-[10px] uppercase tracking-widest font-bold bg-white/[0.02]">
                <th className="py-5 px-6">ID / Time Info</th>
                <th className="py-5 px-6">Customer & Contact</th>
                <th className="py-5 px-6">Full Shipping Address</th>
                <th className="py-5 px-6">Product Details</th>
                <th className="py-5 px-6">Amount</th>
                <th className="py-5 px-6 text-center">Status</th>
                <th className="py-5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-sans">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-white/[0.01] transition-colors group">
                  
                  {/* Order ID, Date & EXACT TIME */}
                  <td className="py-6 px-6">
                    <div className="text-gray-500 text-[11px] font-mono">
                      #{order.id.toString().padStart(4, '0')}
                    </div>
                    <div className="text-white text-[10px] mt-1.5 font-bold tracking-tighter">
                      {new Date(order.createdAt).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </div>
                    <div className="text-[#C5A25D] text-[10px] mt-0.5 font-mono font-bold">
                      {new Date(order.createdAt).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </div>
                  </td>

                  {/* Customer Info */}
                  <td className="py-6 px-6">
                    <div className="text-white text-sm font-semibold uppercase tracking-tight">
                      {order.customerName}
                    </div>
                    <div className="text-[#C5A25D]/80 text-[10px] font-mono mt-1 select-all">
                      {order.email || "No Email"}
                    </div>
                    <div className="text-gray-300 text-[11px] mt-1 font-bold tracking-widest">
                      {order.phone}
                    </div>
                  </td>

                  {/* FULL ADDRESS */}
                  <td className="py-6 px-6 max-w-[350px]">
                    <div className="text-gray-400 text-[11px] leading-relaxed border-l-2 border-[#C5A25D]/20 pl-4 italic">
                      {order.address}
                    </div>
                  </td>

                  {/* Product Details */}
                  <td className="py-6 px-6">
                    <div className="text-[#C5A25D] text-[11px] font-bold uppercase tracking-wider">
                      {order.productName}
                    </div>
                    <div className="text-gray-500 text-[9px] mt-1 uppercase tracking-widest">
                      Color: <span className="text-gray-300 font-bold">{order.colorSelected}</span>
                    </div>
                  </td>

                  {/* Pricing */}
                  <td className="py-6 px-6">
                    <div className="text-white text-sm font-bold font-mono">Rs. {order.totalPrice}</div>
                    <div className="text-[8px] text-[#C5A25D] uppercase font-bold mt-1 tracking-widest opacity-60">
                      COD Payment
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-6 px-6 text-center">
                    <StatusDropdown orderId={order.id} currentStatus={order.status} />
                  </td>

                  {/* Action */}
                  <td className="py-6 px-6 text-right">
                    <ConfirmOrderButton order={order} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-[#0A0A0A] border border-white/5 p-24 text-center rounded-sm">
          <p className="text-gray-600 tracking-[0.3em] uppercase text-[10px] font-bold">
            Empty Ledger
          </p>
        </div>
      )}
    </div>
  );
}