import { describe, expect, it } from 'bun:test'
import { getEndpointEndToEnd } from 'tests/helpers/get-endpoint-e2e'
import { getAudioDataClassic } from '@/functions/audio/get-audio-data-classic'

describe('getAudioDataClassic', () => {
	it('returns audio data', async () => {
		const sonarEndpoint = await getEndpointEndToEnd()
		const result = await getAudioDataClassic(sonarEndpoint)
		expect(result.master?.volume).toBeGreaterThan(0)
	})
})
