import { afterEach, beforeEach, describe, expect, it } from 'bun:test'
import { ChatMixState } from '@/enums'
import { SonarRequestException } from '@/exceptions'
import { getChatMixState } from '@/functions/chatmix/get-chat-mix-state'

let originalFetch: typeof fetch

const request = () => getChatMixState('http://localhost')

describe('getChatMixState', () => {
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
				text: async () => 'Some error occurred'
			}) as Response) as unknown as typeof fetch

		expect(request()).rejects.toThrow(SonarRequestException)
	})

	it('throws SonarException when response 200 but not data', async () => {
		globalThis.fetch = (async () =>
			({
				ok: true,
				json: async () => ({})
			}) as Response) as unknown as typeof fetch

		expect(request()).rejects.toThrow(SonarRequestException)
	})

	it('return data when classic and response 200', async () => {
		globalThis.fetch = (async () =>
			({
				ok: true,
				json: async () => ({
					balance: 0.5,
					state: ChatMixState.Enabled
				})
			}) as Response) as unknown as typeof fetch

		const response = await request()
		expect(response.chatBalance).toBe(75)
		expect(response.state).toBe(ChatMixState.Enabled)
		expect(response.isEnabled).toBeTrue()
	})

	it('return data when streamer and response 200', async () => {
		globalThis.fetch = (async () =>
			({
				ok: true,
				json: async () => ({
					balance: 0.5,
					state: ChatMixState.FiniteWheel
				})
			}) as Response) as unknown as typeof fetch

		const response = await request()
		expect(response.chatBalance).toBe(75)
		expect(response.state).toBe(ChatMixState.FiniteWheel)
		expect(response.isEnabled).toBeFalse()
	})
})
