import { Button, Form, Input } from "antd";
import { LockOutlined, MailOutlined, NumberOutlined } from "@ant-design/icons";
import AutenticacaoService from "../../services/autenticacao.service";
import { useNavigate, useSearchParams } from "react-router";
import ROUTES from "../../config/routes.config";
import { toast } from "sonner";

type FormInputs = {
  email: string;
  codigo: string;
  novaSenha: string;
  confirmarSenha: string;
};

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";

  const onSubmit = async (values: FormInputs) => {
    const id = toast.loading("Alterando senha...");
    try {
      const { status } = await AutenticacaoService.alterarSenha({
        email: values.email,
        codigo: values.codigo,
        senha: values.novaSenha,
      });
      if (status === 200) {
        toast.success("Senha alterada com sucesso!", { id });
        navigate("/" + ROUTES.AUTH + "/" + ROUTES.LOGIN);
      } else {
        toast.error("Erro ao alterar senha.", { id });
      }
    } catch (e) {
      toast.error("Erro ao alterar senha.", { id });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center flex-grow p-4 gap-4">
      <h2>Recuperar Senha</h2>
      <Form
        name="reset-password-form"
        className="flex flex-col items-center min-w-40 max-w-96 w-full"
        onFinish={onSubmit}
        size="large"
        initialValues={{ email }}
      >
        <Form.Item<FormInputs>
          label={"E-Mail"}
          name="email"
          layout="vertical"
          rules={[
            { required: true, message: "Por favor insira seu email!" },
            { type: "email", message: "Insira um email válido." },
          ]}
          className="w-full"
        >
          <Input placeholder="Email" prefix={<MailOutlined />} />
        </Form.Item>
        <Form.Item<FormInputs>
          label={"Código"}
          name="codigo"
          layout="vertical"
          rules={[{ required: true, message: "Por favor insira o código!" }]}
          className="w-full"
        >
          <Input placeholder="Código" prefix={<NumberOutlined />} />
        </Form.Item>
        <Form.Item<FormInputs>
          label="Nova Senha"
          name="novaSenha"
          layout="vertical"
          rules={[
            { required: true, message: "Por favor insira sua nova senha!" },
          ]}
          className="w-full"
        >
          <Input.Password placeholder="Nova Senha" prefix={<LockOutlined />} />
        </Form.Item>
        <Form.Item<FormInputs>
          label="Confirmar Senha"
          name="confirmarSenha"
          layout="vertical"
          dependencies={["novaSenha"]}
          rules={[
            { required: true, message: "Por favor confirme sua senha!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("novaSenha") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("As senhas não coincidem!"));
              },
            }),
          ]}
          className="w-full"
        >
          <Input.Password
            placeholder="Confirmar Senha"
            prefix={<LockOutlined />}
          />
        </Form.Item>
        <div className="flex justify-between w-full gap-4">
          <Button onClick={() => navigate(-1)} className="w-full">
            Cancelar
          </Button>
          <Button type="primary" htmlType="submit" className="w-full">
            Alterar Senha
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ResetPassword;
