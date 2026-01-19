import { afterEach, beforeEach, describe, expect, it } from 'bun:test'
import { InitializeErrorReason, SonarInitializationException } from '../../../src/exceptions'
import { getSonarEndpoint } from '../../../src/functions/endpoint/get-sonar-endpoint'

let originalFetch: typeof fetch

const request = () => getSonarEndpoint('')

describe('getSonarEndpoint', () => {
	beforeEach(() => {
		originalFetch = globalThis.fetch
	})

	afterEach(() => {
		globalThis.fetch = originalFetch
	})

	it('throws NotEnabled Exception if sonar is not enabled', async () => {
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

		const rejects = expect(request()).rejects
		rejects.toThrow(SonarInitializationException)
		rejects.toMatchObject({ reason: InitializeErrorReason.NotEnabled })
	})

	it('throws NotReady Exception if sonar is not ready', async () => {
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

		const rejects = expect(request()).rejects
		rejects.toThrow(SonarInitializationException)
		rejects.toMatchObject({ reason: InitializeErrorReason.NotReady })
	})

	it('throws NotRunning Exception if sonar is not running', async () => {
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

		const rejects = expect(request()).rejects
		rejects.toThrow(SonarInitializationException)
		rejects.toMatchObject({ reason: InitializeErrorReason.NotRunning })
	})

	it('throws NotResponding Exception if sonar server is not found', async () => {
		globalThis.fetch = (async () => {
			throw new Error('Failed to fetch')
		}) as unknown as typeof fetch
		const rejects = expect(request()).rejects
		rejects.toThrow(SonarInitializationException)
		rejects.toMatchObject({ reason: InitializeErrorReason.NotResponding })
	})

	it('throws NotResponding Exception if sonar server returns bad status code', async () => {
		globalThis.fetch = (async () =>
			({
				ok: false
			}) as Response) as unknown as typeof fetch
		const rejects = expect(request()).rejects
		rejects.toThrow(SonarInitializationException)
		rejects.toMatchObject({ reason: InitializeErrorReason.NotResponding })
	})

	it('throws NotAvailable Exception if sonar webServerAddress is not provided', async () => {
		globalThis.fetch = (async () =>
			({
				ok: true,
				json: async () => ({
					subApps: {
						sonar: {
							isEnabled: true,
							isReady: true,
							isRunning: true
						}
					}
				})
			}) as Response) as unknown as typeof fetch

		const rejects = expect(request()).rejects
		rejects.toThrow(SonarInitializationException)
		rejects.toMatchObject({ reason: InitializeErrorReason.NotAvailable })
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

		expect(getSonarEndpoint('')).resolves.toBe(expectedWebServerAddress)
	})
})
