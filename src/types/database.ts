
export interface Database {
  public: {
    Tables: {
      student_courses: {
        Row: {
          id: string
          title: string
          description: string
          instructor_id: string
          category: string
          level: string
          price: number
          rating: number
          reviews: number
          duration: string
          created_at: string
          thumbnail_url: string | null
          is_student_created: boolean
        }
        Insert: Omit<Database['public']['Tables']['student_courses']['Row'], 'id' | 'created_at' | 'rating' | 'reviews'>
        Update: Partial<Database['public']['Tables']['student_courses']['Insert']>
      }
      course_content: {
        Row: {
          id: string
          course_id: string
          title: string
          content_type: string
          content: string
          duration: string | null
          order_index: number
          created_at: string
          video_url: string | null
        }
      }
      quizzes: {
        Row: {
          id: string
          course_id: string
          title: string
          description: string | null
          passing_score: number
          created_at: string
        }
      }
      quiz_questions: {
        Row: {
          id: string
          quiz_id: string
          question: string
          options: Record<string, any>
          correct_answer: string
          order_index: number
        }
      }
      instructor_dashboard: {
        Row: {
          course_id: string
          course_title: string
          course_created_at: string
          total_enrollments: number
          completed_enrollments: number
          total_earnings: number
          rating: number
          reviews: number
        }
      }
    }
  }
}

export type CourseForAdmin = {
  id: string;
  title: string;
  description: string;
  instructor_id: string;
  category: string;
  level: string;
  price: number;
  rating: number;
  reviews: number;
  duration: string;
  created_at: string;
  thumbnail_url: string | null;
  instructor_email?: string;
};
