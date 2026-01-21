import { afterEach, beforeEach, describe, expect, it } from 'bun:test'
import { AudioChannel } from '@/enums'
import { SonarRequestException } from '@/exceptions'
import { setChannelMuteClassic } from '@/functions/audio/set-channel-mute-classic'

let originalFetch: typeof fetch

const request = () => setChannelMuteClassic('https://localhost', true, AudioChannel.Master)

describe('setChannelMuteClassic', () => {
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
				json: async () => 'Some error occurred'
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

	it('return data when response 200', async () => {
		globalThis.fetch = (async () =>
			({
				ok: true,
				json: async () => ({
					masters: {
						classic: {
							volume: 0.49,
							muted: false
						}
					},
					devices: {}
				})
			}) as Response) as unknown as typeof fetch

		const response = await request()
		expect(response.volume).toBe(49)
		expect(response.isMuted).toBe(false)
	})
})
