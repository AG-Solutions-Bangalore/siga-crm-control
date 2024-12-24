import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ExternalLink, Calendar, Tag, Link as LinkIcon } from "lucide-react";
import BASE_URL from "@/config/BaseUrl";

const NewView = ({id}) => {
    const {
        data: newsDetails,
        isLoading,
        isError,
      } = useQuery({
        queryKey: ["newsDetails", id],
        queryFn: async () => {
          // Only fetch if registrationId is available
          if (!id) return null;
          const token = localStorage.getItem("token");
          const response = await axios.get(
            `${BASE_URL}/api/panel-fetch-news-by-id/${id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          return response.data.news;
        },
        enabled: !!id, // Only run query if registrationId exists
      });
    
      // If no registration is selected
      if (!id || !newsDetails) {
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
          <Card className="w-full">
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
      const getFirstTenWords = (text) => {
        if (!text) return '';
        return text.split(' ').slice(0, 10).join(' ') + (text.split(' ').length > 10 ? '...' : '');
      };
      const getFirstFiftyWords = (text) => {
        if (!text) return '';
        return text.split(' ').slice(0, 50).join(' ') + (text.split(' ').length > 10 ? '...' : '');
      };

  return (
    <Card className="w-full border-2 border-blue-100 shadow-lg">
    <CardHeader className="bg-blue-50 p-4">
      <CardTitle className="text-2xl font-bold text-blue-800">
      {getFirstTenWords(newsDetails.news_heading)}
      </CardTitle>
      <p className="text-gray-600 text-sm mt-1">  {getFirstTenWords(newsDetails.news_sub_title)}</p>
    </CardHeader>
    
    <CardContent className="p-6 space-y-2">
      {/* News Details Section */}
      <div className="bg-white rounded-lg p-1 border border-gray-100 shadow-sm">
        <h3 className="text-lg font-semibold text-blue-700 mb-2 flex items-center">
          <Tag className="mr-2 h-5 w-5 text-blue-500" />
          News Details
        </h3>
        <p className="text-gray-700">{getFirstFiftyWords(newsDetails.news_details)}</p>
      </div>

      {/* Metadata Grid */}
      {/* <div className="grid md:grid-cols-1 gap-4">
 
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 shadow-sm">
            <h4 className="text-sm font-semibold text-gray-600 flex items-center mb-1">
              <Calendar className="mr-2 h-4 w-4 text-blue-500" />
              News Date
            </h4>
            <p className="text-gray-800">{formattedDate}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 shadow-sm">
            <h4 className="text-sm font-semibold text-gray-600 flex items-center mb-1">
              <Tag className="mr-2 h-4 w-4 text-blue-500" />
              Department
            </h4>
            <p className="text-gray-800">{newsDetails.news_department}</p>
          </div>
        </div>

      </div> */}

      {/* Additional Info */}
      <div className="space-y-2 ">
        {newsDetails.news_link && (
          <div className="bg-white rounded-lg p-1 border border-gray-100 shadow-sm flex items-center justify-between">
            <div className="flex items-center">
             
              <span className="text-gray-700 font-semibold">News Link</span>
            </div>
            <Button 
              variant="outline" 
              className="flex items-center"
              onClick={() => window.open(newsDetails.news_link, '_blank')}
            >
              Open Link
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Status Indicator */}
        <div className="bg-gray-50 rounded-lg p-1 border border-gray-100 shadow-sm">
          <h4 className="text-sm font-semibold text-gray-600 flex items-center mb-1">
            <Tag className="mr-2 h-4 w-4 text-blue-500" />
            News Status
          </h4>
          <p className={`font-semibold ${newsDetails.news_status === 1 ? 'text-green-600' : 'text-red-600'}`}>
            {newsDetails.news_status === 1 ? 'Active' : 'Inactive'}
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
  )
}

export default NewView