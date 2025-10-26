// RPC用の型定義（get_random_stores関数の戻り値）
export type RpcStoreRawResult = {
  id: string;
  name: string;
  address: string;
  photo: string | null;
  latitude: number;
  longitude: number;
  genre: {
    name: string;
  } | null;
  posts: Array<{
    id: string;
    name: string;
    price: number;
    photo: string;
    description: string | null;
  }> | null;
  likes: Array<{
    user_id: string;
  }> | null;
  comments : {
    count : number;
  }
};
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
    PostgrestVersion: "13.0.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      _prisma_migrations: {
        Row: {
          applied_steps_count: number
          checksum: string
          finished_at: string | null
          id: string
          logs: string | null
          migration_name: string
          rolled_back_at: string | null
          started_at: string
        }
        Insert: {
          applied_steps_count?: number
          checksum: string
          finished_at?: string | null
          id: string
          logs?: string | null
          migration_name: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Update: {
          applied_steps_count?: number
          checksum?: string
          finished_at?: string | null
          id?: string
          logs?: string | null
          migration_name?: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Relationships: []
      }
      comments: {
        Row: {
          content: string
          created_at: string
          id: string
          store_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at: string
          id: string
          store_id: string
          updated_at: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          store_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      genres: {
        Row: {
          created_at: string
          id: number
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          updated_at: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      likes: {
        Row: {
          created_at: string
          store_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          store_id: string
          updated_at: string
          user_id: string
        }
        Update: {
          created_at?: string
          store_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "likes_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      posts: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          photo: string
          price: number
          store_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id: string
          name: string
          photo: string
          price: number
          store_id: string
          updated_at: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          photo?: string
          price?: number
          store_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      prefectures: {
        Row: {
          area: string
          created_at: string
          id: number
          name: string
          updated_at: string
        }
        Insert: {
          area: string
          created_at?: string
          id?: number
          name: string
          updated_at: string
        }
        Update: {
          area?: string
          created_at?: string
          id?: number
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          icon: string | null
          id: number
          name: string
          role: Database["public"]["Enums"]["Role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          icon?: string | null
          id?: number
          name: string
          role: Database["public"]["Enums"]["Role"]
          updated_at: string
          user_id: string
        }
        Update: {
          created_at?: string
          icon?: string | null
          id?: number
          name?: string
          role?: Database["public"]["Enums"]["Role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      store_tags: {
        Row: {
          created_at: string
          store_id: string
          tag_id: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          store_id: string
          tag_id: number
          updated_at: string
        }
        Update: {
          created_at?: string
          store_id?: string
          tag_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "store_tags_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "store_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      stores: {
        Row: {
          address: string
          created_at: string
          end_at: string | null
          genre_id: number | null
          id: string
          latitude: number
          link: string | null
          longitude: number
          name: string
          phone: string
          photo: string | null
          prefecture_id: number | null
          start_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address: string
          created_at?: string
          end_at?: string | null
          genre_id?: number | null
          id: string
          latitude: number
          link?: string | null
          longitude: number
          name: string
          phone: string
          photo?: string | null
          prefecture_id?: number | null
          start_at?: string | null
          updated_at: string
          user_id: string
        }
        Update: {
          address?: string
          created_at?: string
          end_at?: string | null
          genre_id?: number | null
          id?: string
          latitude?: number
          link?: string | null
          longitude?: number
          name?: string
          phone?: string
          photo?: string | null
          prefecture_id?: number | null
          start_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stores_genre_id_fkey"
            columns: ["genre_id"]
            isOneToOne: false
            referencedRelation: "genres"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stores_prefecture_id_fkey"
            columns: ["prefecture_id"]
            isOneToOne: false
            referencedRelation: "prefectures"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          created_at: string
          id: number
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          updated_at: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_admin_with_store: {
        Args: {
          _address: string
          _end_at: string
          _genre_id: number
          _latitude: number
          _link: string
          _longitude: number
          _name: string
          _phone: string
          _photo: string
          _prefecture_id: number
          _start_at: string
          _tag_ids: number[]
          _user_id: string
        }
        Returns: Json
      }
      get_random_stores: {
        Args: {
          result_limit?: number
          search_range?: number
          showed_store_ids: string[]
          user_latitude?: number
          user_longitude?: number
        }
        Returns: Json
      }
      update_admin_stores: {
        Args: {
          _address: string
          _end_at?: string
          _genre_id?: number
          _latitude: number
          _link?: string
          _longitude: number
          _name: string
          _phone: string
          _photo?: string
          _prefecture_id: number
          _start_at?: string
          _tag_ids?: number[]
          _user_id: string
        }
        Returns: Json
      }
      update_stores_and_tags: {
        Args: {
          _address: string
          _end_at: string
          _genre_id: string
          _latitude: number
          _link: string
          _longitude: number
          _name: string
          _phone: string
          _photo: string
          _prefecture_id: string
          _start_at: string
          _tag_ids: string[]
          _user_id: string
        }
        Returns: Json
      }
    }
    Enums: {
      Role: "user" | "admin"
    }
    CompositeTypes: {
      store_genre_t: {
        id: number | null
        name: string | null
      }
      store_post_t: {
        id: string | null
        name: string | null
        price: number | null
        photo: string | null
        description: string | null
        created_at: string | null
      }
      store_result_t: {
        id: string | null
        user_id: string | null
        name: string | null
        address: string | null
        phone: string | null
        latitude: number | null
        longitude: number | null
        photo: string | null
        start_at: string | null
        end_at: string | null
        link: string | null
        genre: Database["public"]["CompositeTypes"]["store_genre_t"] | null
        posts: Database["public"]["CompositeTypes"]["store_post_t"][] | null
        likes: Json | null
        comments: Json | null
        created_at: string | null
        updated_at: string | null
      }
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      Role: ["user", "admin"],
    },
  },
} as const
