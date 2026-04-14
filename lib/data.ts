import { cacheLife, cacheTag } from 'next/cache';

export async function getCachedAgreementData(agreementId: string, hsCode: string) {
  'use cache';
  cacheLife('days');
  cacheTag('agreement', `agreement-${agreementId}-${hsCode}`);
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 10));
  return {
    name: `Agreement ${agreementId}`,
    rules: [{ code: hsCode, description: `Rule for ${hsCode}` }],
  };
}
