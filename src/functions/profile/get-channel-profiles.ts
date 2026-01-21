import type { ProfileChannel } from '@/enums'
import { convertProfileChannelToApi } from '@/functions/converters/convert-profile-channel-to-api'
import { convertProfileChannelToUser } from '@/functions/converters/convert-profile-channel-to-user'
import { requestConfigs } from '@/sonar/requests/profiles/request-configs'
import type { ProfileOption } from '@/types/profile-option'

export async function getChannelProfiles(
	sonarAddress: string,
	channel: ProfileChannel,
	favoritesOnly?: boolean
): Promise<ProfileOption[]> {
	const vad = convertProfileChannelToApi(channel)
	const data = await requestConfigs(sonarAddress, vad)
	const workingSetData = favoritesOnly ? data.filter((x) => x.isFavorite) : data

	return workingSetData.map((x) => {
		const profile: ProfileOption = {
			id: x.id,
			name: x.name,
			isFavorite: x.isFavorite,
			channel: convertProfileChannelToUser(x.virtualAudioDevice),
			image: x.image
		}
		return profile
	})
}
