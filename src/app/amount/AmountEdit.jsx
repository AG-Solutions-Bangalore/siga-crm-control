import React, { useEffect } from "react";
import Page from "../dashboard/page";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import BASE_URL from "@/config/BaseUrl";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Printer, FileText, Loader2 } from "lucide-react";
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

const amountSchema = z.object({
  dus_note: z.string().optional(),
  dus_status: z.string(),
});


const AmountEdit = () => {
    
const { id } = useParams();
const navigate = useNavigate();
const { toast } = useToast();
const fetchAmountEdit = async () => {
  const token = localStorage.getItem("token");
  const { data } = await axios.get(
    `${BASE_URL}/api/panel-fetch-duesreconcil-by-id/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return data.duesreconcil;
};

const { data, isLoading, error, refetch } = useQuery({
  queryKey: ["duesReconciliation"],
  queryFn: fetchAmountEdit,
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
  resolver: zodResolver(amountSchema),
  defaultValues: {
    dus_note: "",
    dus_status: "Pending",
  },
});

// Populate form when data is loaded
useEffect(() => {
  if (data) {
    // Map API data to form values
    form.reset({
      dus_note: data.dus_note || "",
      dus_status: data.dus_status || "Pending",
    });
  }
}, [data, form.reset]);
// Update mutation for API submission
const updateAmountMutation = useMutation({
  mutationFn: async (data) => {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `${BASE_URL}/api/panel-update-duesreconcil/${id}`,
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
      title: "Amount Updated",
      description: "Your Amount has been successfully updated.",
      variant: "default",
    });
    navigate("/amount");
  },
  onError: (error) => {
    toast({
      title: "Error",
      description: "Failed to update Amount. Please try again.",
      variant: "destructive",
    });
    console.error("Amount Update Error:", error);
  },
});

// Form submission handler
const onSubmit = (data) => {
  updateAmountMutation.mutate(data);
};
const handleAttachmentView = (attachmentUrl) => {
    window.open(attachmentUrl, "_blank");
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
          Loading Amount Edit
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
            Error Fetching Amount Edit
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
      {/* job edit view  */}
      <div className="container mx-auto p-4">
        <Card className="w-full relative ">
          <div>
            <CardHeader className="  flex flex-row justify-between items-center">
              <CardTitle>Dues Reconciliation Edit</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Company Details */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Company Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <InfoItem label="Due Amount" value={`₹ ${data.due_amount}`} />
                  <InfoItem label="Pending Since" value={data.pending_from} />
                  <InfoItem label="Status" value={handleCompanyStatusLabel(data.dus_status)} />
                </div>
              </div>

              <Separator className="my-4" />

              {/* Attachments */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Attachments</h3>
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() =>
                      handleAttachmentView(
                        `https://agsrebuild.store/public/app_images/ledger/${data.ledger}`
                      )
                    }
                    className="flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" /> Ledger
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      handleAttachmentView(
                        `https://agsrebuild.store/public/app_images/authorisation_letter/${data.authorisation_letter}`
                      )
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
      {/* job edit action  */}
      <div className="container mx-auto p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              {/* remarks  */}
              <FormField
                control={form.control}
                name="dus_note"
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
                name="dus_status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount Status</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        form.setValue("dus_status", value);
                      }}
                      value={form.watch("dus_status") || "Pending"}
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
                disabled={updateAmountMutation.isPending}
              >
                {updateAmountMutation.isPending
                  ? "Updating..."
                  : "Update Amount"}
              </Button>

              <Button
                onClick={() => navigate("/amount")}
                className="w-full "
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
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
export default AmountEdit;
