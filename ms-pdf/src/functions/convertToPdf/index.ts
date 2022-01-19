import { handlerPath } from '@libs/handlerResolver'
import { AWS } from '@serverless/typescript'

export const convertToPdf: AWS['functions'][''] = {
	handler: `${handlerPath(__dirname)}/handler.handler`,
	layers: [
		// https://github.com/shelfio/chrome-aws-lambda-layer
		// Choose the right one for your AWS region
		'arn:aws:lambda:us-east-2:764866452798:layer:chrome-aws-lambda:25',
		// This is a Lambda Layer for aws-lambda-layer
	],
}
