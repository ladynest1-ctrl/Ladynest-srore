import { PrismaClient } from "@prisma/client";

// Prisma client ko yahan initialize karna behtar hai agar file level par masla ho
const prisma = new PrismaClient();

// Is line se Next.js hamesha fresh data fetch karega, purana cache nahi dikhayega
export const revalidate = 0; 

export default async function AdminMessages() {
  // Database se messages fetch karna
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-10 p-6">
      <header className="border-b border-white/5 pb-8">
        <h1 className="text-4xl font-serif text-white uppercase tracking-tighter">
          Customer <span className="text-[#C5A25D]">Inquiries</span>
        </h1>
        <p className="text-gray-500 text-[10px] uppercase tracking-[0.4em] mt-2 font-bold italic font-sans">
          Direct messages from the concierge portal
        </p>
      </header>

      <div className="overflow-x-auto bg-[#0A0A0A] rounded-lg border border-white/5">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-[#C5A25D] text-[10px] uppercase tracking-widest font-bold">
              <th className="py-4 px-4">Date</th>
              <th className="py-4 px-4">Client</th>
              <th className="py-4 px-4">Subject</th>
              <th className="py-4 px-4">Message Body</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-sans">
            {messages.length > 0 ? (
              messages.map((msg) => (
                <tr key={msg.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="py-6 px-4 text-gray-500 text-[11px]">
                    {new Date(msg.createdAt).toLocaleDateString('en-PK', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </td>
                  <td className="py-6 px-4">
                    <div className="text-white text-sm font-medium">{msg.name}</div>
                    <div className="text-gray-600 text-[10px] tracking-tight">{msg.email}</div>
                  </td>
                  <td className="py-6 px-4 text-[#C5A25D] text-xs font-medium uppercase tracking-wider">
                    {msg.subject || "General Inquiry"}
                  </td>
                  <td className="py-6 px-4 text-gray-400 text-[13px] font-light leading-relaxed max-w-sm whitespace-pre-wrap">
                    {msg.message}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-20 text-center text-gray-700 italic tracking-widest text-sm font-sans">
                  No messages in the vault yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}