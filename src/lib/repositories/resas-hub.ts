import axios from 'axios'
import type { ResasResponse } from '$lib/utils/resas-cli';

const cli = axios.create();

export default class {
  getPrefectures(): Promise<ResasResponse> {
    return cli.get(`/api/v1/prefectures`);
  }

  getPopulation(prefCode: number): Promise<ResasResponse> {
    const params = { prefCode };
    return cli.get(`/api/v1/population/composition/perYear`, { params });
  }
}
