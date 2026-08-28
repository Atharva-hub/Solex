import moongoose from "mongoose";

const shoeSchema = moongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        brand:{
            type:String,
            required:true
        },
        price:{
            type:Number,
            required:true
        },
        description:{
            type:String,
            required:true
        },
        imageUrl:{
            type:String,
            required:true
        },
        inStock:{
            type:Boolean,
            required:true,
            default:true
        }
    },
    {
        timestamps:true
    }
);


const Shoe = moongoose.model("Shoe",shoeSchema);
export default Shoe;