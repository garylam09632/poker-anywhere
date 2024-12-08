import { Suspense } from 'react';
import { getDictionary } from '../../../../get-dictionary';
import { Locale } from '../../../../i18n-config';
import GameClient from '@/components/page/Game';

export default async function Home({
  params
}: {
  params: Promise<{ lang: Locale }>
}) {
  
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  return (
    <Suspense>
      <GameClient dictionary={dictionary} />
    </Suspense>
  );
}