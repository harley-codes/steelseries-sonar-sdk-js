import type { AudioMode } from '@/enums'
import { requestAudioMode } from '@/sonar/requests/mode/request-audio-mode'

/**
 * Gets audio data for all channels.
 * @param sonarEndpoint Sonar endpoint URL
 * @returns classic or streamer mode
 */
export async function getAudioMode(sonarEndpoint: string): Promise<AudioMode> {
	return await requestAudioMode(sonarEndpoint)
}
