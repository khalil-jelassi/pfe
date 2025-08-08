import mongoose from 'mongoose';

const demandeAbsenceSchema = new mongoose.Schema({
  employe: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  jours: { type: Number, required: true },
  type: { type: String, enum: ['congé', 'maladie'], required: true },
  motif: { type: String, required: true },
  statut: { type: String, enum: ['en_attente', 'acceptée', 'refusée'], default: 'en_attente' }
}, { timestamps: true });

export default mongoose.model('DemandeAbsence', demandeAbsenceSchema);