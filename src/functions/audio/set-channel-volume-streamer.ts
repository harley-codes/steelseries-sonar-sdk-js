import { FETCH_OPTIONS_PUT } from '@/consts/fetch-options-put'
import { type AudioChannel, SonarChannel, StreamerPath } from '@/enums'
import { SonarException } from '@/exceptions'
import { convertChannelToApi } from '@/functions/converters/convert-channel-to-api'
import { convertVolumeToApi } from '@/functions/converters/convert-volume-to-api'
import { convertVolumeToUser } from '@/functions/converters/convert-volume-to-user'
import type { ApiVolumeDataStreamer } from '@/models/api-volume-data-streamer.ok'
import type { StreamVolume } from '@/types/audio-data-streamer'

const DEFAULT_ERROR_TEXT = 'Failed to set audio volume.'

/**
 * Sets audio data for target channel.
 * @param sonarEndpoint Sonar endpoint URL
 * @param volumePercent Volume in the range of 0 to 100
 * @param channel Target audio channel
 * @param path Target streamer path
 */
export async function setChannelVolumeStreamer(
	sonarEndpoint: string,
	volumePercent: number,
	channel: AudioChannel,
	path: StreamerPath
): Promise<StreamVolume> {
	let response: Response
	let sonarChannel: SonarChannel

	try {
		sonarChannel = convertChannelToApi(channel)
		const formattedVolume = convertVolumeToApi(volumePercent)
		response = await fetch(
			`${sonarEndpoint}/volumeSettings/streamer/${path}/${sonarChannel}/volume/${formattedVolume}`,
			FETCH_OPTIONS_PUT
		)
	} catch (error) {
		throw new SonarException(DEFAULT_ERROR_TEXT, error as Error)
	}

	if (response.ok) {
		const data = (await response.json()) as ApiVolumeDataStreamer
		if (data?.masters?.stream == null) {
			throw new SonarException(`${DEFAULT_ERROR_TEXT} Missing required data in response.`)
		}

		const device = sonarChannel === SonarChannel.Master ? data.masters.stream : data.devices[sonarChannel]?.stream

		if (!device) {
			throw new SonarException(`${DEFAULT_ERROR_TEXT} Missing device data in response.`)
		}

		const devicePath = path === StreamerPath.Streaming ? device.streaming : device.monitoring

		const result: StreamVolume = {
			volume: convertVolumeToUser(devicePath.volume),
			isMuted: devicePath.isMuted
		}

		return result
	} else {
		const data = await response.text()
		throw new SonarException(DEFAULT_ERROR_TEXT, new Error(data))
	}
}
