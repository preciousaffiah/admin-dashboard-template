import withVideo from 'next-videos';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    additionalData: `@import "styles/variables.scss"; @import "styles/mixins.scss";`,
  },
};

// Wrap the nextConfig with the next-video plugin
export default withVideo(nextConfig);