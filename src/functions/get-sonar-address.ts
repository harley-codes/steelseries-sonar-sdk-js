import {
	SonarNotEnabledException,
	SonarNotReadyException,
	SonarNotRunningException,
	SonarUnavailableException
} from '../exceptions'
import { getAppAddress } from './get-app-address'

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

export async function getSonarAddress(appAddress?: string): Promise<string> {
	const address = appAddress ?? (await getAppAddress())
	let response: Response

	try {
		response = await fetch(`${address}/subApps`, {
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
