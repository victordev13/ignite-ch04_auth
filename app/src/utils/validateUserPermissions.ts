type User = {
  permissions: string[];
  roles: string[];
}

type Props = {
  user: User;
  permissions?: string[];
  roles?: string[];
}

export function validateUserPermissions({ user, permissions, roles }: Props) {
  if (permissions && permissions?.length > 0) {
    const hasAllPermissions = permissions.every(permission => user?.permissions.includes(permission));

    if (!hasAllPermissions) {
      return false;
    }
  }

  if (roles && roles?.length > 0) {
    const hasAllRoles = roles.some(role => user?.roles.includes(role));

    if (!hasAllRoles) {
      return false;
    }
  }

  return true
}