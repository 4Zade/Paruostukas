export interface LoginProps {
    username: string;
    password: string;
    remember: boolean;
}

export interface RegisterProps {
    username: string;
    email: string;
    password: string;
    repeatPassword: string;
}