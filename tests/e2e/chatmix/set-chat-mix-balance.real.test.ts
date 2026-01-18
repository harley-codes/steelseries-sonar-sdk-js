import { describe, expect, it } from 'bun:test'
import { getEndpointEndToEnd } from 'tests/helpers/get-endpoint-e2e'
import { AudioMode, ChatMixState } from '@/enums'
import { SonarServerException } from '@/exceptions'
import { setAudioMode } from '@/functions/audio/set-audio-mode'
import { setChatMixBalance } from '@/functions/chatmix/set-chat-mix-balance'

describe('setChatBalance', () => {
	it('returns balance when classic mode', async () => {
		const expectedBalance = 70
		const sonarEndpoint = await getEndpointEndToEnd()
		await setAudioMode(sonarEndpoint, AudioMode.Classic)
		const result = await setChatMixBalance(sonarEndpoint, expectedBalance)
		expect(result).not.toBeNull()
		expect(result.state).toBe(ChatMixState.Enabled)
		expect(result.isEnabled).toBeTrue()
		expect(result.chatBalance).toBe(expectedBalance)
	})

	it('throws when streamer mode enabled', async () => {
		const sonarEndpoint = await getEndpointEndToEnd()
		await setAudioMode(sonarEndpoint, AudioMode.Streamer)
		expect(setChatMixBalance(sonarEndpoint, 0)).rejects.toThrow(SonarServerException)
	})
})
