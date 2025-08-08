import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeService } from 'src/app/services/EmployeService.service';
import { PdfGeneratorServicee } from 'src/app/services/PdfGeneratorServicee.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-employe-rapport',
  templateUrl: './employe-rapport.component.html',
  styleUrls: ['./employe-rapport.component.css']
})
export class EmployeRapportComponent implements OnInit {
  rapports: any[] = [];
  employes: any[] = [];
  rapportForm: FormGroup;
  isEditing = false;
  currentId: string = '';
  companyName: string = 'Votre Entreprise SA';

  constructor(private fb: FormBuilder, private employéService: EmployeService,private pdfService: PdfGeneratorServicee) {
    this.rapportForm = this.fb.group({
      employeId: ['', Validators.required],
      note: ['', [Validators.required, Validators.min(0), Validators.max(20)]],
      rendement: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadRapports();
  }

  loadRapports() {
    this.employéService.getMesRapports().subscribe(res => this.rapports = res.rapports);
  }


  async generatePDF(rapport: any) {
    try {
      const fileName = await this.pdfService.generateRapportPDF(rapport, this.companyName);
      Swal.fire({
        icon: 'success',
        title: 'PDF généré avec succès',
        text: `Le fichier ${fileName} a été téléchargé`,
        timer: 2000
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Une erreur est survenue lors de la génération du PDF'
      });
    }
  }
}