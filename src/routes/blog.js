const express = require("express");
const { body } = require("express-validator");

const router = express.Router();

const blogController = require("../controllers/blog");

// [POST] : /v1/blog/post
router.post(
  "/post",
  [
    body("title")
      .isLength({ min: 5 })
      .withMessage("input title minimum 5 karakter"),
    body("body")
      .isLength({ min: 5 })
      .withMessage("input body minimum 5 karakter"),
  ],
  blogController.createBlogPost
);

router.get("/posts", blogController.getAllBlogPost);
router.get("/post/:postId", blogController.getBlogPostById);
router.put("/post/:postId", blogController.updateBlogPost);

module.exports = router;
