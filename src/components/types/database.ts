
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          first_name: string | null;
          last_name: string | null;
          bio: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          first_name?: string | null;
          last_name?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      courses: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          instructor_id: string;
          category: string;
          level: string;
          price: number;
          duration: string;
          thumbnail_url: string | null;
          rating: number;
          reviews: number;
          created_at: string;
          is_student_created: boolean;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          instructor_id: string;
          category: string;
          level: string;
          price: number;
          duration: string;
          thumbnail_url?: string | null;
          rating?: number;
          reviews?: number;
          created_at?: string;
          is_student_created?: boolean;
        };
        Update: Partial<Database['public']['Tables']['courses']['Insert']>;
      };
      course_content: {
        Row: {
          id: string;
          course_id: string;
          title: string;
          content_type: string;
          content: string;
          video_url: string | null;
          duration: string | null;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          course_id: string;
          title: string;
          content_type: string;
          content: string;
          video_url?: string | null;
          duration?: string | null;
          order_index: number;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['course_content']['Insert']>;
      };
      user_enrollments: {
        Row: {
          id: string;
          user_id: string;
          course_id: string;
          enrolled_at: string;
          completed: boolean;
          last_accessed_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          course_id: string;
          enrolled_at?: string;
          completed?: boolean;
          last_accessed_at?: string;
        };
        Update: Partial<Database['public']['Tables']['user_enrollments']['Insert']>;
      };
      user_progress: {
        Row: {
          id: string;
          user_id: string;
          course_id: string;
          content_id: string;
          progress_percent: number;
          completed: boolean;
          last_position_seconds: number;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          course_id: string;
          content_id: string;
          progress_percent?: number;
          completed?: boolean;
          last_position_seconds?: number;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['user_progress']['Insert']>;
      };
      student_courses: {
        Row: {
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
          is_student_created: boolean;
        };
        Insert: Omit<Database['public']['Tables']['student_courses']['Row'], 'id' | 'created_at' | 'rating' | 'reviews'>;
        Update: Partial<Database['public']['Tables']['student_courses']['Insert']>;
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
};
