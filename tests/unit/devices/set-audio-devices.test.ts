import { afterEach, beforeEach, describe, expect, it } from 'bun:test'
import { DeviceChannel } from '@/enums'
import { SonarRequestException } from '@/exceptions'
import { setAudioDevice } from '@/functions/devices/set-audio-device'

let originalFetch: typeof fetch

const request = () => setAudioDevice('http://localhost', DeviceChannel.Output, 'game_ID')

describe('setAudioDevices', () => {
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
						id: 'game',
						deviceId: 'game_ID',
						isRunning: true
					},
					{
						id: 'aux',
						deviceId: 'game_ID',
						isRunning: false
					}
				]
			}) as Response) as unknown as typeof fetch

		const response = await request()
		expect(response.length).toBe(2)
		expect(response[0]?.deviceChannel).toBe(DeviceChannel.Game)
		expect(response[1]?.deviceChannel).toBe(DeviceChannel.Aux)
	})
})
