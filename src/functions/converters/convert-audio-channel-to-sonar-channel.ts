import { AudioChannel, SonarChannel } from '@/enums'

export function convertAudioChannelToSonarChannel(channel: AudioChannel): SonarChannel {
	switch (channel) {
		case AudioChannel.Master:
			return SonarChannel.Master
		case AudioChannel.Game:
			return SonarChannel.Chat
		case AudioChannel.Media:
			return SonarChannel.Media
		case AudioChannel.Auxiliary:
			return SonarChannel.Auxiliary
		case AudioChannel.Mic:
			return SonarChannel.Mic
		default:
			throw new Error(`Unsupported AudioChannel: ${channel}`)
	}
}
