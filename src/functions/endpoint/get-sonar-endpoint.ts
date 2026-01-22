import https from 'node:https'
import nodeFetch from 'node-fetch'
import { InitializeErrorReason, SonarInitializationException } from '@/exceptions'

type SubAppsResponse = {
	subApps: {
		sonar?: {
			isEnabled: boolean
			isReady: boolean
			isRunning: boolean
			metadata: {
				webServerAddress: string
			}
		}
	}
}

/**
 * Retrieves the Sonar web server address from an application server's /subApps endpoint.
 *
 * @param appEndpoint - The base URL of the application server (e.g. "https://localhost:1234").
 * @returns A promise that resolves to the Sonar web server address.
 *
 * @throws {SonarInitializationException} If the sonar server cannot be determined.
 *
 * @remarks
 * - Performs a GET request to `${appAddress}/subApps`.
 * - The response body is expected to conform to the SubAppsResponse shape and contain `subApps.sonar`.
 * - Uses a fetch TLS option that disables certificate verification (rejectUnauthorized: false).
 */
export async function getSonarEndpoint(appEndpoint: string): Promise<string> {
	let response: Response

	try {
		const url = `${appEndpoint}/subApps`
		// Add compatibility for Bun and Node.js
		if (typeof Bun !== 'undefined') {
			response = (await fetch(url, {
				tls: {
					rejectUnauthorized: false
				}
			})) as unknown as Response
		} else {
			response = (await nodeFetch(url, {
				agent: new https.Agent({
					rejectUnauthorized: false
				})
			})) as unknown as Response
		}
	} catch (error) {
		throw new SonarInitializationException({
			reason: InitializeErrorReason.NotResponding,
			innerException: error as Error
		})
	}

	if (!response.ok) {
		throw new SonarInitializationException({
			reason: InitializeErrorReason.NotResponding
		})
	}

	const result: SubAppsResponse = (await response.json()) as SubAppsResponse

	const sonar = result?.subApps?.sonar

	if (!sonar) {
		throw new SonarInitializationException({
			reason: InitializeErrorReason.NotAvailable
		})
	}

	if (!sonar.isEnabled) {
		throw new SonarInitializationException({
			reason: InitializeErrorReason.NotEnabled
		})
	}

	if (!sonar.isRunning) {
		throw new SonarInitializationException({
			reason: InitializeErrorReason.NotRunning
		})
	}

	if (!sonar.isReady) {
		throw new SonarInitializationException({
			reason: InitializeErrorReason.NotReady
		})
	}

	const sonarAddress = sonar.metadata?.webServerAddress

	if (!sonarAddress) {
		throw new SonarInitializationException({
			reason: InitializeErrorReason.NotAvailable
		})
	}

	return sonarAddress
}
