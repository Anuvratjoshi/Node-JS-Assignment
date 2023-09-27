const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Posts = mongoose.model("Posts");
const Tag = mongoose.model("Tag");

/**
 * @route POST /posts/image
 * @description Endpoint for posting image with title and description in the database.
 */
router.post("/posts/image", (req, res) => {
    const { title, image, description } = req.body;
    const newPost = new Posts({
        title,
        description,
        image
    });

    newPost.save()
        .then(() => {
            return res.status(200).json({ message: "Posted successfully" });
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({ error: "Internal server error" });
        });
});

/**
 * @route POST /posts/filter
 * @description Endpoint to get all posts with filters, sort, and pagination.
 */
router.post('/posts/filter', async (req, res) => {
    try {
        // Extract parameters from the request body
        const { page = 2, sortOrder, query = "" } = req.body;

        // Sort order
        const sortDirection = sortOrder === 'ascending' ? 1 : -1;

        // Filter object to search in title or description
        const filterObject = {
            $or: [
                { title: { $regex: query, $options: 'i' } }, // Case-insensitive regex search in title
                { description: { $regex: query, $options: 'i' } } // Case-insensitive regex search in description
            ]
        };

        const posts = await Posts.find(filterObject)
            .sort({ _id: sortDirection })
            .limit(Number(page))
            .exec();

        return res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * @route POST /posts/search
 * @description Endpoint to search keywords in title and description.
 */
router.post('/posts/search', async (req, res) => {
    try {
        const { keyword } = req.body;

        // Searching posts according to the keywords
        const regex = new RegExp(keyword, 'i');
        const posts = await Posts.find({ $or: [{ title: regex }, { description: regex }] }).exec();

        return res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * @route POST /posts/addTag
 * @description Endpoint for adding tags to a post.
 */
router.post('/posts/addTag', async (req, res) => {
    const { _id, tagName } = req.body;

    try {
        // Finding the post by ID
        const post = await Posts.findById(_id);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Check if the tag already exists in the post's tags array
        if (post.tags.includes(tagName)) {
            return res.status(400).json({ error: 'Tag already exists in the post' });
        }

        // Check if the tag already exists
        const existingTag = await Tag.findOne({ name: tagName });

        // If the tag doesn't exist, create a new one
        const tag = existingTag || new Tag({ name: tagName });

        // Save the tag if it's new
        if (!existingTag) {
            await tag.save();
        }

        // Add the tag to the post
        post.tags.push(tagName.toLowerCase());

        // Save the updated post
        await post.save();

        return res.status(200).json({ message: "Tag added successfully", post });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * @route POST /posts/filterByTag
 * @description Endpoint to filter posts using tags.
 */
router.post('/posts/filterByTag', async (req, res) => {
    try {
        const posts = await Posts.find({ tags: { $in: [req.body.tags] } });

        if (!posts || !req.body.tags) {
            return res.status(404).json({ message: "No result found" });
        }

        return res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
