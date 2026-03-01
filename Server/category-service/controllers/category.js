const Category = require("../models/categoryModel");
const publisher = require("../config/redisPublisher");
const redisClient = require("../config/redisClient");

async function createCategory(req, res) {
  try {
    const { categoryName } = req.body;
    const userId = req.user.userId;

    const key = `categories:${userId}`;

    const category = await Category.create({ name: categoryName, userId });

    // invalidate list cache
    await redisClient.del(key);

    return res.status(201).json({ msg: "category is created", category });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error in creating the category" });
  }
}

async function getCategories(req, res) {
  try {
    const userId = req.user.userId;
    const key = `categories:${userId}`;

    const cached = await redisClient.get(key);
    if (cached) return res.status(200).json(JSON.parse(cached));

    const userCategories = await Category.find({ userId });


    const payLoad = { msg: "Fetched Successfully", userCategories };

    await redisClient.setEx(key, 60, JSON.stringify(payLoad));

    return res.status(200).json(payLoad);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server Error in getting the categories" });
  }
}

async function deleteByCategory(req, res) {
  try {
    const categoryId = req.params.categoryId;
    const userId = req.user.userId;

    const key = `categories:${userId}`;

    // secure delete
    const deletedCategory = await Category.findOneAndDelete({ _id: categoryId, userId });
    if (!deletedCategory) {
      return res.status(404).json({ msg: "Couldn't find category to delete" });
    }

    await redisClient.del(key);

    // keep event name consistent with subscriber
    await publisher.publish("CATEGORY_DELETE", JSON.stringify({ categoryId, userId }));

    return res.json({ msg: "Category deleted Successfully", deletedCategory });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server Error in deleting the category" });
  }
}

async function updateCategory(req, res) {
  try {
    const { categoryName } = req.body;
    const userId = req.user.userId;
    const categoryId = req.params.categoryId;

    const key = `categories:${userId}`;

    // secure update
    const updatedCategory = await Category.findOneAndUpdate(
      { _id: categoryId, userId },
      { name: categoryName },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ msg: "Could not update the category name" });
    }

    await redisClient.del(key);

    return res.json({ msg: "CategoryName was updated", updatedCategory });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error in updating the categoryName" });
  }
}

module.exports = { createCategory, getCategories, deleteByCategory, updateCategory };