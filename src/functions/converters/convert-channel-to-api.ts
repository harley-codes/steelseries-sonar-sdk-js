import { AudioChannel } from '@/enums'
import { SonarChannel } from '@/sonar/models/audio-settings/enums/sonar-channel'

export function convertChannelToApi(channel: AudioChannel): SonarChannel {
	switch (channel) {
		case AudioChannel.Master:
			return SonarChannel.Master
		case AudioChannel.Game:
			return SonarChannel.ChatRender
		case AudioChannel.Media:
			return SonarChannel.Media
		case AudioChannel.Aux:
			return SonarChannel.Aux
		case AudioChannel.Mic:
			return SonarChannel.ChatCapture
		default:
			throw new Error(`Unsupported AudioChannel: ${channel}`)
	}
}
