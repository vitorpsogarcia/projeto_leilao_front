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

  async registrar(dados: any) {
    const resposta = await this.api.post(`${this.endpoint}/registrar`, dados);
    return resposta;
  }
}

export default new AutenticacaoService();
