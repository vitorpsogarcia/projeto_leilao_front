import { useNavigate } from "react-router";
import ROUTES from "../config/routes.config";
import { Avatar, Button, Dropdown, type MenuProps } from "antd";
import {
  AppstoreOutlined,
  HomeOutlined,
  LoginOutlined,
  UserOutlined,
  UnorderedListOutlined,
  TeamOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import useUserStore from "../stores/userStore";
import { useCallback } from "react";
import autenticacaoService from "../services/autenticacao.service";
import { TipoPerfil } from "../models/user";

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

  const configItems: MenuProps["items"] = [
    {
      key: "leiloes",
      label: "Leilões",
      icon: <UnorderedListOutlined />,
      onClick: () => handleNavigation("/" + ROUTES.LEILAO_LIST),
    },
    {
      key: "usuarios",
      label: "Usuários",
      icon: <TeamOutlined />,
      onClick: () => handleNavigation("/" + ROUTES.PESSOA_LIST),
    },
    {
      key: "categorias",
      label: "Categorias",
      icon: <AppstoreOutlined />,
      onClick: () => handleNavigation("/" + ROUTES.CATEGORIA_LIST),
    },
  ];

  return (
    <header className="bg-blue-500 text-white p-4 grid grid-cols-3">
      <h1>Leilão</h1>
      <nav className="col-span-2">
        <ul className="flex justify-end space-x-4">
          {Boolean(user)
            ? [
                <li key="header-home">
                  <Button
                    variant="outlined"
                    onClick={() => handleNavigation("/" + ROUTES.HOME)}
                  >
                    <HomeOutlined />
                    <span className="hidden sm:block">Home</span>
                  </Button>
                </li>,
                user?.perfis?.includes(TipoPerfil.ADMIN) && (
                  <li key="header-config">
                    <Dropdown
                      menu={{ items: configItems }}
                      placement="bottomRight"
                    >
                      <Button variant="outlined">
                        <SettingOutlined />
                        <span className="hidden sm:block">Configurações</span>
                      </Button>
                    </Dropdown>
                  </li>
                ),
                <Avatar
                  key="header-avatar"
                  className="cursor-pointer"
                  alt={user?.nome}
                  shape="square"
                  onClick={handleLogout}
                  src={user?.fotoPerfil}
                  icon={<UserOutlined />}
                  children={user?.nome.charAt(0).toUpperCase()}
                />,
              ]
            : [
                <li key="header-login">
                  <Button
                    onClick={() =>
                      handleNavigation("/" + ROUTES.AUTH + "/" + ROUTES.LOGIN)
                    }
                  >
                    <LoginOutlined />
                    <span className="hidden sm:block">Login</span>
                  </Button>
                </li>,
                <li key="header-signup">
                  <Button
                    type="primary"
                    onClick={() =>
                      handleNavigation("/" + ROUTES.AUTH + "/" + ROUTES.SIGN_UP)
                    }
                  >
                    <UserOutlined />
                    <span className="hidden sm:block">Cadastre-se</span>
                  </Button>
                </li>,
              ]}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
