import type { AxiosInstance } from "axios";
import api from "../config/axios.config";

class BaseService {
  protected endpoint: string;
  protected api: AxiosInstance;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
    this.api = api;
  }

  async inserir(dados: any) {
    const resposta = await this.api.post(this.endpoint, dados);
    return resposta;
  }

  async excluir(id: string) {
    const resposta = await this.api.delete(`${this.endpoint}/${id}`);
    return resposta;
  }

  async atualizar(id: string, dados: any) {
    const resposta = await this.api.put(`${this.endpoint}/${id}`, dados);
    return resposta;
  }

  async consultar(id: string) {
    const resposta = await this.api.get(`${this.endpoint}/${id}`);
    return resposta;
  }

  async consultarTodos() {
    const resposta = await this.api.get(this.endpoint);
    return resposta;
  }
}

export default BaseService;
