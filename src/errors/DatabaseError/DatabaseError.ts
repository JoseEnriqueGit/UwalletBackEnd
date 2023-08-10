class DatabaseError extends Error {
	constructor(message: string, public originalError?: Error) {
		super(message);
		this.name = "DatabaseError";
	}
}

class TransactionError extends Error {
	constructor(message: string, public originalError?: Error) {
		super(message);
		this.name = "TransactionError";
	}
}

class ValidationError extends Error {
	constructor(message: string, public field?: string) {
		super(message);
		this.name = "ValidationError";
	}
}

class NotFoundError extends Error {
	constructor(entity: string, id: string) {
		super(`${entity} with ID ${id} not found`);
		this.name = "NotFoundError";
	}
}

class UnauthorizedError extends Error {
	constructor() {
		super("Unauthorized");
		this.name = "UnauthorizedError";
	}
}

export {
	DatabaseError,
	TransactionError,
	ValidationError,
	NotFoundError,
	UnauthorizedError,
};
