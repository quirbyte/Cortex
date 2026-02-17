import { Request,Response } from "express";
import { TenantModel } from "../Models/Tenant";

export async function TenantMiddleware(req:Request,res:Response,next:Function){
    const tenantId = req.headers["tenantId"] as string;
    if(!tenantId){
        return res.status(404).json({
            msg: "Tenant Id not found!!"
        })
    }
    try{
        if (!req.userId) {
            return res.status(401).json({ msg: "User context missing" });
        }
        const tenant = await TenantModel.findOne({
            _id:tenantId,
            userId:req.userId
        });
        if(!tenant){
            return res.status(404).json({
                msg: "Tenant not found!!"
            })
        }
        req.tenantId=tenant._id;
        next();
    }catch(e){
        return res.status(403).json({
            msg:"Invalid Tenant Id"
        })
    }
}