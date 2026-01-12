import { FETCH_OPTIONS_PUT } from '@/consts/fetch-options-put'
import { type AudioChannel, SonarChannel, type VolumeFormat } from '@/enums'
import { SonarException } from '@/exceptions'
import { convertApiVolumeToUserVolume } from '@/functions/converters/convert-api-volume-to-user-volume'
import { convertAudioChannelToSonarChannel } from '@/functions/converters/convert-audio-channel-to-sonar-channel'
import { convertUserVolumeToApiVolume } from '@/functions/converters/convert-user-volume-to-api-volume'
import type { ApiError } from '@/models/api-error'
import type { VolumeDataClassic } from '@/models/api-volume-data-classic.ok'
import type { ChannelAudioDataClassic } from '@/types/audio-data-classic'

const DEFAULT_ERROR_TEXT = 'Failed to set audio volume.'

export async function setChannelVolumeClassic(
	sonarEndpoint: string,
	volume: number,
	format: VolumeFormat,
	channel: AudioChannel
): Promise<ChannelAudioDataClassic> {
	let response: Response
	let sonarChannel: SonarChannel

	try {
		sonarChannel = convertAudioChannelToSonarChannel(channel)
		const formattedVolume = convertUserVolumeToApiVolume(volume, format)
		response = await fetch(
			`${sonarEndpoint}/volumeSettings/classic/${sonarChannel}/volume/${formattedVolume}`,
			FETCH_OPTIONS_PUT
		)
	} catch (error) {
		throw new SonarException(DEFAULT_ERROR_TEXT, error as Error)
	}
	// console.log('TEST TEST', response)
	if (response.ok) {
		const data = (await response.json()) as VolumeDataClassic
		if (data?.masters?.classic == null) {
			throw new SonarException(`${DEFAULT_ERROR_TEXT} Missing required data in response.`)
		}

		const device = sonarChannel === SonarChannel.Master ? data.masters.classic : data.devices[sonarChannel]

		if (!device) {
			throw new SonarException(`${DEFAULT_ERROR_TEXT} Missing device data in response.`)
		}

		const result: ChannelAudioDataClassic = {
			volume: convertApiVolumeToUserVolume(device.volume, format),
			isMuted: device.isMuted
		}

		return result
	} else {
		const data = (await response.json()) as ApiError
		throw new SonarException(data?.error ?? DEFAULT_ERROR_TEXT)
	}
}
