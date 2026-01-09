import { afterEach, describe, expect, it } from 'bun:test'
import { getAppAddress } from '../../src/functions/get-app-address'
import { getSonarAddress } from '../../src/functions/get-sonar-address'

const logs: string[] = []

afterEach(() => {
	for (const log of logs) {
		console.log(log)
	}
	logs.length = 0
})

describe('getSonarAddress', () => {
	it('returns sonarAddress', async () => {
		const appAddress = await getAppAddress()
		const sonarAddress = await getSonarAddress(appAddress)
		expect(sonarAddress).toBeString()
		logs.push(`> sonar address: ${sonarAddress}`)
	})
})
