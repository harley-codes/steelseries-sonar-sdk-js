import type { AudioMode } from '@/sonar/models/audio-settings/enums/audio-mode'

export async function changeAudioMode(sonarEndpoint: string, audioMode: AudioMode) {
	const url = new URL(`${sonarEndpoint}/mode/${audioMode}`)
	return await fetch(url, {
		method: 'PUT'
	})
}
