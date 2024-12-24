import React, { useRef } from 'react'
import Page from '../dashboard/page'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '@/config/BaseUrl';
import { useQuery } from "@tanstack/react-query";
import ReactToPrint from "react-to-print";
import { 
    Building2, 
    Phone, 
    Mail, 
    Globe, 
    User, 
    MapPin, 
    Tag, 
    ShoppingBag, 
    Printer, 
    FileAxis3D,
    Loader2,
    Calendar,
    BarChart2,
    Briefcase,
    Shield,
    FileText
  } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import moment from 'moment';
import { Badge } from "@/components/ui/badge";
const DirectoryView = () => {
    const { id } = useParams(); 
    const printRef = useRef(null);
  
    const fetchDirectoryView = async () => {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `${BASE_URL}/api/panel-fetch-directory-by-id/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return data.directory;
    };
    const { data, isLoading, error,refetch } = useQuery({
      queryKey: ["directory"],
      queryFn: fetchDirectoryView,
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
        <div className=" relative container mx-auto px-4 py-6">
        <div className=' absolute right-10 top-10 '>
        <ReactToPrint
                  trigger={() => (
                    <Button variant="outline" size="sm" className="mt-4 md:mt-0">
                      <Printer className="mr-2 h-4 w-4" /> Print Directory
                    </Button>
                  )}
                  content={() => printRef.current}
                  documentTitle={`Directory-${data.name_of_firm}`}
            pageStyle={`
              @page {
                size: auto;
                margin: 2mm;
              }
              @media print {
                body {
                  border: 1px solid #000;
                  margin: 1mm;
                  padding: 1mm;
                  min-height:100vh
                }
                .print-hide {
                  display: none;
                }
              }
            `}
                />
        </div>
          <Card 
            ref={printRef} 
            className="w-full shadow-2xl rounded-xl print:shadow-none print:rounded-none overflow-hidden"
          >
            {/* Header Section */}
            <div className="bg-gradient-to-r from-primary to-primary/10 text-white p-6">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="flex items-center space-x-6">
                  {data.image && (
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white print:shadow-none shadow-lg">
                      <img 
                        src={`https://agsrebuild.store/public/app_images/directory/${data.image}`} 
                        alt={`${data.name_of_firm} Logo`} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{data.name_of_firm}</h1>
                    <Badge variant="secondary" className="text-sm">
                      {data.membership_category}
                    </Badge>
                  </div>
                </div>
                
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 p-6">
              {/* Contact Information */}
              <div className="bg-secondary/10 p-5 print:rounded-none rounded-lg">
                <h2 className="text-xl font-semibold mb-4 flex  items-center text-primary">
                  <User className="mr-3 h-6 w-6" /> Contact Information
                </h2>
                <div className="space-y-3 print:grid print:grid-cols-2 print:gap-1">
                  <DetailRow 
                    // icon={<User className="mr-2 h-5 w-5 text-muted-foreground" />} 
                    label="Contact Person" 
                    value={data.contact_person} 
                  />
                
              
                  <DetailRow 
                    // icon={<Phone className="mr-2 h-5 w-5 text-muted-foreground" />} 
                    label="Office Phone" 
                    value={data.office_ph_no} 
                  />
                  <DetailRow 
                    // icon={<Phone className="mr-2 h-5 w-5 text-muted-foreground" />} 
                    label="Cell Phone" 
                    value={data.cell_no} 
                  />
                      <DetailRow 
                    // icon={<Mail className="mr-2 h-5 w-5 text-muted-foreground" />} 
                    label="Email" 
                    value={data.mail_id} 
                  />
                  {data.fax_no && (
                    <DetailRow 
                    //   icon={<FileAxis3D className="mr-2 h-5 w-5 text-muted-foreground" />} 
                      label="Fax" 
                      value={data.fax_no} 
                    />
                  )}
                  {data.website && (
                    <DetailRow 
                    //   icon={<Globe className="mr-2 h-5 w-5 text-muted-foreground" />} 
                      label="Website" 
                      value={data.website} 
                    />
                  )}
                   <div className='print:col-span-2'>
                   <DetailRow 
                    // icon={<MapPin className="mr-2 h-5 w-5 text-muted-foreground" />} 
                    label="Address" 
                    value={data.contact_address} 
                  />
                   </div>
                </div>
              </div>

              {/* Business Details */}
              <div className="bg-secondary/10 p-5 print:rounded-none rounded-lg">
                <h2 className="text-xl font-semibold mb-4 flex items-center text-primary">
                  <ShoppingBag className="mr-3 h-6 w-6" /> Business Details
                </h2>
                <div className="space-y-3 print:grid print:grid-cols-3 print:gap-1">
                  <DetailRow 
                    // icon={<BarChart2 className="mr-2 h-5 w-5 text-muted-foreground" />} 
                    label="Nature of Business" 
                    value={data.nature_of_business} 
                  />
                  <DetailRow 
                    // icon={<Briefcase className="mr-2 h-5 w-5 text-muted-foreground" />} 
                    label="Manufacturers" 
                    value={data.manufacturers} 
                  />
                  <DetailRow 
                    // icon={<Tag className="mr-2 h-5 w-5 text-muted-foreground" />} 
                    label="Brands" 
                    value={data.brands} 
                  />
                </div>
              </div>

              {/* Additional Information */}
              <div className="bg-secondary/10 p-5 print:rounded-none rounded-lg">
                <h2 className="text-xl font-semibold mb-4 flex items-center text-primary">
                  <Shield className="mr-3 h-6 w-6" /> Additional Details
                </h2>
                <div className="space-y-3 print:grid print:grid-cols-3 print:gap-1">
                  {!data.year_of_establishment && (
                    <DetailRow 
                    //   icon={<Calendar className="mr-2 h-5 w-5 text-muted-foreground" />} 
                      label="Year of Establishment" 
                      value={data.year_of_establishment} 
                    />
                  )}
                  {!data.tin_number && (
                    <DetailRow 
                    //   icon={<FileText className="mr-2 h-5 w-5 text-muted-foreground" />} 
                      label="TIN Number" 
                      value={data.tin_number} 
                    />
                  )}
                  {!data.ssi_registration_number && (
                    <DetailRow 
                    //   icon={<FileText className="mr-2 h-5 w-5 text-muted-foreground" />} 
                      label="SSI Registration" 
                      value={data.ssi_registration_number} 
                    />
                  )}
                  {!data.dgtd_number && (
                    <DetailRow 
                    //   icon={<FileText className="mr-2 h-5 w-5 text-muted-foreground" />} 
                      label="DGTD Number" 
                      value={data.dgtd_number} 
                    />
                  )}
                  {!data.gst && (
                    <DetailRow 
                    //   icon={<FileText className="mr-2 h-5 w-5 text-muted-foreground" />} 
                      label="GST" 
                      value={data.gst} 
                    />
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
   </Page>
  )
}
// Reusable Detail Row Component
const DetailRow = ({ icon, label, value }) => (
    <div className="flex items-start">
      {icon}
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value || 'Not Provided'}</p>
      </div>
    </div>
  );
export default DirectoryView