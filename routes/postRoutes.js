const express = require("express");
const router = express.Router();
const { createPost, getAllBlogs, deleteBlog } = require(
  "../controllers/postControllers",
);

router.post("/create", createPost);
router.get("/", getAllBlogs);
router.post("/delete/:id", deleteBlog);

module.exports = router;
