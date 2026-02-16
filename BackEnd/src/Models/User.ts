import mongoose,{Document,Schema,model} from "mongoose";

export interface InterfaceUser extends Document{
    name: string,
    email: string,
}

const UserSchema = new Schema<InterfaceUser>({
    name:{
        type: String,
        required:true
    },
    email:{
        type:String,
        required: true,
        unique: true,
    },
})

export const User = model<InterfaceUser>("User",UserSchema);