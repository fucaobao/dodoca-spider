var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/dodoca');
exports.mongoose = mongoose;