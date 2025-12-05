import BaseService from "./base.service";

class CategoriaService extends BaseService {
  constructor() {
    super("/categorias");
  }
}

export default new CategoriaService();
