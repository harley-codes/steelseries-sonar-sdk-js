import { convertProfileChannelToUser } from '@/functions/converters/convert-profile-channel-to-user'
import { requestSelectedConfigs } from '@/sonar/requests/profiles/request-selected-configs'
import type { ProfileOption } from '@/types/profile-option'

export async function getSelectedProfiles(sonarAddress: string): Promise<ProfileOption[]> {
	const data = await requestSelectedConfigs(sonarAddress)
	return data.map((x) => {
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
