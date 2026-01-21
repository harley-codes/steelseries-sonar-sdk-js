import { describe, expect, it } from 'bun:test'
import { getEndpointEndToEnd } from 'tests/helpers/get-endpoint-e2e'
import { AudioChannel, AudioMode } from '@/enums'
import { setChannelMuteClassic } from '@/functions/audio/set-channel-mute-classic'
import { setAudioMode } from '@/index'

describe('setChannelMuteClassic', () => {
	it('returns muted false', async () => {
		const sonarEndpoint = await getEndpointEndToEnd()

		await setAudioMode(sonarEndpoint, AudioMode.Classic)
		const initial = await setChannelMuteClassic(sonarEndpoint, true, AudioChannel.Game)
		const expected = await setChannelMuteClassic(sonarEndpoint, false, AudioChannel.Game)

		expect(initial.isMuted).toBeTrue()
		expect(expected.isMuted).toBeFalse()
	})
})
