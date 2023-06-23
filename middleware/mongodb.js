import mongoose from 'mongoose';

const connectDB = async () => {
  if (mongoose.connections && mongoose?.connections[0]?.readyState) {
    // Use current db connection
    return true;
  }
  // Use new db connection

  await mongoose.connect(process.env['MONGO'], {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });

  console.log('Connected');

  return true;
};

export default connectDB;
