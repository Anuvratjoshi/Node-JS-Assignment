const mongoose = require("mongoose");

// Define the schema for posts
const PostSchema = mongoose.Schema({
    // The title of the post, a required field
    title: {
        type: String,
        required: true
    },
    // The description of the post, also required
    description: {
        type: String,
        required: true
    },
    // The image URL for the post, required as well
    image: {
        type: String,
        required: true
    },
    // An array to store tags associated with the post
    tags: {
        type: Array
    },
});

// Create a model named 'Posts' using the defined schema
mongoose.model("Posts", PostSchema);

// The 'Posts' model is now ready to be used in the application to interact with the MongoDB database.
// It represents the structure of the documents in the 'posts' collection, ensuring that each post
// has a title, description, and image field. The tags field is optional and can store an array of tags.
