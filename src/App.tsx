
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Courses from "./pages/Courses";
import Categories from "./pages/Categories";
import About from "./pages/About";
import CourseUpload from "./pages/CourseUpload";
import TestMonitoring from "./pages/TestMonitoring";
import Profile from "./pages/Profile";
import InstructorDashboard from "./pages/InstructorDashboard";
import ChatGPTWidget from "./components/ChatGPTWidget";
import CourseDetail from "./pages/CourseDetail";
import AdminDashboard from "./pages/AdminDashboard";
import Community from "./pages/Community";
import Payment from "./pages/Payment";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/community" element={<Community />} />
            <Route path="/about" element={<About />} />
            <Route path="/course-upload" element={<CourseUpload />} />
            <Route path="/test-monitoring" element={<TestMonitoring />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/instructor-dashboard" element={<InstructorDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ChatGPTWidget />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
