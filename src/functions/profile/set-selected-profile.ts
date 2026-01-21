import { convertProfileChannelToUser } from '@/functions/converters/convert-profile-channel-to-user'
import { changeSelectedConfig } from '@/sonar/requests/profiles/change-selected-config'
import type { ProfileOption } from '@/types/profile-option'

export async function setSelectedProfile(sonarAddress: string, profileId: string): Promise<ProfileOption> {
	const data = await changeSelectedConfig(sonarAddress, profileId)

	const result: ProfileOption = {
		id: data.id,
		name: data.name,
		isFavorite: data.isFavorite,
		channel: convertProfileChannelToUser(data.virtualAudioDevice),
		image: data.image
	}

	return result
}
