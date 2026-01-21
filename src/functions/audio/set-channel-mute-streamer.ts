import { type AudioChannel, StreamerPath } from '@/enums'
import { SonarRequestException } from '@/exceptions'
import { convertChannelToApi } from '@/functions/converters/convert-channel-to-api'
import { convertVolumeToUser } from '@/functions/converters/convert-volume-to-user'
import { SonarChannel } from '@/sonar/models/audio-settings/enums/sonar-channel'
import { StreamingPath } from '@/sonar/models/audio-settings/enums/streaming-path'
import { changeVolumeMuteStreamer } from '@/sonar/requests/volume-settings/change-volume-mute-streamer'
import type { ChannelVolumeStreamerPath } from '@/types/channel-volume-streamer-path'

/**
 * Sets audio data for target channel.
 * @param sonarEndpoint Sonar endpoint URL
 * @param isMuted Will mute if true.
 * @param channel Target audio channel
 * @param path Target streamer path
 */
export async function setChannelMuteStreamer(
	sonarEndpoint: string,
	isMuted: boolean,
	channel: AudioChannel,
	path: StreamerPath
): Promise<ChannelVolumeStreamerPath> {
	const sonarChannel = convertChannelToApi(channel)
	const streamPath = path === StreamerPath.Streaming ? StreamingPath.Streaming : StreamingPath.Monitoring
	const data = await changeVolumeMuteStreamer(sonarEndpoint, isMuted, sonarChannel, streamPath)

	const device = sonarChannel === SonarChannel.Master ? data.masters.stream : data.devices[sonarChannel]?.stream

	if (!device) {
		throw new SonarRequestException({ message: `Missing device data in response.` })
	}

	const devicePath = path === StreamerPath.Streaming ? device.streaming : device.monitoring

	const result: ChannelVolumeStreamerPath = {
		volume: convertVolumeToUser(devicePath.volume),
		isMuted: devicePath.muted
	}

	return result
}
