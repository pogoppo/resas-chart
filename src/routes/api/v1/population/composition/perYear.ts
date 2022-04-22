import type { RequestEvent } from '@sveltejs/kit/types/internal';
import resasCli from '$lib/utils/resasCli';
import type { ResasResponse } from '$lib/utils/resasCli';

/** @type {import('./perYear').RequestHandler} */
export async function get({ url }: RequestEvent) {
  try {
    const params = {
      prefCode: url.searchParams.get('prefCode'),
      cityCode: url.searchParams.get('cityCode'),
      addArea: url.searchParams.get('addArea'),
    }
    const result: { data: ResasResponse } = await resasCli.get(`api/v1/population/composition/perYear`, {
      params
    });
    return {
      status: Number(result.data.statusCode) || 200,
      body: result.data
    };
  } catch {
    return {
      status: 500,
    };
  }
}
