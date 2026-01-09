import { promises as fsAsync } from 'node:fs'
import { platform as getPlatform } from 'node:os'
import { join as joinPath } from 'node:path'
import { InvalidException, NotFoundException, UnsupportedException } from '../exceptions'

const WINDOWS_PATHS = ['SteelSeries', 'SteelSeries Engine 3', 'coreProps.json']

type CoreProps = {
	ggEncryptedAddress: string
}

export async function getAppAddress(): Promise<string> {
	const appDataPath = getPath()
	const fileContents = await getContents(appDataPath)
	const data = parseContents(fileContents)

	if (data.ggEncryptedAddress) {
		return data.ggEncryptedAddress
	}

	throw new NotFoundException(`ggEncryptedAddress not found in ${appDataPath}`)
}

function getPath(): string {
	const os = getPlatform()
	switch (os) {
		case 'win32': {
			const programData = process.env.ProgramData ?? 'C:\\ProgramData'
			return joinPath(programData, ...WINDOWS_PATHS)
		}
		default:
			throw new UnsupportedException(`Operating system is not supported: ${os}`)
	}
}

async function getContents(path: string): Promise<string> {
	try {
		return await fsAsync.readFile(path, 'utf8')
	} catch (error) {
		throw new NotFoundException(`Could not read file at path: ${path}`, error as Error)
	}
}

function parseContents(contents: string): CoreProps {
	try {
		return JSON.parse(contents) as CoreProps
	} catch (error) {
		throw new InvalidException('Failed to parse coreProps.json contents', error as Error)
	}
}
