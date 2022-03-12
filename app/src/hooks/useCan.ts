import { AuthContext } from './../contexts/AuthContext';
import { useContext } from 'react';
import { validateUserPermissions } from '../utils/validateUserPermissions';

type Props = {
  permissions?: string[];
  roles?: string[];
}

export function useCan({ permissions = [], roles = [] }: Props) {
  const { user, isAuthenticated } = useContext(AuthContext);

  if (!user || !isAuthenticated) {
    return false;
  }

  const userHasValidPermissions = validateUserPermissions({ user, permissions, roles });

  return userHasValidPermissions;
}