import type { Leilao } from "./leilao";
import type { User } from "./user";

export type Lance = {
  id?: number;
  valorLance: number;
  dataHora: string;
  pessoa?: User;
  leilao?: Leilao;
  criadoEm?: string;
  atualizadoEm?: string;
  excluidoEm?: string;
};
