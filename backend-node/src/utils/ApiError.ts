class ApiError extends Error {
    statusCode: number;
    data: any;
    success: boolean;
    errors: any[];

    constructor(statusCode: number, message: string, errors: any[] = [], stack = '') {
        super(message);
        this.statusCode = statusCode;
        this.data = null;
        this.message = message;
        this.success = false;
        this.errors = errors;
        if (stack) {
            this.stack = stack;
        } else if ((Error as any).captureStackTrace) {
            (Error as any).captureStackTrace(this, this.constructor);
        }
    }
}

export default ApiError;