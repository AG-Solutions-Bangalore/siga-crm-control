import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
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
import { useNavigate } from "react-router-dom";
import BASE_URL from "@/config/BaseUrl";

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

const STALL_TYPES = {
  "Brand Wagon": [ "8x5", "6x4"],
  "Business Stall": ["6x4", "4x3"],
};

const NO_OF_STALLS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
const PRICING = {
  "Brand Wagon": {
    baseRate: 4900,
    taxRate: 0.18,
  },
  "Business Stall": {
    baseRate: 4200,
    taxRate: 0.18,
  },
};
const participationSchema = z.object({
  name_of_firm: z.string().min(1, "Firm name is required"),  
  gst_no: z.string().min(1, "GST number is required"),   
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
  manufacturer_name: z.string(), 
  distributor_agent_name: z.string(), 
  profile_website: z.string(), 
  product_description: z.string().min(1, "Product description is required"),  
  distributor_agent_address: z
    .string()
    .min(1, "Participant Address  address is required"),  
  rep1_name: z.string().min(1, "Contact name is required"),  
  rep1_mobile: z.string().min(1, "Contact mobile is required"),  

  profile_email: z.string().email("Invalid email address"),
  profile_stall_size: z.string().min(1, "Stall size is required"), 
  profile_stall_no: z.string().min(1, "Stall number is required"), 
  profile_amount: z.number().min(1, "Amount is required"), //
  profile_payment: z.string(), 
  profile_remark: z.string(), 
  profile_new_stall_no: z.string(), 
  profile_received_amt: z.string(), 

});

const CreateParticipation = () => {
  const { toast } = useToast();
  const [stallSizes, setStallSizes] = useState([]);
  const navigate = useNavigate()
  const form = useForm({
    resolver: zodResolver(participationSchema),
    defaultValues: {
      name_of_firm: "", 
      gst_no: "", 
      brand_name: "", 
      category_men:"No", 
      category_women:"No", 
      category_kids:"No", 
      category_accessories:"No", 
    fair_guide:"No", 
    branding_at_venue:"No", 
    fashion_show:"No", 
    be_an_sponsor:"No", 
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
      profile_stall_size: "", 
      profile_stall_no: "", 
      profile_amount: "", 
      profile_payment: "", 
      profile_remark: "", 
      profile_new_stall_no:"", 
      profile_received_amt:"", 
    },
  });
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
  const handleStallTypeChange = (value) => {
    setStallSizes(STALL_TYPES[value] || []);
    form.setValue("profile_stall_size", "");
    form.setValue("profile_stall_no", "");
    form.setValue("profile_amount", "");
  };

  const calculateAmount = (stallType, stallSize, stallNo) => {
    if (!stallType || !stallSize || !stallNo) return "";

    // Calculate size multiplier (multiply width and height)
    const [width, height] = stallSize.split("x").map(Number);
    const sizeMultiplier = width * height;

    // Get base pricing for the stall type
    const { baseRate, taxRate } = PRICING[stallType];

    // Calculate base amount
    const baseAmount = baseRate * sizeMultiplier * Number(stallNo);

    // Calculate tax amount separately
    const taxAmount = baseAmount * taxRate;

    // Total amount is base amount plus tax amount
    const totalAmount = baseAmount + taxAmount;

    return totalAmount;
  };

  const stallType = form.watch("stall_type");
  const stallSize = form.watch("profile_stall_size");
  const stallNo = form.watch("profile_stall_no");

  React.useEffect(() => {
    const amount = calculateAmount(stallType, stallSize, stallNo);
    form.setValue("profile_amount", amount);
  }, [stallType, stallSize, stallNo]);






  // Create mutation for API submission
  const createParticipationMutation = useMutation({
    mutationFn: async (data) => {
        const token = localStorage.getItem('token')
      const response = await axios.post(
        `${BASE_URL}/api/panel-create-participant`,
        data,
        {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast({
        title: "Participation Created",
        description: "Your participation has been successfully registered.",
        variant: "default",
      });
      form.reset();
      navigate('/participation')
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create participation. Please try again.",
        variant: "destructive",
      });
      console.error("Participation Creation Error:", error);
    },
  });

  // Form submission handler
  const onSubmit = (data) => {
    createParticipationMutation.mutate(data);
  };
  return (
    <Page>
      <div className="   mx-auto px-4 py-0 md:py-8 ">
        <h1 className="text-2xl font-bold mb-6">Create Participation</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              {/* Firm Details */}
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
                      <Input placeholder="Enter Participant Address " {...field} />
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
                      <Input placeholder="Enter Distributor/Agent name" {...field} />
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
                  <FormItem className='md:col-span-2'>
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
              {/* Stall Type Dropdown */}
              <FormField
                control={form.control}
                name="stall_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stall Type</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        handleStallTypeChange(value);
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Stall Type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.keys(STALL_TYPES).map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Stall Details */}
              <FormField
                control={form.control}
                name="profile_stall_size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stall Size</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={!form.getValues("stall_type")}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Stall Size" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {stallSizes.map((size) => (
                          <SelectItem key={size} value={size}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="profile_stall_no"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Stalls</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={!form.getValues("profile_stall_size")}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Number of Stalls" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {NO_OF_STALLS.map((number) => (
                          <SelectItem key={number} value={number}>
                            {number}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Payment Details */}
              <FormField
                control={form.control}
                name="profile_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Amount will be calculated automatically"
                        {...field}
                        readOnly
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                      <Input placeholder="Enter Received Amount details" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
                {/* Additional Remarks */}
                <FormField
                control={form.control}
                name="profile_remark"
                render={({ field }) => (
                  <FormItem className="md:col-span-2" >
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
              disabled={createParticipationMutation.isPending}
            >
              {createParticipationMutation.isPending
                ? "Submitting..."
                : "Create Participation"}
            </Button>
     
         <Button
             onClick={()=>navigate('/participation')}
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

export default CreateParticipation;
