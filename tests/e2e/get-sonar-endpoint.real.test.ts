import { afterEach, describe, expect, it } from 'bun:test'
import { getAppEndpoint } from '@/functions/get-app-endpoint'
import { getSonarEndpoint } from '@/functions/get-sonar-endpoint'

const logs: string[] = []

afterEach(() => {
	for (const log of logs) {
		console.log(log)
	}
	logs.length = 0
})

describe('getSonarEndpoint', () => {
	it('returns sonarAddress', async () => {
		const appAddress = await getAppEndpoint()
		const sonarAddress = await getSonarEndpoint(appAddress)
		expect(sonarAddress).toBeString()
		logs.push(`> sonar address: ${sonarAddress}`)
	})
})
