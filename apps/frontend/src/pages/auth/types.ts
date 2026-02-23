export interface loginResponse{
    token:string;
    user: {
        id:string;
        email:string;
        name:string;
    }
}