/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    additionalData: `@import "styles/variables.scss"; @import "styles/mixins.scss";`,
  },
};

export default nextConfig;
