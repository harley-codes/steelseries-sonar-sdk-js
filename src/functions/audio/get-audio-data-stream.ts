import { AudioChannel } from '@/enums'
import { SonarException } from '@/exceptions'
import { convertVolumeToUser } from '@/functions/converters/convert-volume-to-user'
import type { ChannelDataStreamer, VolumeDataStreamer } from '@/models/api-volume-data-streamer.ok'
import type { AudioDataStreamer, ChannelAudioDataStreamer } from '@/types/audio-data-streamer'

const DEFAULT_ERROR_TEXT = 'Failed to get audio data.'

/**
 * Gets audio data for all channels.
 * @param sonarEndpoint Sonar endpoint URL
 * @returns volume in the range of 0 to 100,
 */
export async function getAudioDataStream(sonarEndpoint: string): Promise<AudioDataStreamer> {
	let response: Response

	try {
		response = await fetch(`${sonarEndpoint}/volumeSettings/streamer`)
	} catch (error) {
		throw new SonarException(DEFAULT_ERROR_TEXT, error as Error)
	}

	if (response.ok) {
		const data = (await response.json()) as VolumeDataStreamer
		if (data?.masters?.stream == null) {
			throw new SonarException(`${DEFAULT_ERROR_TEXT} Missing required data in response.`)
		}
		const volumeData: AudioDataStreamer = {
			[AudioChannel.Master]: createResponseVolumeData(data.masters),
			[AudioChannel.Game]: data.devices.game && createResponseVolumeData(data.devices.game),
			[AudioChannel.Chat]: data.devices.chatRender && createResponseVolumeData(data.devices.chatRender),
			[AudioChannel.Media]: data.devices.media && createResponseVolumeData(data.devices.media),
			[AudioChannel.Aux]: data.devices.aux && createResponseVolumeData(data.devices.aux),
			[AudioChannel.Mic]: data.devices.chatCapture && createResponseVolumeData(data.devices.chatCapture)
		}
		return volumeData
	} else {
		const data = await response.text()
		throw new SonarException(DEFAULT_ERROR_TEXT, new Error(data))
	}
}

function createResponseVolumeData(volumeData: ChannelDataStreamer): ChannelAudioDataStreamer {
	return {
		volumeStreamer: convertVolumeToUser(volumeData.stream.streaming.volume),
		volumeMonitoring: convertVolumeToUser(volumeData.stream.monitoring.volume),
		isMutedStreamer: volumeData.stream.streaming.isMuted,
		isMutedMonitoring: volumeData.stream.monitoring.isMuted
	}
}
