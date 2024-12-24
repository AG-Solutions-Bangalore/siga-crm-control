import React, { useRef } from 'react'
import Page from '../dashboard/page'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '@/config/BaseUrl';
import { useQuery } from "@tanstack/react-query";
import ReactToPrint from "react-to-print";
import { 
    Loader2, 
    User, 
    Mail, 
    Phone, 
    Printer, 
    GraduationCap, 
    Briefcase, 
    
    MapPin, 
    CarFront, 
    FileText, 
    Calendar,
    Info,
    Notebook
  } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import moment from 'moment';

const JobRequireView = () => {
    const { id } = useParams();
    const printRef = useRef(null);
  
    const fetchJobRequireView = async () => {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `${BASE_URL}/api/panel-fetch-jobrequire-by-id/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return data.jobrequire;
    };
    const { data, isLoading, error,refetch } = useQuery({
      queryKey: ["jobRequire"],
      queryFn: fetchJobRequireView,
    });
  
    const handleStaffStatusLabel = (status) => {
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
            documentTitle={`JobRequirement-${data.full_name}`}
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

          <div ref={printRef}>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <User className="h-6 w-6" /> Job Requirement Profile
              </CardTitle>
            </CardHeader>

            <CardContent>
              {/* Personal Details */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <User className="h-4 w-4" /> Personal Information
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <InfoItem 
                    // icon={<User className="h-4 w-4 text-muted-foreground" />} 
                    label="Full Name" 
                    value={data.full_name} 
                  />
                  <InfoItem 
                    label="Father's Name" 
                    value={data.father_name} 
                  />
                  <InfoItem 
                    // icon={<MapPin className="h-4 w-4 text-muted-foreground" />} 
                    label="Residing Years" 
                    value={data.residing_years} 
                  />
                  <InfoItem 
                    label="Willing to Relocate" 
                    value={data.re_locate} 
                  />
                  <div className=' col-span-2'>
                  <InfoItem 
                    label="House Address" 
                    value={data.house_address} 
                  />
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              {/* Contact Details */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3  flex items-center gap-2">
                <Phone className="h-4 w-4" /> Contact Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <InfoItem 
                    // icon={<Mail className="h-4 w-4 text-muted-foreground" />} 
                    label="Email" 
                    value={data.person_email} 
                  />
                  <InfoItem 
                    // icon={<Phone className="h-4 w-4 text-muted-foreground" />} 
                    label="Mobile" 
                    value={data.person_mobile} 
                  />
                </div>
              </div>

              <Separator className="my-4" />

              {/* Professional Details */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <GraduationCap className="h-4 w-4" /> Professional Information</h3>
                <div className="grid grid-cols-3 gap-4">
                  <InfoItem 
                    // icon={<GraduationCap className="h-4 w-4 text-muted-foreground" />} 
                    label="Education" 
                    value={data.person_education} 
                  />
                  <InfoItem 
                    // icon={<Briefcase className="h-4 w-4 text-muted-foreground" />} 
                    label="Last Employer" 
                    value={data.last_employer} 
                  />
                  <InfoItem 
                    label="Designation" 
                    value={data.designation} 
                  />
                  <InfoItem 
                    label="Job Profile" 
                    value={data.job_profile} 
                  />
                  <InfoItem 
                    label="Last Salary" 
                    value={`₹ ${data.last_salary}`} 
                  />
                  <InfoItem 
                    label="Expected Salary" 
                    value={`₹ ${data.exp_salary}`} 
                  />
                </div>
              </div>

              <Separator className="my-4" />

              {/* Additional Details */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              
                <Info className="h-4 w-4 " /> Additional Information</h3>
                <div className="grid grid-cols-3 gap-4">
                  <InfoItem 
                    label="Dependants" 
                    value={data.dependants} 
                  />
                  <InfoItem 
                    label="Driving License" 
                    value={data.have_licence === 'no' ? 'No' : 'Yes'} 
                  />
                  <InfoItem 
                    label="Driving Knowledge" 
                    value={data.know_driving} 
                  />
                  <InfoItem 
                    label="Vehicle Ownership" 
                    value={data.have_vehicle} 
                  />
                  <InfoItem 
                    // icon={<Calendar className="h-4 w-4 text-muted-foreground" />} 
                    label="Profile Validity" 
                    // value={data.staff_validity} 
                    value={moment(data.staff_validity).format('DD-MMMM-YYYY')}
                  />
                  <InfoItem 
                    label="Profile Status" 
                    value={handleStaffStatusLabel(data.staff_status)} 
                  />
                </div>
              </div>

              {/* Additional Notes */}
              {data.lose_job && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  
                  <Briefcase className="h-4 w-4 " /> Career Objective</h3>
                  <p>{data.lose_job}</p>
                </div>
              )}
              {data.staff_note && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Notebook  className="h-4 w-4 " />Notes</h3>
                  <p>{data.staff_note}</p>
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

export default JobRequireView;
