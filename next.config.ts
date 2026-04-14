import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./app/i18n/request.ts');

const nextConfig: NextConfig = {
  cacheComponents: true,
  staticPageGenerationTimeout: 120,
  experimental: {
    rootParams: true,
  },
};

export default withNextIntl(nextConfig);
