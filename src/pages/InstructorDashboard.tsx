
import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Users, DollarSign, BookOpen, TrendingUp } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface InstructorCourse {
  course_id: string;
  course_title: string;
  course_created_at: string;
  total_enrollments: number;
  completed_enrollments: number;
  total_earnings: number;
  rating: number;
  reviews: number;
}

interface EnrollmentByDay {
  date: string;
  enrollments: number;
}

interface EarningByMonth {
  month: string;
  amount: number;
}

const InstructorDashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<InstructorCourse[]>([]);
  const [enrollmentData, setEnrollmentData] = useState<EnrollmentByDay[]>([]);
  const [earningsData, setEarningsData] = useState<EarningByMonth[]>([]);
  const [totalStats, setTotalStats] = useState({
    totalCourses: 0,
    totalEnrollments: 0,
    totalCompletions: 0,
    totalEarnings: 0,
    averageRating: 0,
  });

  useEffect(() => {
    const fetchInstructorData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Fetch instructor courses with stats from the dashboard view
        const { data: instructorCourses, error } = await supabase
          .from('instructor_dashboard')
          .select('*')
          .eq('instructor_id', user.id);
        
        if (error) throw error;
        
        setCourses(instructorCourses || []);
        
        // Calculate total statistics
        if (instructorCourses && instructorCourses.length > 0) {
          const totalEnrollments = instructorCourses.reduce((sum, course) => sum + (course.total_enrollments || 0), 0);
          const totalCompletions = instructorCourses.reduce((sum, course) => sum + (course.completed_enrollments || 0), 0);
          const totalEarnings = instructorCourses.reduce((sum, course) => sum + (course.total_earnings || 0), 0);
          
          // Calculate average rating across all courses (weighted by number of reviews)
          let weightedRatingSum = 0;
          let totalReviews = 0;
          
          instructorCourses.forEach(course => {
            if (course.rating && course.reviews) {
              weightedRatingSum += course.rating * course.reviews;
              totalReviews += course.reviews;
            }
          });
          
          const averageRating = totalReviews > 0 ? weightedRatingSum / totalReviews : 0;
          
          setTotalStats({
            totalCourses: instructorCourses.length,
            totalEnrollments,
            totalCompletions,
            totalEarnings,
            averageRating,
          });
          
          // Generate enrollment data for the past 30 days
          const enrollmentsByDay: Record<string, number> = {};
          const today = new Date();
          
          // Initialize with zeros for the last 30 days
          for (let i = 29; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            enrollmentsByDay[dateStr] = 0;
          }
          
          // Fetch enrollment data
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          
          const { data: enrollments } = await supabase
            .from('user_enrollments')
            .select('enrolled_at, course_id')
            .gte('enrolled_at', thirtyDaysAgo.toISOString())
            .in('course_id', instructorCourses.map(c => c.course_id));
          
          if (enrollments) {
            enrollments.forEach(enrollment => {
              const dateStr = new Date(enrollment.enrolled_at).toISOString().split('T')[0];
              if (enrollmentsByDay[dateStr] !== undefined) {
                enrollmentsByDay[dateStr]++;
              }
            });
          }
          
          // Convert to array format for charts
          const enrollmentChartData = Object.keys(enrollmentsByDay)
            .map(date => ({ date, enrollments: enrollmentsByDay[date] }))
            .sort((a, b) => a.date.localeCompare(b.date));
          
          setEnrollmentData(enrollmentChartData);
          
          // Generate monthly earnings data
          const earningsByMonth: Record<string, number> = {};
          const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          
          // Initialize with zeros for the last 6 months
          for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const monthStr = monthNames[date.getMonth()];
            earningsByMonth[monthStr] = 0;
          }
          
          // Fake earnings data for demonstration
          // In a real app, you would fetch this from the earnings table
          Object.keys(earningsByMonth).forEach((month, index) => {
            earningsByMonth[month] = Math.floor(Math.random() * 2000) + 500;
          });
          
          const earningsChartData = Object.keys(earningsByMonth)
            .map(month => ({ month, amount: earningsByMonth[month] }));
          
          setEarningsData(earningsChartData);
        }
      } catch (error: any) {
        console.error('Error fetching instructor data:', error);
        toast({
          title: 'Failed to load instructor data',
          description: error.message,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchInstructorData();
  }, [user, toast]);

  if (!user) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-12">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <h2 className="text-xl font-semibold mb-4">Authentication Required</h2>
              <p className="text-gray-600 mb-6">Please sign in to access the instructor dashboard.</p>
              <Button className="bg-brand-600 hover:bg-brand-700" asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-12">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-10 w-10 animate-spin text-brand-600 mb-4" />
              <p className="text-gray-600">Loading instructor dashboard...</p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Instructor Dashboard</h1>
            <p className="mt-2 text-gray-600">Monitor your courses, performance, and earnings</p>
          </div>
          <Button className="mt-4 md:mt-0 bg-brand-600 hover:bg-brand-700" asChild>
            <Link to="/course-upload">Create New Course</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-full mr-4">
                  <BookOpen className="h-6 w-6 text-blue-700" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Courses</p>
                  <h3 className="text-2xl font-bold">{totalStats.totalCourses}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-full mr-4">
                  <Users className="h-6 w-6 text-green-700" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Enrollments</p>
                  <h3 className="text-2xl font-bold">{totalStats.totalEnrollments}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-full mr-4">
                  <TrendingUp className="h-6 w-6 text-purple-700" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Completion Rate</p>
                  <h3 className="text-2xl font-bold">
                    {totalStats.totalEnrollments > 0 
                      ? Math.round((totalStats.totalCompletions / totalStats.totalEnrollments) * 100) 
                      : 0}%
                  </h3>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-amber-100 rounded-full mr-4">
                  <DollarSign className="h-6 w-6 text-amber-700" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Earnings</p>
                  <h3 className="text-2xl font-bold">${totalStats.totalEarnings.toFixed(2)}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="mb-8">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="courses">Your Courses</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Course Enrollments (Last 30 Days)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={enrollmentData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={(value) => {
                            const date = new Date(value);
                            return `${date.getMonth() + 1}/${date.getDate()}`;
                          }}
                          tick={{ fontSize: 12 }}
                          interval={4}
                        />
                        <YAxis />
                        <Tooltip 
                          formatter={(value: any) => [`${value} enrollments`, 'Enrollments']}
                          labelFormatter={(label) => {
                            const date = new Date(label);
                            return date.toLocaleDateString();
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="enrollments" 
                          stroke="#8884d8" 
                          strokeWidth={2} 
                          activeDot={{ r: 8 }} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Earnings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={earningsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value: any) => [`$${value.toFixed(2)}`, 'Earnings']} />
                        <Legend />
                        <Bar dataKey="amount" name="Revenue" fill="#4f46e5" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="courses">
            <Card>
              <CardHeader>
                <CardTitle>Your Courses</CardTitle>
              </CardHeader>
              <CardContent>
                {courses.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">You haven't created any courses yet.</p>
                    <Button className="bg-brand-600 hover:bg-brand-700" asChild>
                      <Link to="/course-upload">Create Your First Course</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b">
                          <th className="pb-4 font-medium">Course</th>
                          <th className="pb-4 font-medium">Rating</th>
                          <th className="pb-4 font-medium">Enrollments</th>
                          <th className="pb-4 font-medium">Completion Rate</th>
                          <th className="pb-4 font-medium">Revenue</th>
                          <th className="pb-4 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {courses.map(course => (
                          <tr key={course.course_id} className="border-b hover:bg-gray-50">
                            <td className="py-4 pr-4">
                              <div className="font-medium">{course.course_title}</div>
                              <div className="text-sm text-gray-500">
                                {new Date(course.course_created_at).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="py-4">
                              <div className="flex items-center">
                                <span className="font-medium">{course.rating.toFixed(1)}</span>
                                <span className="text-sm text-gray-500 ml-1">({course.reviews})</span>
                              </div>
                            </td>
                            <td className="py-4">{course.total_enrollments}</td>
                            <td className="py-4">
                              {course.total_enrollments > 0 
                                ? `${Math.round((course.completed_enrollments / course.total_enrollments) * 100)}%`
                                : '0%'
                              }
                            </td>
                            <td className="py-4">${course.total_earnings.toFixed(2)}</td>
                            <td className="py-4">
                              <Button variant="outline" size="sm" asChild>
                                <Link to={`/courses/${course.course_id}`}>View</Link>
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="earnings">
            <Card>
              <CardHeader>
                <CardTitle>Earnings Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Earnings Summary</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                        <span className="text-gray-600">Total Earnings</span>
                        <span className="font-medium">${totalStats.totalEarnings.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                        <span className="text-gray-600">Courses Sold</span>
                        <span className="font-medium">{totalStats.totalEnrollments}</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                        <span className="text-gray-600">Average Revenue per Course</span>
                        <span className="font-medium">
                          ${totalStats.totalCourses > 0 
                            ? (totalStats.totalEarnings / totalStats.totalCourses).toFixed(2) 
                            : '0.00'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Next Payout Date</span>
                        <span className="font-medium">{new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-4">Revenue Breakdown</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={courses.map(course => ({
                              name: course.course_title.length > 20 
                                ? course.course_title.substring(0, 20) + '...' 
                                : course.course_title,
                              value: course.total_earnings
                            }))}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                          />
                          <Tooltip formatter={(value: any) => `$${value.toFixed(2)}`} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default InstructorDashboard;
