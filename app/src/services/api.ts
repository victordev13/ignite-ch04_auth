import { AuthTokenError } from './errors/AuthTokenError';
import axios, { AxiosError } from 'axios';
import { parseCookies, setCookie } from 'nookies';
import { signOut } from '../contexts/AuthContext';

type FailedRequest = {
  onSuccess: (token: string) => void,
  onFailure: (error: AxiosError) => void
}

let isRefreshing = false;
let failedRequestsQueue: FailedRequest[] = [];

export function setupAPIClient(ctx: any = undefined) {
  let cookies = parseCookies(ctx);

  const api = axios.create({
    baseURL: 'http://localhost:3333',
  });

  if (cookies && cookies['nextauth.token']) {
    api.defaults.headers.common['Authorization'] = `Bearer ${cookies['nextauth.token']}`;
  }

  api.interceptors.response.use(res => res, (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (error.response.data?.code === 'token.expired') {
        cookies = parseCookies(ctx);

        const { 'nextauth.refreshToken': refreshToken } = cookies;
        const originalConfig = error.config;

        if (!isRefreshing) {
          isRefreshing = true;

          api.post('/refresh', {
            refreshToken
          }).then(response => {
            const { token, refreshToken } = response.data;

            setCookie(ctx, 'nextauth.token', token, {
              maxAge: 60 * 60 * 24 * 30,
              path: '/'
            })
            setCookie(ctx, 'nextauth.refreshToken', refreshToken, {
              maxAge: 60 * 60 * 24 * 30,
              path: '/'
            })

            api.defaults.headers.common['Authorization'] = `Bearer ${token}`

            failedRequestsQueue.forEach(request => request.onSuccess(token));
            failedRequestsQueue = [];
          }).catch(error => {
            failedRequestsQueue.forEach(request => request.onFailure(error));
            failedRequestsQueue = [];

            if (typeof window !== 'undefined') {
              signOut()
            }
          }).finally(() => {
            isRefreshing = false;
          });

          return new Promise((resolve, reject) => {
            failedRequestsQueue.push(
              {
                onSuccess: (token: string) => {
                  // @ts-ignore
                  originalConfig.headers['Authorization'] = `Bearer ${token}`;
                  resolve(api(originalConfig));
                },
                onFailure: (error: AxiosError) => {
                  reject(error)
                }
              }
            )
          });
        }
      } else {
        if (typeof window !== 'undefined') {
          signOut()
        }

        return Promise.reject(new AuthTokenError());
      }
    }

    return Promise.reject(error);
  })

  return api;
}