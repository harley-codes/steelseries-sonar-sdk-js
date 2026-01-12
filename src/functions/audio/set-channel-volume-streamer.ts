import { FETCH_OPTIONS_PUT } from '@/consts/fetch-options-put'
import { type AudioChannel, SonarChannel, StreamerPath, type VolumeFormat } from '@/enums'
import { SonarException } from '@/exceptions'
import { convertApiVolumeToUserVolume } from '@/functions/converters/convert-api-volume-to-user-volume'
import { convertAudioChannelToSonarChannel } from '@/functions/converters/convert-audio-channel-to-sonar-channel'
import { convertUserVolumeToApiVolume } from '@/functions/converters/convert-user-volume-to-api-volume'
import type { VolumeDataStreamer } from '@/models/api-volume-data-streamer.ok'
import type { ChannelAudioDataStreamer, StreamVolume } from '@/types/audio-data-streamer'

const DEFAULT_ERROR_TEXT = 'Failed to set audio volume.'

export async function setChannelVolumeStreamer(
	sonarEndpoint: string,
	volume: number,
	format: VolumeFormat,
	channel: AudioChannel,
	path: StreamerPath
): Promise<StreamVolume> {
	let response: Response
	let sonarChannel: SonarChannel

	try {
		sonarChannel = convertAudioChannelToSonarChannel(channel)
		const formattedVolume = convertUserVolumeToApiVolume(volume, format)
		response = await fetch(
			`${sonarEndpoint}/volumeSettings/streamer/${path}/${sonarChannel}/volume/${formattedVolume}`,
			FETCH_OPTIONS_PUT
		)
	} catch (error) {
		throw new SonarException(DEFAULT_ERROR_TEXT, error as Error)
	}

	if (response.ok) {
		const data = (await response.json()) as VolumeDataStreamer
		if (data?.masters?.stream == null) {
			throw new SonarException(`${DEFAULT_ERROR_TEXT} Missing required data in response.`)
		}

		const device = sonarChannel === SonarChannel.Master ? data.masters.stream : data.devices[sonarChannel]?.stream

		if (!device) {
			throw new SonarException(`${DEFAULT_ERROR_TEXT} Missing device data in response.`)
		}

		const devicePath = path === StreamerPath.Streaming ? device.streaming : device.monitoring

		const result: StreamVolume = {
			volume: convertApiVolumeToUserVolume(devicePath.volume, format),
			isMuted: devicePath.isMuted
		}

		return result
	} else {
		const data = await response.text()
		throw new SonarException(DEFAULT_ERROR_TEXT, new Error(data))
	}
}
