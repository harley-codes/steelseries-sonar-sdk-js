import { afterEach, beforeEach, describe, expect, it } from 'bun:test'
import { ChatMixState } from '@/enums'
import { SonarServerException } from '@/exceptions'
import { setChatMixBalance } from '@/functions/chatmix/set-chat-mix-balance'

let originalFetch: typeof fetch

const request = (chatBalance: number) => setChatMixBalance('http://localhost', chatBalance)

describe('setChatBalance', () => {
	beforeEach(() => {
		originalFetch = globalThis.fetch
	})

	afterEach(() => {
		globalThis.fetch = originalFetch
	})

	it('throws SonarException when response not 200', async () => {
		globalThis.fetch = (async () =>
			({
				ok: false,
				json: async () => ({
					message: 'Some error occurred'
				})
			}) as Response) as unknown as typeof fetch

		expect(request(0)).rejects.toThrow(SonarServerException)
	})

	it('throws SonarException when response 200 but not data', async () => {
		globalThis.fetch = (async () =>
			({
				ok: true,
				json: async () => ({
					message: 'Some error occurred'
				})
			}) as Response) as unknown as typeof fetch

		expect(request(0)).rejects.toThrow(SonarServerException)
	})

	it('return data when response 200', async () => {
		globalThis.fetch = (async () =>
			({
				ok: true,
				json: async () => ({
					balance: 0.5,
					state: ChatMixState.Enabled
				})
			}) as Response) as unknown as typeof fetch

		const response = await request(0.5)
		expect(response.chatBalance).toBe(75)
		expect(response.state).toBe(ChatMixState.Enabled)
		expect(response.isEnabled).toBeTrue()
	})
})
