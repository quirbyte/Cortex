import mongoose,{Document,Schema,model} from 'mongoose';

export interface InterfaceEvent extends Document{
    name:string,
    tenantId: mongoose.Types.ObjectId,
    date: Date,
    time: string,
    venue: string,
    ticketDetails: {
        price:number,
        total:number,
        sold:number
    }
}

const EventSchema = new Schema<InterfaceEvent>({
    name:{
        type:String,
        required:true,
    },
    tenantId:{
        type:Schema.Types.ObjectId,
        ref:"Tenant",
        required:true
    },
    date:{
        type:Date,
        required:true,
    },
    time:{
        type:String,
        required:true,
    },
    venue:{
        type:String,
        required:true,
    },
    ticketDetails:{
        price:{
            type:Number,
            required:true,
            default:0,
        },
        total:{
            type:Number,
            required:true,
            default:1
        },
        sold:{
            type:Number,
            required:true,
            default:0,
        }
    }
},{timestamps:true})

export const EventModel = model<InterfaceEvent>("Event",EventSchema);