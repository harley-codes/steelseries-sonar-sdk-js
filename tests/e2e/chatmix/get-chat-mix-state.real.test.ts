import { describe, expect, it } from 'bun:test'
import { getEndpointEndToEnd } from 'tests/helpers/get-endpoint-e2e'
import { AudioMode, ChatMixState } from '@/enums'
import { setAudioMode } from '@/functions/audio/set-audio-mode'
import { getChatMixState } from '@/functions/chatmix/get-chat-mix-state'

describe('getChatMixState', () => {
	it('returns enabled state when classic', async () => {
		const sonarEndpoint = await getEndpointEndToEnd()
		await setAudioMode(sonarEndpoint, AudioMode.Classic)
		const result = await getChatMixState(sonarEndpoint)
		expect(result).not.toBeNull()
		expect(result.state).toBe(ChatMixState.Enabled)
		expect(result.isEnabled).toBeTrue()
	})

	it('returns disabled state when streamer', async () => {
		const sonarEndpoint = await getEndpointEndToEnd()
		await setAudioMode(sonarEndpoint, AudioMode.Streamer)
		const result = await getChatMixState(sonarEndpoint)
		expect(result).not.toBeNull()
		expect(result.state).toBe(ChatMixState.FiniteWheel)
		expect(result.isEnabled).toBeFalse()
	})
})
