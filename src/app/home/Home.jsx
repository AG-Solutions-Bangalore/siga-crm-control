import React from 'react'
import Page from '../dashboard/page'
import { useQuery } from '@tanstack/react-query'
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { 
  Activity, 
  BarChart2, 
  IndianRupee, 
  TrendingUp 
} from "lucide-react"
import { Loader2 } from "lucide-react"
import axios from 'axios'
import BASE_URL from '@/config/BaseUrl'

const MetricCard = ({ title, value, icon: Icon, trend }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {trend && (
        <p className="text-xs text-muted-foreground">{trend}</p>
      )}
    </CardContent>
  </Card>
)
const Home = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboardData'],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/api/panel-fetch-dashboard/202425`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      return response.data
    }
  })


  

  if (isLoading) {
    return (
      <Page>
        <div className="flex justify-center items-center h-full">
          <Loader2 className="mr-2 h-8 w-8 animate-spin" />
        </div>
      </Page>
    )
  }

  if (isError) {
    return (
      <Page>
        <Card className="w-full max-w-md mx-auto mt-10">
          <CardHeader>
            <CardTitle className="text-destructive">Error Fetching Dashboard Data</CardTitle>
          </CardHeader>
        </Card>
      </Page>
    )
  }
  return (
   <Page>
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        <MetricCard 
          title="Today's Printing Count" 
          value={data.current_day_printing_count} 
          icon={Activity}
        />
        <MetricCard 
          title="Today's Printing Sum" 
          value={`₹${data.current_day_printing_sum}`} 
          icon={IndianRupee}
        />
        <MetricCard 
          title="Total Printing Count" 
          value={data.total_printing_count} 
          icon={BarChart2}
        />
        <MetricCard 
          title="Total Printing Sum" 
          value={`₹${data.total_printing_sum}`} 
          icon={TrendingUp}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        <Card>
          <CardHeader>
            <CardTitle>Historical Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>1 Day Back Printing Count</span>
                <span>{data.one_day_back_printing_count}</span>
              </div>
              <div className="flex justify-between">
                <span>1 Day Back Printing Sum</span>
                <span>₹{data.one_day_back_printing_sum}</span>
              </div>
              <div className="flex justify-between">
                <span>2 Days Back Printing Count</span>
                <span>{data.two_day_back_printing_count}</span>
              </div>
              <div className="flex justify-between">
                <span>2 Days Back Printing Sum</span>
                <span>₹{data.two_day_back_printing_sum}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
   </Page>
  )
}

export default Home