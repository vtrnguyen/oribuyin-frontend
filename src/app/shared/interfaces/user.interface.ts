
export interface User {
    id: number;
    avatar: string;
    firstName: string;
    lastName: string;
    userName: string;
    role: "admin" | "staff" | "customer";
    email: string;
    phoneNumber: string;
    gender: "male" | "female" | "other";
    birthDay: Date;
    address: string;
}
