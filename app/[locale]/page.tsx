import { getTranslations } from 'next-intl/server';
import { cacheLife, cacheTag } from 'next/cache';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  'use cache';
  const { locale } = await params;
  cacheLife('days');
  cacheTag('meta');
  const t = await getTranslations({ locale });
  return { title: t('title') };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return <h1>{t('hello')}</h1>;
}
