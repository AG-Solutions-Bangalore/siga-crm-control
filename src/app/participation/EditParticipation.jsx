import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Checkbox } from "@/components/ui/checkbox";
import Page from "../dashboard/page";
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
import { useNavigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import BASE_URL from "@/config/BaseUrl";
import CalculateAmountDialog from "./CalculateAmountDialog";

const CATEGORY_OPTIONS = [
  { id: "category_men", label: "Men" },
  { id: "category_women", label: "Women" },
  { id: "category_kids", label: "Kids" },
  { id: "category_accessories", label: "Accessories" },
];

const ADVERTISE_OPTIONS = [
  { id: "fair_guide", label: "Fair Guide" },
  { id: "branding_at_venue", label: "Branding at Venue" },
  { id: "fashion_show", label: "Fashion Show" },
  { id: "be_an_sponsor", label: "Be a Sponsor" },
];

const PROFILE_STATUS_OPTIONS = [
  { value: "Pending", label: "Pending" },
  { value: "Confirm", label: "Confirm" },
  { value: "Cancel", label: "Cancel" },
  { value: "Stall Issued", label: "Stall Issued" },
];

const participationSchema = z.object({
  name_of_firm: z.string().min(1, "Firm name is required"),
  gst_no: z.string().optional(),
  brand_name: z.string().min(1, "Brand name is required"),

  // Individual category fields
  category_men: z.string(),
  category_women: z.string(),
  category_kids: z.string(),
  category_accessories: z.string(),

  // Individual advertise fields
  fair_guide: z.string(),
  branding_at_venue: z.string(),
  fashion_show: z.string(),
  be_an_sponsor: z.string(),

  product_description: z.string().min(1, "Product description is required"),
  manufacturer_name: z.string().optional(),
  distributor_agent_name: z.string().optional(),
  distributor_agent_address: z
    .string()
    .min(1, "Participant Address is required"),

  rep1_name: z.string().min(1, "Contact name is required"),
  rep1_mobile: z.string().min(1, "Contact mobile is required"),
  rep2_name: z.string().optional(),
  rep2_mobile: z.string().optional(),

  profile_email: z.string().email("Invalid email address").optional(),
  profile_website: z.string().optional(),

  stall_type: z.string().optional(),
  profile_stall_size: z.string().optional(),
  profile_stall_no: z.string().optional(),
  profile_amount: z
    .string()
    .transform((val) => (val === "" ? undefined : Number(val)))
    .pipe(z.number().optional()),
  profile_payment: z.string().optional(),
  profile_remark: z.string().optional(),
  profile_new_stall_no: z.string().optional(),
  profile_received_amt: z.string().optional(),
  distributor_agent_city: z.string().min(1, "City  is required"),
  distributor_agent_state: z.string().min(1, "State  is required"),

  // New field for status
  profile_status: z
    .enum(["Pending", "Confirm", "Cancel", "Stall Issued"])
    .optional(),
});

const EditParticipation = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch participant data
  const { data: participantData, isLoading } = useQuery({
    queryKey: ["participant", id],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-participant-by-id/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.participant;
    },
  });

  // state data fetch query
  const { data: stateData } = useQuery({
    queryKey: ["states"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/api/panel-fetch-state`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.state;
    },
  });
 
  const form = useForm({
    resolver: zodResolver(participationSchema),
    defaultValues: {
      name_of_firm: "",
      gst_no: "",
      brand_name: "",
      category_men: "No",
      category_women: "No",
      category_kids: "No",
      category_accessories: "No",
      fair_guide: "No",
      branding_at_venue: "No",
      fashion_show: "No",
      be_an_sponsor: "No",
      product_description: "",
      manufacturer_name: "",
      distributor_agent_name: "",
      distributor_agent_address: "",
      rep1_name: "",
      rep1_mobile: "",
      rep2_name: "",
      rep2_mobile: "",
      profile_email: "",
      profile_website: "",
      stall_type: "",
      profile_stall_size: "",
      profile_stall_no: "",
      profile_amount: "",
      profile_payment: "",
      profile_remark: "",
      profile_new_stall_no: "",
      profile_received_amt: "",
      distributor_agent_city: "",
      distributor_agent_state: "",
      profile_status: "Pending",
    },
  });

  // Populate form when data is loaded
  useEffect(() => {
    if (participantData) {
      // Map API data to form values
      form.reset({
        name_of_firm: participantData.name_of_firm || "",
        gst_no: participantData.gst_no || "",
        brand_name: participantData.brand_name || "",
        category_men: participantData.category_men || "No",
        category_women: participantData.category_women || "No",
        category_kids: participantData.category_kids || "No",
        category_accessories: participantData.category_accessories || "No",
        fair_guide: participantData.fair_guide || "No",
        branding_at_venue: participantData.branding_at_venue || "No",
        fashion_show: participantData.fashion_show || "No",
        be_an_sponsor: participantData.be_an_sponsor || "No",
        product_description: participantData.product_description || "",
        manufacturer_name: participantData.manufacturer_name || "",
        distributor_agent_name: participantData.distributor_agent_name || "",
        distributor_agent_address:
          participantData.distributor_agent_address || "",
        rep1_name: participantData.rep1_name || "",
        rep1_mobile: participantData.rep1_mobile || "",
        rep2_name: participantData.rep2_name || "",
        rep2_mobile: participantData.rep2_mobile || "",
        profile_email: participantData.profile_email || "",
        profile_website: participantData.profile_website || "",
        stall_type: participantData.stall_type || "",
        profile_stall_size: participantData.profile_stall_size || "",
        profile_stall_no: participantData.profile_stall_no || "",
        profile_amount: participantData.profile_amount.toString() || "",
        profile_payment: participantData.profile_payment || "",
        profile_remark: participantData.profile_remark || "",
        profile_new_stall_no: participantData.profile_new_stall_no || "",
        profile_received_amt: participantData.profile_received_amt || "",
        distributor_agent_city: participantData.distributor_agent_city || "",
        distributor_agent_state: participantData.distributor_agent_state || "",
        profile_status: participantData.profile_status || "Pending",
      });
    }
  }, [participantData, form.reset]);

  // Render method for categories with individual checkbox handling
  const renderCategoryCheckboxes = () => (
    <FormItem>
      <FormLabel>Categories</FormLabel>
      <div className="flex flex-wrap gap-4">
        {CATEGORY_OPTIONS.map((option) => (
          <FormField
            key={option.id}
            control={form.control}
            name={option.id}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={option.id}
                      checked={field.value === "Yes"}
                      onCheckedChange={(checked) => {
                        form.setValue(option.id, checked ? "Yes" : "No");
                      }}
                    />
                    <label
                      htmlFor={option.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {option.label}
                    </label>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
        ))}
      </div>
    </FormItem>
  );

  // Render method for advertise options with individual checkbox handling
  const renderAdvertiseCheckboxes = () => (
    <FormItem className="md:col-span-2">
      <FormLabel>Advertise Options</FormLabel>
      <div className="flex flex-wrap gap-4">
        {ADVERTISE_OPTIONS.map((option) => (
          <FormField
            key={option.id}
            control={form.control}
            name={option.id}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={option.id}
                      checked={field.value === "Yes"}
                      onCheckedChange={(checked) => {
                        form.setValue(option.id, checked ? "Yes" : "No");
                      }}
                    />
                    <label
                      htmlFor={option.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {option.label}
                    </label>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
        ))}
      </div>
    </FormItem>
  );

  // Update mutation for API submission
  const updateParticipationMutation = useMutation({
    mutationFn: async (data) => {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${BASE_URL}/api/panel-update-participant/${id}`,
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
        title: "Participation Updated",
        description: "Your participation has been successfully updated.",
        variant: "default",
      });
      navigate("/participation");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update participation. Please try again.",
        variant: "destructive",
      });
      console.error("Participation Update Error:", error);
    },
  });

  // Form submission handler
  const onSubmit = (data) => {
    updateParticipationMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <Page>
        <div className="flex justify-center items-center h-full">
          <Button disabled>
            <Loader2 className=" h-4 w-4 animate-spin" />
            Loading Edit Participation
          </Button>
        </div>
      </Page>
    );
  }
  return (
    <Page>
      <div className="mx-auto px-4 py-0 md:py-8">
        <h1 className="text-2xl font-bold mb-6">Edit Participation</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="name_of_firm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name of Participant</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Participant name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gst_no"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GST Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter GST number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="brand_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter brand name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Partcipants Address  Details */}
              <FormField
                control={form.control}
                name="distributor_agent_address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Participant Address </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Participant Address "
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Manufacturer Details */}
              <FormField
                control={form.control}
                name="manufacturer_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Manufacturer Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter manufacturer name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Distributed/Agent  Details */}
              <FormField
                control={form.control}
                name="distributor_agent_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Distributor/Agent Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Distributor/Agent name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Category Selection */}

              {renderCategoryCheckboxes()}

              {/* Product Details */}
              <FormField
                control={form.control}
                name="product_description"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Product</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your products"
                        className="resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Contact Details */}
              <FormField
                control={form.control}
                name="rep1_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter contact name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rep1_mobile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Mobile</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter contact mobile" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email and Website */}
              <FormField
                control={form.control}
                name="profile_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter email address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="profile_website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter website URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Advertise */}

              {renderAdvertiseCheckboxes()}

              {/* Stall Size Details */}
              <div>
              <FormField
                control={form.control}
                name="profile_stall_size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stall Size</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter stall size" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <CalculateAmountDialog form={form} />
              </div>
              {/* stall no  */}
              <FormField
                control={form.control}
                name="profile_stall_no"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Stalls</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter stall no" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* amount Details */}
              <FormField
                control={form.control}
                name="profile_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Amount"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === "" ? "" : value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            {/* payment detaisl  */}
              <FormField
                control={form.control}
                name="profile_payment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Details</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter payment details" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* New Stall No  */}
              <FormField
                control={form.control}
                name="profile_new_stall_no"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Stall No</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter stall no details" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Received Amount  */}
              <FormField
                control={form.control}
                name="profile_received_amt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Received Amount</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Received Amount details"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* city  */}
              <FormField
                control={form.control}
                name="distributor_agent_city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter City details" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Add state dropdown */}
              <FormField
                control={form.control}
                name="distributor_agent_state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select State" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {stateData?.map((item) => (
                          <SelectItem key={item.state} value={item.state}>
                            {item.state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* // In the status field rendering */}
              <FormField
                control={form.control}
                name="profile_status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Participation Status</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        form.setValue("profile_status", value);
                      }}
                      value={form.watch("profile_status") || "Pending"}
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
              {/* Additional Remarks */}
              <FormField
                control={form.control}
                name="profile_remark"
                render={({ field }) => (
                  <FormItem className="md:col-span-3">
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
            </div>

            <div className="flex flex-row mt-6 gap-6">
              <Button
                type="submit"
                className="w-full "
                disabled={updateParticipationMutation.isPending}
              >
                {updateParticipationMutation.isPending
                  ? "Updating..."
                  : "Update Participant"}
              </Button>

              <Button
                onClick={() => navigate("/participation")}
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

export default EditParticipation;
