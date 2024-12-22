import { Database } from "./database";

export type IPedidos = Database["public"]["Tables"]["pedidos"]["Row"];
export type IPropostas = Database["public"]["Tables"]["propostas"]["Row"];
export type IUsuarios = Database["public"]["Tables"]["usuarios"]["Row"];

// pedidos com propostas e usuários
export type IPedidosCompletos = IPedidos & {
  propostas: IPropostas[];
  usuarios: IUsuarios;
};

// propostas com usuários
export type IPropostasCompletas = IPropostas & {
  usuarios: IUsuarios;
};

// usuários com pedidos
export type IUsuariosCompletos = IUsuarios & {
  pedidos: IPedidos[];
};

export type IResponse<T> = {
  data: T;
  error: Error | null;
};

export type IResponseList<T> = {
  data: T[];
  error: Error | null;
};
