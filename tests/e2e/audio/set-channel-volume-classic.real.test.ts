import { describe, expect, it } from 'bun:test'
import { getEndpointEndToEnd } from 'tests/helpers/get-endpoint-e2e'
import { AudioChannel, AudioMode, VolumeFormat } from '@/enums'
import { setChannelVolumeClassic } from '@/functions/audio/set-channel-volume-classic'
import { setAudioMode } from '@/index'

describe('setChannelVolumeClassic', () => {
	it('returns new volume in 0 to 1 format', async () => {
		const expectedVolume = 0.41
		const sonarEndpoint = await getEndpointEndToEnd()

		await setAudioMode(sonarEndpoint, AudioMode.Classic)
		const result = await setChannelVolumeClassic(
			sonarEndpoint,
			expectedVolume,
			VolumeFormat['0 to 1'],
			AudioChannel.Master
		)

		expect(result.volume).toBe(expectedVolume)
	})
	it('returns new volume in 0 to 100 format', async () => {
		const expectedVolume = 39
		const sonarEndpoint = await getEndpointEndToEnd()

		await setAudioMode(sonarEndpoint, AudioMode.Classic)
		const result = await setChannelVolumeClassic(
			sonarEndpoint,
			expectedVolume,
			VolumeFormat['0 to 100'],
			AudioChannel.Master
		)

		expect(result.volume).toBe(expectedVolume)
	})
})
