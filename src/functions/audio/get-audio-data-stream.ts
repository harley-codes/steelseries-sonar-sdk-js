import type { VolumeFormat } from '@/enums'
import { SonarException } from '@/exceptions'
import { convertApiVolumeToUserVolume } from '@/functions/converters/convert-api-volume-to-user-volume'
import type { ChannelDataStreamer, VolumeDataStreamer } from '@/models/api-volume-data-streamer.ok'
import type { AudioDataStreamer, ChannelAudioDataStreamer } from '@/types/audio-data-streamer'

const DEFAULT_ERROR_TEXT = 'Failed to get audio data.'

export async function getAudioDataStream(
	sonarEndpoint: string,
	volumeFormat: VolumeFormat
): Promise<AudioDataStreamer> {
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
			master: createResponseVolumeData(data.masters, volumeFormat),
			game: data.devices.game && createResponseVolumeData(data.devices.game, volumeFormat),
			chat: data.devices.chatRender && createResponseVolumeData(data.devices.chatRender, volumeFormat),
			media: data.devices.media && createResponseVolumeData(data.devices.media, volumeFormat),
			aux: data.devices.aux && createResponseVolumeData(data.devices.aux, volumeFormat),
			mic: data.devices.chatCapture && createResponseVolumeData(data.devices.chatCapture, volumeFormat),
			volumeFormat
		}
		return volumeData
	} else {
		const data = await response.text()
		throw new SonarException(DEFAULT_ERROR_TEXT, new Error(data))
	}
}

function createResponseVolumeData(
	volumeData: ChannelDataStreamer,
	volumeFormat: VolumeFormat
): ChannelAudioDataStreamer {
	return {
		volumeStreamer: convertApiVolumeToUserVolume(volumeData.stream.streaming.volume, volumeFormat),
		volumeMonitoring: convertApiVolumeToUserVolume(volumeData.stream.monitoring.volume, volumeFormat),
		isMutedStreamer: volumeData.stream.streaming.isMuted,
		isMutedMonitoring: volumeData.stream.monitoring.isMuted
	}
}
