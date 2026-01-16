import { describe, expect, it } from 'bun:test'
import { getEndpointEndToEnd } from 'tests/helpers/get-endpoint-e2e'
import { AudioChannel, AudioMode, StreamerPath } from '@/enums'
import { setChannelVolumeStreamer } from '@/functions/audio/set-channel-volume-streamer'
import { setAudioMode } from '@/index'

describe('setChannelVolumeStreamer', () => {
	it('returns new volume', async () => {
		const expectedVolume = 39
		const sonarEndpoint = await getEndpointEndToEnd()

		await setAudioMode(sonarEndpoint, AudioMode.Streamer)
		const result = await setChannelVolumeStreamer(
			sonarEndpoint,
			expectedVolume,
			AudioChannel.Master,
			StreamerPath.Monitoring
		)

		expect(result.volume).toBe(expectedVolume)
	})
})
