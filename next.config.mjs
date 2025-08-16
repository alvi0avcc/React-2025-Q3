import nextIntlPlugin from 'next-intl/plugin';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: './dist',
  trailingSlash: true,
};

const withNextIntl = nextIntlPlugin();

export default withNextIntl(nextConfig);
