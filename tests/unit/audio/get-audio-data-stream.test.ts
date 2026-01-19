import { afterEach, beforeEach, describe, expect, it } from 'bun:test'
import { SonarRequestException } from '@/exceptions'
import { getAudioDataStream } from '@/functions/audio/get-audio-data-stream'

let originalFetch: typeof fetch

const request = () => getAudioDataStream('https://localhost')

describe('getAudioDataStream', () => {
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
						stream: {
							streaming: {
								volume: 0.49,
								muted: true
							},
							monitoring: {
								volume: 0.48,
								muted: false
							}
						}
					},
					devices: {}
				})
			}) as Response) as unknown as typeof fetch

		const response = await request()
		expect(response.master.streaming.volume).toBe(49)
		expect(response.master.streaming.isMuted).toBe(true)
		expect(response.master.monitoring.volume).toBe(48)
		expect(response.master.monitoring.isMuted).toBe(false)
	})
})
