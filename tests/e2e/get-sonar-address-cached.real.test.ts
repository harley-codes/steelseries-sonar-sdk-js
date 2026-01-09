import { afterEach, describe, expect, it } from 'bun:test'
import { getAppAddress } from '../../src/functions/get-app-address'
import { getSonarAddressCached } from '../../src/functions/get-sonar-address-cached'

const logs: string[] = []

afterEach(() => {
	for (const log of logs) {
		console.log(log)
	}
	logs.length = 0
})

describe('getSonarAddressCached', () => {
	it('returns sonarAddress', async () => {
		const appAddress = await getAppAddress()
		const sonarAddress = await getSonarAddressCached(appAddress)
		expect(sonarAddress).toBeString()
		logs.push(`> sonar address: ${sonarAddress}`)
	})
})
