import { ProfileChannel } from '@/enums'
import { VirtualAudioDevice } from '@/sonar/models/config/enums/VirtualAudioDevice'

export function convertProfileChannelToApi(channel: ProfileChannel): VirtualAudioDevice {
	switch (channel) {
		case ProfileChannel.Game:
			return VirtualAudioDevice.Game
		case ProfileChannel.Chat:
			return VirtualAudioDevice.ChatRender
		case ProfileChannel.Media:
			return VirtualAudioDevice.Media
		case ProfileChannel.Aux:
			return VirtualAudioDevice.Aux
		case ProfileChannel.Mic:
			return VirtualAudioDevice.ChatCapture
		default:
			throw new Error(`Unsupported ProfileChannel: ${channel}`)
	}
}
