// src/app/dashboard/users/page.tsx
"use client";

import * as React from "react";
import type { Metadata } from "next";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { DownloadIcon } from "@phosphor-icons/react/dist/ssr/Download";
import { PlusIcon } from "@phosphor-icons/react/dist/ssr/Plus";
import { UploadIcon } from "@phosphor-icons/react/dist/ssr/Upload";
import dayjs from "dayjs";

import { config } from "@/config";
import { UsersFilters } from "@/components/dashboard/user/users-filters";
import { UsersTable } from "@/components/dashboard/user/users-table";
import type { User } from "@/components/dashboard/user/users-table";
import { UserCreateModal, NewUserData } from "@/components/dashboard/user/user-create-modal";
import { UserEditModal, UserUpdateData } from "@/components/dashboard/user/user-edit-modal";     // Novo: Modal de Edição
import { UserDeleteConfirmModal } from "@/components/dashboard/user/user-delete-confirm-modal"; // Novo: Modal de Confirmação de Exclusão
import { apiFetch } from "@/lib/api";


// Metadata para a página (ajuste conforme a estrutura do seu projeto Next.js)
// export const metadata = { title: `Usuários | Dashboard | ${config.site.name}` } satisfies Metadata;

// Função para simular paginação no frontend (será substituída pela paginação do backend, se houver)
function applyPagination(rows: User[], page: number, rowsPerPage: number): User[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}

