export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function isValidPhoneNumber(phoneNumber: string): boolean {
    const phoneRegex = /^(0)([0-9]{9,10})$/;
    return phoneRegex.test(phoneNumber);
}