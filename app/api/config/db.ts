import mongoose from 'mongoose';

const connectDB = async () => {
  if (mongoose.connections[0].readyState) {
    console.log('Ya conectado a la base de datos');
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Conectado a la base de datos');
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
    throw new Error('Error al conectar a la base de datos');
  }
};

export default connectDB;
