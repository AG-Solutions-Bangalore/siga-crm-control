import React, { useRef } from 'react'
import Page from '../dashboard/page'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '@/config/BaseUrl';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Printer, Briefcase, Loader2, MapPin, Phone, Mail, Calendar, FileText, Layers2, Info, Notebook } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import ReactToPrint from "react-to-print";
import moment from 'moment';

const JobOfferedView = () => {
    const { id } = useParams();
  const printRef = useRef(null);

  const fetchJobOfferedView = async () => {
    const token = localStorage.getItem("token");
    const { data } = await axios.get(
      `${BASE_URL}/api/panel-fetch-joboffered-by-id/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return data.joboffered;
  };
  const { data, isLoading, error,refetch } = useQuery({
    queryKey: ["jobOffered"],
    queryFn: fetchJobOfferedView,
  });

  const handleCompanyStatusLabel = (status) => {
    switch(status) {
      case "0": return "Pending";
      case "1": return "Active";
      case "2": return "Expired";
      default: return "Unknown";
    }
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
              Loading Job Offered View
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
                Error Fetching Job Offered View
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
        <Card className="w-full relative">
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
            documentTitle={`JobOffered-${data.company_name}`}
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
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-6 w-6" /> Job Offered Details
              </CardTitle>
            </CardHeader>

            <CardContent>
              {/* Company Details */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Briefcase className="h-4 w-4" /> Company Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <InfoItem 
                    label="Company Name" 
                    value={data.company_name} 
                  />
                  <InfoItem 
                    label="Company Type" 
                    value={data.company_type} 
                  />
                  <InfoItem 
                    label="Location" 
                    value={data.location} 
                  />
                  <InfoItem 
                    label="Company Address" 
                    value={data.company_address} 
                  />
                </div>
              </div>

              <Separator className="my-4" />

              {/* Job Details */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            
                <Layers2 className="h-4 w-4" />Job Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <InfoItem 
                    label="Profile" 
                    value={data.profile_employee} 
                  />
                  <InfoItem 
                    label="Approximate Experience" 
                    value={`${data.appx_exp} years`} 
                  />
                  <InfoItem 
                    label="Approximate Salary" 
                    value={data.appx_sal} 
                  />
                </div>
              </div>

              <Separator className="my-4" />

              {/* Contact Details */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Phone className="h-4 w-4" /> Contact Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <InfoItem 
                    label="Contact Name" 
                    value={data.contact_name} 
                  />
                  <InfoItem 
                    label="Mobile" 
                    value={data.contact_mobile} 
                  />
                  <InfoItem 
                    label="Email" 
                    value={data.contact_email} 
                  />
                </div>
              </div>

              <Separator className="my-4" />

              {/* Additional Details */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Info className="h-4 w-4" /> Additional Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <InfoItem 
                    label="Company Validity" 
                    
                    value={moment(data.company_validity).format('DD-MMMM-YYYY')}
                  />
                  <InfoItem 
                    label="Company Status" 
                    value={handleCompanyStatusLabel(data.company_status)} 
                  />
                </div>
              </div>

              {/* Notes */}
              {data.company_note && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Notebook className="h-4 w-4" /> Notes</h3>
                  <p>{data.company_note}</p>
                </div>
              )}
            </CardContent>
          </div>
        </Card>
      </div>
   </Page>
  )
}


// Reusable Component for Info Display
const InfoItem = ({ label, value, icon }) => (
    <div className="flex flex-col">
      <span className="text-muted-foreground text-sm flex items-center gap-2">
        {icon}
        {label}
      </span>
      <p className="font-medium whitespace-pre-line break-words mt-1">
        {value || "N/A"}
      </p>
    </div>
  );
  

export default JobOfferedView