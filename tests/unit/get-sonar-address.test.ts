import { afterEach, beforeEach, describe, expect, it } from 'bun:test'
import {
	SonarNotEnabledException,
	SonarNotReadyException,
	SonarNotRunningException,
	SonarUnavailableException
} from '../../src/exceptions'
import { getSonarAddress } from '../../src/functions/get-sonar-address'

let originalFetch: typeof fetch

describe('getSonarAddress', () => {
	beforeEach(() => {
		originalFetch = globalThis.fetch
	})

	afterEach(() => {
		globalThis.fetch = originalFetch
	})

	it('throws SonarNotEnabledException if sonar is not enabled', async () => {
		globalThis.fetch = (async () =>
			({
				ok: true,
				json: async () => ({
					subApps: {
						sonar: {
							isEnabled: false,
							isReady: true,
							isRunning: true,
							metadata: { webServerAddress: '127.0.0.1:1234' }
						}
					}
				})
			}) as Response) as unknown as typeof fetch

		expect(getSonarAddress('')).rejects.toThrow(SonarNotEnabledException)
	})

	it('throws SonarNotReadyException if sonar is not ready', async () => {
		globalThis.fetch = (async () =>
			({
				ok: true,
				json: async () => ({
					subApps: {
						sonar: {
							isEnabled: true,
							isReady: false,
							isRunning: true,
							metadata: { webServerAddress: '127.0.0.1:1234' }
						}
					}
				})
			}) as Response) as unknown as typeof fetch

		expect(getSonarAddress('')).rejects.toThrow(SonarNotReadyException)
	})

	it('throws SonarNotRunningException if sonar is not running', async () => {
		globalThis.fetch = (async () =>
			({
				ok: true,
				json: async () => ({
					subApps: {
						sonar: {
							isEnabled: true,
							isReady: true,
							isRunning: false,
							metadata: { webServerAddress: '127.0.0.1:1234' }
						}
					}
				})
			}) as Response) as unknown as typeof fetch

		expect(getSonarAddress('')).rejects.toThrow(SonarNotRunningException)
	})

	it('throws SonarUnavailableException if sonar server is not found', async () => {
		globalThis.fetch = (async () => {
			throw new Error('Failed to fetch')
		}) as unknown as typeof fetch
		expect(getSonarAddress('')).rejects.toThrow(SonarUnavailableException)
	})

	it('throws SonarUnavailableException if sonar server returns bad status code', async () => {
		globalThis.fetch = (async () =>
			({
				ok: false
			}) as Response) as unknown as typeof fetch
		expect(getSonarAddress('')).rejects.toThrow(SonarUnavailableException)
	})

	it('throws SonarUnavailableException if sonar webServerAddress is not provided', async () => {
		globalThis.fetch = (async () =>
			({
				ok: true,
				json: async () => ({
					subApps: {
						sonar: {
							isEnabled: true,
							isReady: true,
							isRunning: false
						}
					}
				})
			}) as Response) as unknown as typeof fetch

		expect(getSonarAddress('')).rejects.toThrow(SonarUnavailableException)
	})

	it('return Sonar webServerAddress when response is valid', async () => {
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

		expect(getSonarAddress('')).resolves.toBe(expectedWebServerAddress)
	})
})
