import {authOptions} from "@/app/api/auth/[...nextauth]/route"
import mongoose from "mongoose";
import {UserInfo} from "@/models/UserInfo"
import { getServerSession } from "next-auth";
import { Order } from "@/models/Order";

export async function GET(req){
    mongoose.connect(process.env.MONGO_URL);

    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;
    let isAdmin =false;

    const url = new URL(req.url);
    const _id = url.searchParams.get('_id');
    if (_id) {
      return Response.json( await Order.findById(_id) );
    }

    /*if(userEmail){
        const userInfo =await userInfo.findOne({email:userEmail});
        if(userInfo){
             isAdmin = userInfo.admin;
        }
    }*/

    if(isAdmin){
        return Response.json(await Order.find() ); 
    }

    if(userEmail){
        return Response.json( await Order.find({userEmail}));
    }

}