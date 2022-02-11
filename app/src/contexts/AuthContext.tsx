import { createContext, ReactNode, useState } from 'react';
import { api } from '../services/api';
import Router from 'next/router';
import { setCookie } from 'nookies';

type SignInCredentials = {
  email: string;
  password: string;
};

type AuthContextData = {
  signIn(credentials: SignInCredentials): Promise<void>;
  user?: User;
  isAuthenticated: boolean;
};

type User = {
  email: string;
  permissions: string[];
  roles: string[];
}

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext(
  {} as AuthContextData
);

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] = useState<User>();

  const isAuthenticated = !!user;

  async function signIn({
    email,
    password,
  }: SignInCredentials) {
    try {
      const { data } = await api.post('/sessions', {
        email,
        password,
      })

      const { token, permissions, roles } = data

      setCookie(undefined, 'nextauth.token', token, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/' // who accesses?

      })
      setCookie(undefined, 'nextauth.refreshToken', token, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/' // who accesses?
      })
      setUser({email, permissions, roles})

      Router.push('/dashboard')
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <AuthContext.Provider
      value={{ signIn, isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  );
}
