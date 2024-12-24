import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

const PrintableComponent = ({ data }) => {
  const printRef = useRef(null);

  const handlePrint = () => {
    if (printRef.current) {
      const printWindow = window.open("", "_blank");
      printWindow.document.write(`
        <html>
          <head>
            <title>Print</title>
            <style>
              @page {
                size: auto;
                margin: 10mm;
              }
              body {
                margin: 0;
                padding: 10mm;
                font-family: Arial, sans-serif;
              }
            </style>
          </head>
          <body>${printRef.current.innerHTML}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  };

  return (
    <div>
      <Button onClick={handlePrint} variant="outline">
        <Printer className="h-4 w-4" /> Print
      </Button>
      <div ref={printRef}>
        {/* Content to Print */}
        <h1>Business Expansion Details</h1>
        <p>{data?.full_name || "No data"}</p>
        {/* Add your printable content here */}
      </div>
    </div>
  );
};

export default PrintableComponent;





