import type {
	APIGatewayEvent,
	APIGatewayProxyResult,
	Handler,
} from 'aws-lambda'

export type ValidAPIGatewayHandler<S = any> = Handler<
	Omit<APIGatewayEvent, 'body'> & { body: S },
	APIGatewayProxyResult
>

export const formatJSONResponse = (
	statusCode = 200,
	response: Record<string, unknown>
) => {
	return {
		statusCode,
		body: JSON.stringify(response),
	}
}
