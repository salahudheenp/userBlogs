const express = require("express");
const {registerUser, getUsersWithBlogs, userLogin } = require("../controller/userController");
const { createBlog, listBlogs, viewBlog, editBlog, deleteBlog } = require("../controller/blogController");
const authenticate = require("../middleware/jwtAuth");

const router = express.Router();

// user route
router.post("/register", registerUser);
router.post("/login", userLogin);
router.get("/", authenticate,getUsersWithBlogs);

// blog routes
router.post("/blog", authenticate,createBlog);
router.get("/blog", authenticate,listBlogs);
router.get("/blog/:id", authenticate,viewBlog);
router.put("/blog/:id", authenticate,editBlog);
router.delete("/blog/:id", authenticate,deleteBlog);
module.exports = router;
