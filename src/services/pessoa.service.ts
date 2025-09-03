import BaseService from "./base.service";

class PessoaService extends BaseService {
  constructor() {
    super("/pessoas");
  }
}

export default new PessoaService();
