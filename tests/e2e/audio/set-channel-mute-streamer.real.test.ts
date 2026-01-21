import { describe, expect, it } from 'bun:test'
import { getEndpointEndToEnd } from 'tests/helpers/get-endpoint-e2e'
import { AudioChannel, AudioMode, StreamerPath } from '@/enums'
import { setChannelMuteStreamer } from '@/functions/audio/set-channel-mute-streamer'
import { setAudioMode } from '@/index'

describe('setChannelMuteStreamer', () => {
	it('returns muted false', async () => {
		const sonarEndpoint = await getEndpointEndToEnd()

		await setAudioMode(sonarEndpoint, AudioMode.Streamer)
		const initial = await setChannelMuteStreamer(sonarEndpoint, true, AudioChannel.Game, StreamerPath.Streaming)
		const expected = await setChannelMuteStreamer(sonarEndpoint, false, AudioChannel.Game, StreamerPath.Streaming)

		expect(initial.isMuted).toBeTrue()
		expect(expected.isMuted).toBeFalse()
	})
})
