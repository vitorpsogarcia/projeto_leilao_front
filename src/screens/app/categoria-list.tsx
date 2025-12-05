import { Button, Card, Popconfirm, Table, Tooltip } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import ROUTES from "../../config/routes.config";
import type { Categoria } from "../../models/categoria";
import CategoriaService from "../../services/categoria.service";

const CategoriaList = () => {
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(false);

  const carregarCategorias = async () => {
    setLoading(true);
    try {
      const { data, status } = await CategoriaService.consultarTodos();
      if (status === 200) {
        setCategorias(data);
      } else {
        toast.error("Erro ao carregar categorias");
      }
    } catch (error) {
      toast.error("Erro ao carregar categorias");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarCategorias();
  }, []);

  const handleExcluir = async (id: number) => {
    const toastId = toast.loading("Excluindo categoria...");
    try {
      const { status } = await CategoriaService.excluir(id.toString());
      if (status === 200 || status === 204) {
        toast.success("Categoria excluída com sucesso!", { id: toastId });
        carregarCategorias();
      } else {
        toast.error("Erro ao excluir categoria", { id: toastId });
      }
    } catch (error) {
      toast.error("Erro ao excluir categoria", { id: toastId });
    }
  };

  const columns = [
    {
      title: "Nome",
      dataIndex: "nome",
      key: "nome",
    },
    {
      title: "Observação",
      dataIndex: "observacao",
      key: "observacao",
      responsive: ["md"],
    },
    {
      title: "Ações",
      key: "acoes",
      width: 100,
      render: (_: any, record: Categoria) => (
        <div className="flex gap-2">
          <Tooltip title="Editar">
            <Button
              icon={<EditOutlined />}
              onClick={() =>
                navigate("/" + ROUTES.CATEGORIA_FORM + "/" + record.id)
              }
            />
          </Tooltip>
          <Popconfirm
            title="Excluir categoria"
            description="Tem certeza que deseja excluir esta categoria?"
            onConfirm={() => record.id && handleExcluir(record.id)}
            okText="Sim"
            cancelText="Não"
          >
            <Tooltip title="Excluir">
              <Button danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col items-center flex-grow p-4 w-full">
      <Card
        title="Categorias"
        className="w-full max-w-4xl"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/" + ROUTES.CATEGORIA_FORM)}
          >
            Nova
          </Button>
        }
      >
        <Table
          dataSource={categorias}
          columns={columns as any}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: true }}
        />
      </Card>
    </div>
  );
};

export default CategoriaList;
