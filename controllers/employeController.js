import Absence from "../models/Absence.js";
import DemandeAbsence from "../models/DemandeAbsence.js";
import Notification from "../models/Notification.js";
import Rapport from "../models/Rapport.js";
import User from "../models/User.js";

export const createDemandeAbsence = async (req, res) => {
  try {
    const { jours, type, motif } = req.body;
    const employeId = req.user.id; // From auth middleware

    // Check if this is a "congé" type absence request
    if (type === 'congé') {
      const employe = await User.findById(employeId);
      if (!employe) {
        return res.status(404).json({
          success: false,
          message: 'Employé non trouvé'
        });
      }

      // Check if requested leave days exceed available balance
      if (jours > employe.solde) {
        return res.status(400).json({
          success: false,
          message: `Solde insuffisant. Vous avez ${employe.solde} jours disponibles.`
        });
      }
    }

    // Create a new absence request
    const newDemande = new DemandeAbsence({
      employe: employeId,
      type,
      motif,
      jours,
      statut: 'en_attente' // Set initial status to 'en_attente'
    });

    const savedDemande = await newDemande.save();

    // Create notification for managers
    const notification = new Notification({
      recipient: 'managers',
      type: 'absence_request',
      message: `Nouvelle demande d'absence de ${req.user.username}`,
      data: {
        demandeId: savedDemande._id,
        employeName: req.user.username,
        type: type,
        jours: jours
      },
      createdBy: employeId
    });

    await notification.save();

    // Emit socket event to managers
    const io = req.app.get('io');
    io.to('managers').emit('new_notification', {
      type: 'absence_request',
      message: `Nouvelle demande d'absence de ${req.user.username}`,
      data: {
        demandeId: savedDemande._id,
        employeName: req.user.username,
        type: type,
        jours: jours
      }
    });

    res.status(201).json({
      success: true,
      data: savedDemande
    });
  } catch (error) {
    console.error('Error creating absence request:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


  
  export const getMesDemandesAbsence = async (req, res) => {
    try {
      const demandes = await DemandeAbsence.find({ employe: req.user.id }).sort({ createdAt: -1 });
      res.status(200).json({ success: true, demandes });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };
  
  export const deleteDemandeAbsence = async (req, res) => {
    try {
      const { id } = req.params;
      const demande = await DemandeAbsence.findOne({ _id: id, employe: req.user.id });
  
      if (!demande) {
        return res.status(404).json({ success: false, message: 'Demande non trouvée.' });
      }
  
      if (demande.statut !== 'en_attente') {
        return res.status(400).json({ success: false, message: 'Impossible de supprimer une demande traitée.' });
      }
  
      await demande.deleteOne();
      res.status(200).json({ success: true, message: 'Demande supprimée.' });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  export const getDemandeAbsenceById = async (req, res) => {
    try {
      const { id } = req.params;
  
      const demande = await DemandeAbsence.findOne({
        _id: id,
        employe: req.user.id
      });
  
      if (!demande) {
        return res.status(404).json({
          success: false,
          message: "Demande non trouvée ou non autorisée."
        });
      }
  
      res.status(200).json({ success: true, demande });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  export const getMesAbsences = async (req, res) => {
    try {
      const absences = await Absence.find({ employe: req.user.id }).sort({ createdAt: -1 });
      res.status(200).json({ success: true, absences });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };
  
  export const getMesRapports = async (req, res) => {
    try {
      const rapports = await Rapport.find({ employe: req.user.id }).sort({ createdAt: -1 });
      res.status(200).json({ success: true, rapports });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };
  
  