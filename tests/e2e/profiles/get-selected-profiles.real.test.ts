import { describe, expect, it } from 'bun:test'
import { getEndpointEndToEnd } from 'tests/helpers/get-endpoint-e2e'
import { getSelectedProfiles } from '@/functions/profile/get-selected-profiles'

describe('getSelectedProfiles', () => {
	it('returns list of selected profiles', async () => {
		const sonarEndpoint = await getEndpointEndToEnd()
		const result = await getSelectedProfiles(sonarEndpoint)
		expect(result.length).toBeGreaterThanOrEqual(2)
	})
})
