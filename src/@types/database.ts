export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      inspiracoes: {
        Row: {
          caminho_storage: string | null;
          created_at: string;
          id: number;
          nome_arquivo: string | null;
          pedido_id: number | null;
          tamanho_bytes: number | null;
          tipo_mime: string | null;
        };
        Insert: {
          caminho_storage?: string | null;
          created_at?: string;
          id?: number;
          nome_arquivo?: string | null;
          pedido_id?: number | null;
          tamanho_bytes?: number | null;
          tipo_mime?: string | null;
        };
        Update: {
          caminho_storage?: string | null;
          created_at?: string;
          id?: number;
          nome_arquivo?: string | null;
          pedido_id?: number | null;
          tamanho_bytes?: number | null;
          tipo_mime?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "inspiracoes_pedido_id_fkey";
            columns: ["pedido_id"];
            isOneToOne: false;
            referencedRelation: "pedidos";
            referencedColumns: ["id"];
          }
        ];
      };
      pedidos: {
        Row: {
          cor: string | null;
          costureira_id: string | null;
          created_at: string;
          detalhes: string | null;
          estilo: string | null;
          id: number;
          material: string | null;
          orcamento_maximo: number | null;
          prazo_entrega: number | null;
          progresso: number | null;
          status: string | null;
          tamanho: string | null;
          tipo_roupa: string | null;
          usuario_id: string | null;
        };
        Insert: {
          cor?: string | null;
          costureira_id?: string | null;
          created_at?: string;
          detalhes?: string | null;
          estilo?: string | null;
          id?: number;
          material?: string | null;
          orcamento_maximo?: number | null;
          prazo_entrega?: number | null;
          progresso?: number | null;
          status?: string | null;
          tamanho?: string | null;
          tipo_roupa?: string | null;
          usuario_id?: string | null;
        };
        Update: {
          cor?: string | null;
          costureira_id?: string | null;
          created_at?: string;
          detalhes?: string | null;
          estilo?: string | null;
          id?: number;
          material?: string | null;
          orcamento_maximo?: number | null;
          prazo_entrega?: number | null;
          progresso?: number | null;
          status?: string | null;
          tamanho?: string | null;
          tipo_roupa?: string | null;
          usuario_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "pedidos_costureira_id_fkey1";
            columns: ["costureira_id"];
            isOneToOne: false;
            referencedRelation: "usuarios";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "pedidos_usuario_id_fkey1";
            columns: ["usuario_id"];
            isOneToOne: false;
            referencedRelation: "usuarios";
            referencedColumns: ["id"];
          }
        ];
      };
      propostas: {
        Row: {
          costureira_id: string;
          created_at: string | null;
          descricao: string | null;
          id: number;
          pedido_id: number;
          status: string | null;
          tempo_estimado: number | null;
          updated_at: string | null;
          valor: number;
        };
        Insert: {
          costureira_id: string;
          created_at?: string | null;
          descricao?: string | null;
          id?: number;
          pedido_id: number;
          status?: string | null;
          tempo_estimado?: number | null;
          updated_at?: string | null;
          valor: number;
        };
        Update: {
          costureira_id?: string;
          created_at?: string | null;
          descricao?: string | null;
          id?: number;
          pedido_id?: number;
          status?: string | null;
          tempo_estimado?: number | null;
          updated_at?: string | null;
          valor?: number;
        };
        Relationships: [
          {
            foreignKeyName: "propostas_costureira_id_fkey";
            columns: ["costureira_id"];
            isOneToOne: false;
            referencedRelation: "usuarios";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "propostas_pedido_id_fkey";
            columns: ["pedido_id"];
            isOneToOne: false;
            referencedRelation: "pedidos";
            referencedColumns: ["id"];
          }
        ];
      };
      usuarios: {
        Row: {
          anos_experiencia: number | null;
          avatar_url: string | null;
          biografia: string | null;
          cep: string | null;
          cidade: string | null;
          data_atualizacao: string | null;
          data_criacao: string | null;
          e_costureiro: boolean | null;
          email: string;
          endereco: string | null;
          especialidades: string[] | null;
          estado: string | null;
          id: string;
          media_avaliacao: number | null;
          nome_completo: string | null;
          nome_usuario: string | null;
          portfolio_url: string | null;
          telefone: string | null;
          tipo_usuario: string;
          total_avaliacoes: number | null;
          total_pedidos_concluidos: number | null;
        };
        Insert: {
          anos_experiencia?: number | null;
          avatar_url?: string | null;
          biografia?: string | null;
          cep?: string | null;
          cidade?: string | null;
          data_atualizacao?: string | null;
          data_criacao?: string | null;
          e_costureiro?: boolean | null;
          email: string;
          endereco?: string | null;
          especialidades?: string[] | null;
          estado?: string | null;
          id?: string;
          media_avaliacao?: number | null;
          nome_completo?: string | null;
          nome_usuario?: string | null;
          portfolio_url?: string | null;
          telefone?: string | null;
          tipo_usuario?: string;
          total_avaliacoes?: number | null;
          total_pedidos_concluidos?: number | null;
        };
        Update: {
          anos_experiencia?: number | null;
          avatar_url?: string | null;
          biografia?: string | null;
          cep?: string | null;
          cidade?: string | null;
          data_atualizacao?: string | null;
          data_criacao?: string | null;
          e_costureiro?: boolean | null;
          email?: string;
          endereco?: string | null;
          especialidades?: string[] | null;
          estado?: string | null;
          id?: string;
          media_avaliacao?: number | null;
          nome_completo?: string | null;
          nome_usuario?: string | null;
          portfolio_url?: string | null;
          telefone?: string | null;
          tipo_usuario?: string;
          total_avaliacoes?: number | null;
          total_pedidos_concluidos?: number | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
      PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
      PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
  ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;
