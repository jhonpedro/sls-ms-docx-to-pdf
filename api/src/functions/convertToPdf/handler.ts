import type { ValidAPIGatewayHandler } from '@libs/apiGateway'
import { formatJSONResponse } from '@libs/apiGateway'
import { middify } from '@libs/lambda'
import { Lambda, S3 } from 'aws-sdk'
import { randomUUID } from 'crypto'
import {
	AWS_REGION,
	PDF_LAMBDA_NAME,
	S3_BUCKET_NAME,
} from '../../../../constants'

export const convertDocx: ValidAPIGatewayHandler = async (event) => {
	if (!event.body.docx) {
		return formatJSONResponse(400, { message: 'invalid request' })
	}

	const s3Client = new S3({ region: AWS_REGION })

	const docx_key = randomUUID()

	await s3Client
		.putObject({
			Bucket: S3_BUCKET_NAME,
			Key: docx_key,
			Body: event.body.docx.content,
		})
		.promise()

	const lambdaClient = new Lambda({
		region: AWS_REGION,
		endpoint:
			// https://www.serverless.com/plugins/serverless-offline#the-processenvis_offline-variable
			process.env.IS_OFFLINE === 'true'
				? 'http://localhost:3001'
				: `https://lambda.${AWS_REGION}.amazonaws.com`,
	})

	const responseRaws = await lambdaClient
		.invoke({
			FunctionName: PDF_LAMBDA_NAME,
			Payload: JSON.stringify({ docx_key: docx_key }),
		})
		.promise()

	const lambdaPayload = JSON.parse(responseRaws.Payload as string) as {
		statusCode: number
		file_key: string
	}

	if (!(lambdaPayload.statusCode >= 200 && lambdaPayload.statusCode < 300)) {
		console.log(lambdaPayload)
		return formatJSONResponse(500, {
			message: 'error in pdf generation',
		})
	}

	const presignedUrl = s3Client.getSignedUrlPromise('getObject', {
		Bucket: S3_BUCKET_NAME,
		Key: lambdaPayload.file_key,
		Expires: 60,
	})

	return formatJSONResponse(200, {
		url: presignedUrl,
	})
}

export const handler = middify(convertDocx)
