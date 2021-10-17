const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CNN, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true,
      // useFindAndModifiy: false,
    });
    console.log("DB online");
  } catch (err) {
    console.log(err);
    throw new Error("Error conectando a DB");
  }
};

module.exports = {
  dbConnection,
};
