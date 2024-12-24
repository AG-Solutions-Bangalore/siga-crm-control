import React, { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import BASE_URL from "@/config/BaseUrl";

const DetailRow = ({ label, value }) => (
  <div className="flex justify-between py-2 border-b last:border-b-0">
    <span className="text-sm text-muted-foreground">{label}</span>
    <span className="text-sm font-medium text-right">{value || "-"}</span>
  </div>
);

const ParticipationView = ({ id }) => {
  const {
    data: participantDetails,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["participantDetails", id],
    queryFn: async () => {
      // Only fetch if registrationId is available
      if (!id) return null;
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-participant-by-id/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.participant;
    },
    enabled: !!id, // Only run query if registrationId exists
  });

 

  // If no registration is selected
  if (!id) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Participant Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Select a Participant to view details
          </p>
        </CardContent>
      </Card>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <Card className="w-full  ">
        <CardHeader>
          <CardTitle>Loading Details</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (isError) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-destructive">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Unable to fetch registration details</p>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="w-full  ">
      <CardHeader className=" p-3 bg-gradient-to-r from-slate-300 via-gray-200 to-gray-100">
        <CardTitle className="text-lg font-bold">
          {participantDetails.name_of_firm}
        </CardTitle>
        <div className="flex flex-row justify-between ">
          <p className=" text-sm text-muted-foreground">
            {participantDetails.brand_name}
          </p>
          <p className=" text-sm text-muted-foreground">
            {participantDetails.profile_stall_no || "Stall No"}
          </p>
        </div>
        <div className="flex flex-row justify-between">
          <p className=" text-sm text-muted-foreground">
            {participantDetails.gst_no || "Gst No.."}
          </p>
          <p className=" text-sm text-muted-foreground">
            {participantDetails.profile_stall_size || "Stall Size"}
          </p>
        </div>
      </CardHeader>
      <CardContent className="max-h-[24rem] mt-2  overflow-y-auto">
        <div className="space-y-4   ">
          {/* Firm Information Section */}
          <div>
            <h3 className="text-lg font-semibold mb-2 border-b pb-1">
              Firm Information
            </h3>

            {/* <DetailRow label="GST Number" value={participantDetails.gst_no} /> */}
            <DetailRow
              label="Manufacturer Name"
              value={participantDetails.manufacturer_name}
            />
          </div>

          {/* Product Categories Section */}
          <div>
            <h3 className="text-lg font-semibold mb-2 border-b pb-1">
              Product Categories
            </h3>
            <div className="flex items-center gap-1 justify-between">
              <DetailRowCheck
                label="M"
                value={participantDetails.category_men}
                isCheckbox
              />
              <DetailRowCheck
                label="W"
                value={participantDetails.category_women}
                isCheckbox
              />
              <DetailRowCheck
                label="K"
                value={participantDetails.category_kids}
                isCheckbox
              />
              <DetailRowCheck
                label="A"
                value={participantDetails.category_accessories}
                isCheckbox
              />
            </div>
            <div>
              <DetailRowCheck value={participantDetails.product_description} />
            </div>
          </div>

          {/* Contact Information Section */}
          <div>
            <h3 className="text-lg font-semibold mb-2 border-b pb-1">
              Contact Information
            </h3>
            <DetailRow label="Email" value={participantDetails.profile_email} />
          </div>

          {/* Representatives Section */}
          <div>
            <h3 className="text-lg font-semibold mb-2 border-b pb-1">
              Representatives
            </h3>
            <div className="flex items-center justify-between">
              <DetailRow value={participantDetails.rep1_name} />
              <DetailRow value={participantDetails.rep1_mobile} />
            </div>
            <div className="flex items-center justify-between">
              <DetailRow value={participantDetails.rep2_name} />
              <DetailRow value={participantDetails.rep2_mobile} />
            </div>
          </div>

          {/* Fair Participation Section */}
          <div>
            <h3 className="text-lg font-semibold mb-2 border-b pb-1">
              Fair Participation Details
            </h3>
            <DetailRow
              label="Fair Guide"
              value={participantDetails.fair_guide}
            />
            <DetailRow
              label="Branding at Venue"
              value={participantDetails.branding_at_venue}
            />
            <DetailRow
              label="Fashion Show"
              value={participantDetails.fashion_show}
            />
            <DetailRow
              label="Sponsorship"
              value={participantDetails.be_an_sponsor}
            />
          </div>

          {/* Stall and Payment Section */}
          <div>
            <h3 className="text-lg font-semibold mb-2 border-b pb-1">
              Stall and Payment Details
            </h3>
            {/* <DetailRow
              label="Stall Size"
              value={participantDetails.profile_stall_size}
            />
            <DetailRow
              label="Stall Number"
              value={participantDetails.profile_stall_no}
            /> */}
            <DetailRow
              label="Amount"
              value={participantDetails.profile_amount}
            />
            <DetailRow
              label="Payment Method"
              value={participantDetails.profile_payment}
            />
            <DetailRow
              label="Remarks"
              value={participantDetails.profile_remark}
            />
            <DetailRow
              label="Status"
              value={participantDetails.profile_status}
            />
            <DetailRow
              label="New Stall Number"
              value={participantDetails.profile_new_stall_no}
            />
            <DetailRow
              label="Received Amount"
              value={participantDetails.profile_received_amt}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const DetailRowCheck = ({ label, value, isCheckbox = false }) => {
  return (
    <div className="flex justify-start gap-2 py-2 border-b last:border-b-0 items-center">
      {isCheckbox ? (
        <div
          className={`h-4 w-4 border-[1px] border-black rounded ${
            value === "Yes" ? "bg-black" : "bg-white"
          }`}
        ></div>
      ) : (
        <span className="text-sm font-medium ">{value || "-"}</span>
      )}
      {label && <span className="text-sm text-muted-foreground">{label}</span>}
    </div>
  );
};

export default ParticipationView;
