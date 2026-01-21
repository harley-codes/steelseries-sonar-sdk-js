import type { ProfileChannel } from '@/enums'

export type ProfileOption = {
	id: string
	name: string
	isFavorite: boolean
	channel: ProfileChannel
	image?: string
}
