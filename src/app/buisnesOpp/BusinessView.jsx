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

const BusinessView = () => {
    const { id } = useParams();
  const printRef = useRef(null);

  const fetchBusinessOpp = async () => {
    const token = localStorage.getItem("token");
    const { data } = await axios.get(
      `${BASE_URL}/api/panel-fetch-busopp-by-id/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return data.busopp;
  };
  const { data, isLoading, error,refetch } = useQuery({
    queryKey: ["busOppurtunity"],
    queryFn: fetchBusinessOpp,
  });

 

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
              Loading Business View
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
                Error Fetching Business View
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
            documentTitle={`BusinessExpanison-${data.full_name}`}
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
              <CardTitle>Business Expansion Details</CardTitle>
            
            </CardHeader>
            <CardContent>
              {/* Company Details */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Requested By</h3>
                <div className="grid grid-cols-2 gap-4">
                  <InfoItem label="Full Name" value={`${data.full_name} - ${data.about_you}`} />
                  <InfoItem label="Mobile" value={data.mobile_no} />
                  <InfoItem label="Email" value={data.email} />
                  <InfoItem label="Brand Name" value={data.brand_name} />
                  <InfoItem label="Product Type" value={data.product_type} />
                  {/* <InfoItem label="About You" value={data.about_you} />  */}
                  <InfoItem label="Address" value={data.address} />
                </div>
              </div>



              <Separator className="my-4" />
              <div className="mb-6 ">
                <h3 className="text-lg font-semibold mb-3">
                  Offer & Investment
                </h3>
                <div className="grid grid-cols-1 gap-4">
                <InfoItem label="Looking for" value={data.looking_for} />
                 <InfoItem label="Offer" value={data.what_you_offer} />
                  <InfoItem label="Investment Amount" value={data.investment_amount} />
                  
                </div>
              </div>

          
              <Separator className="my-4" />
              {/* Defaulter Details */}
              <div className="mb-6 ">
                <h3 className="text-lg font-semibold mb-3">
                  Other Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
               

                  <InfoItem label="Area" value={data.which_area} />
                  <InfoItem label="State" value={data.which_state} />
                  
                </div>
              </div>
             

              {/* Notes */}
              {data.buss_note && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Notes</h3>
                  <p>{data.buss_note}</p>
                </div>
              )}
            </CardContent>
          </div>
        </Card>
      </div>
  </Page>
  )
}


const InfoItem = ({ label, value }) => (
  <div>
    <span className="text-muted-foreground  text-sm">{label}</span>
    <p className="font-medium whitespace-pre-line  break-words">
      {value || "N/A"}
    </p>
  </div>
);


export default BusinessView