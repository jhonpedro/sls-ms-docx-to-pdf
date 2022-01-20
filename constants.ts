export const AWS_REGION = 'us-east-2'

export const MS_PDF_SERVICE_NAME = 'test-ms-pdf'

export const PDF_LAMBDA_NAME = process.env.IS_OFFLINE
	? `${MS_PDF_SERVICE_NAME}-dev-convertToPdf`
	: `${MS_PDF_SERVICE_NAME}-prod-convertToPdf`

export const S3_BUCKET_NAME = 'private-bucket-for-pdf-jhonpedro'
