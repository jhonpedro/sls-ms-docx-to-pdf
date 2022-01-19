import middy from '@middy/core'
import doNotWaitForEmptyEventLoop from '@middy/do-not-wait-for-empty-event-loop'
import httpHeaderNormalizer from '@middy/http-header-normalizer'
import jsonBodyParser from '@middy/http-json-body-parser'
import multipartBodyParser from '@middy/http-multipart-body-parser'
import { ValidAPIGatewayHandler } from './apiGateway'

export const middify = (handler: ValidAPIGatewayHandler) =>
	middy(handler)
		.use(httpHeaderNormalizer())
		.use(doNotWaitForEmptyEventLoop())
		.use(jsonBodyParser())
		.use(multipartBodyParser())
