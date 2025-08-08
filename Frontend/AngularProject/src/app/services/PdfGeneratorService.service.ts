// pdf-generator.service.ts
import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root'
})
export class PdfGeneratorService {
  constructor() {}

  async generateRapportPDF(rapport: any, companyName: string = 'Votre Entreprise') {
    // Create the PDF document
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Define colors
    const primaryColor = [41, 128, 185]; // RGB format for #2980b9
    const secondaryColor = [52, 73, 94]; // RGB format for #34495e
    
    // Set background
    doc.setFillColor(248, 249, 250); // Light gray background
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
    
    // Add header with logo placeholder
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    // Add company name
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text(companyName, 20, 20);
    
    // Add report title
    doc.setFontSize(16);
    doc.text('RAPPORT DE PERFORMANCE', pageWidth - 20, 20, { align: 'right' });
    
    // Add date
    const today = new Date();
    doc.setFontSize(11);
    doc.text(`Date: ${today.toLocaleDateString('fr-FR')}`, pageWidth - 20, 30, { align: 'right' });
    
    // Add employee info section
    doc.setDrawColor(220, 220, 220);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(15, 50, pageWidth - 30, 40, 3, 3, 'FD');
    
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('INFORMATIONS DE L\'EMPLOYÉ', 20, 60);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Nom de l'employé: ${rapport.employe?.username || 'N/A'}`, 20, 70);
    doc.text(`ID de l'employé: ${rapport.employe?._id || 'N/A'}`, 20, 78);
    doc.text(`Poste: ${rapport.employe?.role || 'Employé'}`, 20, 86);
    
    // Add performance section
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(15, 100, pageWidth - 30, 100, 3, 3, 'FD');
    
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('ÉVALUATION DE PERFORMANCE', 20, 110);
    
    // Add note with colored indicator
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Note de performance:', 20, 120);
    
    // Draw note background
    const noteValue = rapport.note;
    let noteColor = [231, 76, 60]; // Red for low scores
    
    if (noteValue >= 14) {
      noteColor = [46, 204, 113]; // Green for high scores
    } else if (noteValue >= 10) {
      noteColor = [241, 196, 15]; // Yellow for medium scores
    }
    
    // Draw note circle
    doc.setFillColor(noteColor[0], noteColor[1], noteColor[2]);
    doc.circle(50, 133, 12, 'F');
    
    // Add note text
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(noteValue.toString(), 50, 133, { align: 'center' });
    doc.text('/20', 70, 133);
    
    // Add performance description
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Description du rendement:', 20, 150);
    
    // Format multiline text for rendement
    const splitRendement = doc.splitTextToSize(rapport.rendement || 'Aucune description disponible.', pageWidth - 70);
    doc.setFont('helvetica', 'normal');
    doc.text(splitRendement, 20, 160);
    
    // Add footer
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, pageHeight - 20, pageWidth, 20, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text('Document généré automatiquement - Confidentiel', pageWidth / 2, pageHeight - 10, { align: 'center' });
    
    // Add signature section at the bottom
    doc.setDrawColor(220, 220, 220);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(15, 210, pageWidth - 30, 50, 3, 3, 'FD');
    
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('SIGNATURES', 20, 220);
    
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 240, 100, 240); // Line for manager signature
    doc.line(pageWidth - 100, 240, pageWidth - 20, 240); // Line for employee signature
    
    doc.setFontSize(10);
    doc.text('Signature du responsable', 20, 248);
    doc.text('Signature de l\'employé', pageWidth - 100, 248);
    
    // Save the PDF
    const fileName = `Rapport_${rapport.employe?.username || 'Employe'}_${today.toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
    
    return fileName;
  }
}