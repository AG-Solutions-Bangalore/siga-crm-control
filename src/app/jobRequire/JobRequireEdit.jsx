import React, { useEffect } from 'react'
import Page from '../dashboard/page'
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import BASE_URL from "@/config/BaseUrl";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
import moment from "moment";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";




const PROFILE_STATUS_OPTIONS = [
    { value: "0", label: "Pending" },
    { value: "1", label: "Active" },
    { value: "2", label: "Expired" },
  ];
  
  const jobRequireSchema = z.object({
      staff_note: z.string().optional(),
      staff_status: z.string(),
  });

const JobRequireEdit = () => {
    const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fetchJobRequireEdit = async () => {
    const token = localStorage.getItem("token");
    const { data } = await axios.get(
      `${BASE_URL}/api/panel-fetch-jobrequire-by-id/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data.jobrequire;
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["jobRequire"],
    queryFn: fetchJobRequireEdit,
  });

  const handleStaffStatusLabel = (status) => {
    switch (status) {
      case "0":
        return "Pending";
      case "1":
        return "Active";
      case "2":
        return "Expired";
      default:
        return "Unknown";
    }
  };

  const form = useForm({
    resolver: zodResolver(jobRequireSchema),
    defaultValues: {
      staff_note: "",
      staff_status: "Pending",
    },
  });

  // Populate form when data is loaded
  useEffect(() => {
    if (data) {
      // Map API data to form values
      form.reset({
        staff_note: data.staff_note || "",
        staff_status: data.staff_status || "Pending",
      });
    }
  }, [data, form.reset]);
  // Update mutation for API submission
  const updateJobRequireMutation = useMutation({
    mutationFn: async (data) => {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${BASE_URL}/api/panel-update-jobrequire/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast({
        title: "Job Require Updated",
        description: "Your Job Require has been successfully updated.",
        variant: "default",
      });
      navigate("/job-require");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update Job Require. Please try again.",
        variant: "destructive",
      });
      console.error("Job Require Update Error:", error);
    },
  });

  // Form submission handler
  const onSubmit = (data) => {
    updateJobRequireMutation.mutate(data);
  };

  if (!id) {
    return (
      <Page>
        <div>No ID provided</div>;
      </Page>
    );
  }
  if (isLoading)
    return (
      <Page>
        <div className="flex justify-center items-center h-full">
          <Button disabled>
            <Loader2 className=" h-4 w-4 animate-spin" />
            Loading Job Require Edit
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
              Error Fetching Job Require Edit
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
    <>
    <Page>
      {/* job edit view  */}
      <div className="container mx-auto p-4">
        <Card className="w-full relative">

          <div >
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <User className="h-6 w-6" /> Job Require Edit
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
      {/* job edit action  */}
      <div className="container mx-auto p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-4">

             
            {/* remarks  */}
            <FormField
              control={form.control}
              name="staff_note"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Additional Remarks</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter any additional remarks"
                      className="resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* // In the status field rendering */}
            <FormField
              control={form.control}
              name="staff_status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Require Status</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      form.setValue("staff_status", value);
                    }}
                    value={form.watch("staff_status") || "Pending"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PROFILE_STATUS_OPTIONS.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
             </div>
            <div className="flex flex-row mt-6 gap-6">
        <Button
          type="submit"
          className="w-full "
          disabled={updateJobRequireMutation.isPending}
        >
          {updateJobRequireMutation.isPending
            ? "Updating..."
            : "Update Job Offered"}
        </Button>

        <Button onClick={() => navigate("/job-require")} className="w-full ">
          Cancel
        </Button>
      </div>
          </form>
        </Form>
      </div>
      
    </Page>
  </>
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
  
export default JobRequireEdit