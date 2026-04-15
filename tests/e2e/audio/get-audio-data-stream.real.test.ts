import { describe, expect, it } from 'bun:test'
import { getEndpointEndToEnd } from 'tests/helpers/get-endpoint-e2e'
import { getAudioDataStreamer } from '@/functions/audio/get-audio-data-streamer'

describe('getAudioDataStreamer', () => {
	it('returns audio data', async () => {
		const sonarEndpoint = await getEndpointEndToEnd()
		const result = await getAudioDataStreamer(sonarEndpoint)
		expect(result.master.monitoring.volume).toBeGreaterThan(0)
	})
})
