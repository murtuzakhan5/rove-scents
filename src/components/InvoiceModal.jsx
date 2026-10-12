import React from 'react';
import { X, Printer } from 'lucide-react';

export default function InvoiceModal({ order, onClose, settings }) {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white text-black rounded-xl max-w-2xl w-full p-8 shadow-2xl print:p-0 print:shadow-none print:max-w-none">
        
        {/* Screen-only Controls */}
        <div className="flex items-center justify-between border-b pb-4 mb-6 print:hidden">
          <span className="text-xs uppercase tracking-wider font-bold text-zinc-500">
            Official Courier Packing Slip & Invoice
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 rounded bg-black text-white text-xs font-bold flex items-center gap-1.5 hover:bg-zinc-800 transition"
            >
              <Printer size={14} />
              <span>Print Slip</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded hover:bg-zinc-100 text-zinc-500"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Invoice Printable Content */}
        <div className="space-y-6 text-xs">
          
          {/* Header */}
          <div className="flex items-start justify-between border-b pb-4">
            <div>
              <h2 className="text-xl font-bold font-serif tracking-widest uppercase">
                {settings?.storeName || 'ROVE SCENTS'}
              </h2>
              <p className="text-[10px] tracking-wider text-zinc-600 uppercase">
                {settings?.storeSlogan || 'SCENT YOUR STORY'}
              </p>
              <p className="text-[11px] text-zinc-600 mt-1">
                WhatsApp: {settings?.whatsappNumber || '03001234567'} | Web: rovescents.pk
              </p>
            </div>
            <div className="text-right">
              <span className="text-sm font-mono font-bold block">{order.id}</span>
              <span className="text-[11px] text-zinc-500">
                {order.date ? new Date(order.date).toLocaleDateString() : 'Today'}
              </span>
              <div className="mt-1 px-2.5 py-0.5 rounded bg-zinc-100 border text-[10px] font-bold inline-block">
                {order.paymentMethod === 'COD' ? 'CASH ON DELIVERY (COD)' : 'PAID / BANK TRANSFER'}
              </div>
            </div>
          </div>

          {/* Consignee Info Box */}
          <div className="grid grid-cols-2 gap-4 bg-zinc-50 p-3.5 rounded border">
            <div>
              <span className="text-[10px] uppercase font-bold text-zinc-500 block">Deliver To (Customer):</span>
              <p className="font-bold text-sm text-black">{order.customerName}</p>
              <p className="font-mono text-zinc-700">{order.phone}</p>
              {order.email && <p className="text-zinc-500 text-[10px]">{order.email}</p>}
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-zinc-500 block">Destination Address:</span>
              <p className="font-medium text-zinc-800">{order.address}</p>
              <p className="font-bold text-black uppercase">{order.city}, Pakistan</p>
              {order.notes && (
                <p className="text-[10px] text-zinc-600 italic mt-1">Note: {order.notes}</p>
              )}
            </div>
          </div>

          {/* Items Table */}
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-zinc-100 text-zinc-700">
                <th className="py-2 px-2 font-bold">Item Description</th>
                <th className="py-2 px-2 font-bold">Size</th>
                <th className="py-2 px-2 font-bold text-center">Qty</th>
                <th className="py-2 px-2 font-bold text-right">Price</th>
                <th className="py-2 px-2 font-bold text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {order.items?.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-2.5 px-2 font-medium">{item.name}</td>
                  <td className="py-2.5 px-2 text-zinc-600">{item.size || '50ml'}</td>
                  <td className="py-2.5 px-2 text-center font-bold">{item.quantity}</td>
                  <td className="py-2.5 px-2 text-right">Rs. {item.price?.toLocaleString()}</td>
                  <td className="py-2.5 px-2 text-right font-bold">
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Total Breakdown */}
          <div className="flex justify-end pt-2">
            <div className="w-64 space-y-1.5 border-t pt-2">
              <div className="flex justify-between text-zinc-600">
                <span>Subtotal:</span>
                <span>Rs. {order.subtotal?.toLocaleString()}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Discount ({order.couponCode}):</span>
                  <span>-Rs. {order.discount?.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-zinc-600">
                <span>Shipping:</span>
                <span>{order.deliveryCharge === 0 ? 'FREE' : `Rs. ${order.deliveryCharge}`}</span>
              </div>
              <div className="flex justify-between text-sm font-bold border-t pt-2 text-black">
                <span>Total Amount To Collect:</span>
                <span className="font-mono text-base font-extrabold">Rs. {order.total?.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="border-t pt-4 text-center text-[10px] text-zinc-500">
            Thank you for choosing {settings?.storeName || 'ROVE SCENTS'}. 14+ hours luxury sillage guaranteed.
          </div>

        </div>

      </div>
    </div>
  );
}
