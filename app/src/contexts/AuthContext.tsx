import { createContext, ReactNode, useEffect, useState } from 'react';
import { api } from '../services/api';
import Router from 'next/router';
import { setCookie, parseCookies, destroyCookie } from 'nookies';

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

export function signOut() {
  destroyCookie(undefined, 'nextauth.token')
  destroyCookie(undefined, 'nextauth.refreshToken')

  Router.push('/');
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] = useState<User>();

  const isAuthenticated = !!user;

  useEffect(() => {
    const { 'nextauth.token': token } = parseCookies();

    if (!token) {
      return;
    }

    api.get('/me').then(res => {
      const { email, permissions, roles } = res.data;
      setUser({ email, permissions, roles });
    }).catch(() => {
      signOut();
    })
  }, [])

  async function signIn({
    email,
    password,
  }: SignInCredentials) {
    try {
      const { data } = await api.post('/sessions', {
        email,
        password,
      })

      const { token, refreshToken, permissions, roles } = data

      setCookie(undefined, 'nextauth.token', token, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/' // who can access?
      })
      setCookie(undefined, 'nextauth.refreshToken', refreshToken, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/' // who can access?
      })
      setUser({ email, permissions, roles })

      api.defaults.headers.put['Authorization'] = `Bearer ${token}`

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
