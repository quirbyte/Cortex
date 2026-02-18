import { Router, Request, Response } from "express";
import { userMiddleware } from "../Middleware/UserMiddleware";
import { TenantMiddleware } from "../Middleware/TenantMiddleware";
import { TenantModel } from "../Models/Tenant";

const TenantRouter = Router();

TenantRouter.post(
  "/create",
  userMiddleware,
  async (req: Request, res: Response) => {
    try{
      if(!req.userId){
        return res.status(404).json({
          msg: "User not verified!!",
        });
      }
      let {name,slug} = req.body;
      slug=slug.trim().toLowerCase().replace(/\s+/g, '-');
      const sameSlug = await TenantModel.findOne({
        slug:slug
      });
      if(sameSlug){
        return res.status(409).json({
          msg: "Slug already exists!!"
        })
      }
      await TenantModel.create({
        name:name,
        slug:slug,
        userId:req.userId
      });
      return res.json({
        msg: "Created Tenant successfully!!"
      })
    }catch(e){
      return res.status(500).json({
        msg: "Failed to Create Tenant"
      })
    }
  },
);

TenantRouter.get(
  "/my-organizations",
  userMiddleware,
  (req: Request, res: Response) => {},
);

TenantRouter.get("/:slug", (req: Request, res: Response) => {});

TenantRouter.patch(
  "/update/:id",
  TenantMiddleware,
  (req: Request, res: Response) => {},
);
