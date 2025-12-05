import {
  Button,
  Card,
  Col,
  Popconfirm,
  Row,
  Skeleton,
  Tag,
  Tooltip,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import ROUTES from "../../config/routes.config";
import { StatusLeilaoConst, type Leilao } from "../../models/leilao";
import type { StatusLeilao } from "../../models/leilao";
import LeilaoService from "../../services/leilao.service";
import useUserStore from "../../stores/userStore";
import dayjs from "dayjs";

const LeilaoList = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const [leiloes, setLeiloes] = useState<Leilao[]>([]);
  const [loading, setLoading] = useState(false);

  const carregarLeiloes = async () => {
    setLoading(true);
    try {
      const { data, status } = await LeilaoService.consultarTodos();
      if (status === 200) {
        setLeiloes(data);
      } else {
        toast.error("Erro ao carregar leilões");
      }
    } catch (error) {
      toast.error("Erro ao carregar leilões");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarLeiloes();
  }, []);

  const handleExcluir = async (id: number) => {
    const toastId = toast.loading("Excluindo leilão...");
    try {
      const { status } = await LeilaoService.excluir(id.toString());
      if (status === 200 || status === 204) {
        toast.success("Leilão excluído com sucesso!", { id: toastId });
        carregarLeiloes();
      } else {
        toast.error("Erro ao excluir leilão", { id: toastId });
      }
    } catch (error) {
      toast.error("Erro ao excluir leilão", { id: toastId });
    }
  };

  const getStatusColor = (status: StatusLeilao) => {
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

  return (
    <div className="flex flex-col items-center flex-grow p-4 w-full">
      <div className="w-full max-w-6xl mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Leilões</h2>
        {user && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/" + ROUTES.LEILAO_FORM)}
          >
            Novo Leilão
          </Button>
        )}
      </div>

      {loading ? (
        <Skeleton active />
      ) : (
        <Row gutter={[16, 16]} className="w-full max-w-6xl">
          {leiloes.map((leilao) => (
            <Col xs={24} sm={12} md={8} lg={6} key={leilao.id}>
              <Card
                title={leilao.titulo}
                extra={
                  <Tag color={getStatusColor(leilao.status)}>
                    {leilao.status}
                  </Tag>
                }
                actions={
                  user && user.id === leilao.pessoa?.id
                    ? [
                        <Tooltip title="Editar">
                          <EditOutlined
                            key="edit"
                            onClick={() =>
                              navigate(
                                "/" + ROUTES.LEILAO_FORM + "/" + leilao.id
                              )
                            }
                          />
                        </Tooltip>,
                        <Popconfirm
                          title="Excluir leilão"
                          description="Tem certeza que deseja excluir este leilão?"
                          onConfirm={() =>
                            leilao.id && handleExcluir(leilao.id)
                          }
                          okText="Sim"
                          cancelText="Não"
                        >
                          <Tooltip title="Excluir">
                            <DeleteOutlined
                              key="delete"
                              className="text-red-500"
                            />
                          </Tooltip>
                        </Popconfirm>,
                        <Tooltip title="Visualizar">
                          <EyeOutlined
                            key="view"
                            onClick={() =>
                              navigate(
                                "/" + ROUTES.LEILAO_LIST + "/" + leilao.id
                              )
                            }
                          />
                        </Tooltip>,
                      ]
                    : [
                        <Tooltip title="Visualizar">
                          <EyeOutlined
                            key="view"
                            onClick={() =>
                              navigate(
                                "/" + ROUTES.LEILAO_LIST + "/" + leilao.id
                              )
                            }
                          />
                        </Tooltip>,
                      ]
                }
              >
                <div
                  className="cursor-pointer"
                  onClick={() =>
                    navigate("/" + ROUTES.LEILAO_LIST + "/" + leilao.id)
                  }
                >
                  <p className="line-clamp-3 mb-2">{leilao.descricao}</p>
                  <p>
                    <strong>Lance Mínimo:</strong> R${" "}
                    {leilao.lanceMinimo.toFixed(2)}
                  </p>
                  <p>
                    <strong>Início:</strong>{" "}
                    {dayjs(leilao.dataHoraInicio).format("DD/MM/YYYY HH:mm")}
                  </p>
                  <p>
                    <strong>Fim:</strong>{" "}
                    {dayjs(leilao.dataHoraFim).format("DD/MM/YYYY HH:mm")}
                  </p>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default LeilaoList;
