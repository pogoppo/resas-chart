import resasCli from '$lib/utils/resas-cli';
import { error, json, type RequestEvent } from '@sveltejs/kit';

export async function GET({ url }: RequestEvent) {
  try {
    const params = {
      prefCode: url.searchParams.get('prefCode'),
      cityCode: url.searchParams.get('cityCode'),
      addArea: url.searchParams.get('addArea'),
    }
    const result: { data: object } = await resasCli.get(`api/v1/population/composition/perYear`, {
      params
    });

    if (Object.hasOwn(result.data, 'result')) {
      return json(result.data);
    } else {
      throw error(500);
    }
  } catch {
    throw error(500);
  }
}
