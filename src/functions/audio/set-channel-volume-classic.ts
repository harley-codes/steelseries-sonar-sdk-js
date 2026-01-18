import type { AudioChannel } from '@/enums'
import { SonarServerException } from '@/exceptions'
import { convertChannelToApi } from '@/functions/converters/convert-channel-to-api'
import { convertVolumeToApi } from '@/functions/converters/convert-volume-to-api'
import { convertVolumeToUser } from '@/functions/converters/convert-volume-to-user'
import { SonarChannel } from '@/sonar/models/audio-settings/enums/sonar-channel'
import { changeVolumeSettingsClassic } from '@/sonar/requests/volume-settings/change-volume-settings-classic'
import type { ChannelVolumeClassic } from '@/types/channel-volume-classic'

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
): Promise<ChannelVolumeClassic> {
	const sonarChannel = convertChannelToApi(channel)
	const formattedVolume = convertVolumeToApi(volumePercent)
	const data = await changeVolumeSettingsClassic(sonarEndpoint, formattedVolume, sonarChannel)

	const device = sonarChannel === SonarChannel.Master ? data.masters.classic : data.devices[sonarChannel]?.classic

	if (!device) {
		throw new SonarServerException({ message: `Missing device data in response.` })
	}

	const result: ChannelVolumeClassic = {
		volume: convertVolumeToUser(device.volume),
		isMuted: device.muted
	}

	return result
}
