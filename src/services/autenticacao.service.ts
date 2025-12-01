import BaseService from "./base.service";

class AutenticacaoService extends BaseService {
  constructor() {
    super("/autenticacao");
  }

  async login(email: string, senha: string) {
    const resposta = await this.api.post(`${this.endpoint}/login`, {
      email,
      senha,
    });
    return resposta;
  }

  async logout() {
    const resposta = await this.api.get(`${this.endpoint}/logout`);
    return resposta;
  }

  async registrar(dados: {
    nome: string;
    cpf: string;
    email: string;
    senha: string;
  }) {
    const resposta = await this.api.post(`${this.endpoint}/registrar`, dados);
    return resposta;
  }

  async recuperarSenha(email: string) {
    const resposta = await this.api.post(`${this.endpoint}/recuperar-senha`, {
      email,
    });
    return resposta;
  }

  async alterarSenha(dados: { email: string; codigo: string; senha: string }) {
    const resposta = await this.api.post(
      `${this.endpoint}/alterar-senha`,
      dados
    );
    return resposta;
  }
}

export default new AutenticacaoService();
