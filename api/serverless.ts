import type { AWS } from '@serverless/typescript'

import { convertToPdf } from '@functions/convertToPdf'
import { AWS_REGION } from '../constants'

const serverlessConfiguration: AWS = {
	service: 'test-ms-api',
	frameworkVersion: '2',
	useDotenv: true,
	provider: {
		name: 'aws',
		runtime: 'nodejs14.x',
		region: AWS_REGION,
		apiGateway: {
			minimumCompressionSize: 1024,
			shouldStartNameWithService: true,
			binaryMediaTypes: ['*/*'],
		},
		environment: {
			AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
			NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
		},
		lambdaHashingVersion: '20201221',
		iam: {
			role: {
				statements: [
					{ Effect: 'Allow', Action: ['s3:*', 'lambda:*'], Resource: '*' },
				],
			},
		},
	},
	custom: {
		esbuild: {
			bundle: true,
			minify: false,
			sourcemap: true,
			exclude: ['aws-sdk'],
			target: 'node14',
			define: { 'require.resolve': undefined },
			platform: 'node',
		},
		'serverless-offline': {
			httpPort: 4000,
			lambdaPort: 4001,
		},
	},
	plugins: ['serverless-esbuild', 'serverless-offline'],

	// import the function via paths
	functions: { convertToPdf },
}

module.exports = serverlessConfiguration
