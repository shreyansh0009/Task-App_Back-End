const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/todoApp');

const taskSchema = mongoose.Schema({
    title: String,
    description: String
});

module.exports = mongoose.model('Task', taskSchema);