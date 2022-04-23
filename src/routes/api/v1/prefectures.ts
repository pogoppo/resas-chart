import resasCli from '$lib/utils/resas-cli';
import type { ResasResponse } from '$lib/utils/resas-cli';

/** @type {import('./prefectures').RequestHandler} */
export async function get() {
  try {
    const result: { data: ResasResponse } = await resasCli.get(`api/v1/prefectures`);
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
