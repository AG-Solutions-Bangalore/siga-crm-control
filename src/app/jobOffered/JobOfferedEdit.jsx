import React, { useEffect } from "react";
import Page from "../dashboard/page";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import BASE_URL from "@/config/BaseUrl";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Printer,
  Briefcase,
  Loader2,
  MapPin,
  Phone,
  Mail,
  Calendar,
  FileText,
  Layers2,
  Info,
  Notebook,
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

const jobOfferedSchema = z.object({
    company_note: z.string().optional(),
    company_status: z.string(),
});

const JobOfferedEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fetchJobOfferedEdit = async () => {
    const token = localStorage.getItem("token");
    const { data } = await axios.get(
      `${BASE_URL}/api/panel-fetch-joboffered-by-id/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data.joboffered;
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["jobOffered"],
    queryFn: fetchJobOfferedEdit,
  });

  const handleCompanyStatusLabel = (status) => {
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
    resolver: zodResolver(jobOfferedSchema),
    defaultValues: {
      company_note: "",
      company_status: "Pending",
    },
  });

  // Populate form when data is loaded
  useEffect(() => {
    if (data) {
      // Map API data to form values
      form.reset({
        company_note: data.company_note || "",
        company_status: data.company_status || "Pending",
      });
    }
  }, [data, form.reset]);
  // Update mutation for API submission
  const updateJobOfferedMutation = useMutation({
    mutationFn: async (data) => {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${BASE_URL}/api/panel-update-joboffered/${id}`,
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
        title: "Job Offered Updated",
        description: "Your Job Offered has been successfully updated.",
        variant: "default",
      });
      navigate("/job-offered");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update Job Offered. Please try again.",
        variant: "destructive",
      });
      console.error("Job Offered Update Error:", error);
    },
  });

  // Form submission handler
  const onSubmit = (data) => {
    updateJobOfferedMutation.mutate(data);
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
            Loading Job Offered Edit
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
              Error Fetching Job Offered Edit
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
            <div>
              <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-6 w-6" /> Job Offered Edit
                </CardTitle>
              </CardHeader>

              <CardContent>
                {/* Company Details */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Briefcase className="h-4 w-4" /> Company Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <InfoItem label="Company Name" value={data.company_name} />
                    <InfoItem label="Company Type" value={data.company_type} />
                    <InfoItem label="Location" value={data.location} />
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
                    <Layers2 className="h-4 w-4" />
                    Job Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <InfoItem label="Profile" value={data.profile_employee} />
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
                    <Phone className="h-4 w-4" /> Contact Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <InfoItem label="Contact Name" value={data.contact_name} />
                    <InfoItem label="Mobile" value={data.contact_mobile} />
                    <InfoItem label="Email" value={data.contact_email} />
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Additional Details */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Info className="h-4 w-4" /> Additional Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <InfoItem
                      label="Company Validity"
                      value={moment(data.company_validity).format(
                        "DD-MMMM-YYYY"
                      )}
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
                      <Notebook className="h-4 w-4" /> Notes
                    </h3>
                    <p>{data.company_note}</p>
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
                name="company_note"
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
                name="company_status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Participation Status</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        form.setValue("company_status", value);
                      }}
                      value={form.watch("company_status") || "Pending"}
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
            disabled={updateJobOfferedMutation.isPending}
          >
            {updateJobOfferedMutation.isPending
              ? "Updating..."
              : "Update Job Offered"}
          </Button>

          <Button onClick={() => navigate("/job-offered")} className="w-full ">
            Cancel
          </Button>
        </div>
            </form>
          </Form>
        </div>
        
      </Page>
    </>
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

export default JobOfferedEdit;
