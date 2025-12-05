import type { Categoria } from "./categoria";
import type { Lance } from "./lance";
import type { User } from "./user";

// ABERTO, CANCELADO, EM_ANALISE, ENCERRADO
export const StatusLeilaoConst = {
  ABERTO: "ABERTO",
  CANCELADO: "CANCELADO",
  EM_ANALISE: "EM_ANALISE",
  ENCERRADO: "ENCERRADO",
} as const;

export type StatusLeilao =
  (typeof StatusLeilaoConst)[keyof typeof StatusLeilaoConst];

export type Leilao = {
  id?: number;
  titulo: string;
  descricao: string;
  descricaoDetalhada?: string;
  dataHoraInicio: string;
  dataHoraFim: string;
  status: StatusLeilao;
  observacao?: string;
  valorIncremento: number;
  lanceMinimo: number;
  pessoa?: User;
  categoria?: Categoria;
  imagens?: any[]; // Definir melhor se possível
  lances?: Lance[];
  pagamento?: any; // Definir melhor se possível
  criadoEm?: string;
  atualizadoEm?: string;
  excluidoEm?: string;
};
