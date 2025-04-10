/** @type {import('next').NextConfig} */
const nextConfig = {
    // output: 'export',
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

    headers() {
        return [
            {
                source: "/api/:path*",
                headers: [
                {
                    key: "Access-Control-Allow-Origin",
                    value: "https://www.indiainresearch.org"
                },
                {
                    key: "Access-Control-Allow-Methods",
                    value: "GET",
                },
                {
                    key: "Access-Control-Allow-Headers",
                    value: "Content-Type, Authorization",
                },
                ],
            },
        ];
    }
};

export default nextConfig;
