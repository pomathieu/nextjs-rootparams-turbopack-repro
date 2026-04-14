import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import { cacheLife, cacheTag } from 'next/cache';
import { getCachedAgreementData } from '../../../../../lib/data';

type Props = { params: Promise<{ locale: string; agreementId: string; hsCode: string }> };

export async function generateMetadata({ params }: Props) {
  'use cache';
  const { locale, agreementId, hsCode } = await params;
  cacheLife('weeks');
  cacheTag('meta-agreement', `meta-agreement-${agreementId}-${hsCode}-${locale}`);
  const [data, t] = await Promise.all([
    getCachedAgreementData(agreementId, hsCode),
    getTranslations({ locale }),
  ]);
  return { title: `${data.name} - HS ${hsCode} - ${t('title')}` };
}

async function AgreementContent({ locale, agreementId, hsCode }: { locale: string; agreementId: string; hsCode: string }) {
  const [data, t] = await Promise.all([
    getCachedAgreementData(agreementId, hsCode),
    getTranslations({ locale }),
  ]);
  return (
    <div>
      <h1>{data.name} - HS {hsCode}</h1>
      <p>{t('hello')}</p>
      <ul>
        {data.rules.map((r, i) => <li key={i}>{r.description}</li>)}
      </ul>
    </div>
  );
}

export default async function AgreementHSPage({ params }: Props) {
  const { locale, agreementId, hsCode } = await params;
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AgreementContent locale={locale} agreementId={agreementId} hsCode={hsCode} />
    </Suspense>
  );
}
