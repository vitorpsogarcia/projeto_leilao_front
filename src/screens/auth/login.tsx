import { Button, Form, Input } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import AutenticacaoService from "../../services/autenticacao.service";
import useUserStore from "../../stores/userStore";
import { useNavigate } from "react-router";
import ROUTES from "../../config/routes.config";

type FormInputs = {
  email: string;
  senha: string;
};

const Login = () => {
  const { setUser } = useUserStore();
  const navigate = useNavigate();
  const onSubmit = async (values: FormInputs) => {
    const { status, data } = await AutenticacaoService.login(
      values.email,
      values.senha
    );
    if (status === 200) {
      setUser(data);
      navigate("/" + ROUTES.HOME);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center flex-grow p-4 gap-4">
      <h2>Entre com suas credenciais</h2>
      <Form
        name="login-form"
        initialValues={{}}
        className="flex flex-col items-center min-w-40 max-w-96 w-full"
        autoComplete="off"
        autoCapitalize="none"
        onFinish={onSubmit}
        size="large"
        style={{
          gap: 0,
        }}
      >
        <Form.Item<FormInputs>
          label={"E-Mail"}
          name="email"
          layout="vertical"
          rules={[
            {
              required: true,
              message: "Por favor insira seu email!",
            },
            {
              type: "email",
              message: "Insira um email válido.",
            },
          ]}
          className="w-full"
        >
          <Input placeholder="Email" prefix={<MailOutlined />} />
        </Form.Item>
        <Form.Item<FormInputs>
          label="Senha"
          name="senha"
          layout="vertical"
          rules={[
            {
              required: true,
              message: "Por favor insira sua senha!",
            },
          ]}
          className="w-full"
          style={{
            marginBottom: "5px",
          }}
        >
          <Input.Password placeholder="Senha" prefix={<LockOutlined />} />
        </Form.Item>
        <span className="mb-4 mt-2">
          Não tem conta?{" "}
          <Button
            size="small"
            type="link"
            onClick={() => navigate("/" + ROUTES.AUTH + "/" + ROUTES.SIGN_UP)}
          >
            Crie uma agora mesmo
          </Button>
        </span>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Entrar
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
