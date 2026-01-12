import type { VolumeFormat } from '@/enums'
import { SonarException } from '@/exceptions'
import { convertApiVolumeToUserVolume } from '@/functions/converters/convert-api-volume-to-user-volume'
import type { ChannelDataClassic, VolumeDataClassic } from '@/models/api-volume-data-classic.ok'
import type { AudioDataClassic, ChannelAudioDataClassic } from '@/types/audio-data-classic'

const DEFAULT_ERROR_TEXT = 'Failed to get audio data.'

export async function getAudioDataClassic(
	sonarEndpoint: string,
	volumeFormat: VolumeFormat
): Promise<AudioDataClassic> {
	let response: Response

	try {
		response = await fetch(`${sonarEndpoint}/volumeSettings/classic`)
	} catch (error) {
		throw new SonarException(DEFAULT_ERROR_TEXT, error as Error)
	}

	if (response.ok) {
		const data = (await response.json()) as VolumeDataClassic
		if (data?.masters?.classic == null) {
			throw new SonarException(`${DEFAULT_ERROR_TEXT} Missing required data in response.`)
		}
		const volumeData: AudioDataClassic = {
			master: createResponseVolumeData(data.masters.classic, volumeFormat),
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

function createResponseVolumeData(volumeData: ChannelDataClassic, volumeFormat: VolumeFormat): ChannelAudioDataClassic {
	return {
		volume: convertApiVolumeToUserVolume(volumeData.volume, volumeFormat),
		isMuted: volumeData.isMuted
	}
}
