import { AudioChannel, StreamerPath } from '@/enums'
import { convertVolumeToUser } from '@/functions/converters/convert-volume-to-user'
import type { VolumeInfoStreamer } from '@/sonar/models/audio-settings/volume-info-streamer'
import { requestVolumeSettingsStreamer } from '@/sonar/requests/volume-settings/request-volume-settings-streamer'
import type { ChannelVolumeStreamer } from '@/types/channel-volume-streamer'
import type { ChannelVolumesStreamer } from '@/types/channel-volumes-streamer'

/**
 * Gets audio data for all channels.
 * @param sonarEndpoint Sonar endpoint URL
 * @returns volume in the range of 0 to 100,
 */
export async function getAudioDataStream(sonarEndpoint: string): Promise<ChannelVolumesStreamer> {
	const data = await requestVolumeSettingsStreamer(sonarEndpoint)
	const volumeData: ChannelVolumesStreamer = {
		[AudioChannel.Master]: createResponseVolumeData(data.masters.stream),
		[AudioChannel.Game]: data.devices.game && createResponseVolumeData(data.devices.game.stream),
		[AudioChannel.Chat]: data.devices.chatRender && createResponseVolumeData(data.devices.chatRender.stream),
		[AudioChannel.Media]: data.devices.media && createResponseVolumeData(data.devices.media.stream),
		[AudioChannel.Aux]: data.devices.aux && createResponseVolumeData(data.devices.aux.stream),
		[AudioChannel.Mic]: data.devices.chatCapture && createResponseVolumeData(data.devices.chatCapture.stream)
	}
	return volumeData
}

function createResponseVolumeData(volumeData: VolumeInfoStreamer): ChannelVolumeStreamer {
	return {
		[StreamerPath.Streaming]: {
			volume: convertVolumeToUser(volumeData.streaming.volume),
			isMuted: volumeData.streaming.muted
		},
		[StreamerPath.Monitoring]: {
			volume: convertVolumeToUser(volumeData.monitoring.volume),
			isMuted: volumeData.monitoring.muted
		}
	}
}
