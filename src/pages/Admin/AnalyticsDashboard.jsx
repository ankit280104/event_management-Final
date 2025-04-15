import { useState } from "react"
import { BarChart, LineChart, PieChart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Chart,
  ChartArea,
  ChartBar,
  ChartContainer,
  ChartGrid,
  ChartLine,
  ChartPie,
  ChartTooltip,
  ChartXAxis,
  ChartYAxis,
} from "@/components/ui/chart"

// Mock data for the analytics dashboard
const analyticsData = {
  totalEvents: 24,
  totalAttendees: 876,
  totalRevenue: 78450,
  averageRating: 4.7,
  attendanceRate: 92,

  // Monthly data for charts
  monthlyData: [
    { month: "Jan", attendees: 45, revenue: 4500, events: 2 },
    { month: "Feb", attendees: 68, revenue: 6800, events: 3 },
    { month: "Mar", attendees: 92, revenue: 9200, events: 4 },
    { month: "Apr", attendees: 120, revenue: 12000, events: 5 },
    { month: "May", attendees: 85, revenue: 8500, events: 3 },
    { month: "Jun", attendees: 110, revenue: 11000, events: 4 },
  ],

  // Rating distribution
  ratingDistribution: [
    { rating: "5 Stars", count: 245, percentage: 45 },
    { rating: "4 Stars", count: 180, percentage: 33 },
    { rating: "3 Stars", count: 85, percentage: 16 },
    { rating: "2 Stars", count: 25, percentage: 5 },
    { rating: "1 Star", count: 5, percentage: 1 },
  ],

  // Top events by attendance
  topEvents: [
    { name: "Advanced React Patterns", attendees: 120, rating: 4.9 },
    { name: "Introduction to Web Development", attendees: 95, rating: 4.7 },
    { name: "UI/UX Design Workshop", attendees: 85, rating: 4.8 },
    { name: "Full Stack Development", attendees: 75, rating: 4.6 },
    { name: "Mobile App Development", attendees: 70, rating: 4.5 },
  ],

  // Attendee demographics
  demographics: [
    { category: "Students", percentage: 45 },
    { category: "Professionals", percentage: 35 },
    { category: "Entrepreneurs", percentage: 15 },
    { category: "Others", percentage: 5 },
  ],
}

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState("6months")

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Event Analytics</h1>
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">Export Report</Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Events</CardDescription>
            <CardTitle className="text-4xl">{analyticsData.totalEvents}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">+12% from last period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Attendees</CardDescription>
            <CardTitle className="text-4xl">{analyticsData.totalAttendees}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">+18% from last period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Revenue</CardDescription>
            <CardTitle className="text-4xl">${analyticsData.totalRevenue}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">+15% from last period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Average Rating</CardDescription>
            <CardTitle className="text-4xl">{analyticsData.averageRating}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= Math.round(analyticsData.averageRating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="attendance" className="mb-8">
        <TabsList>
          <TabsTrigger value="attendance" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            Attendance
          </TabsTrigger>
          <TabsTrigger value="revenue" className="flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            Revenue
          </TabsTrigger>
          <TabsTrigger value="ratings" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Ratings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Attendance</CardTitle>
              <CardDescription>Number of attendees per month</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ChartContainer>
                <Chart>
                  <ChartGrid x y />
                  <ChartYAxis />
                  <ChartXAxis />
                  <ChartBar
                    data={analyticsData.monthlyData.map((item) => ({
                      name: item.month,
                      value: item.attendees,
                    }))}
                    valueKey="value"
                    nameKey="name"
                    fill="#6366f1"
                  />
                  <ChartTooltip />
                </Chart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue</CardTitle>
              <CardDescription>Revenue generated per month</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ChartContainer>
                <Chart>
                  <ChartGrid x y />
                  <ChartYAxis />
                  <ChartXAxis />
                  <ChartArea
                    data={analyticsData.monthlyData.map((item) => ({
                      name: item.month,
                      value: item.revenue,
                    }))}
                    valueKey="value"
                    nameKey="name"
                    fill="#22c55e"
                    stroke="#16a34a"
                  />
                  <ChartLine
                    data={analyticsData.monthlyData.map((item) => ({
                      name: item.month,
                      value: item.revenue,
                    }))}
                    valueKey="value"
                    nameKey="name"
                    stroke="#16a34a"
                  />
                  <ChartTooltip />
                </Chart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ratings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rating Distribution</CardTitle>
              <CardDescription>Distribution of ratings across all events</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ChartContainer>
                <Chart>
                  <ChartPie
                    data={analyticsData.ratingDistribution.map((item) => ({
                      name: item.rating,
                      value: item.percentage,
                    }))}
                    valueKey="value"
                    nameKey="name"
                    innerRadius={50}
                    outerRadius={80}
                  />
                  <ChartTooltip />
                </Chart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Top Events & Demographics */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Events</CardTitle>
            <CardDescription>Events with highest attendance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.topEvents.map((event, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{event.name}</p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <span>{event.attendees} attendees</span>
                      <span className="mx-2">•</span>
                      <div className="flex items-center">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1" />
                        {event.rating}
                      </div>
                    </div>
                  </div>
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{
                        width: `${(event.attendees / analyticsData.topEvents[0].attendees) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Attendee Demographics</CardTitle>
            <CardDescription>Breakdown of attendee backgrounds</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ChartContainer>
              <Chart>
                <ChartPie
                  data={analyticsData.demographics.map((item) => ({
                    name: item.category,
                    value: item.percentage,
                  }))}
                  valueKey="value"
                  nameKey="name"
                  innerRadius={0}
                  outerRadius={80}
                />
                <ChartTooltip />
              </Chart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Star component for ratings
function Star() {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}
