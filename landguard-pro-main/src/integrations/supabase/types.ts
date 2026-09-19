export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      citizen_land_access: {
        Row: {
          citizen_id: string
          created_at: string
          id: string
          land_id: string
          relationship: string
        }
        Insert: {
          citizen_id: string
          created_at?: string
          id?: string
          land_id: string
          relationship?: string
        }
        Update: {
          citizen_id?: string
          created_at?: string
          id?: string
          land_id?: string
          relationship?: string
        }
        Relationships: [
          {
            foreignKeyName: "citizen_land_access_land_id_fkey"
            columns: ["land_id"]
            isOneToOne: false
            referencedRelation: "land_parcels"
            referencedColumns: ["id"]
          },
        ]
      }
      citizen_notifications: {
        Row: {
          category: string
          citizen_id: string
          created_at: string
          id: string
          is_read: boolean
          land_id: string | null
          message: string
          title: string
        }
        Insert: {
          category?: string
          citizen_id: string
          created_at?: string
          id?: string
          is_read?: boolean
          land_id?: string | null
          message: string
          title: string
        }
        Update: {
          category?: string
          citizen_id?: string
          created_at?: string
          id?: string
          is_read?: boolean
          land_id?: string | null
          message?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "citizen_notifications_land_id_fkey"
            columns: ["land_id"]
            isOneToOne: false
            referencedRelation: "land_parcels"
            referencedColumns: ["id"]
          },
        ]
      }
      citizen_profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          phone: string | null
          village: string | null
        }
        Insert: {
          created_at?: string
          email?: string
          full_name?: string
          id: string
          phone?: string | null
          village?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          village?: string | null
        }
        Relationships: []
      }
      citizen_requests: {
        Row: {
          citizen_id: string
          created_at: string
          document_path: string | null
          id: string
          issue_type: string | null
          land_id: string
          latest_update: string
          photo_path: string | null
          reason: string
          request_code: string
          request_type: string
          status: string
          updated_at: string
        }
        Insert: {
          citizen_id: string
          created_at?: string
          document_path?: string | null
          id?: string
          issue_type?: string | null
          land_id: string
          latest_update?: string
          photo_path?: string | null
          reason: string
          request_code?: string
          request_type: string
          status?: string
          updated_at?: string
        }
        Update: {
          citizen_id?: string
          created_at?: string
          document_path?: string | null
          id?: string
          issue_type?: string | null
          land_id?: string
          latest_update?: string
          photo_path?: string | null
          reason?: string
          request_code?: string
          request_type?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "citizen_requests_land_id_fkey"
            columns: ["land_id"]
            isOneToOne: false
            referencedRelation: "land_parcels"
            referencedColumns: ["id"]
          },
        ]
      }
      demo_land_assignments: {
        Row: {
          email: string
          id: string
          survey_number: string
        }
        Insert: {
          email: string
          id?: string
          survey_number: string
        }
        Update: {
          email?: string
          id?: string
          survey_number?: string
        }
        Relationships: []
      }
      land_documents: {
        Row: {
          created_at: string
          document_type: string
          file_path: string | null
          id: string
          is_demo: boolean
          issued_on: string | null
          land_id: string
          reference: string | null
          title: string
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string
          document_type: string
          file_path?: string | null
          id?: string
          is_demo?: boolean
          issued_on?: string | null
          land_id: string
          reference?: string | null
          title: string
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string
          document_type?: string
          file_path?: string | null
          id?: string
          is_demo?: boolean
          issued_on?: string | null
          land_id?: string
          reference?: string | null
          title?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "land_documents_land_id_fkey"
            columns: ["land_id"]
            isOneToOne: false
            referencedRelation: "land_parcels"
            referencedColumns: ["id"]
          },
        ]
      }
      land_parcels: {
        Row: {
          boundary_displacement: number | null
          boundary_geometry: Json | null
          boundary_status: string
          classification: string
          district: string
          drone_survey_date: string | null
          drone_survey_status: string | null
          drone_surveyed_area: number | null
          government_area: number
          id: string
          is_demo: boolean
          last_updated: string
          latest_survey_date: string | null
          latitude: number
          longitude: number
          patta_number: string
          rtk_public_accuracy: string | null
          rtk_status: string | null
          rtk_survey_date: string | null
          source: string
          sub_division: string
          survey_number: string
          surveyed_area: number | null
          taluk: string
          verification_status: string
          village: string
        }
        Insert: {
          boundary_displacement?: number | null
          boundary_geometry?: Json | null
          boundary_status?: string
          classification: string
          district: string
          drone_survey_date?: string | null
          drone_survey_status?: string | null
          drone_surveyed_area?: number | null
          government_area: number
          id?: string
          is_demo?: boolean
          last_updated?: string
          latest_survey_date?: string | null
          latitude: number
          longitude: number
          patta_number?: string
          rtk_public_accuracy?: string | null
          rtk_status?: string | null
          rtk_survey_date?: string | null
          source?: string
          sub_division?: string
          survey_number: string
          surveyed_area?: number | null
          taluk: string
          verification_status?: string
          village: string
        }
        Update: {
          boundary_displacement?: number | null
          boundary_geometry?: Json | null
          boundary_status?: string
          classification?: string
          district?: string
          drone_survey_date?: string | null
          drone_survey_status?: string | null
          drone_surveyed_area?: number | null
          government_area?: number
          id?: string
          is_demo?: boolean
          last_updated?: string
          latest_survey_date?: string | null
          latitude?: number
          longitude?: number
          patta_number?: string
          rtk_public_accuracy?: string | null
          rtk_status?: string | null
          rtk_survey_date?: string | null
          source?: string
          sub_division?: string
          survey_number?: string
          surveyed_area?: number | null
          taluk?: string
          verification_status?: string
          village?: string
        }
        Relationships: []
      }
      land_surveys: {
        Row: {
          boundary_movement: number | null
          boundary_status: string
          created_at: string
          id: string
          is_demo: boolean
          land_id: string
          public_result: string
          survey_date: string
          survey_type: string
          surveyed_area: number | null
          verification_status: string
        }
        Insert: {
          boundary_movement?: number | null
          boundary_status?: string
          created_at?: string
          id?: string
          is_demo?: boolean
          land_id: string
          public_result?: string
          survey_date: string
          survey_type: string
          surveyed_area?: number | null
          verification_status?: string
        }
        Update: {
          boundary_movement?: number | null
          boundary_status?: string
          created_at?: string
          id?: string
          is_demo?: boolean
          land_id?: string
          public_result?: string
          survey_date?: string
          survey_type?: string
          surveyed_area?: number | null
          verification_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "land_surveys_land_id_fkey"
            columns: ["land_id"]
            isOneToOne: false
            referencedRelation: "land_parcels"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      citizen_has_land_access: { Args: { _land_id: string }; Returns: boolean }
      claim_citizen_lands: { Args: { _full_name?: string }; Returns: undefined }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
