export declare class AuthService {
    private jwtSecret;
    register(username: string, email: string, password: string, role: string): Promise<import("mongoose").Document<unknown, {}, import("../models/user.model").User> & import("../models/user.model").User & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    login(username: string, password: string): Promise<{
        user: import("mongoose").Document<unknown, {}, import("../models/user.model").User> & import("../models/user.model").User & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
        token: string;
    }>;
}
