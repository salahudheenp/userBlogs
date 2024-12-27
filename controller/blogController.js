const Blog = require('../models/blogModel');

// Create a new blog post
exports.createBlog = async (req, res) => {
  try {
    const { title, content } = req.body;
    if(!req.user){
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const newBlog = new Blog({ title, content, author:req.user.id });
    await newBlog.save();
    res.status(201).json({ message: 'Blog created successfully', newBlog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// List all published blog posts
exports.listBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().select('title author content -_id');
    res.status(200).json(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// View a single blog post
exports.viewBlog = async (req, res) => {
    
  try {
    const blog = await Blog.findById(req.params.id).select('title author content -_id');
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.status(200).json(blog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Edit a blog post
exports.editBlog = async (req, res) => {
  try {
    const { title, content } = req.body;
    const blog = await Blog.findByIdAndUpdate(req.params.id, { title, content }, { new: true });
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.status(200).json({ message: 'Blog updated successfully', blog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a blog post
exports.deleteBlog = async (req, res) => {
  try {    
    await Blog.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
