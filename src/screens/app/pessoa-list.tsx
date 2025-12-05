import { Avatar, Card, Select, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { TipoPerfil } from "../../models/user";
import type { User } from "../../models/user";
import PessoaService from "../../services/pessoa.service";
import { UserOutlined } from "@ant-design/icons";

const PessoaList = () => {
  const [pessoas, setPessoas] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const carregarPessoas = async () => {
    setLoading(true);
    try {
      const { data, status } = await PessoaService.consultarTodos();
      if (status === 200) {
        // Verifica se data é um array ou se possui uma propriedade content (paginação)
        const lista = Array.isArray(data) ? data : data.content || [];
        setPessoas(lista);
      } else {
        toast.error("Erro ao carregar usuários");
      }
    } catch (error) {
      toast.error("Erro ao carregar usuários");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarPessoas();
  }, []);

  const handlePerfilChange = async (id: number, perfis: TipoPerfil[]) => {
    const toastId = toast.loading("Atualizando perfil...");
    try {
      // Encontrar o usuário atual para manter os outros dados
      const pessoaAtual = pessoas.find((p) => p.id === id);
      if (!pessoaAtual) return;

      const payload = {
        ...pessoaAtual,
        perfis: perfis,
      };

      const { status } = await PessoaService.atualizar(id.toString(), payload);
      if (status === 200) {
        toast.success("Perfil atualizado com sucesso!", { id: toastId });
        carregarPessoas();
      } else {
        toast.error("Erro ao atualizar perfil", { id: toastId });
      }
    } catch (error) {
      toast.error("Erro ao atualizar perfil", { id: toastId });
    }
  };

  const columns = [
    {
      title: "Foto",
      dataIndex: "fotoPerfil",
      key: "fotoPerfil",
      width: 80,
      render: (foto: string, record: User) => (
        <Avatar
          src={foto}
          icon={<UserOutlined />}
          alt={record.nome}
          children={record.nome?.charAt(0).toUpperCase()}
        />
      ),
    },
    {
      title: "Nome",
      dataIndex: "nome",
      key: "nome",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Status",
      dataIndex: "ativo",
      key: "ativo",
      render: (ativo: boolean) => (
        <Tag color={ativo ? "green" : "red"}>{ativo ? "Ativo" : "Inativo"}</Tag>
      ),
    },
    {
      title: "Perfis",
      dataIndex: "perfis",
      key: "perfis",
      render: (perfis: TipoPerfil[], record: User) => (
        <Select
          mode="multiple"
          style={{ width: "100%", minWidth: 200 }}
          placeholder="Selecione os perfis"
          defaultValue={perfis}
          onChange={(value) => handlePerfilChange(record.id, value)}
          options={Object.values(TipoPerfil).map((perfil) => ({
            label: perfil,
            value: perfil,
          }))}
        />
      ),
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center flex-grow p-4 w-full">
      <Card title="Gerenciamento de Usuários" className="w-full max-w-6xl">
        <Table
          dataSource={pessoas}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: true }}
        />
      </Card>
    </div>
  );
};

export default PessoaList;
