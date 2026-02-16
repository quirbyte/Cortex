import mongoose , {Document,Schema,model} from 'mongoose';

export interface InterfaceTenant extends Document{
    slug: string,
    userId: mongoose.Types.ObjectId
}

const TenantSchema = new Schema<InterfaceTenant>({
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
})

export const Tenant = model<InterfaceTenant>("Tenant",TenantSchema);