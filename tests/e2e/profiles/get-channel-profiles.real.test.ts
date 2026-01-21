import { describe, expect, it } from 'bun:test'
import { getEndpointEndToEnd } from 'tests/helpers/get-endpoint-e2e'
import { ProfileChannel } from '@/enums'
import { getChannelProfiles } from '@/functions/profile/get-channel-profiles'

describe('getChannelProfiles', () => {
	it('returns list of profiles', async () => {
		const sonarEndpoint = await getEndpointEndToEnd()
		const result = await getChannelProfiles(sonarEndpoint, ProfileChannel.Game)
		expect(result.length).toBeGreaterThan(1)
	})

	it('returns list of favorite profiles only', async () => {
		const sonarEndpoint = await getEndpointEndToEnd()
		const allProfiles = await getChannelProfiles(sonarEndpoint, ProfileChannel.Game)
		const favoriteProfiles = await getChannelProfiles(sonarEndpoint, ProfileChannel.Game, true)
		expect(allProfiles.length).toBeGreaterThan(1)
		expect(favoriteProfiles.length).toBeGreaterThan(1)
		expect(favoriteProfiles.length).toBeLessThan(allProfiles.length)
	})
})
