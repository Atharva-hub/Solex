import Shoe from "../models/shoeModel.js";

export const getShoes = async (req,res) => {
    try{
        const shoes = await Shoe.find();
        res.status(200).json({shoes});
    } catch (error) {
        res.status(400).json({message:"Error fetching shoes"});
    }
};

export const createShoe = async (req, res) => {
    try {
        // req.body has the text fields (name, price, etc.)
        const { name, brand, price, description, inStock } = req.body;
        
        // req.file has the image file. We need to create the URL for the frontend to use.
        let imageUrl = '';
        if (req.file) {
            // If a file was uploaded, save its path
            imageUrl = `/uploads/${req.file.filename}`;
        } else {
            return res.status(400).json({ message: "Image file is required" });
        }

        // Create the shoe in MongoDB using both the text and the new image URL
        const newShoe = await Shoe.create({
            name,
            brand,
            price,
            description,
            inStock,
            imageUrl // <-- Save the path to the database
        }); 
        
        res.status(201).json(newShoe);
    } catch (error) {
        res.status(400).json({ message: "Invalid shoe data", error: error.message });
    }
};

export const updateShoe = async (req,res) =>{
    try{
        const updatedShoe = await Shoe.findByIdAndUpdate(req.params.id,req.body, {
            new:true
        });
        res.status(200).json({updatedShoe});
    }catch (error) {
        res.status(400).json({message:"Error updating shoe"});
    }

};


export const deleteShoe = async (req,res) =>{
    try{
        await Shoe.findByIdAndDelete(req.params.id);
        res.status(200).json({message:"Shoe deleted successfully"});
    }catch (error) {
        res.status(400).json({message:"Error deleting shoe"});
    }
};