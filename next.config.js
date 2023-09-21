/** @type {import('next').NextConfig} */
const nextConfig = {
	webpack: (config, { isServer, nextRuntime, webpack }) => {
		// Avoid AWS SDK Node.js require issue
		if (isServer && nextRuntime === "nodejs")
			config.plugins.push(
				new webpack.IgnorePlugin({ resourceRegExp: /^aws-crt$/ }),
			);
		return config;
	},
	experimental: {
		typedRoutes: true,
		serverActions: true,
		typedRoutes: true,
	},
};

module.exports = nextConfig;
