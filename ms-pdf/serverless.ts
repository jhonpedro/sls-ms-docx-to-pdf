import type { AWS } from '@serverless/typescript'

import { convertToPdf } from '@functions/convertToPdf'
import { AWS_REGION, MS_PDF_SERVICE_NAME, S3_BUCKET_NAME } from '../constants'

const serverlessConfiguration: AWS = {
	service: MS_PDF_SERVICE_NAME,
	frameworkVersion: '2',
	useDotenv: true,
	provider: {
		name: 'aws',
		runtime: 'nodejs14.x',
		region: AWS_REGION,
		apiGateway: {
			minimumCompressionSize: 1024,
			shouldStartNameWithService: true,
		},
		environment: {
			AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
			NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
		},
		lambdaHashingVersion: '20201221',
		iam: {
			role: {
				statements: [{ Effect: 'Allow', Action: ['s3:*'], Resource: '*' }],
			},
		},
	},
	custom: {
		esbuild: {
			bundle: true,
			minify: false,
			sourcemap: true,
			exclude: ['aws-sdk', 'chrome-aws-lambda'],
			target: 'node14',
			define: { 'require.resolve': undefined },
			platform: 'node',
		},
		'serverless-offline': {
			httpPort: 3000,
			// Port for lambdas to be in
			lambdaPort: 3001,
		},
	},
	plugins: ['serverless-esbuild', 'serverless-offline'],
	// import the function via paths
	functions: { convertToPdf },
	resources: {
		Resources: {
			PrivateBucketForPdf: {
				Type: 'AWS::S3::Bucket',
				Properties: {
					BucketName: S3_BUCKET_NAME,
				},
			},
		},
	},
}

module.exports = serverlessConfiguration
