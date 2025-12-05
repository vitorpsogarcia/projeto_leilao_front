import { Button, Card, Form, Input, Skeleton } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import ROUTES from "../../config/routes.config";
import type { Categoria } from "../../models/categoria";
import CategoriaService from "../../services/categoria.service";

const CategoriaForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      carregarCategoria(id);
    }
  }, [id]);

  const carregarCategoria = async (id: string) => {
    setLoading(true);
    try {
      const { data, status } = await CategoriaService.consultar(id);
      if (status === 200) {
        form.setFieldsValue(data);
      } else {
        toast.error("Erro ao carregar categoria");
        navigate("/" + ROUTES.HOME);
      }
    } catch (error) {
      toast.error("Erro ao carregar categoria");
      navigate("/" + ROUTES.HOME);
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values: Categoria) => {
    const toastId = toast.loading("Salvando categoria...");
    try {
      let response;
      if (id) {
        response = await CategoriaService.atualizar(id, values);
      } else {
        response = await CategoriaService.inserir(values);
      }

      if (response.status === 200 || response.status === 201) {
        toast.success("Categoria salva com sucesso!", { id: toastId });
        navigate(-1); // Ou para a lista de categorias se houver
      } else {
        toast.error("Erro ao salvar categoria", { id: toastId });
      }
    } catch (error) {
      toast.error("Erro ao salvar categoria", { id: toastId });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center flex-grow p-4">
      <Card
        title={id ? "Editar Categoria" : "Nova Categoria"}
        className="w-full max-w-2xl"
      >
        {loading ? (
          <Skeleton active />
        ) : (
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              label="Nome"
              name="nome"
              rules={[
                { required: true, message: "O nome é obrigatório" },
                {
                  min: 3,
                  max: 100,
                  message: "O nome deve ter entre 3 e 100 caracteres",
                },
              ]}
            >
              <Input placeholder="Digite o nome da categoria" />
            </Form.Item>

            <Form.Item
              label="Observação"
              name="observacao"
              rules={[
                {
                  max: 255,
                  message: "A observação deve ter no máximo 255 caracteres",
                },
              ]}
            >
              <Input.TextArea
                rows={4}
                placeholder="Digite uma observação (opcional)"
              />
            </Form.Item>

            <div className="flex justify-end gap-2">
              <Button onClick={() => navigate(-1)}>Cancelar</Button>
              <Button type="primary" htmlType="submit">
                Salvar
              </Button>
            </div>
          </Form>
        )}
      </Card>
    </div>
  );
};

export default CategoriaForm;
