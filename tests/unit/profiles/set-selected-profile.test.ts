import { afterEach, beforeEach, describe, expect, it } from 'bun:test'
import { SonarRequestException } from '@/exceptions'
import { setSelectedProfile } from '@/functions/profile/set-selected-profile'
import { VirtualAudioDevice } from '@/sonar/models/config/enums/VirtualAudioDevice'

let originalFetch: typeof fetch

const request = () => setSelectedProfile('http://localhost', 'one')

describe('setSelectedProfile', () => {
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
					id: 'one',
					name: 'one',
					isFavorite: true,
					virtualAudioDevice: VirtualAudioDevice.Game,
					image: 'string'
				})
			}) as Response) as unknown as typeof fetch

		const response = await request()
		expect(response.id).toBe('one')
	})
})
