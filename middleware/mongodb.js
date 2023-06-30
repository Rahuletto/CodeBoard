import mongoose from 'mongoose';
import Code from '../../model/code';

let interval;

const connectDB = async () => {
  if (mongoose.connections && mongoose?.connections[0]?.readyState) {
    mountInterval()
    // Use current db connection
    return true;
  }
  // Use new db connection

  await mongoose.connect(process.env['MONGO'], {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });

  console.log('Connected. Mounting Interval...');

  mountInterval()
  
  return true;
};

export default connectDB;

function mountInterval() {
  if (!interval) {
    interval = setInterval(async () => {
      const data = await Code.find({});

      data.forEach(async (obj) => {
        if (!obj) return;
        if (
          (Number(obj.createdAt) + 86400 * 1000 < Date.now() &&
            obj?.options[0]?.autoVanish) ||
          obj?.files.length == 0
        ) {
          await Code.findByIdAndRemove(obj._id);
        }
      });
    }, 10000);
  } else interval;
}