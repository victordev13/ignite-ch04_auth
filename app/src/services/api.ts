import axios, { AxiosError } from 'axios';
import { parseCookies, setCookie } from 'nookies';

let cookies = parseCookies();

export const api = axios.create({
  baseURL: 'http://localhost:3333',
  headers: {
    Authorization: `Bearer ${cookies['nextauth.token']}`
  }
});


api.interceptors.response.use(res => res, (error: AxiosError) => {
  if (error.response?.status !== 401) {
    return error;
  }

  if (error.response.data?.code === 'token.expired') {
    cookies = parseCookies();

    const { 'nextauth.refreshToken': refreshToken } = cookies;

    api.post('/refresh', {
      refreshToken
    }).then(response => {
      const { token, refreshToken } = response.data;

      setCookie(undefined, 'nextauth.token', token, {
        maxAge: 60 * 60 * 24 * 30,
        path: '/'
      })
      setCookie(undefined, 'nextauth.refreshToken', refreshToken, {
        maxAge: 60 * 60 * 24 * 30,
        path: '/'
      })

      api.defaults.headers.put['Authorization'] = `Bearer ${token}`
    })
  }
})