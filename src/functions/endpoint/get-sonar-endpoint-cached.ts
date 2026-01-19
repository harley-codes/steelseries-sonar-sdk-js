import { getSonarEndpoint } from '@/functions/endpoint/get-sonar-endpoint'

const cache = {
	appAddress: null as string | null,
	sonarAddress: null as string | null,
	timestamp: 0
}

export async function getSonarEndpointCached(appAddress: string, seconds: number = 60): Promise<string> {
	const now = Date.now()

	if (cache.appAddress === appAddress && cache.sonarAddress && now - cache.timestamp < seconds * 1000) {
		return cache.sonarAddress
	}

	try {
		const sonarAddress = await getSonarEndpoint(appAddress)
		cache.appAddress = appAddress
		cache.sonarAddress = sonarAddress
		cache.timestamp = now
		return sonarAddress
	} catch (error) {
		cache.appAddress = null
		cache.sonarAddress = null
		cache.timestamp = 0
		throw error
	}
}
