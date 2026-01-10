import { afterEach, describe, expect, it } from 'bun:test'
import { getAppEndpoint } from '@/functions/get-app-endpoint'

const logs: string[] = []

afterEach(() => {
	for (const log of logs) {
		console.log(log)
	}
	logs.length = 0
})

describe('getAppEndpoint', () => {
	it('returns ggEncryptedAddress', async () => {
		const result = await getAppEndpoint()
		expect(result).toBeString()
		logs.push(`> app address: ${result}`)
	})
})
