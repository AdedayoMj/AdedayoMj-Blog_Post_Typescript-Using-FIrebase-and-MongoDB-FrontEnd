export default interface IUser {
    _id: string;
    uid: string;
    name: string;
    email: string;
}

export const DEFAULT_USER: IUser = {
    _id: '',
    uid: '',
    name: '',
    email:'',
};

export const DEFAULT_FIRE_TOKEN = '';