import type { VolumeFormat } from '@/enums'
import { SonarException } from '@/exceptions'
import { formatRawAudioValue } from '@/functions/helpers/format-raw-audio-value'
import type { AudioDataClassic, ChannelAudioDataClassic } from '@/types/audio-data-classic'

const DEFAULT_ERROR_TEXT = 'Failed to get audio data.'

type OkResponse = {
	masters: {
		classic: VolumeData
	}
	devices: {
		game?: VolumeData
		chatRender?: VolumeData
		chatCapture?: VolumeData
		media?: VolumeData
		aux?: VolumeData
	}
}

type VolumeData = {
	volume: number
	isMuted: boolean
}

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
		const data = (await response.json()) as OkResponse
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

function createResponseVolumeData(volumeData: VolumeData, volumeFormat: VolumeFormat): ChannelAudioDataClassic {
	return {
		volume: formatRawAudioValue(volumeData.volume, volumeFormat),
		isMuted: volumeData.isMuted
	}
}
