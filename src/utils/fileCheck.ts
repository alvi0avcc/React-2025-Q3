export async function checkLocalFileExists(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      signal: AbortSignal.timeout(3000),
    });

    const contentType = response.headers.get('content-type');
    const isJsonFile = contentType?.includes('application/json');

    if (isJsonFile) return response.ok;

    return false;
  } catch (error) {
    console.warn(`Local file not found at ${url}:`, error);
    return false;
  }
}
