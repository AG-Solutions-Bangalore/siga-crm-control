import React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import Page from '../dashboard/page';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Edit, Save, CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format ,parseISO} from 'date-fns';
import { cn } from "@/lib/utils";
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import BASE_URL from '@/config/BaseUrl';
const EditNews = () => {
     // Fetch news by ID
     const {id} = useParams()
     const { toast } = useToast();
     const navigate = useNavigate()
     const [calendarMonth, setCalendarMonth] = React.useState(new Date());
  const { data, isLoading, error } = useQuery({
    queryKey: ['newsDetails', 1],
    queryFn: async () => {
        const token = localStorage.getItem('token')
      const response = await axios.get(`${BASE_URL}/api/panel-fetch-news-by-id/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.news;
    }
  });

  // Update news mutation
   // Update news mutation
   const updateNewsMutation = useMutation({
    mutationFn: async (updatedNews) => {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      const correctDate = new Date(updatedNews.news_date);
      correctDate.setHours(12, 0, 0, 0);
      // Append all required fields to FormData
      formData.append('news_heading', updatedNews.news_heading);
      formData.append('news_sub_title', updatedNews.news_sub_title);
      formData.append('news_department', updatedNews.news_department);
      formData.append('news_details', updatedNews.news_details);
      formData.append('news_link', updatedNews.news_link);
      formData.append('news_date', format(correctDate, 'yyyy-MM-dd'))
      formData.append('news_status', updatedNews.news_status);
      formData.append('news_id', updatedNews.id);

    
      const response = await axios.post(
        `${BASE_URL}/api/panel-update-news`, 
        formData,
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
         
          }
        }
      );
      return response.data;
    },
    onSuccess: () => {
      console.log('News updated successfully');
      // Optionally add toast or navigation logic here
      toast({
        title: "Updated Succesfully",
        description: "Your news article has been successfully updated.",
        variant: "success"
      });
     
      navigate('/latest-news')
    },
    onError: (error) => {
      console.error('Failed to update news', error);
      // Optionally add error handling toast or messaging
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create news",
        variant: "destructive"
      });
    }
  });

  // State to manage form data
  const [formData, setFormData] = React.useState({
    news_heading: '',
    news_sub_title: '',
    news_details: '',
    news_link: '',
    news_date: new Date(),
    news_department: '',
    news_status: '1'
  });
 

  // Update form data when fetched data is available
  React.useEffect(() => {
    if (data) {
      const parsedDate = data.news_date ? parseISO(data.news_date) : new Date();
      setFormData({
        ...data,
        news_date: parsedDate
      });
      setCalendarMonth(parsedDate);
    }
  }, [data]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    updateNewsMutation.mutate(formData);
  };

  
  return (
 <Page>
       <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6 flex items-center">
          <Edit className="mr-2" /> Edit News
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2">News Heading</label>
              <Input
                name="news_heading"
                value={formData.news_heading}
                onChange={handleChange}
                placeholder="Enter news heading"
              />
            </div>

            <div>
              <label className="block mb-2">Sub Title</label>
              <Input
                name="news_sub_title"
                value={formData.news_sub_title}
                onChange={handleChange}
                placeholder="Enter sub title"
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2">News Date</label>
              <Popover>
                <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.news_date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.news_date
                      ? format(formData.news_date, "PPP")
                      : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.news_date}
                    onSelect={(date) => {
                      setFormData((prev) => ({ ...prev, news_date: date }));
                      // Update calendar month when a new date is selected
                      setCalendarMonth(date);
                    }}
                    month={calendarMonth}
                    onMonthChange={setCalendarMonth}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <label className="block mb-2">Status</label>
              <Select
                name="news_status"
                value={formData.news_status}
                onValueChange={(value) => setFormData(prev => ({
                  ...prev,
                  news_status: value
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Active</SelectItem>
                  <SelectItem value="0">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2">News Link</label>
              <Input
                name="news_link"
                value={formData.news_link}
                onChange={handleChange}
                placeholder="Enter news link"
              />
            </div>

            <div>
              <label className="block mb-2">Department</label>
              <Input
                name="news_department"
                value={formData.news_department}
                onChange={handleChange}
                placeholder="Enter Department"
              />
              
            </div>
          </div>
          <div>
            <label className="block mb-2">News Details</label>
            <Textarea
              name="news_details"
              value={formData.news_details}
              onChange={handleChange}
              placeholder="Enter news details"
              rows={4}
            />
          </div>
      

  

          <div className="mt-6">
            <Button type="submit" className="flex items-center">
              <Save className="mr-2" /> Update News
            </Button>
          </div>
        </form>
      </div>
 </Page>
  )
}

export default EditNews