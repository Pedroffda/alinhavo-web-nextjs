import { Database } from "./database";

export type IPedidos = Database["public"]["Tables"]["pedidos"]["Row"];

export type IResponse<T> = {
  data: T;
  error: Error | null;
};

export type IResponseList<T> = {
  data: T[];
  error: Error | null;
};
