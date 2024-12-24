import React, { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import BASE_URL from "@/config/BaseUrl";
import Page from '../dashboard/page';

const TestView = () => {
  const componentRef = useRef();
  const { id } = useParams();

  const {
    data: participantDetails,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["participantDetails", id],
    queryFn: async () => {
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
    enabled: !!id,
  });

  // Handle print
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Participant-${participantDetails?.name_of_firm || 'Details'}`,
    pageStyle: `
      @page {
        size: A4;
        margin: 6mm;
      }
      @media print {
        body {
        border: 1px solid #000
        margin: 2mm
        padding: 2mm
        min-height:100vh
          
        }
        
      }
    `
  });

  // Handle loading and error states
  if (!id) return <div>No Participant Selected</div>;
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching participant details</div>;

  return (
    <Page>
      <div className="container mx-auto px-4 py-8">
        <div 
          ref={componentRef} 
          className=" p-2 min-h-screen border border-gray-300 bg-white"
        >
          {/* Header */}
          <div className="border-b border-gray-300 pb-4 mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  {participantDetails.name_of_firm}
                </h1>
                <p className="text-lg text-gray-700">
                  {participantDetails.brand_name}
                </p>
                <div className="mt-2 text-sm text-gray-600">
                  <span className="mr-4">
                    GST No: {participantDetails.gst_no || 'Not Provided'}
                  </span>
                  <span>
                    Event Year: {participantDetails.event_year}
                  </span>
                </div>
              </div>
              <button 
                onClick={handlePrint} 
                className="px-4 py-2 border border-gray-400 text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Print Details
              </button>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-2 gap-6">
            {/* Company Details */}
            <DetailSection 
              title="Company Details"
              details={[
                { label: "Manufacturer", value: participantDetails.manufacturer_name },
                { label: "Brand Name", value: participantDetails.brand_name },
                { label: "GST No", value: participantDetails.gst_no || 'Not Provided' }
              ]}
            />

            {/* Contact Information */}
            <DetailSection 
              title="Contact Information"
              details={[
                { label: "Email", value: participantDetails.profile_email },
                { label: "Website", value: participantDetails.profile_website || 'Not Provided' },
                { label: "Distributor Address", value: participantDetails.distributor_agent_address }
              ]}
            />

            {/* Representatives */}
            <DetailSection 
              title="Representatives"
              details={[
                { label: "Rep 1", value: participantDetails.rep1_name },
                { label: "Mobile 1", value: participantDetails.rep1_mobile },
                { label: "Rep 2", value: participantDetails.rep2_name },
                { label: "Mobile 2", value: participantDetails.rep2_mobile }
              ]}
            />

            {/* Product Categories */}
            <DetailSection 
              title="Product Categories"
              details={[
                { label: "Product Description", value: participantDetails.product_description }
              ]}
              footer={
                <div className="mt-2 flex gap-2 text-xs">
                  {participantDetails.category_men === "Yes" && <span className="border border-gray-400 px-2 py-1">Men</span>}
                  {participantDetails.category_women === "Yes" && <span className="border border-gray-400 px-2 py-1">Women</span>}
                  {participantDetails.category_kids === "Yes" && <span className="border border-gray-400 px-2 py-1">Kids</span>}
                  {participantDetails.category_accessories === "Yes" && <span className="border border-gray-400 px-2 py-1">Accessories</span>}
                </div>
              }
            />

            {/* Event Participation */}
            <DetailSection 
              title="Event Participation"
              details={[
                { label: "Fair Guide", value: participantDetails.fair_guide },
                { label: "Branding at Venue", value: participantDetails.branding_at_venue },
                { label: "Fashion Show", value: participantDetails.fashion_show },
                { label: "Sponsorship", value: participantDetails.be_an_sponsor }
              ]}
            />

            {/* Stall & Payment Details */}
            <DetailSection 
              title="Stall & Payment"
              details={[
                { label: "Stall Size", value: participantDetails.profile_stall_size },
                { label: "Amount", value: `₹${participantDetails.profile_amount.toLocaleString()}` },
                { label: "Payment Method", value: participantDetails.profile_payment },
                { label: "Status", value: participantDetails.profile_status }
              ]}
            />
          </div>
        </div>
      </div>
    </Page>
  );
};

// Reusable component for consistent section formatting
const DetailSection = ({ title, details, footer }) => (
  <div className="border border-gray-300 p-4">
    <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-300 pb-2 mb-3">
      {title}
    </h3>
    <div className="space-y-2">
      {details.map((detail, index) => (
        <div 
          key={index} 
          className="flex justify-between text-sm"
        >
          <span className="text-gray-700 font-medium">{detail.label}:</span>
          <span className="text-gray-900 text-right">{detail.value}</span>
        </div>
      ))}
      {footer && <div className="mt-3">{footer}</div>}
    </div>
  </div>
);

export default TestView;



// it can be use 