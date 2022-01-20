import type { ValidAPIGatewayHandler } from '@libs/apiGateway'
import { formatJSONResponse } from '@libs/apiGateway'
import { S3 } from 'aws-sdk'
import { AWS_REGION, S3_BUCKET_NAME } from '../../../../constants'
import { Browser } from 'puppeteer-core'
import chromium from 'chrome-aws-lambda'
import mammoth from 'mammoth'
import { randomUUID } from 'crypto'

export const handler: ValidAPIGatewayHandler = async (event) => {
	const s3Client = new S3({ region: AWS_REGION })

	let browser: Browser = null
	try {
		const executablePath = process.env.IS_OFFLINE
			? null
			: await chromium.executablePath
		browser = await chromium.puppeteer.launch({
			args: chromium.args,
			executablePath,
		})

		const page = await browser.newPage()
		const loaded = page.waitForNavigation({
			waitUntil: 'load',
		})

		const docx = await s3Client
			.getObject({
				Bucket: S3_BUCKET_NAME,
				Key: event.docx_key,
			})
			.promise()

		const { value: html } = await mammoth.convertToHtml({
			buffer: docx.Body as Buffer,
		})

		await page.setContent(html)
		await loaded

		const pdfBuffer = await page.pdf({
			format: 'a4',
			printBackground: true,
			margin: { top: '1in', right: '1in', bottom: '1in', left: '1in' },
		})

		const pdf_key = randomUUID()

		await s3Client
			.putObject({
				Bucket: S3_BUCKET_NAME,
				Key: pdf_key,
				Body: pdfBuffer,
				ContentType: 'application/pdf',
			})
			.promise()

		return {
			statusCode: 200,
			file_key: pdf_key,
		}
	} catch (error) {
		console.error(error)
		return error
	} finally {
		if (browser !== null) {
			await browser.close()
		}
	}
}
