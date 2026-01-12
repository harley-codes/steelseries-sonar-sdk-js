import { afterEach, beforeEach, describe, expect, it } from 'bun:test'
import { VolumeFormat } from '@/enums'
import { SonarException } from '@/exceptions'
import { getAudioDataClassic } from '@/functions/audio/get-audio-data-classic'

let originalFetch: typeof fetch

describe('getAudioDataClassic', () => {
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

		expect(getAudioDataClassic('', VolumeFormat['0 to 1'])).rejects.toThrow(SonarException)
	})

	it('throws SonarException when response 200 but not data', async () => {
		globalThis.fetch = (async () =>
			({
				ok: true,
				json: async () => ({})
			}) as Response) as unknown as typeof fetch

		expect(getAudioDataClassic('', VolumeFormat['0 to 1'])).rejects.toThrow(SonarException)
	})

	it('return classic in "0 - 1" format when response 200', async () => {
		globalThis.fetch = (async () =>
			({
				ok: true,
				json: async () => ({
					masters: {
						classic: {
							volume: 0.5,
							isMuted: false
						}
					},
					devices: {}
				})
			}) as Response) as unknown as typeof fetch

		const response = await getAudioDataClassic('', VolumeFormat['0 to 1'])
		expect(response.master.volume).toBe(0.5)
		expect(response.master.isMuted).toBe(false)
	})

	it('return classic in "0 - 100" format when response 200', async () => {
		globalThis.fetch = (async () =>
			({
				ok: true,
				json: async () => ({
					masters: {
						classic: {
							volume: 0.5,
							isMuted: false
						}
					},
					devices: {}
				})
			}) as Response) as unknown as typeof fetch

		const response = await getAudioDataClassic('', VolumeFormat['0 to 100'])
		expect(response.master.volume).toBe(50)
		expect(response.master.isMuted).toBe(false)
	})
})
