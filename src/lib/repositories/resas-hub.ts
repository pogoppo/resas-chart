import axios from 'axios'
import type { ResasOKResponse } from '$lib/utils/resas-cli';

const cli = axios.create();

export type Prefectures = {
  prefCode: number
  prefName: string
}

export type Population = {
  prefCode: number
  data: { year: number, value: number }[]
}

type PerYear = {
  boundaryYear: number,
  data: { label: string, data: Population["data"] }[]
}

export default class {
  async getPrefectures(): Promise<Prefectures[]> {
    // データ構成
    // https://opendata.resas-portal.go.jp/docs/api/v1/prefectures.html
    const response = await cli.get(`/api/v1/prefectures`);
    const rawData: ResasOKResponse<Prefectures[]> = response.data;

    return rawData.result;
  }

  async getPopulation(prefCode: number): Promise<Population> {
    const params = { prefCode };

    // データ構成
    // https://opendata.resas-portal.go.jp/docs/api/v1/population/composition/perYear.html
    const response = await cli.get(`/api/v1/population/composition/perYear`, { params });
    const rawData: ResasOKResponse<PerYear> = response.data;
    const data: Population["data"] = rawData.result.data[0].data;

    return {
      prefCode,
      data
    }
  }
}
