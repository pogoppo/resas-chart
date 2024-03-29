import axios from 'axios';

export type ResasOKResponse<T> = {
  message: string | null
  result: T
}

export default axios.create({
  baseURL: import.meta.env.VITE_RESAS_API_BASEURL,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    'X-API-KEY': import.meta.env.VITE_RESAS_API_KEY,
  },
  timeout: 10000,
});
