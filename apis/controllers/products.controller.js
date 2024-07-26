import productModel from "../models/product.model.js";
import { errorHandler } from "../utillitis/errorHandler.js";

export const createProduct = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(200, req.user));
  }
  if (!req.body.title || !req.body.content || !req.body.category ||!req.body.subCategory) {
    return next(errorHandler(400, "Please fill necessary field.."));
  }
  const slug = req.body.title
    .trim()
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "");

  const newProduct = new productModel({
    ...req.body,
    slug,
  });
  try {
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    next(error);
  }
};

export const getProducts = async (req, res, next) => {
  const startIndex = parseInt(req.query.startIndex) || 0; 
  const limit = parseInt(req.query.limit) || 9;
  const sort = req.query.sort === "asc" ? 1 : -1;

  const products = await productModel
    .find({
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.subCategory && { subCategory: req.query.subCategory }),
      ...(req.query.productId && { _id: req.query.productId }),
      ...(req.query.searchTerm && {
        $or: [
          { category: { $regex: req.query.searchTerm , $options: "i" }},
          { subCategory: { $regex: req.query.searchTerm , $options: "i" }},
        ],
      }),
    })
    .sort({ updatedAt: sort })
    .skip(startIndex)
    .limit(limit);

    const totalProducts = await productModel.countDocuments();

    const today = new Date();

    const oneMonthAgo = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      today.getDate()
    );

    const lastMonthProducts = await productModel.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({ products, totalProducts, lastMonthProducts });
};

export const deleteProduct = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "you are not allowed to delete this product"));
  }
  try {
    await productModel.findByIdAndDelete(req.query.productId);
    res.status(200).json("product has been deleted...");
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req,res,next)=>{
  if(!req.user.isAdmin)
  {
    next(errorHandler(403,"You are not allowed to upadate this product"));
  }
  try{
    const updatedProduct=await productModel.findByIdAndUpdate(req.query.productId,{
      $set:{
        title:req.body.title,
        content:req.body.content,
        productPhotoUrl:req.body.productPhotoUrl,
        category:req.body.category,
        subCategory:req.body.subCategory,
        price:req.body.price
      }
    },{new:true});
    if(updatedProduct)
    {
      res.status(200).json(updatedProduct);
    }
  }
  catch(error)
  {
    next(error);
  }
}

export const getProduct = async (req,res,next)=>{
  try{
    const product=await productModel.findOne({slug:req.params.slug});
    if(!product)
    {
      return next(errorHandler(404,"Product is not found.."));
    }
    if(product)
    {
      res.status(200).json(product);
    }
  }
  catch(error)
  {
    next(error);
  }
}
