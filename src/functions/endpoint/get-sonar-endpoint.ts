import {
	SonarNotEnabledException,
	SonarNotReadyException,
	SonarNotRunningException,
	SonarUnavailableException
} from '@/exceptions'

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
 * @returns A promise that resolves to the Sonar web server address string.
 *
 * @throws {SonarUnavailableException} If the app server cannot be reached, or data cannot be resolved.
 * @throws {SonarNotEnabledException} If the Sonar sub-application exists but is not enabled.
 * @throws {SonarNotRunningException} If the Sonar sub-application exists but is not running.
 * @throws {SonarNotReadyException} If the Sonar sub-application exists but is not ready.
 *
 * @remarks
 * - Performs a GET request to `${appAddress}/subApps`.
 * - The response body is expected to conform to the SubAppsResponse shape and contain `subApps.sonar`.
 * - Uses a fetch TLS option that disables certificate verification (rejectUnauthorized: false).
 */
export async function getSonarEndpoint(appEndpoint: string): Promise<string> {
	let response: Response

	try {
		response = await fetch(`${appEndpoint}/subApps`, {
			tls: {
				rejectUnauthorized: false
			}
		})
	} catch (error) {
		throw new SonarUnavailableException('Unable to reach app server endpoint.', error as Error)
	}

	if (!response.ok) {
		throw new SonarUnavailableException('Unable to reach app server endpoint.')
	}

	const result: SubAppsResponse = (await response.json()) as SubAppsResponse

	const sonar = result?.subApps?.sonar

	if (!sonar) {
		throw new SonarUnavailableException('Sonar sub-application is missing.')
	}

	if (!sonar.isEnabled) {
		throw new SonarNotEnabledException()
	}

	if (!sonar.isRunning) {
		throw new SonarNotRunningException()
	}

	if (!sonar.isReady) {
		throw new SonarNotReadyException()
	}

	const sonarAddress = sonar.metadata?.webServerAddress

	if (!sonarAddress) {
		throw new SonarUnavailableException('Sonar web server address is missing.')
	}

	return sonarAddress
}
