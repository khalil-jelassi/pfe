import mongoose from 'mongoose';

const RapportSchema = new mongoose.Schema({
  employe: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  note: { type: Number, required: true, max: 20 },
  rendement: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('Rapport', RapportSchema);
