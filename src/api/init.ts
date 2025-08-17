import { baseUrl, defaultPagination } from '@src/const/const';

export async function getInitialSpacecrafts() {
  try {
    const externalUrl = new URL(baseUrl);
    externalUrl.searchParams.set('pageNumber', '1');
    externalUrl.searchParams.set(
      'pageSize',
      defaultPagination.pageSize.toString()
    );

    const proxyUrl = new URL(
      '/api/proxy',
      process.env.NODE_ENV === 'production'
        ? process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
        : 'http://localhost:3000'
    );

    const response = await fetch(proxyUrl.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: '',
        originalUrl: externalUrl.toString(),
        options: {
          pageNumber: 1,
          pageSize: defaultPagination.pageSize,
        },
      }),
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      spacecrafts: data.spacecrafts || [],
      page: data.page || null,
    };
  } catch (error) {
    console.error('Error fetching initial spacecrafts:', error);
    return { spacecrafts: [], page: null };
  }
}
