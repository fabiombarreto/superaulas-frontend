// src/components/dashboard/user/users-filters.tsx
import * as React from "react";
import Card from "@mui/material/Card";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import { MagnifyingGlassIcon } from "@phosphor-icons/react/dist/ssr/MagnifyingGlass";

interface UsersFiltersProps {
  // Adicionamos as props 'value' para o valor atual do input
  // e 'onChange' para lidar com as mudanças
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function UsersFilters({ value, onChange }: UsersFiltersProps): React.JSX.Element {
  return (
    <Card sx={{ p: 2 }}>
      <OutlinedInput
        // Conectamos o input aos valores e handlers passados via props
        value={value}
        onChange={onChange}
        fullWidth
        placeholder="Buscar usuário por nome ou email" // Ajustei o placeholder para ser mais descritivo
        startAdornment={
          <InputAdornment position="start">
            <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
          </InputAdornment>
        }
        sx={{ maxWidth: "500px" }}
      />
    </Card>
  );
}
