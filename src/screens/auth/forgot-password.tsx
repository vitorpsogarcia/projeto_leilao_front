import { Button, Form, Input } from "antd";
import { MailOutlined } from "@ant-design/icons";
import AutenticacaoService from "../../services/autenticacao.service";
import { useNavigate } from "react-router";
import ROUTES from "../../config/routes.config";
import { toast } from "sonner";

type FormInputs = {
  email: string;
};

const ForgotPassword = () => {
  const navigate = useNavigate();

  const onSubmit = async (values: FormInputs) => {
    const id = toast.loading("Enviando solicitação...");
    try {
      const { status } = await AutenticacaoService.recuperarSenha(values.email);
      if (status === 200) {
        toast.success("Email de recuperação enviado!", { id });
        navigate(
          "/" +
            ROUTES.AUTH +
            "/" +
            ROUTES.RESET_PASSWORD +
            `?email=${values.email}`
        );
      } else {
        toast.error("Erro ao enviar email.", { id });
      }
    } catch (e) {
      toast.error("Erro ao enviar email.", { id });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center flex-grow p-4 gap-4">
      <h2>Recuperar Senha</h2>
      <Form
        name="forgot-password-form"
        className="flex flex-col items-center min-w-40 max-w-96 w-full"
        onFinish={onSubmit}
        size="large"
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
        <div className="flex justify-between w-full gap-4">
          <Button onClick={() => navigate(-1)} className="w-full">
            Cancelar
          </Button>
          <Button type="primary" htmlType="submit" className="w-full">
            Recuperar Senha
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ForgotPassword;
