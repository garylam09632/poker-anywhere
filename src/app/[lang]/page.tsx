import { getDictionary } from '../../../get-dictionary';
import { Locale } from '../../../i18n-config';
import HomeClient from '@/components/page/Home';

export default async function Home({
  params
}: {
  params: Promise<{ lang: Locale }>
}) {
  
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  return <HomeClient dictionary={dictionary} />;
}