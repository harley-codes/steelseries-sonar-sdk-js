import { describe, expect, it, mock } from 'bun:test'
import { InvalidException, NotFoundException, UnsupportedException } from '../../src/exceptions'
import { getAppAddress } from '../../src/functions/get-app-address'

describe('getAppAddress', () => {
	it('throws UnsupportedException on unsupported OS', async () => {
		mock.module('node:os', () => ({
			platform: () => 'linux'
		}))
		expect(getAppAddress()).rejects.toThrow(UnsupportedException)
	})

	it('throws NotFoundException when appData file does not exist', async () => {
		mock.module('node:os', () => ({
			platform: () => 'win32'
		}))
		mock.module('node:fs', () => ({
			promises: {
				readFile: async () => {
					throw new Error('File not found')
				}
			}
		}))
		expect(getAppAddress()).rejects.toThrow(NotFoundException)
	})

	it('throws InvalidException when appData file is invalid JSON', async () => {
		mock.module('node:os', () => ({
			platform: () => 'win32'
		}))
		mock.module('node:fs', () => ({
			promises: {
				readFile: async () => 'invalid json'
			}
		}))
		expect(getAppAddress()).rejects.toThrow(InvalidException)
	})

	it('throws NotFoundException when ggEncryptedAddress is missing', async () => {
		mock.module('node:os', () => ({
			platform: () => 'win32'
		}))
		mock.module('node:fs', () => ({
			promises: {
				readFile: async () => JSON.stringify({})
			}
		}))
		expect(getAppAddress()).rejects.toThrow(NotFoundException)
	})

	it('returns ggEncryptedAddress when file is valid', async () => {
		const mockAddress = 'encrypted-address-123'
		const expectedUrl = `https://${mockAddress}`
		mock.module('node:os', () => ({
			platform: () => 'win32'
		}))
		mock.module('node:fs', () => ({
			promises: {
				readFile: async () => JSON.stringify({ ggEncryptedAddress: mockAddress })
			}
		}))
		expect(getAppAddress()).resolves.toBe(expectedUrl)
	})
})
