/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    // experimental: {
    //     swcPlugins: [['fluentui-next-appdir-directive', { paths: ['@griffel', '@fluentui'] }]],
    // },
    // transpilePackages: ['@fluentui/react-components'],
    webpack: (config) => {
        config.module.rules.push({
            test: /\.geojson$/,
            type: 'json',
        });
        return config;
    },
};

export default nextConfig;
