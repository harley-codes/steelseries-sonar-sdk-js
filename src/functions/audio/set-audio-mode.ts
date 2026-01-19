import type { AudioMode } from '@/enums'
import { changeAudioMode } from '@/sonar/requests/mode/change-audio-mode'

/**
 * Gets audio data for all channels.
 * @param sonarEndpoint Sonar endpoint URL
 * @param audioMode Target audio mode
 * @returns classic or streamer mode
 */
export async function setAudioMode(sonarEndpoint: string, audioMode: AudioMode): Promise<AudioMode> {
	return await changeAudioMode(sonarEndpoint, audioMode)
}
