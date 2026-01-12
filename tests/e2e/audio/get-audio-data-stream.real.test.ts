import { describe, expect, it } from 'bun:test'
import { getEndpointEndToEnd } from 'tests/helpers/get-endpoint-e2e'
import { VolumeFormat } from '@/enums'
import { getAudioDataStream } from '@/functions/audio/get-audio-data-stream'

describe('getAudioDataStreamer', () => {
	it('returns an audio mode in 0 to 1 format', async () => {
		const sonarEndpoint = await getEndpointEndToEnd()
		const result = await getAudioDataStream(sonarEndpoint, VolumeFormat['0 to 1'])
		expect(result.master.volumeMonitoring).toBeLessThanOrEqual(1)
	})
	it('returns an audio mode in 0 to 100 format', async () => {
		const sonarEndpoint = await getEndpointEndToEnd()
		const result = await getAudioDataStream(sonarEndpoint, VolumeFormat['0 to 100'])
		expect(result.master.volumeMonitoring).toBeGreaterThan(1)
	})
})
