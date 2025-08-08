import mongoose from 'mongoose';

const AbsenceSchema = new mongoose.Schema({
  employe: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['congé', 'maladie'], required: true },
  jours: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.model('Absence', AbsenceSchema);