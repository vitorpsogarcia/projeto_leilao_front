export const TipoPerfil = {
  ADMIN: "ADMIN",
  COMPRADOR: "COMPRADOR",
  VENDEDOR: "VENDEDOR",
} as const;

export type TipoPerfil = (typeof TipoPerfil)[keyof typeof TipoPerfil];

export type User = {
  id: number;
  nome: string;
  email: string;
  cpf?: string;
  ativo: boolean;
  fotoPerfil?: string; // Base64 ou URL
  perfis: TipoPerfil[];
  criadoEm?: string;
  atualizadoEm?: string;
  excluidoEm?: string;
};
