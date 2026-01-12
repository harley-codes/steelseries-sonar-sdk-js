import { describe, expect, it } from 'bun:test'
import { getEndpointEndToEnd } from 'tests/helpers/get-endpoint-e2e'
import { AudioChannel, AudioMode, StreamerPath, VolumeFormat } from '@/enums'
import { setChannelVolumeStreamer } from '@/functions/audio/set-channel-volume-streamer'
import { setAudioMode } from '@/index'

describe('setChannelVolumeStreamer', () => {
	it('returns new volume in 0 to 1 format', async () => {
		const expectedVolume = 0.41
		const sonarEndpoint = await getEndpointEndToEnd()

		await setAudioMode(sonarEndpoint, AudioMode.Streamer)
		const result = await setChannelVolumeStreamer(
			sonarEndpoint,
			expectedVolume,
			VolumeFormat['0 to 1'],
			AudioChannel.Master,
			StreamerPath.Monitoring
		)

		expect(result.volume).toBe(expectedVolume)
	})
	it('returns new volume in 0 to 100 format', async () => {
		const expectedVolume = 39
		const sonarEndpoint = await getEndpointEndToEnd()

		await setAudioMode(sonarEndpoint, AudioMode.Streamer)
		const result = await setChannelVolumeStreamer(
			sonarEndpoint,
			expectedVolume,
			VolumeFormat['0 to 100'],
			AudioChannel.Master,
			StreamerPath.Monitoring
		)

		expect(result.volume).toBe(expectedVolume)
	})
})
