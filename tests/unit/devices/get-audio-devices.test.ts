import { afterEach, beforeEach, describe, expect, it } from 'bun:test'
import { SonarRequestException } from '@/exceptions'
import { getAudioDevices } from '@/functions/devices/get-audio-devices'

let originalFetch: typeof fetch

const request = () => getAudioDevices('http://localhost')

describe('getAudioDevices', () => {
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

	it('return data when response 200', async () => {
		globalThis.fetch = (async () =>
			({
				ok: true,
				json: async () => [
					{
						friendlyName: 'Speakers',
						id: 'speaker',
						dataFlow: 'render'
					},
					{
						friendlyName: 'Microphone',
						id: 'mic',
						dataFlow: 'capture'
					}
				]
			}) as Response) as unknown as typeof fetch

		const response = await request()
		expect(response.length).toBe(2)
	})
})
