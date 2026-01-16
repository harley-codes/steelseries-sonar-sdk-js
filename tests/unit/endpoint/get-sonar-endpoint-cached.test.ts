import { afterEach, beforeEach, describe, expect, it, setSystemTime } from 'bun:test'
import { getSonarEndpointCached } from '../../../src/functions/endpoint/get-sonar-endpoint-cached'

let originalFetch: typeof fetch

describe('getSonarEndpointCached', () => {
	beforeEach(() => {
		originalFetch = globalThis.fetch
	})

	afterEach(() => {
		globalThis.fetch = originalFetch
	})

	it('return cached value when within time', async () => {
		const expectedWebServerAddress = 'https://127.0.0.1:1234'

		globalThis.fetch = (async () =>
			({
				ok: true,
				json: async () => ({
					subApps: {
						sonar: {
							isEnabled: true,
							isReady: true,
							isRunning: true,
							metadata: { webServerAddress: expectedWebServerAddress }
						}
					}
				})
			}) as Response) as unknown as typeof fetch

		setSystemTime(1000)
		expect(getSonarEndpointCached('', 1)).resolves.toBe(expectedWebServerAddress)

		globalThis.fetch = (async () =>
			({
				ok: true,
				json: async () => ({
					subApps: {
						sonar: {
							isEnabled: true,
							isReady: true,
							isRunning: true,
							metadata: { webServerAddress: 'other' }
						}
					}
				})
			}) as Response) as unknown as typeof fetch
		setSystemTime(500)
		expect(getSonarEndpointCached('', 1)).resolves.toBe(expectedWebServerAddress)
	})

	it('return new value when cache time expired', async () => {
		const expectedFirstAddress = 'https://127.0.0.1:1234'
		const expectedSecondAddress = 'https://127.0.0.1:4321'

		globalThis.fetch = (async () =>
			({
				ok: true,
				json: async () => ({
					subApps: {
						sonar: {
							isEnabled: true,
							isReady: true,
							isRunning: true,
							metadata: { webServerAddress: expectedFirstAddress }
						}
					}
				})
			}) as Response) as unknown as typeof fetch

		setSystemTime(1000)
		expect(getSonarEndpointCached('', 1)).resolves.toBe(expectedFirstAddress)

		globalThis.fetch = (async () =>
			({
				ok: true,
				json: async () => ({
					subApps: {
						sonar: {
							isEnabled: true,
							isReady: true,
							isRunning: true,
							metadata: { webServerAddress: expectedSecondAddress }
						}
					}
				})
			}) as Response) as unknown as typeof fetch
		setSystemTime(2500)
		expect(getSonarEndpointCached('', 1)).resolves.toBe(expectedSecondAddress)
	})
})
