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
    { value: "1", label: "Cleared" },
    { value: "2", label: "Expired" },
  ];
  
  const buisnessSchema = z.object({
      buss_note: z.string().optional(),
      buss_status: z.string(),
  });


const BusinessEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const fetchBusinessEdit = async () => {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `${BASE_URL}/api/panel-fetch-busopp-by-id/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return data.busopp;
    };
  
    const { data, isLoading, error, refetch } = useQuery({
      queryKey: ["buisnessOpp"],
      queryFn: fetchBusinessEdit,
    });
  
    const handleCompanyStatusLabel = (status) => {
        switch (status) {
          case '0':
            return "Pending";
          case '1':
            return "Cleared";
          case '2':
            return "Expired";
          default:
            return "Unknown";
        }
      };
  
    const form = useForm({
      resolver: zodResolver(buisnessSchema),
      defaultValues: {
        buss_note: "",
        buss_status: "Pending",
      },
    });
  
    // Populate form when data is loaded
    useEffect(() => {
      if (data) {
        // Map API data to form values
        form.reset({
          buss_note: data.buss_note || "",
          buss_status: data.buss_status || "Pending",
        });
      }
    }, [data, form.reset]);
    // Update mutation for API submission
    const updateBuisnessMutation = useMutation({
      mutationFn: async (data) => {
        const token = localStorage.getItem("token");
        const response = await axios.put(
          `${BASE_URL}/api/panel-update-busopp/${id}`,
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
          title: "Buisness Expansion Updated",
          description: "Your Buisness Expansion has been successfully updated.",
          variant: "default",
        });
        navigate("/business-opp");
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: "Failed to update Buisness Expansion. Please try again.",
          variant: "destructive",
        });
        console.error("Buisness Expansion Update Error:", error);
      },
    });
  
    // Form submission handler
    const onSubmit = (data) => {
      updateBuisnessMutation.mutate(data);
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
              Loading Buisness Expansion Edit
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
                Error Fetching Buisness Expansion Edit
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
        <Card className="w-full relative ">
         
          <div >
            <CardHeader className="  flex flex-row justify-between items-center">
              <CardTitle>Business Expansion Edit</CardTitle>
            
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <div className="grid grid-cols-1  md:grid-cols-3 gap-4">
               

                  <InfoItem label="Area" value={data.which_area} />
                  <InfoItem label="State" value={data.which_state} />
                  <InfoItem label="Status"   value={handleCompanyStatusLabel(data.buss_status)}  />
                  
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
      {/* job edit action  */}
      <div className="container mx-auto p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-4">

             
            {/* remarks  */}
            <FormField
              control={form.control}
              name="buss_note"
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
              name="buss_status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Buisness Expansion Status</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      form.setValue("buss_status", value);
                    }}
                    value={form.watch("buss_status") || "Pending"}
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
          disabled={updateBuisnessMutation.isPending}
        >
          {updateBuisnessMutation.isPending
            ? "Updating..."
            : "Update Business Expansion"}
        </Button>

        <Button onClick={() => navigate("/business-opp")} className="w-full ">
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
const InfoItem = ({ label, value }) => (
    <div>
      <span className="text-muted-foreground  text-sm">{label}</span>
      <p className="font-medium whitespace-pre-line  break-words">
        {value || "N/A"}
      </p>
    </div>
  );
export default BusinessEdit