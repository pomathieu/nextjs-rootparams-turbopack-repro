import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import { cacheLife, cacheTag } from 'next/cache';
import { getCachedAgreementData } from '../../../../../lib/data';

type Props = { params: Promise<{ locale: string; agreementId: string; hsCode: string }> };

// generateMetadata with 'use cache' — the pattern that causes metadata boundary errors
export async function generateMetadata({ params }: Props) {
  'use cache';
  const { locale, agreementId, hsCode } = await params;
  cacheLife('weeks');
  cacheTag('meta', `meta-${agreementId}-${hsCode}-${locale}`);
  const [data, t] = await Promise.all([
    getCachedAgreementData(agreementId, hsCode),
    getTranslations({ locale }),
  ]);
  return { title: `${data.name} - HS ${hsCode} - ${t('title')}` };
}

// Gated content inside Suspense
async function GatedContent({ agreementId, hsCode }: { agreementId: string; hsCode: string }) {
  const data = await getCachedAgreementData(agreementId, hsCode);
  return (
    <section>
      <h2>Rules</h2>
      <ul>
        {data.rules.map((r, i) => <li key={i}>{r.description}</li>)}
      </ul>
    </section>
  );
}

// Page component — fetches data OUTSIDE Suspense for header/breadcrumb (like production)
export default async function AgreementHSPage({ params }: Props) {
  const { locale, agreementId, hsCode } = await params;
  const [data, t] = await Promise.all([
    getCachedAgreementData(agreementId, hsCode),
    getTranslations({ locale }),
  ]);

  return (
    <div>
      {/* Header — outside Suspense, depends on fetched data */}
      <header>
        <h1>{data.name} — HS {hsCode}</h1>
        <p>{t('hello')}</p>
        <p>Agreement with {data.rules.length} rules</p>
      </header>

      {/* Gated content — inside Suspense */}
      <Suspense fallback={<div>Loading rules...</div>}>
        <GatedContent agreementId={agreementId} hsCode={hsCode} />
      </Suspense>
    </div>
  );
}
