import { describe, expect, it } from 'bun:test'
import { getEndpointEndToEnd } from 'tests/helpers/get-endpoint-e2e'
import { AudioChannel, AudioMode } from '@/enums'
import { setChannelVolumeClassic } from '@/functions/audio/set-channel-volume-classic'
import { setAudioMode } from '@/index'

describe('setChannelVolumeClassic', () => {
	it('returns new volume', async () => {
		const expectedVolume = 39
		const sonarEndpoint = await getEndpointEndToEnd()

		await setAudioMode(sonarEndpoint, AudioMode.Classic)
		const result = await setChannelVolumeClassic(sonarEndpoint, expectedVolume, AudioChannel.Master)

		expect(result.volume).toBe(expectedVolume)
	})
})
