import axios from 'axios'
import type { ResasResponse } from '$lib/utils/resas-cli';

const cli = axios.create();

export type Prefectures = {
  prefCode: number
  prefName: string
}

export type Population = {
  prefCode: number
  data: { year: number, value: number }[]
}

export default class {
  async getPrefectures(): Promise<Prefectures[]> {
    // データ構成
    // https://opendata.resas-portal.go.jp/docs/api/v1/prefectures.html
    const response = await cli.get(`/api/v1/prefectures`);
    const rawData: ResasResponse = response.data;

    return rawData.result as Prefectures[];
  }

  async getPopulation(prefCode: number): Promise<Population> {
    const params = { prefCode };

    // データ構成
    // https://opendata.resas-portal.go.jp/docs/api/v1/population/composition/perYear.html
    const response = await cli.get(`/api/v1/population/composition/perYear`, { params });
    const rawData: ResasResponse = response.data;

    return {
      prefCode,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: (rawData.result as any).data[0].data
    }
  }
}
