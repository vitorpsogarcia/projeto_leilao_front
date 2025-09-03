import { Button, Card, Form, Input } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import ROUTES from "../../config/routes.config";
import FormItem from "antd/es/form/FormItem";
import { REGEX } from "../../const";
import AutenticacaoService from "../../services/autenticacao.service";
import { toast } from "sonner";

type FormInputs = {
  nome: string;
  cpf: string;
  email: string;
  senha: string;
};

// type PasswordPopoverContentProps = {
//   hasLowercase?: boolean;
//   hasUppercase?: boolean;
//   hasNumber?: boolean;
//   hasSymbol?: boolean;
//   hasMinLength?: boolean;
// };

// const PasswordPopoverContent = ({
//   hasLowercase,
//   hasUppercase,
//   hasNumber,
//   hasSymbol,
//   hasMinLength,
// }: PasswordPopoverContentProps) => {
//   const CriteriaItem = ({
//     isValid,
//     text,
//   }: {
//     isValid: boolean;
//     text: string;
//   }) => (
//     <div
//       className={`flex items-center gap-1 ${
//         isValid ? "text-green-600" : "text-red-600"
//       }`}
//     >
//       {isValid ? <CheckOutlined /> : <CloseOutlined />}
//       <span>{text}</span>
//     </div>
//   );

//   return (
//     <div className="text-sm">
//       <div className="mb-2 font-medium">A senha deve conter pelo menos:</div>
//       <div className="flex flex-col gap-1 w-full">
//         <CriteriaItem
//           isValid={hasMinLength || false}
//           text="Mínimo 8 caracteres"
//         />
//         <CriteriaItem
//           isValid={hasUppercase || false}
//           text="1 letra Maiúscula"
//         />
//         <CriteriaItem
//           isValid={hasLowercase || false}
//           text="1 letra Minúscula"
//         />
//         <CriteriaItem isValid={hasNumber || false} text="1 número" />
//         <CriteriaItem
//           isValid={hasSymbol || false}
//           text="1 caractere especial"
//         />
//       </div>
//     </div>
//   );
// };

const SignUp = () => {
  const navigate = useNavigate();
  const validatePassword = (password: string) => {
    let mensagem = "";

    if (!/[a-z]/.test(password)) mensagem += "uma letra minúscula,\n ";
    if (!/[A-Z]/.test(password)) mensagem += "uma letra maiúscula,\n ";
    if (!/\d/.test(password)) mensagem += "um número,\n ";
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password))
      mensagem += "um caractere especial,\n ";
    if (password.length < 8) mensagem += "mínimo 8 caracteres,\n ";

    return mensagem;
  };

  const onSubmit = async (values: FormInputs) => {
    const id = toast.loading("Salvando Cadastro");
    try {
      const { status } = await AutenticacaoService.registrar(values);
      if (status === 200) {
        toast.success("Cadastro realizado com sucesso!", {
          id,
        });
        navigate(`/${ROUTES.AUTH}/${ROUTES.LOGIN}`);
      }
    } catch (e) {
      toast.dismiss(id);
    }
  };

  return (
    <div className="flex flex-grow justify-center items-center">
      <Card
        title="Nova Conta"
        className="w-fit items-center justify-center p-4 gap-4"
      >
        <Form
          name="login-form"
          initialValues={{}}
          className="grid items-center min-w-40 max-w-96 w-full md:max-w-2xl md:grid-cols-2 md:gap-y-2 md:gap-x-4"
          autoComplete="off"
          autoCapitalize="none"
          onFinish={onSubmit}
          onValuesChange={(changedValues) => {
            if ("senha" in changedValues) {
              validatePassword(changedValues.senha);
            }
          }}
          size="large"
        >
          <FormItem<FormInputs>
            label="Nome"
            name="nome"
            layout="vertical"
            className="w-full"
            rules={[
              {
                required: true,
                message: "Seu nome é obrigatório",
              },
            ]}
          >
            <Input placeholder="Nome" />
          </FormItem>
          <FormItem<FormInputs>
            label="CPF (sem traço ou pontuações)"
            name="cpf"
            layout="vertical"
            className="w-full"
            normalize={(value: string) => value.replaceAll(REGEX.NON_DIGIT, "")}
            rules={[
              { required: true, message: "CPF Obrigatório" },
              { min: 11, max: 11, message: "CPF Invalido" },
            ]}
          >
            <Input
              inputMode="numeric"
              placeholder="12345678900"
              maxLength={11}
            />
          </FormItem>
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
            required
            validateTrigger="onChange"
            rules={[
              {
                validator: (_, value) => {
                  const validation = validatePassword(value || "");
                  const isValid = !validation;
                  if (isValid || !value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("A senha não atende aos critérios: " + validation)
                  );
                },
              },
            ]}
            className="w-full"
          >
            <Input.Password
              autoComplete="off"
              placeholder="Senha"
              prefix={<LockOutlined />}
            />
          </Form.Item>
          <div className="flex justify-around w-full md:col-span-2 ">
            <Button htmlType="reset" onClick={() => navigate(-1)}>
              Cancelar
            </Button>
            <Button type="primary" htmlType="submit">
              Criar conta
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default SignUp;
