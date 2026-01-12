import { describe, expect, it } from 'bun:test'
import { getEndpointEndToEnd } from 'tests/helpers/get-endpoint-e2e'
import { VolumeFormat } from '@/enums'
import { getAudioDataClassic } from '@/functions/audio/get-audio-data-classic'

describe('getAudioDataClassic', () => {
	it('returns an audio mode in 0 to 1 format', async () => {
		const sonarEndpoint = await getEndpointEndToEnd()
		const result = await getAudioDataClassic(sonarEndpoint, VolumeFormat['0 to 1'])
		expect(result.master.volume).toBeLessThanOrEqual(1)
	})
	it('returns an audio mode in 0 to 100 format', async () => {
		const sonarEndpoint = await getEndpointEndToEnd()
		const result = await getAudioDataClassic(sonarEndpoint, VolumeFormat['0 to 100'])
		expect(result.master.volume).toBeGreaterThan(1)
	})
})
