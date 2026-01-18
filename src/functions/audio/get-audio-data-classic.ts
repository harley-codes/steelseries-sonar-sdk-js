import { AudioChannel } from '@/enums'
import { convertVolumeToUser } from '@/functions/converters/convert-volume-to-user'
import type { VolumeInfoClassic } from '@/sonar/models/audio-settings/volume-info-classic'
import { requestVolumeSettingsClassic } from '@/sonar/requests/volume-settings/request-volume-settings-classic'
import type { ChannelVolumeClassic } from '@/types/channel-volume-classic'
import type { ChannelVolumesClassic } from '@/types/channel-volumes-classic'

/**
 * Gets audio data for all channels.
 * @param sonarEndpoint Sonar endpoint URL
 * @returns volume in the range of 0 to 100,
 */
export async function getAudioDataClassic(sonarEndpoint: string): Promise<ChannelVolumesClassic> {
	const data = await requestVolumeSettingsClassic(sonarEndpoint)
	const volumeData: ChannelVolumesClassic = {
		[AudioChannel.Master]: createResponseVolumeData(data.masters.classic),
		[AudioChannel.Game]: data.devices.game && createResponseVolumeData(data.devices.game.classic),
		[AudioChannel.Chat]: data.devices.chatRender && createResponseVolumeData(data.devices.chatRender.classic),
		[AudioChannel.Media]: data.devices.media && createResponseVolumeData(data.devices.media.classic),
		[AudioChannel.Aux]: data.devices.aux && createResponseVolumeData(data.devices.aux.classic),
		[AudioChannel.Mic]: data.devices.chatCapture && createResponseVolumeData(data.devices.chatCapture.classic)
	}
	return volumeData
}

function createResponseVolumeData(volumeData: VolumeInfoClassic): ChannelVolumeClassic {
	return {
		volume: convertVolumeToUser(volumeData.volume),
		isMuted: volumeData.muted
	}
}
