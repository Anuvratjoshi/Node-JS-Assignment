const mongoose = require('mongoose');

// Define the schema for tags
const tagSchema = new mongoose.Schema({
    // The name of the tag, which is a required field
    name: { type: String, required: true },
});

// Create a model named 'Tag' using the defined schema
mongoose.model('Tag', tagSchema);

// The 'Tag' model is now ready to be used in the application to interact with the MongoDB database.
// It represents the structure of the documents in the 'tags' collection
