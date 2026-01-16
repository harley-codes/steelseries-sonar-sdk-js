import { afterEach, describe, expect, it, spyOn } from 'bun:test'
import { getAppEndpoint } from '@/functions/endpoint/get-app-endpoint'
import { getSonarEndpointCached } from '@/functions/endpoint/get-sonar-endpoint-cached'

const logs: string[] = []

afterEach(() => {
	for (const log of logs) {
		console.log(log)
	}
	logs.length = 0
})

const spy = spyOn(globalThis, 'fetch')

describe('getSonarEndpointCached', () => {
	it('returns sonarAddress', async () => {
		const appAddress = await getAppEndpoint()
		const sonarAddress = await getSonarEndpointCached(appAddress)
		expect(sonarAddress).toBeString()
		logs.push(`> sonar address: ${sonarAddress}`)
	})

	it('returns cached sonarAddress', async () => {
		const appAddress = await getAppEndpoint()
		await getSonarEndpointCached(appAddress)
		const sonarAddress = await getSonarEndpointCached(appAddress)
		expect(sonarAddress).toBeString()
		expect(spy).toHaveBeenCalledTimes(1)
		logs.push(`> sonar address: ${sonarAddress}`)
	})
})
