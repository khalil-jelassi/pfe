import User from '../models/User.js';
import Rapport from '../models/Rapport.js';
import Absence from '../models/Absence.js';
import bcrypt from 'bcryptjs';
import DemandeAbsence from '../models/DemandeAbsence.js';



export const createEmploye = async (req, res) => {
  try {
    const { username, email, password, departement, solde } = req.body;
    
    const existing = await User.findOne({ $or: [{ username }, { email }] });
    if (existing) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }
    
    // Set default solde to 30 if not provided
    const leaveBalance = solde !== undefined ? solde : 30;
    
    const employe = new User({
      username,
      email,
      password,
      role: 'employé',
      departement,
      solde: leaveBalance
    });
    
    await employe.save(); // Ceci déclenche le pre('save') -> hashing
    
    res.status(201).json({
      success: true,
      employe: {
        id: employe._id,
        username,
        email,
        role: employe.role,
        departement: employe.departement,
        solde: employe.solde
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
  
export const updateEmploye = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const employe = await User.findOne({ _id: id, role: 'employé' });
    
    if (!employe) return res.status(404).json({ message: 'Employé non trouvé' });
    
    // Met à jour les champs transmis
    if (updates.username) employe.username = updates.username;
    if (updates.email) employe.email = updates.email;
    if (updates.departement) employe.departement = updates.departement;
    if (updates.solde !== undefined) employe.solde = updates.solde;
    
    // Si mot de passe fourni, le hacher avant de l'enregistrer
    if (updates.password && updates.password.trim() !== '') {
      const salt = await bcrypt.genSalt(10);
      employe.password = await bcrypt.hash(updates.password, salt);
    }
    
    await employe.save(); // Déclenche les hooks et enregistre le tout
    
    res.status(200).json({
      success: true,
      employe: {
        id: employe._id,
        username: employe.username,
        email: employe.email,
        role: employe.role,
        departement: employe.departement,
        solde: employe.solde
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
  

export const updateRapport = async (req, res) => {
    try {
      const { id } = req.params;
      const { note, rendement } = req.body;
  
      const rapport = await Rapport.findByIdAndUpdate(
        id,
        { note, rendement },
        { new: true, runValidators: true }
      );
  
      if (!rapport) {
        return res.status(404).json({ success: false, message: "Rapport non trouvé" });
      }
  
      res.status(200).json({ success: true, rapport });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  
  export const deleteRapport = async (req, res) => {
    try {
      const { id } = req.params;
      const rapport = await Rapport.findByIdAndDelete(id);
  
      if (!rapport) {
        return res.status(404).json({ success: false, message: "Rapport non trouvé" });
      }
  
      res.status(200).json({ success: true, message: "Rapport supprimé avec succès" });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };
  

// Supprimer un employé
export const deleteEmploye = async (req, res) => {
  try {
    const { id } = req.params;
    const employe = await User.findOneAndDelete({ _id: id, role: 'employé' });
    if (!employe) return res.status(404).json({ message: 'Employé non trouvé' });
    res.status(200).json({ success: true, message: 'Employé supprimé' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Créer un rapport
export const createRapport = async (req, res) => {
  try {
    const { employeId, note, rendement } = req.body;
    const rapport = await Rapport.create({ employe: employeId, note, rendement });
    res.status(201).json({ success: true, rapport });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// CRUD absences
export const addAbsence = async (req, res) => {
  try {
    const { employeId, type, jours } = req.body;
    const absence = await Absence.create({ employe: employeId, type, jours });
    res.status(201).json({ success: true, absence });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateAbsence = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Absence.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({ success: true, updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteAbsence = async (req, res) => {
  try {
    const { id } = req.params;
    await Absence.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Absence supprimée' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }  
};


export const getAllRapports = async (req, res) => {
    try {
      const rapports = await Rapport.find().populate('employe', 'username email');
      res.status(200).json({ success: true, rapports });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  export const getRapportsByEmploye = async (req, res) => {
    try {
      const { employeId } = req.params;
      const rapports = await Rapport.find({ employe: employeId }).populate('employe', 'username email');
      res.status(200).json({ success: true, rapports });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };
  
  

  export const getAllAbsences = async (req, res) => {
    try {
      const absences = await Absence.find().populate('employe', 'username email');
      res.status(200).json({ success: true, absences });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };


  export const getAbsencesByEmploye = async (req, res) => {
    try {
      const { employeId } = req.params;
      const absences = await Absence.find({ employe: employeId }).populate('employe', 'username email');
      res.status(200).json({ success: true, absences });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  export const getAllEmployes = async (req, res) => {
    try {
      const employes = await User.find({ role: 'employé' }).select('-password');
      res.status(200).json({ success: true, employes });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  export const getAllDemandesAbsence = async (req, res) => {
    try {
      const demandes = await DemandeAbsence.find().populate('employe', 'username email').sort({ createdAt: -1 });
      res.status(200).json({ success: true, demandes });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };
  
  export const traiterDemandeAbsence = async (req, res) => {
    try {
      const { id } = req.params;
      const { action } = req.body; // 'accepter' ou 'refuser'
      
      const demande = await DemandeAbsence.findById(id).populate('employe');
      if (!demande) return res.status(404).json({ message: 'Demande non trouvée.' });
      
      if (demande.statut !== 'en_attente') {
        return res.status(400).json({ message: 'Demande déjà traitée.' });
      }
      
      if (action === 'accepter') {
        // If congé type, check and update the leave balance
        if (demande.type === 'congé') {
          const employe = await User.findById(demande.employe._id);
          
          if (!employe) {
            return res.status(404).json({ message: 'Employé non trouvé.' });
          }
          
          // Check if the employee has enough leave balance
          if (employe.solde < demande.jours) {
            return res.status(400).json({ 
              message: `Solde insuffisant. L'employé a ${employe.solde} jours disponibles pour ${demande.jours} jours demandés.` 
            });
          }
          
          // Deduct from leave balance
          employe.solde -= demande.jours;
          await employe.save();
        }
        
        // Ajouter une absence réelle
        await Absence.create({
          employe: demande.employe._id,
          type: demande.type,
          jours: demande.jours
        });
        
        demande.statut = 'acceptée';
      } else if (action === 'refuser') {
        demande.statut = 'refusée';
      } else {
        return res.status(400).json({ message: "Action invalide (utiliser 'accepter' ou 'refuser')" });
      }
      
      await demande.save();
      
      res.status(200).json({ success: true, demande });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  
  
  

  
  