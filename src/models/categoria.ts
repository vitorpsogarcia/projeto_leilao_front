import type { User } from "./user";

export type Categoria = {
  id?: number;
  nome: string;
  observacao?: string;
  pessoa?: User;
  criadoEm?: string;
  atualizadoEm?: string;
  excluidoEm?: string;
};
