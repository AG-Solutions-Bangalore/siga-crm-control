import React, { useState, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { PlusCircle, Save, CalendarIcon } from 'lucide-react';
import Page from '../dashboard/page';
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useNavigate } from 'react-router-dom';
import BASE_URL from '@/config/BaseUrl';

const CreateNews = () => {
  const { register, handleSubmit, control, reset, setValue, formState: { errors } } = useForm();
  const [newsDate, setNewsDate] = useState(new Date());
  const { toast } = useToast();
  const navigate =useNavigate()

  // Mutation for creating news
  const createNewsMutation = useMutation({
    mutationFn: async (data) => {
      const token = localStorage.getItem('token');
      
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        formData.append(key, data[key]);
      });
      
    

      const response = await axios.post(`${BASE_URL}/api/panel-create-news`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    },
    onSuccess: (data) => {
      toast({
        title: "News Created",
        description: "Your news article has been successfully created.",
        variant: "success"
      });
      reset();
      setNewsDate(new Date());
      navigate('/latest-news')
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create news",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data) => {
    createNewsMutation.mutate(data);
  };

  return (
   <Page>
      <div className="container mx-auto px-4 py-0 md:py-8">
        <h1 className="text-2xl font-bold mb-6 flex items-center">
          <PlusCircle className="mr-2" /> Create News Article
        </h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* News Heading */}
            <div className="space-y-2">
              <Label>News Heading</Label>
              <Input 
                {...register('news_heading', { required: 'Heading is required' })}
                placeholder="Enter news heading"
              />
              {errors.news_heading && (
                <p className="text-red-500 text-sm">{errors.news_heading.message}</p>
              )}
            </div>

            {/* Sub Title */}
            <div className="space-y-2">
              <Label>Sub Title</Label>
              <Input 
                {...register('news_sub_title')}
                placeholder="Enter sub title (optional)"
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
          {/* Department */}
          <div className="space-y-2">
            <Label>Department</Label>
            <Input 
              {...register('news_department', { required: 'Department is required' })}
              placeholder="Enter department"
            />
            {errors.news_department && (
              <p className="text-red-500 text-sm">{errors.news_department.message}</p>
            )}
          </div>
          {/* News Link (Optional) */}
          <div className="space-y-2">
            <Label>News Link (Optional)</Label>
            <Input 
              {...register('news_link')}
              placeholder="Enter related link (optional)"
              
            />
          </div>
          </div>
              {/* News Date */}
              <div className="space-y-2">
            <Label>News Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !newsDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {newsDate ? format(newsDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={newsDate}
                  onSelect={(date) => {
                    setNewsDate(date);
                    // Optionally update the form value
                    setValue('news_date', format(date, "yyyy-MM-dd"));
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          {/* News Details */}
          <div className="space-y-2">
            <Label>News Details</Label>
            <Textarea 
              {...register('news_details', { required: 'News details are required' })}
              placeholder="Enter full news article content"
              rows={5}
            />
            {errors.news_details && (
              <p className="text-red-500 text-sm">{errors.news_details.message}</p>
            )}
          </div>

     

      

          {/* Submit Button */}
          <div className="flex flex-row mt-6 gap-6">
          <Button 
            type="submit" 
            disabled={createNewsMutation.isPending}
            className="w-full"
          >
            <Save className="mr-2" /> 
            {createNewsMutation.isPending ? 'Saving...' : 'Create News Article'}
          </Button>
          <Button
             onClick={()=>navigate('/latest-news')}
              className="w-full "
            >
             Cancel
            </Button>
            </div>
        </form>
      </div>
   </Page>
  )
}

export default CreateNews;