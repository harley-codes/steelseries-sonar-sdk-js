import { afterEach, describe, expect, it } from 'bun:test'
import { getAppEndpoint } from '@/functions/get-app-endpoint'
import { getSonarEndpointCached } from '@/functions/get-sonar-endpoint-cached'

const logs: string[] = []

afterEach(() => {
	for (const log of logs) {
		console.log(log)
	}
	logs.length = 0
})

describe('getSonarEndpointCached', () => {
	it('returns sonarAddress', async () => {
		const appAddress = await getAppEndpoint()
		const sonarAddress = await getSonarEndpointCached(appAddress)
		expect(sonarAddress).toBeString()
		logs.push(`> sonar address: ${sonarAddress}`)
	})
})
