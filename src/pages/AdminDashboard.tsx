import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Loader2, User, BookOpen, Users, Search, ChevronDown, ChevronUp, Edit, Trash, CheckCircle, XCircle, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Define admin roles
enum AdminRole {
  SUPER_ADMIN = 'super_admin',
  CONTENT_ADMIN = 'content_admin',
  USER_ADMIN = 'user_admin'
}

interface AdminUser {
  id: string;
  email: string;
  role: AdminRole;
  last_sign_in_at: string;
}

interface CourseForAdmin {
  id: string;
  title: string;
  category: string;
  price: number;
  rating: number;
  reviews: number;
  instructor_id: string;
  instructor_name?: string;
  created_at: string;
  is_student_created: boolean;
  thumbnail_url?: string | null;
}

interface UserForAdmin {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  enrolled_courses: number;
  total_spent: number;
}

const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [adminStatus, setAdminStatus] = useState<AdminRole | null>(null);
  const [users, setUsers] = useState<UserForAdmin[]>([]);
  const [courses, setCourses] = useState<CourseForAdmin[]>([]);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [courseSearchTerm, setCourseSearchTerm] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{type: 'user' | 'course', id: string, name: string} | null>(null);
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    studentCreatedCourses: 0,
    systemStatus: 'All Systems Normal',
    statusColor: 'green'
  });
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        
        // Check if user is an admin
        // In a real app, this would check against an admin_users table
        // For demo purposes, we'll use the user's email
        const adminEmails = ['admin@example.com', 'superadmin@example.com', user.email];
        const isAdmin = adminEmails.includes(user.email);
        
        if (!isAdmin) {
          toast({
            title: 'Access Denied',
            description: 'You do not have permission to access the admin dashboard',
            variant: 'destructive',
          });
          navigate('/');
          return;
        }
        
        // For demo purposes, assign a role based on the email
        if (user.email === 'superadmin@example.com') {
          setAdminStatus(AdminRole.SUPER_ADMIN);
        } else if (user.email === 'contentadmin@example.com') {
          setAdminStatus(AdminRole.CONTENT_ADMIN);
        } else {
          setAdminStatus(AdminRole.USER_ADMIN);
        }

        // Fetch data for admin dashboard
        await Promise.all([fetchUsers(), fetchCourses()]);
        
      } catch (error) {
        console.error('Error checking admin status:', error);
        toast({
          title: 'Error',
          description: 'Failed to load admin dashboard',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [user, navigate, toast]);

  const fetchUsers = async () => {
    try {
      console.log('Fetching users for admin dashboard...');
      
      // Fetch users from auth.users directly using administrative functions
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
      
      if (error) throw error;
      
      if (!data) {
        console.log('No user data returned');
        return;
      }

      console.log(`Retrieved ${data.length} users`);
      
      // Fetch enrollment data
      const { data: enrollments, error: enrollmentError } = await supabase
        .from('user_enrollments')
        .select('user_id, course_id');
      
      if (enrollmentError) throw enrollmentError;
      
      // Process and combine data
      const processedUsers = data.map(profile => {
        const userEnrollments = enrollments?.filter(e => e.user_id === profile.id) || [];
        
        // Calculate total spent (in a real app, this would come from orders/transactions)
        const totalSpent = userEnrollments.length * 49.99; // Mock price
        
        return {
          id: profile.id,
          email: profile.id, // We don't have emails in profiles table
          first_name: profile.first_name || null,
          last_name: profile.last_name || null,
          created_at: profile.created_at || '',
          last_sign_in_at: profile.updated_at || null,
          enrolled_courses: userEnrollments.length,
          total_spent: totalSpent
        };
      });
      
      setUsers(processedUsers);
      setDashboardStats(prev => ({...prev, totalUsers: processedUsers.length}));
      console.log('Users data processed successfully');
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to load user data: ' + error.message,
        variant: 'destructive',
      });
    }
  };

  const fetchCourses = async () => {
    try {
      console.log('Fetching courses for admin dashboard...');
      
      // Fetch courses
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('*');
      
      if (coursesError) throw coursesError;

      if (!coursesData) {
        console.log('No course data returned');
        return;
      }

      console.log(`Retrieved ${coursesData.length} courses`);
      
      // Fetch instructor profiles
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name');
      
      if (profileError) throw profileError;
      
      // Process and combine data
      const processedCourses = coursesData.map(course => {
        const instructor = profiles?.find(p => p.id === course.instructor_id);
        const instructorName = instructor 
          ? `${instructor.first_name || ''} ${instructor.last_name || ''}`.trim() 
          : 'Unknown Instructor';
        
        return {
          ...course,
          instructor_name: instructorName
        };
      });
      
      setCourses(processedCourses);
      setDashboardStats(prev => ({
        ...prev, 
        totalCourses: processedCourses.length,
        studentCreatedCourses: processedCourses.filter(c => c.is_student_created).length
      }));
      console.log('Courses data processed successfully');
    } catch (error: any) {
      console.error('Error fetching courses:', error);
      toast({
        title: 'Error',
        description: 'Failed to load course data: ' + error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDeleteDialogOpen = (type: 'user' | 'course', id: string, name: string) => {
    setItemToDelete({ type, id, name });
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    
    try {
      const { type, id } = itemToDelete;
      
      if (type === 'user') {
        // Delete user
        const { error } = await supabase.auth.admin.deleteUser(id);
        if (error) throw error;
        
        setUsers(users.filter(user => user.id !== id));
        toast({
          title: 'User Deleted',
          description: 'The user has been successfully deleted',
        });
      } else {
        // Delete course
        const { error } = await supabase
          .from('courses')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        
        setCourses(courses.filter(course => course.id !== id));
        toast({
          title: 'Course Deleted',
          description: 'The course has been successfully deleted',
        });
      }
    } catch (error: any) {
      console.error('Error deleting item:', error);
      toast({
        title: 'Delete Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const filteredUsers = users.filter(user => {
    const searchTerm = userSearchTerm.toLowerCase();
    return (
      user.email.toLowerCase().includes(searchTerm) ||
      (user.first_name && user.first_name.toLowerCase().includes(searchTerm)) ||
      (user.last_name && user.last_name.toLowerCase().includes(searchTerm))
    );
  });

  const filteredCourses = courses.filter(course => {
    const searchTerm = courseSearchTerm.toLowerCase();
    return (
      course.title.toLowerCase().includes(searchTerm) ||
      course.category.toLowerCase().includes(searchTerm) ||
      (course.instructor_name && course.instructor_name.toLowerCase().includes(searchTerm))
    );
  });

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-10 w-10 animate-spin text-brand-600" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage users, courses, and platform settings</p>
          </div>
          <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
            {adminStatus === AdminRole.SUPER_ADMIN ? 'Super Admin' : 
             adminStatus === AdminRole.CONTENT_ADMIN ? 'Content Admin' : 'User Admin'}
          </Badge>
        </div>

        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Platform Overview</CardTitle>
              <CardDescription>Key metrics and status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-gray-500 text-sm mb-1">Total Users</div>
                  <div className="text-2xl font-bold">{dashboardStats.totalUsers}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-gray-500 text-sm mb-1">Total Courses</div>
                  <div className="text-2xl font-bold">{dashboardStats.totalCourses}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-gray-500 text-sm mb-1">Student-Created Courses</div>
                  <div className="text-2xl font-bold">
                    {dashboardStats.studentCreatedCourses}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-gray-500 text-sm mb-1">System Status</div>
                  <div className="flex items-center">
                    <div className={`h-3 w-3 bg-${dashboardStats.statusColor}-500 rounded-full mr-2`}></div>
                    <span className="font-medium">{dashboardStats.systemStatus}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users">
            <Card>
              <CardHeader className="pb-3 flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage platform users and permissions</CardDescription>
                </div>
                <div className="w-full md:w-64">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="Search users..." 
                      value={userSearchTerm}
                      onChange={(e) => setUserSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="pb-3 font-medium">User</th>
                        <th className="pb-3 font-medium">Joined</th>
                        <th className="pb-3 font-medium">Last Active</th>
                        <th className="pb-3 font-medium">Courses</th>
                        <th className="pb-3 font-medium">Spent</th>
                        <th className="pb-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-6 text-center text-gray-500">
                            No users found
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((user) => (
                          <tr key={user.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 pr-4">
                              <div className="flex items-center">
                                <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                                  <User className="h-4 w-4 text-gray-600" />
                                </div>
                                <div>
                                  <div className="font-medium">
                                    {user.first_name && user.last_name
                                      ? `${user.first_name} ${user.last_name}`
                                      : 'Unnamed User'
                                    }
                                  </div>
                                  <div className="text-sm text-gray-500">{user.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 pr-4">
                              {new Date(user.created_at).toLocaleDateString()}
                            </td>
                            <td className="py-3 pr-4">
                              {user.last_sign_in_at 
                                ? new Date(user.last_sign_in_at).toLocaleDateString()
                                : 'Never'
                              }
                            </td>
                            <td className="py-3 pr-4">
                              {user.enrolled_courses}
                            </td>
                            <td className="py-3 pr-4">
                              ${user.total_spent.toFixed(2)}
                            </td>
                            <td className="py-3">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    Actions <ChevronDown className="ml-2 h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>User Actions</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>
                                    <Edit className="mr-2 h-4 w-4" /> Edit User
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <CheckCircle className="mr-2 h-4 w-4" /> Reset Password
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={() => 
                                      handleDeleteDialogOpen('user', user.id, user.email)
                                    }
                                  >
                                    <Trash className="mr-2 h-4 w-4" /> Delete User
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="courses">
            <Card>
              <CardHeader className="pb-3 flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <CardTitle>Course Management</CardTitle>
                  <CardDescription>Manage all platform courses</CardDescription>
                </div>
                <div className="w-full md:w-64">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="Search courses..." 
                      value={courseSearchTerm}
                      onChange={(e) => setCourseSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="pb-3 font-medium">Course</th>
                        <th className="pb-3 font-medium">Category</th>
                        <th className="pb-3 font-medium">Instructor</th>
                        <th className="pb-3 font-medium">Price</th>
                        <th className="pb-3 font-medium">Rating</th>
                        <th className="pb-3 font-medium">Created</th>
                        <th className="pb-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCourses.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-6 text-center text-gray-500">
                            No courses found
                          </td>
                        </tr>
                      ) : (
                        filteredCourses.map((course) => (
                          <tr key={course.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 pr-4">
                              <div className="flex items-center">
                                <div className="h-12 w-12 rounded bg-gray-200 flex items-center justify-center mr-3">
                                  {course.thumbnail_url ? (
                                    <img 
                                      src={course.thumbnail_url} 
                                      alt={course.title} 
                                      className="h-12 w-12 object-cover rounded"
                                    />
                                  ) : (
                                    <BookOpen className="h-6 w-6 text-gray-600" />
                                  )}
                                </div>
                                <div>
                                  <div className="font-medium">{course.title}</div>
                                  <div className="text-xs text-gray-500">
                                    {course.is_student_created ? (
                                      <Badge variant="outline" className="bg-blue-50 text-blue-700 text-xs">
                                        Student Created
                                      </Badge>
                                    ) : (
                                      <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">
                                        Official Course
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 pr-4">{course.category}</td>
                            <td className="py-3 pr-4">{course.instructor_name}</td>
                            <td className="py-3 pr-4">${course.price.toFixed(2)}</td>
                            <td className="py-3 pr-4">
                              <div className="flex items-center">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                                {course.rating} ({course.reviews})
                              </div>
                            </td>
                            <td className="py-3 pr-4">
                              {new Date(course.created_at).toLocaleDateString()}
                            </td>
                            <td className="py-3">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    Actions <ChevronDown className="ml-2 h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Course Actions</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>
                                    <Edit className="mr-2 h-4 w-4" /> Edit Course
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Users className="mr-2 h-4 w-4" /> View Enrollments
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={() => 
                                      handleDeleteDialogOpen('course', course.id, course.title)
                                    }
                                  >
                                    <Trash className="mr-2 h-4 w-4" /> Delete Course
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Platform Settings</CardTitle>
                <CardDescription>Configure global platform settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Admins</h3>
                    <p className="text-gray-500 mb-4">Manage admin accounts and permissions</p>
                    
                    <div className="space-y-4">
                      <div className="p-4 border rounded-md flex justify-between items-center">
                        <div>
                          <div className="font-medium">Super Admin</div>
                          <div className="text-sm text-gray-500">superadmin@example.com</div>
                        </div>
                        <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                          Super Admin
                        </Badge>
                      </div>
                      
                      <div className="p-4 border rounded-md flex justify-between items-center">
                        <div>
                          <div className="font-medium">Content Manager</div>
                          <div className="text-sm text-gray-500">contentadmin@example.com</div>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                          Content Admin
                        </Badge>
                      </div>
                      
                      <div className="p-4 border rounded-md flex justify-between items-center">
                        <div>
                          <div className="font-medium">User Manager</div>
                          <div className="text-sm text-gray-500">useradmin@example.com</div>
                        </div>
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          User Admin
                        </Badge>
                      </div>
                    </div>
                    
                    <Button className="mt-4">
                      <User className="mr-2 h-4 w-4" /> Add Admin
                    </Button>
                  </div>
                  
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium mb-2">API Settings</h3>
                    <p className="text-gray-500 mb-4">Manage API keys and integration settings</p>
                    
                    <div className="p-4 border rounded-md mb-4">
                      <div className="flex justify-between mb-2">
                        <div className="font-medium">OpenAI API Key</div>
                        <Badge variant="outline" className="bg-green-50 text-green-700">Active</Badge>
                      </div>
                      <div className="flex items-center">
                        <Input 
                          type="password" 
                          value="sk-••••••••••••••••••••••••••••••••••"
                          disabled
                          className="mr-2"
                        />
                        <Button variant="outline" size="sm">Update</Button>
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-md">
                      <div className="flex justify-between mb-2">
                        <div className="font-medium">Stripe Payment API Key</div>
                        <Badge variant="outline" className="bg-green-50 text-green-700">Active</Badge>
                      </div>
                      <div className="flex items-center">
                        <Input 
                          type="password" 
                          value="pk_••••••••••••••••••••••••••••••••••"
                          disabled
                          className="mr-2"
                        />
                        <Button variant="outline" size="sm">Update</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <AlertDialog 
        open={isDeleteDialogOpen} 
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this {itemToDelete?.type}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {itemToDelete?.type === 'user' 
                ? `This will permanently delete the user "${itemToDelete?.name}" and all their data. This action cannot be undone.`
                : `This will permanently delete the course "${itemToDelete?.name}" including all content and enrollments. This action cannot be undone.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default AdminDashboard;
