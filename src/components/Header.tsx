import { useNavigate } from "react-router";
import ROUTES from "../config/routes.config";
import { Avatar, Button } from "antd";
import {
  AppstoreOutlined,
  HomeOutlined,
  LoginOutlined,
  UserOutlined,
} from "@ant-design/icons";
import useUserStore from "../stores/userStore";
import { useCallback } from "react";
import autenticacaoService from "../services/autenticacao.service";

const Header = () => {
  const navigate = useNavigate();
  const { user, clearUser } = useUserStore();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogout = useCallback(() => {
    clearUser();
    autenticacaoService.logout();
    navigate("/");
  }, [clearUser, navigate]);

  return (
    <header className="bg-blue-500 text-white p-4 grid grid-cols-3">
      <h1>Leilão</h1>
      <nav className="col-span-2">
        <ul className="flex justify-end space-x-4">
          {Boolean(user) ? (
            [
              <li key="header-home">
                <Button
                  variant="outlined"
                  onClick={() => handleNavigation("/" + ROUTES.HOME)}
                >
                  <HomeOutlined />
                  <span className="hidden sm:block">Home</span>
                </Button>
              </li>,
              <li key="header-categorias">
                <Button
                  variant="outlined"
                  onClick={() => handleNavigation("/" + ROUTES.CATEGORIA_LIST)}
                >
                  <AppstoreOutlined />
                  <span className="hidden sm:block">Categorias</span>
                </Button>
              </li>,
              <Avatar
                key="header-avatar"
                className="cursor-pointer"
                alt={user?.nome}
                shape="square"
                onClick={handleLogout}
                src={user?.avatar}
                icon={<UserOutlined />}
                children={user?.nome.charAt(0).toUpperCase()}
              />,
            ]
          ) : (
            <li>
              <Button
                onClick={() =>
                  handleNavigation("/" + ROUTES.AUTH + "/" + ROUTES.LOGIN)
                }
              >
                <LoginOutlined />
                <span className="hidden sm:block">Login</span>
              </Button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
