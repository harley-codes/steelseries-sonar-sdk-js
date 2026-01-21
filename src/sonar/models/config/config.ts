import type { VirtualAudioDevice } from '@/sonar/models/config/enums/VirtualAudioDevice'

export type Config = {
	id: string
	name: string
	isFavorite: boolean
	virtualAudioDevice: VirtualAudioDevice
	image?: string
}
