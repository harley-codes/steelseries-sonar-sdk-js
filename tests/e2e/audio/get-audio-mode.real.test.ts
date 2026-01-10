import { describe, expect, it } from 'bun:test'
import { getEndpointEndToEnd } from 'tests/helpers/get-endpoint-e2e'
import { AudioMode } from '@/enums'
import { getAudioMode } from '@/functions/audio/get-audio-mode'

describe('getAudioMode', () => {
	it('returns an audio mode', async () => {
		const sonarEndpoint = await getEndpointEndToEnd()
		const result = await getAudioMode(sonarEndpoint)
		expect(result).toBeOneOf(Object.values(AudioMode))
	})
})
