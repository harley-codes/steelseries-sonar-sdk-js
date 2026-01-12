import { afterEach, beforeEach, describe, expect, it } from 'bun:test'
import { VolumeFormat } from '@/enums'
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

		expect(getAudioDataStream('', VolumeFormat['0 to 1'])).rejects.toThrow(SonarException)
	})

	it('throws SonarException when response 200 but not data', async () => {
		globalThis.fetch = (async () =>
			({
				ok: true,
				json: async () => ({})
			}) as Response) as unknown as typeof fetch

		expect(getAudioDataStream('', VolumeFormat['0 to 1'])).rejects.toThrow(SonarException)
	})

	it('return classic in "0 - 1" format when response 200', async () => {
		globalThis.fetch = (async () =>
			({
				ok: true,
				json: async () => ({
					masters: {
						stream: {
							streaming: {
								volume: 0.5,
								isMuted: true
							},
							monitoring: {
								volume: 0.75,
								isMuted: false
							}
						}
					},
					devices: {}
				})
			}) as Response) as unknown as typeof fetch

		const response = await getAudioDataStream('', VolumeFormat['0 to 1'])
		expect(response.master.volumeMonitoring).toBe(0.75)
		expect(response.master.isMutedMonitoring).toBe(false)
		expect(response.master.volumeStreamer).toBe(0.5)
		expect(response.master.isMutedStreamer).toBe(true)
	})

	it('return classic in "0 - 100" format when response 200', async () => {
		globalThis.fetch = (async () =>
			({
				ok: true,
				json: async () => ({
					masters: {
						stream: {
							streaming: {
								volume: 0.5,
								isMuted: true
							},
							monitoring: {
								volume: 0.75,
								isMuted: false
							}
						}
					},
					devices: {}
				})
			}) as Response) as unknown as typeof fetch

		const response = await getAudioDataStream('', VolumeFormat['0 to 100'])
		expect(response.master.volumeMonitoring).toBe(75)
		expect(response.master.isMutedMonitoring).toBe(false)
		expect(response.master.volumeStreamer).toBe(50)
		expect(response.master.isMutedStreamer).toBe(true)
	})
})
