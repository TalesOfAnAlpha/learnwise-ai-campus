
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
    }
  }
}
