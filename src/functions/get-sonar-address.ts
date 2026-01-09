import {
	SonarNotEnabledException,
	SonarNotReadyException,
	SonarNotRunningException,
	SonarUnavailableException
} from '../exceptions'

import { getAppAddress } from './get-app-address'

type SubApps = {
	sonar?: {
		isEnabled: boolean
		isReady: boolean
		isRunning: boolean
		metadata: {
			webServerAddress: string
		}
	}
}

export async function getSonarAddress(appAddress?: string): Promise<string> {
	const address = appAddress ?? (await getAppAddress())
	let response: Response

	try {
		response = await fetch(`http://${address}/subApps`)
	} catch (error) {
		throw new SonarUnavailableException('Unable to reach app server endpoint.', error as Error)
	}

	if (!response.ok) {
		throw new SonarUnavailableException('Unable to reach app server endpoint.')
	}

	const { sonar }: SubApps = (await response.json()) as SubApps

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
