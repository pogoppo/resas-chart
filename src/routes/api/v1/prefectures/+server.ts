import resasCli from '$lib/utils/resas-cli';
import { error, json } from '@sveltejs/kit';

export async function GET() {
  try {
    const result: { data: object } = await resasCli.get(`api/v1/prefectures`);

    if (Object.hasOwn(result.data, 'result')) {
      return json(result.data);
    } else {
      throw error(500);
    }
  } catch {
    throw error(500);
  }
}
