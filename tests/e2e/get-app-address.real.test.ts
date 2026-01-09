import { afterEach, describe, expect, it } from 'bun:test'
import { getAppAddress } from '../../src/functions/get-app-address'

const logs: string[] = []

afterEach(() => {
	for (const log of logs) {
		console.log(log)
	}
	logs.length = 0
})

describe('getAppAddress', () => {
	it('returns ggEncryptedAddress', async () => {
		const result = await getAppAddress()
		expect(result).toBeString()
		logs.push(`> app address: ${result}`)
	})
})
