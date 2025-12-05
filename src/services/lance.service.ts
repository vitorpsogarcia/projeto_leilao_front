import BaseService from "./base.service";

class LanceService extends BaseService {
  constructor() {
    super("/lances");
  }
}

export default new LanceService();