export default function Page(): React.JSX.Element {
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  // Estados para paginação e busca
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(5);
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  // Estados para o modal de criação de usuário
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState<boolean>(false);
  const [creatingUser, setCreatingUser] = React.useState<boolean>(false);
  const [createUserError, setCreateUserError] = React.useState<string | null>(null);

  // Novos estados para o modal de edição de usuário
  const [isEditModalOpen, setIsEditModalOpen] = React.useState<boolean>(false);
  const [editingUser, setEditingUser] = React.useState<User | null>(null); // Armazena o usuário sendo editado
  const [updatingUser, setUpdatingUser] = React.useState<boolean>(false);
  const [updateUserError, setUpdateUserError] = React.useState<string | null>(null);

  // Novos estados para o modal de exclusão de usuário
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = React.useState<boolean>(false);
  const [deletingUser, setDeletingUser] = React.useState<User | null>(null); // Armazena o usuário sendo excluído
  const [confirmingDelete, setConfirmingDelete] = React.useState<boolean>(false);
  const [deleteUserError, setDeleteUserError] = React.useState<string | null>(null);


  // Função para buscar usuários do backend
  const fetchUsers = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiFetch("/users/");

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Erro ao buscar usuários: ${response.statusText}`);
      }

      const data = await response.json();
      setUsers(data.items || data);
    } catch (err) {
      console.error("Erro ao buscar usuários:", err);
      setError(err instanceof Error ? err.message : "Erro desconhecido ao buscar usuários.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handlePageChange = React.useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const handleRowsPerPageChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  const handleSearchChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(0);
  }, []);

  const filteredUsers = React.useMemo(() => {
    if (!searchQuery) {
      return users;
    }
    const lowerCaseQuery = searchQuery.toLowerCase();
    return users.filter(user =>
      user.name.toLowerCase().includes(lowerCaseQuery) ||
      user.email.toLowerCase().includes(lowerCaseQuery)
    );
  }, [users, searchQuery]);

  const paginatedUsers = applyPagination(filteredUsers, page, rowsPerPage);

  // --- Funções do Modal de Criação ---
  const handleOpenCreateModal = React.useCallback(() => {
    setIsCreateModalOpen(true);
    setCreateUserError(null);
  }, []);

  const handleCloseCreateModal = React.useCallback(() => {
    setIsCreateModalOpen(false);
    setCreateUserError(null);
  }, []);

  const handleCreateUser = React.useCallback(async (userData: NewUserData) => {
    setCreatingUser(true);
    setCreateUserError(null);
    try {
      const response = await apiFetch("/auth/signup", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Erro ao criar usuário: ${response.statusText}`);
      }

      handleCloseCreateModal();
      await fetchUsers();
    } catch (err) {
      console.error("Erro ao criar usuário:", err);
      setCreateUserError(err instanceof Error ? err.message : "Erro desconhecido ao criar usuário.");
    } finally {
      setCreatingUser(false);
    }
  }, [fetchUsers, handleCloseCreateModal]);

  // --- Funções do Modal de Edição ---
  const handleOpenEditModal = React.useCallback((user: User) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
    setUpdateUserError(null); // Limpa erros anteriores
  }, []);

  const handleCloseEditModal = React.useCallback(() => {
    setIsEditModalOpen(false);
    setEditingUser(null);
    setUpdateUserError(null);
  }, []);

  const handleUpdateUser = React.useCallback(async (userId: string, userData: UserUpdateData) => {
    setUpdatingUser(true);
    setUpdateUserError(null);
    try {
      const response = await apiFetch(`/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Erro ao atualizar usuário: ${response.statusText}`);
      }

      handleCloseEditModal();
      await fetchUsers(); // Recarrega a lista para mostrar as alterações
    } catch (err) {
      console.error("Erro ao atualizar usuário:", err);
      setUpdateUserError(err instanceof Error ? err.message : "Erro desconhecido ao atualizar usuário.");
    } finally {
      setUpdatingUser(false);
    }
  }, [fetchUsers, handleCloseEditModal]);

  // --- Funções do Modal de Exclusão ---
  const handleOpenDeleteConfirmModal = React.useCallback((user: User) => {
    setDeletingUser(user);
    setIsDeleteConfirmModalOpen(true);
    setDeleteUserError(null); // Limpa erros anteriores
  }, []);

  const handleCloseDeleteConfirmModal = React.useCallback(() => {
    setIsDeleteConfirmModalOpen(false);
    setDeletingUser(null);
    setDeleteUserError(null);
  }, []);

  const handleConfirmDeleteUser = React.useCallback(async (userId: string) => {
    setConfirmingDelete(true);
    setDeleteUserError(null);
    try {
      const response = await apiFetch(`/users/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Erro ao excluir usuário: ${response.statusText}`);
      }

      handleCloseDeleteConfirmModal();
      await fetchUsers(); // Recarrega a lista para remover o usuário excluído
    } catch (err) {
      console.error("Erro ao excluir usuário:", err);
      setDeleteUserError(err instanceof Error ? err.message : "Erro desconhecido ao excluir usuário.");
    } finally {
      setConfirmingDelete(false);
    }
  }, [fetchUsers, handleCloseDeleteConfirmModal]);


  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: "1 1 auto" }}>
          <Typography variant="h4">Usuários</Typography>
          {/* <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
           	 <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}>
              Importar
           	</Button>
            <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}>
              Exportar
            </Button>
          </Stack> */}
        </Stack>
        <div>
          <Button
            startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />}
            variant="contained"
            onClick={handleOpenCreateModal}
          >
            Adicionar
          </Button>
        </div>
      </Stack>
      <UsersFilters value={searchQuery} onChange={handleSearchChange} />
      {loading ? (
        <Typography>Carregando usuários...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <UsersTable
          count={filteredUsers.length}
          page={page}
          rows={paginatedUsers}
          rowsPerPage={rowsPerPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          onEdit={handleOpenEditModal}    
          onDelete={handleOpenDeleteConfirmModal}
        />
      )}

      {/* Modal de Criação de Usuário */}
      <UserCreateModal
        open={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onCreateUser={handleCreateUser}
        loading={creatingUser}
        error={createUserError}
      />

      {/* Modal de Edição de Usuário */}
      <UserEditModal
        open={isEditModalOpen}
        onClose={handleCloseEditModal}
        user={editingUser} // Passa o usuário selecionado para o modal
        onUpdateUser={handleUpdateUser}
        loading={updatingUser}
        error={updateUserError}
      />

      {/* Modal de Confirmação de Exclusão de Usuário */}
      <UserDeleteConfirmModal
        open={isDeleteConfirmModalOpen}
        onClose={handleCloseDeleteConfirmModal}
        user={deletingUser} // Passa o usuário selecionado para o modal
        onConfirmDelete={handleConfirmDeleteUser}
        loading={confirmingDelete}
        error={deleteUserError}
      />
    </Stack>
  );
}
