import { FETCH_OPTIONS_PUT } from '@/consts/fetch-options-put'
import { type AudioChannel, SonarChannel } from '@/enums'
import { SonarException } from '@/exceptions'
import { convertChannelToApi } from '@/functions/converters/convert-channel-to-api'
import { convertVolumeToApi } from '@/functions/converters/convert-volume-to-api'
import { convertVolumeToUser } from '@/functions/converters/convert-volume-to-user'
import type { ApiError } from '@/models/api-error'
import type { VolumeDataClassic } from '@/models/api-volume-data-classic.ok'
import type { ChannelAudioDataClassic } from '@/types/audio-data-classic'

const DEFAULT_ERROR_TEXT = 'Failed to set audio volume.'

/**
 * Sets audio data for target channel.
 * @param sonarEndpoint Sonar endpoint URL
 * @param volumePercent Volume in the range of 0 to 100
 * @param channel Target audio channel
 */
export async function setChannelVolumeClassic(
	sonarEndpoint: string,
	volumePercent: number,
	channel: AudioChannel
): Promise<ChannelAudioDataClassic> {
	let response: Response
	let sonarChannel: SonarChannel

	try {
		sonarChannel = convertChannelToApi(channel)
		const formattedVolume = convertVolumeToApi(volumePercent)
		response = await fetch(
			`${sonarEndpoint}/volumeSettings/classic/${sonarChannel}/volume/${formattedVolume}`,
			FETCH_OPTIONS_PUT
		)
	} catch (error) {
		throw new SonarException(DEFAULT_ERROR_TEXT, error as Error)
	}

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
			volume: convertVolumeToUser(device.volume),
			isMuted: device.isMuted
		}

		return result
	} else {
		const data = (await response.json()) as ApiError
		throw new SonarException(data?.error ?? DEFAULT_ERROR_TEXT)
	}
}
