import React, { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Printer, FileText, Loader2 } from "lucide-react";
import Page from "../dashboard/page";
import { useParams } from "react-router-dom";
import ReactToPrint from "react-to-print";
import BASE_URL from "@/config/BaseUrl";

// API Fetch Function

const AmountView = () => {
  const { id } = useParams();
  const printRef = useRef(null);

  const fetchDuesReconciliation = async () => {
    const token = localStorage.getItem("token");
    const { data } = await axios.get(
      `${BASE_URL}/api/panel-fetch-duesreconcil-by-id/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return data.duesreconcil;
  };
  const { data, isLoading, error,refetch } = useQuery({
    queryKey: ["duesReconciliation"],
    queryFn: fetchDuesReconciliation,
  });

  const handleAttachmentView = (attachmentUrl) => {
    window.open(attachmentUrl, "_blank");
  };

  if (!id) {
    return (
        <Page>
            <div>No ID provided</div>;
        </Page>
    )
  }
  if (isLoading)
    return (
        <Page>
          <div className="flex justify-center items-center h-full">
            <Button disabled>
              <Loader2 className=" h-4 w-4 animate-spin" />
              Loading Payment View
            </Button>
          </div>
        </Page>
      );
  if (error) {
    return (
        <Page>
          <Card className="w-full max-w-md mx-auto mt-10">
            <CardHeader>
              <CardTitle className="text-destructive">
                Error Fetching Payment View
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={() => refetch()} variant="outline">
                Try Again
              </Button>
            </CardContent>
          </Card>
        </Page>
      );
  }
  return (
    <Page>
      <div className="container mx-auto p-4">
        <Card className="w-full relative ">
          <ReactToPrint
            trigger={() => (
              <Button
                variant="outline"
                size="icon"
                className="absolute top-4 right-4 z-10"
              >
                <Printer className="h-4 w-4" />
              </Button>
            )}
            content={() => printRef.current}
            documentTitle={`DuesReconciliation-${data.company_firm}`}
            pageStyle={`
                            @page {
                                size: auto;
                                margin: 2mm;
                            }
                            @media print {
                                body {
                                 border: 1px solid #000;
                                    margin: 10mm;
                                     padding: 10mm;
                                     min-height:100vh
                                }
                                .print-hide {
                                    display: none;
                                }
                            }
                        `}
          />
          <div ref={printRef}>
            <CardHeader className="  flex flex-row justify-between items-center">
              <CardTitle>Dues Reconciliation Details</CardTitle>
            
            </CardHeader>
            <CardContent>
              {/* Company Details */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Company Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <InfoItem label="Company/Firm" value={data.company_firm} />

                  <InfoItem label="Contact Name" value={data.contact_name} />
                  <InfoItem label="Mobile" value={data.contact_mobile} />
                  <InfoItem label="Email" value={data.contact_email} />
                  <InfoItem label="Address" value={data.address} />
                </div>
              </div>

              <Separator className="my-4" />

              {/* Defaulter Details */}
              <div className="mb-6 ">
                <h3 className="text-lg font-semibold mb-3">
                  Defaulter Against By
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <InfoItem label="Company/Firm" value={data.d_company_firm} />

                  <InfoItem label="Contact Name" value={data.d_contact_name} />
                  <InfoItem label="Mobile" value={data.d_contact_mobile} />
                  <InfoItem label="Email" value={data.d_contact_email} />
                  <InfoItem label="Address" value={data.d_address} />
                </div>
              </div>

              <Separator className="my-4" />

              {/* Payment Default Details */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">
                  Payment Defaulter{" "}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <InfoItem label="Due Amount" value={`₹ ${data.due_amount}`} />
                  <InfoItem label="Pending Since" value={data.pending_from} />
                </div>
              </div>

              <Separator className="my-4" />

              {/* Attachments */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Attachments</h3>
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => handleAttachmentView(`https://agsrebuild.store/public/app_images/ledger/${data.ledger}`)}
                    className="flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" /> Ledger
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      handleAttachmentView(`https://agsrebuild.store/public/app_images/authorisation_letter/${data.authorisation_letter}`)
                    }
                    className="flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" /> Authorization Letter
                  </Button>
                </div>
              </div>

              {/* Notes */}
              {data.dus_note && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Notes</h3>
                  <p>{data.dus_note}</p>
                </div>
              )}
            </CardContent>
          </div>
        </Card>
      </div>
    </Page>
  );
};

// Reusable Component for Info Display
const InfoItem = ({ label, value }) => (
  <div>
    <span className="text-muted-foreground  text-sm">{label}</span>
    <p className="font-medium whitespace-pre-line  break-words">
      {value || "N/A"}
    </p>
  </div>
);

export default AmountView;
