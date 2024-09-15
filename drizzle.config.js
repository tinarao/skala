/** @type { import("drizzle-kit").Config } */
export default {
	schema: './src/lib/db/schema.js',
	out: './drizzle',
	dialect: 'postgresql',
	url: process.env.DB_URL,
	verbose: true,
	strict: true
};
