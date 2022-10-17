const mongoose = require("mongoose");

const MongoDbConnect = async () => {
  const dbConnect = await mongoose.connect(process.env.DATABASE_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log(`MongoDb connected sucessfully `);
};

module.exports = MongoDbConnect;
