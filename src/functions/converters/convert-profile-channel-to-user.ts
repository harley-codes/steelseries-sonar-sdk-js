import { ProfileChannel } from '@/enums'
import { VirtualAudioDevice } from '@/sonar/models/config/enums/VirtualAudioDevice'

export function convertProfileChannelToUser(channel: VirtualAudioDevice): ProfileChannel {
	switch (channel) {
		case VirtualAudioDevice.Game:
			return ProfileChannel.Game
		case VirtualAudioDevice.ChatRender:
			return ProfileChannel.Chat
		case VirtualAudioDevice.Media:
			return ProfileChannel.Media
		case VirtualAudioDevice.Aux:
			return ProfileChannel.Aux
		case VirtualAudioDevice.ChatCapture:
			return ProfileChannel.Mic
		default:
			throw new Error(`Unsupported ProfileChannel: ${channel}`)
	}
}
