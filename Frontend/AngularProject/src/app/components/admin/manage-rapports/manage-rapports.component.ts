import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from 'src/app/services/admin.service';
import { PdfGeneratorService } from 'src/app/services/PdfGeneratorService.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-rapports',
  templateUrl: './manage-rapports.component.html',
  styleUrls: ['./manage-rapports.component.css']
})
export class ManageRapportsComponent implements OnInit {
  rapports: any[] = [];
  employes: any[] = [];
  rapportForm: FormGroup;
  isEditing = false;
  currentId: string = '';
  companyName: string = 'Votre Entreprise SA';

  constructor(private fb: FormBuilder, private adminService: AdminService,private pdfService: PdfGeneratorService) {
    this.rapportForm = this.fb.group({
      employeId: ['', Validators.required],
      note: ['', [Validators.required, Validators.min(0), Validators.max(20)]],
      rendement: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadRapports();
    this.loadEmployes();
  }

  loadRapports() {
    this.adminService.getAllRapports().subscribe(res => this.rapports = res.rapports);
  }

  loadEmployes() {
    this.adminService.getAllEmployes().subscribe(res => this.employes = res.employes);
  }

  onSubmit() {
    if (this.rapportForm.invalid) return;
    const data = this.rapportForm.value;

    if (this.isEditing) {
      this.adminService.updateRapport(this.currentId, data).subscribe({
        next: () => {
          this.resetForm();
          this.loadRapports();
          Swal.fire({
            icon: 'success',
            title: 'Rapport mis à jour',
            showConfirmButton: false,
            timer: 1500
          });
        },
        error: () => {
          Swal.fire('Erreur', 'Échec de la mise à jour du rapport', 'error');
        }
      });
    } else {
      this.adminService.createRapport(data).subscribe({
        next: () => {
          this.resetForm();
          this.loadRapports();
          Swal.fire({
            icon: 'success',
            title: 'Rapport ajouté',
            showConfirmButton: false,
            timer: 1500
          });
        },
        error: () => {
          Swal.fire('Erreur', 'Échec de la création du rapport', 'error');
        }
      });
    }
  }

  edit(rapport: any) {
    this.isEditing = true;
    this.currentId = rapport._id;
    this.rapportForm.patchValue({
      employeId: rapport.employe._id,
      note: rapport.note,
      rendement: rapport.rendement
    });
  }

  delete(id: string) {
    Swal.fire({
      title: 'Supprimer ce rapport ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#dc3545'
    }).then(result => {
      if (result.isConfirmed) {
        this.adminService.deleteRapport(id).subscribe({
          next: () => {
            this.loadRapports();
            Swal.fire('Supprimé', 'Rapport supprimé avec succès', 'success');
          },
          error: () => {
            Swal.fire('Erreur', 'Échec de la suppression', 'error');
          }
        });
      }
    });
  }

  resetForm() {
    this.isEditing = false;
    this.currentId = '';
    this.rapportForm.reset();
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