import { describe, expect, it } from 'bun:test'
import { getEndpointEndToEnd } from 'tests/helpers/get-endpoint-e2e'
import { DeviceFlow } from '@/enums'
import { getAudioDevices } from '@/functions/devices/get-audio-devices'

describe('getAudioDevices', () => {
	it('returns audio devices for input', async () => {
		const sonarEndpoint = await getEndpointEndToEnd()
		const result = await getAudioDevices(sonarEndpoint, DeviceFlow.Input)
		expect(result.length).toBeGreaterThan(0)
	})

	it('returns audio devices for output', async () => {
		const sonarEndpoint = await getEndpointEndToEnd()
		const result = await getAudioDevices(sonarEndpoint, DeviceFlow.Output)
		expect(result.length).toBeGreaterThan(0)
	})

	it('returns combined audio devices for all', async () => {
		const sonarEndpoint = await getEndpointEndToEnd()
		const resultInput = await getAudioDevices(sonarEndpoint, DeviceFlow.Input)
		const resultOutput = await getAudioDevices(sonarEndpoint, DeviceFlow.Output)
		const resultAll = await getAudioDevices(sonarEndpoint)
		expect(resultInput.length).toBeGreaterThan(0)
		expect(resultOutput.length).toBeGreaterThan(0)
		expect(resultAll.length).toBeGreaterThan(0)
		expect(resultAll.length).toBe(resultInput.length + resultOutput.length)
	})
})
