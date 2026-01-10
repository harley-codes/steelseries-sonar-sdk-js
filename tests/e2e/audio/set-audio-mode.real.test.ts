import { describe, expect, it } from 'bun:test'
import { getEndpointEndToEnd } from 'tests/helpers/get-endpoint-e2e'
import { AudioMode } from '@/enums'
import { setAudioMode } from '@/functions/audio/set-audio-mode'

describe('setAudioMode', () => {
	it('returns classic when set to classic', async () => {
		const expectedAudioMode: AudioMode = AudioMode.Classic
		const sonarEndpoint = await getEndpointEndToEnd()
		const result = await setAudioMode(sonarEndpoint, expectedAudioMode)
		expect(result).toBe(expectedAudioMode)
	})

	it('returns streamer when set to streamer', async () => {
		const expectedAudioMode: AudioMode = AudioMode.Streamer
		const sonarEndpoint = await getEndpointEndToEnd()
		const result = await setAudioMode(sonarEndpoint, expectedAudioMode)
		expect(result).toBe(expectedAudioMode)
	})
})
