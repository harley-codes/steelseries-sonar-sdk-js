import { AudioChannel } from '@/enums'
import { SonarException } from '@/exceptions'
import { convertVolumeToUser } from '@/functions/converters/convert-volume-to-user'
import type { ApiChannelDataClassic, ApiVolumeDataClassic } from '@/models/api-volume-data-classic.ok'
import type { AudioDataClassic, ChannelAudioDataClassic } from '@/types/audio-data-classic'

const DEFAULT_ERROR_TEXT = 'Failed to get audio data.'

/**
 * Gets audio data for all channels.
 * @param sonarEndpoint Sonar endpoint URL
 * @returns volume in the range of 0 to 100,
 */
export async function getAudioDataClassic(sonarEndpoint: string): Promise<AudioDataClassic> {
	let response: Response

	try {
		response = await fetch(`${sonarEndpoint}/volumeSettings/classic`)
	} catch (error) {
		throw new SonarException(DEFAULT_ERROR_TEXT, error as Error)
	}

	if (response.ok) {
		const data = (await response.json()) as ApiVolumeDataClassic
		if (data?.masters?.classic == null) {
			throw new SonarException(`${DEFAULT_ERROR_TEXT} Missing required data in response.`)
		}
		const volumeData: AudioDataClassic = {
			[AudioChannel.Master]: createResponseVolumeData(data.masters.classic),
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

function createResponseVolumeData(volumeData: ApiChannelDataClassic): ChannelAudioDataClassic {
	return {
		volume: convertVolumeToUser(volumeData.volume),
		isMuted: volumeData.isMuted
	}
}
