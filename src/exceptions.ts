abstract class Exception extends Error {
	constructor(message: string, cause?: Error) {
		super(message, { cause })
		super.name = new.target.name
	}
}

export class SonarException extends Exception {
	constructor(message = 'There was an issue interacting with the Sonar service.', cause?: Error) {
		super(message, cause)
	}
}

export class NotFoundException extends Exception {
	constructor(message = 'The requested resource was not found.', cause?: Error) {
		super(message, cause)
	}
}

export class UnsupportedException extends Exception {
	constructor(message = 'The requested resource is unsupported.', cause?: Error) {
		super(message, cause)
	}
}

export class InvalidException extends Exception {
	constructor(message = 'The operation is invalid.', cause?: Error) {
		super(message, cause)
	}
}

export class SonarUnavailableException extends Exception {
	constructor(message = 'Sonar is unavailable.', cause?: Error) {
		super(message, cause)
	}
}

export class SonarNotRunningException extends SonarUnavailableException {
	constructor(message = 'Sonar is not running.', cause?: Error) {
		super(message, cause)
	}
}

export class SonarNotReadyException extends SonarUnavailableException {
	constructor(message = 'Sonar is not ready.', cause?: Error) {
		super(message, cause)
	}
}

export class SonarNotEnabledException extends SonarUnavailableException {
	constructor(message = 'Sonar is not enabled.', cause?: Error) {
		super(message, cause)
	}
}
