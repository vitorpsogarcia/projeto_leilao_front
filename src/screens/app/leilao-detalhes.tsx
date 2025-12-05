import {
  Button,
  Card,
  Descriptions,
  InputNumber,
  List,
  Skeleton,
  Statistic,
  Tag,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import ROUTES from "../../config/routes.config";
import { StatusLeilaoConst } from "../../models/leilao";
import type { Leilao } from "../../models/leilao";
import LeilaoService from "../../services/leilao.service";
import LanceService from "../../services/lance.service";
import useUserStore from "../../stores/userStore";
import dayjs from "dayjs";
import { DollarOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const LeilaoDetalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUserStore();
  const [leilao, setLeilao] = useState<Leilao | null>(null);
  const [loading, setLoading] = useState(false);
  const [valorLance, setValorLance] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      carregarLeilao(id);
    }
  }, [id]);

  const carregarLeilao = async (id: string) => {
    setLoading(true);
    try {
      const { data, status } = await LeilaoService.consultar(id);
      if (status === 200) {
        // Ordenar lances do mais recente para o mais antigo
        if (data.lances) {
          data.lances.sort((a: any, b: any) =>
            dayjs(b.dataHora).diff(dayjs(a.dataHora))
          );
        }
        setLeilao(data);
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

  const getMaiorLance = () => {
    if (!leilao?.lances || leilao.lances.length === 0) return 0;
    return leilao.lances[0].valorLance;
  };

  const getProximoLanceMinimo = () => {
    const maiorLance = getMaiorLance();
    if (maiorLance === 0) return leilao?.lanceMinimo || 0;
    return maiorLance + (leilao?.valorIncremento || 0);
  };

  const handleLance = async (valor: number) => {
    if (!user) {
      toast.error("Você precisa estar logado para dar um lance");
      navigate("/" + ROUTES.AUTH + "/" + ROUTES.LOGIN);
      return;
    }

    if (!leilao) return;

    const minimo = getProximoLanceMinimo();
    if (valor < minimo) {
      toast.error(
        `O valor do lance deve ser de no mínimo R$ ${minimo.toFixed(2)}`
      );
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading("Enviando lance...");
    try {
      const payload = {
        valorLance: valor,
        dataHora: dayjs().toISOString(),
        leilao: { id: leilao.id },
        pessoa: { id: user.id }, // Assumindo que o userStore tem o ID do usuário
      };

      const { status } = await LanceService.inserir(payload);
      if (status === 200 || status === 201) {
        toast.success("Lance enviado com sucesso!", { id: toastId });
        setValorLance(null);
        carregarLeilao(leilao.id!.toString());
      } else {
        toast.error("Erro ao enviar lance", { id: toastId });
      }
    } catch (error) {
      toast.error("Erro ao enviar lance", { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case StatusLeilaoConst.ABERTO:
        return "blue";
      case StatusLeilaoConst.EM_ANALISE:
        return "green";
      case StatusLeilaoConst.ENCERRADO:
        return "red";
      case StatusLeilaoConst.CANCELADO:
        return "gray";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <div className="p-4 flex justify-center">
        <Skeleton active />
      </div>
    );
  }

  if (!leilao) return null;

  const proximoLanceMinimo = getProximoLanceMinimo();
  const isLeilaoAtivo = leilao.status === StatusLeilaoConst.ABERTO;

  return (
    <div className="flex flex-col items-center flex-grow p-4 w-full">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Detalhes do Leilão */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="flex justify-between items-start mb-4">
              <Title level={2} style={{ margin: 0 }}>
                {leilao.titulo}
              </Title>
              <Tag
                color={getStatusColor(leilao.status)}
                className="text-lg p-1 px-3"
              >
                {leilao.status}
              </Tag>
            </div>

            <Descriptions bordered column={1}>
              <Descriptions.Item label="Início">
                {dayjs(leilao.dataHoraInicio).format("DD/MM/YYYY HH:mm")}
              </Descriptions.Item>
              <Descriptions.Item label="Fim">
                {dayjs(leilao.dataHoraFim).format("DD/MM/YYYY HH:mm")}
              </Descriptions.Item>
              <Descriptions.Item label="Lance Mínimo">
                R$ {leilao.lanceMinimo.toFixed(2)}
              </Descriptions.Item>
              <Descriptions.Item label="Incremento Mínimo">
                R$ {leilao.valorIncremento.toFixed(2)}
              </Descriptions.Item>
            </Descriptions>

            <div className="mt-6">
              <Title level={4}>Descrição</Title>
              <Text>{leilao.descricao}</Text>
            </div>

            {leilao.descricaoDetalhada && (
              <div className="mt-4">
                <Title level={5}>Detalhes</Title>
                <Text>{leilao.descricaoDetalhada}</Text>
              </div>
            )}
          </Card>

          {/* Histórico de Lances */}
          <Card title="Histórico de Lances">
            <List
              itemLayout="horizontal"
              dataSource={leilao.lances || []}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={`R$ ${item.valorLance.toFixed(2)}`}
                    description={
                      <span>
                        {item.pessoa?.nome || "Usuário"} -{" "}
                        {dayjs(item.dataHora).format("DD/MM/YYYY HH:mm:ss")}
                      </span>
                    }
                  />
                </List.Item>
              )}
              locale={{ emptyText: "Nenhum lance registrado ainda." }}
            />
          </Card>
        </div>

        {/* Área de Lances */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <Statistic
              title="Lance Atual"
              value={getMaiorLance()}
              precision={2}
              prefix={<DollarOutlined />}
              suffix="BRL"
              valueStyle={{ color: "#3f8600" }}
            />

            {isLeilaoAtivo && (
              <div className="mt-6 space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <Text type="secondary" className="block mb-2">
                    Próximo lance mínimo:
                  </Text>
                  <Title level={3} style={{ margin: 0, color: "#1677ff" }}>
                    R$ {proximoLanceMinimo.toFixed(2)}
                  </Title>
                </div>

                <Button
                  type="primary"
                  block
                  size="large"
                  onClick={() => handleLance(proximoLanceMinimo)}
                  loading={submitting}
                >
                  Dar lance de R$ {proximoLanceMinimo.toFixed(2)}
                </Button>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">
                      Ou defina um valor
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <InputNumber
                    className="w-full"
                    prefix="R$"
                    placeholder="Outro valor"
                    min={proximoLanceMinimo}
                    step={leilao.valorIncremento}
                    precision={2}
                    value={valorLance}
                    onChange={setValorLance}
                  />
                  <Button
                    onClick={() => valorLance && handleLance(valorLance)}
                    disabled={!valorLance || valorLance < proximoLanceMinimo}
                    loading={submitting}
                  >
                    Enviar
                  </Button>
                </div>
              </div>
            )}

            {!isLeilaoAtivo && (
              <div className="mt-6 p-4 bg-gray-100 rounded text-center">
                <Text strong>Este leilão não está aceitando lances.</Text>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LeilaoDetalhes;
