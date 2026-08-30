"use client";
import * as XLSX from "xlsx";
import { Download } from "lucide-react";

export default function ExportExcelButton({ data }) {
  const exportToExcel = () => {
    const excelData = data.map((order) => ({
      Order_ID: `#${order.id.toString().padStart(4, '0')}`,
      Customer: order.customerName,
      Email: order.email || "N/A", // Excel mein bhi email add kar di
      Phone: order.phone,
      Address: order.address,
      Product: order.productName,
      Variant: order.colorSelected,
      Price: order.totalPrice,
      Status: order.status || "Pending",
      Date: new Date(order.createdAt).toLocaleDateString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "LadyNest Sales");

    XLSX.writeFile(workbook, `LadyNest_Sales_Report.xlsx`);
  };

  return (
    <button
      onClick={exportToExcel}
      className="flex items-center gap-2 px-6 py-2.5 bg-[#C5A25D] text-black text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-all duration-300 rounded-sm shadow-lg"
    >
      <Download size={14} />
      Export Ledger
    </button>
  );
}