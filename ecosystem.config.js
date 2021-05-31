module.exports = {
	apps: [
		{
			name: 'NextSupabaseJelastic',
			exec_mode: 'cluster',
			instances: 'max', // Or a number of instances
			cwd: './current',
			script: './node_modules/next/dist/bin/next.js',
			// script: 'node_modules/next/dist/bin/next',
			args: 'start'
		}
	]
}