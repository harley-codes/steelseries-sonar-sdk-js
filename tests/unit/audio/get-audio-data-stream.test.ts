import { afterEach, beforeEach, describe, expect, it } from 'bun:test'
import { SonarException } from '@/exceptions'
import { getAudioDataStream } from '@/functions/audio/get-audio-data-stream'

let originalFetch: typeof fetch

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
				text: async () => 'Some error occurred'
			}) as Response) as unknown as typeof fetch

		expect(getAudioDataStream('')).rejects.toThrow(SonarException)
	})

	it('throws SonarException when response 200 but not data', async () => {
		globalThis.fetch = (async () =>
			({
				ok: true,
				json: async () => ({})
			}) as Response) as unknown as typeof fetch

		expect(getAudioDataStream('')).rejects.toThrow(SonarException)
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
								isMuted: true
							},
							monitoring: {
								volume: 0.48,
								isMuted: false
							}
						}
					},
					devices: {}
				})
			}) as Response) as unknown as typeof fetch

		const response = await getAudioDataStream('')
		expect(response.master?.volumeMonitoring).toBe(48)
		expect(response.master?.isMutedMonitoring).toBe(false)
		expect(response.master?.volumeStreamer).toBe(49)
		expect(response.master?.isMutedStreamer).toBe(true)
	})
})
