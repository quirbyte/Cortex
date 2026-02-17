import mongoose , {Document,Schema,model} from 'mongoose';

export interface InterfaceTenant extends Document{
    name: string,
    slug: string,
    userId: mongoose.Types.ObjectId
}

const TenantSchema = new Schema<InterfaceTenant>({
    name:{
        type:String,
        required:true
    },
    slug:{
        required: true,
        unique: true,
        type: String,
        lowercase:true
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref: "User",
        required:true
    }
},{timestamps:true})

export const TenantModel = model<InterfaceTenant>("Tenant",TenantSchema);