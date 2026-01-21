import { describe, expect, it } from 'bun:test'
import { getEndpointEndToEnd } from 'tests/helpers/get-endpoint-e2e'
import { setSelectedProfile } from '@/functions/profile/set-selected-profile'

const INITIAL_PROFILE = 'e6979db3-3e00-4399-b58c-6f026c9ef6ba'
const CHANGED_PROFILE = 'c55f5f17-db23-4b0e-805c-02fd3ba39636'

describe('setSelectedProfiles', () => {
	it('sets profile successfully', async () => {
		const sonarEndpoint = await getEndpointEndToEnd()
		const initial = await setSelectedProfile(sonarEndpoint, INITIAL_PROFILE)
		const changed = await setSelectedProfile(sonarEndpoint, CHANGED_PROFILE)
		expect(initial.id).toBe(INITIAL_PROFILE)
		expect(changed.id).toBe(CHANGED_PROFILE)
		expect(initial.id).not.toBe(changed.id)
	})
})
