import { describe, expect, it } from 'bun:test'
import { getEndpointEndToEnd } from 'tests/helpers/get-endpoint-e2e'
import { getAudioDataStream } from '@/functions/audio/get-audio-data-stream'

describe('getAudioDataStreamer', () => {
	it('returns audio data', async () => {
		const sonarEndpoint = await getEndpointEndToEnd()
		const result = await getAudioDataStream(sonarEndpoint)
		expect(result.master?.volumeMonitoring).toBeGreaterThan(0)
	})
})
