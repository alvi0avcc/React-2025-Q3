import { getInitialSpacecrafts } from '@src/api/init';
import HomePageClient from '@src/app/homePageClient/page';
import { isValidSpacecrafts, isSpacecraftsTotalInfo } from '@src/utils/valid';

export default async function HomePage() {
  const initialResponse = await getInitialSpacecrafts();

  const spacecrafts = isValidSpacecrafts(initialResponse.spacecrafts || []);
  const info = isSpacecraftsTotalInfo(initialResponse.page)
    ? initialResponse.page
    : undefined;

  return <HomePageClient initialData={{ spacecraft: spacecrafts, info }} />;
}
