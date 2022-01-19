import { handlerPath } from '@libs/handlerResolver'
import { AWS } from '@serverless/typescript'

export const convertToPdf: AWS['functions'][''] = {
	handler: `${handlerPath(__dirname)}/handler.handler`,
	events: [
		{
			httpApi: {
				path: '/convert-docx',
				method: 'POST',
			},
		},
	],
}
