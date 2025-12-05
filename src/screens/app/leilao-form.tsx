import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Skeleton,
} from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import ROUTES from "../../config/routes.config";
import LeilaoService from "../../services/leilao.service";
import CategoriaService from "../../services/categoria.service";
import type { Categoria } from "../../models/categoria";
import dayjs from "dayjs";
import { StatusLeilaoConst } from "../../models/leilao";

const LeilaoForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  useEffect(() => {
    carregarCategorias();
    if (id) {
      carregarLeilao(id);
    }
  }, [id]);

  const carregarCategorias = async () => {
    try {
      const { data, status } = await CategoriaService.consultarTodos();
      if (status === 200) {
        setCategorias(data);
      }
    } catch (error) {
      toast.error("Erro ao carregar categorias");
    }
  };

  const carregarLeilao = async (id: string) => {
    setLoading(true);
    try {
      const { data, status } = await LeilaoService.consultar(id);
      if (status === 200) {
        form.setFieldsValue({
          ...data,
          dataHoraInicio: data.dataHoraInicio
            ? dayjs(data.dataHoraInicio)
            : null,
          dataHoraFim: data.dataHoraFim ? dayjs(data.dataHoraFim) : null,
          categoria: data.categoria?.id,
        });
      } else {
        toast.error("Erro ao carregar leilão");
        navigate("/" + ROUTES.LEILAO_LIST);
      }
    } catch (error) {
      toast.error("Erro ao carregar leilão");
      navigate("/" + ROUTES.LEILAO_LIST);
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values: any) => {
    const toastId = toast.loading("Salvando leilão...");
    try {
      const payload = {
        ...values,
        categoria: { id: values.categoria }, // Ajuste para enviar o objeto categoria com ID
      };

      let response;
      if (id) {
        response = await LeilaoService.atualizar(id, payload);
      } else {
        response = await LeilaoService.inserir(payload);
      }

      if (response.status === 200 || response.status === 201) {
        toast.success("Leilão salvo com sucesso!", { id: toastId });
        navigate("/" + ROUTES.LEILAO_LIST);
      } else {
        toast.error("Erro ao salvar leilão", { id: toastId });
      }
    } catch (error) {
      toast.error("Erro ao salvar leilão", { id: toastId });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center flex-grow p-4">
      <Card
        title={id ? "Editar Leilão" : "Novo Leilão"}
        className="w-full max-w-4xl"
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
              label="Título"
              name="titulo"
              rules={[
                { required: true, message: "O título é obrigatório" },
                {
                  min: 5,
                  max: 150,
                  message: "O título deve ter entre 5 e 150 caracteres",
                },
              ]}
            >
              <Input placeholder="Título do leilão" />
            </Form.Item>

            <Form.Item
              label="Descrição"
              name="descricao"
              rules={[
                { required: true, message: "A descrição é obrigatória" },
                {
                  max: 255,
                  message: "A descrição deve ter no máximo 255 caracteres",
                },
              ]}
            >
              <Input.TextArea rows={2} placeholder="Descrição resumida" />
            </Form.Item>

            <Form.Item label="Descrição Detalhada" name="descricaoDetalhada">
              <Input.TextArea rows={4} placeholder="Descrição detalhada" />
            </Form.Item>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                label="Data/Hora Início"
                name="dataHoraInicio"
                rules={[
                  {
                    required: true,
                    message: "A data de início é obrigatória",
                  },
                  {
                    validator: (_, value) => {
                      if (value && value < dayjs().add(10, "minute")) {
                        return Promise.reject(
                          new Error(
                            "A data de início deve ser pelo menos 10 minutos no futuro"
                          )
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <DatePicker
                  showTime
                  showSecond={false}
                  className="w-full"
                  disabledDate={(current) =>
                    current && current < dayjs().startOf("day")
                  }
                />
              </Form.Item>

              <Form.Item
                label="Data/Hora Fim"
                name="dataHoraFim"
                rules={[
                  { required: true, message: "A data de fim é obrigatória" },
                ]}
              >
                <DatePicker showTime className="w-full" />
              </Form.Item>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Form.Item
                label="Lance Mínimo"
                name="lanceMinimo"
                rules={[
                  { required: true, message: "O lance mínimo é obrigatório" },
                ]}
              >
                <InputNumber
                  prefix="R$"
                  className="w-full"
                  min={0}
                  precision={2}
                />
              </Form.Item>

              <Form.Item
                label="Valor Incremento"
                name="valorIncremento"
                rules={[
                  {
                    required: true,
                    message: "O valor de incremento é obrigatório",
                  },
                ]}
              >
                <InputNumber
                  prefix="R$"
                  className="w-full"
                  min={0.01}
                  precision={2}
                />
              </Form.Item>

              <Form.Item
                label="Status"
                name="status"
                initialValue={StatusLeilaoConst.ABERTO}
              >
                <Select>
                  {Object.values(StatusLeilaoConst).map((status) => (
                    <Select.Option key={status} value={status}>
                      {status}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            <Form.Item label="Categoria" name="categoria">
              <Select placeholder="Selecione uma categoria">
                {categorias.map((cat) => (
                  <Select.Option key={cat.id} value={cat.id}>
                    {cat.nome}
                  </Select.Option>
                ))}
              </Select>
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
              <Input.TextArea rows={2} placeholder="Observações" />
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

export default LeilaoForm;
