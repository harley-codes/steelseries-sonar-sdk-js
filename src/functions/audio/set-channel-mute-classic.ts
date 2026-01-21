import type { AudioChannel } from '@/enums'
import { SonarRequestException } from '@/exceptions'
import { convertChannelToApi } from '@/functions/converters/convert-channel-to-api'
import { convertVolumeToUser } from '@/functions/converters/convert-volume-to-user'
import { SonarChannel } from '@/sonar/models/audio-settings/enums/sonar-channel'
import { changeVolumeMuteClassic } from '@/sonar/requests/volume-settings/change-volume-mute-classic'
import type { ChannelVolumeClassic } from '@/types/channel-volume-classic'

/**
 * Sets audio data for target channel.
 * @param sonarEndpoint Sonar endpoint URL
 * @param isMuted Will mute if true.
 * @param channel Target audio channel
 */
export async function setChannelMuteClassic(
	sonarEndpoint: string,
	isMuted: boolean,
	channel: AudioChannel
): Promise<ChannelVolumeClassic> {
	const sonarChannel = convertChannelToApi(channel)
	const data = await changeVolumeMuteClassic(sonarEndpoint, isMuted, sonarChannel)

	const device = sonarChannel === SonarChannel.Master ? data.masters.classic : data.devices[sonarChannel]?.classic

	if (!device) {
		throw new SonarRequestException({ message: `Missing device data in response.` })
	}

	const result: ChannelVolumeClassic = {
		volume: convertVolumeToUser(device.volume),
		isMuted: device.muted
	}

	return result
}
