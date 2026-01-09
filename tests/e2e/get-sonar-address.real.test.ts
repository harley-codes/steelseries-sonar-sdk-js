import { afterEach, describe, expect, it } from 'bun:test'
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
		const result = await getSonarAddress()
		expect(result).toBeString()
		logs.push(`> address: ${result}`)
	})
})
