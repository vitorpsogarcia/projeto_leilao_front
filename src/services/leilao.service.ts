import BaseService from "./base.service";

class LeilaoService extends BaseService {
  constructor() {
    super("/leiloes");
  }
}

export default new LeilaoService();
