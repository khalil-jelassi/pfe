import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from 'src/app/services/admin.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-manage-absences',
  templateUrl: './manage-absences.component.html',
  styleUrls: ['./manage-absences.component.css']
})
export class ManageAbsencesComponent implements OnInit {
  absences: any[] = [];
  employes: any[] = [];
  absenceForm: FormGroup;
  isEditing = false;
  currentId: string = '';

  constructor(private fb: FormBuilder, private adminService: AdminService) {
    this.absenceForm = this.fb.group({
      employeId: ['', Validators.required],
      type: ['', Validators.required],
      jours: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.loadAbsences();
    this.loadEmployes();
  }
  getTotalAbsencesFor(employeId: string): number {
    return this.absences
      .filter(abs => abs.employe && String(abs.employe._id) === employeId)
      .reduce((sum, abs) => sum + abs.jours, 0);
  }
  
  
  loadAbsences() {
    this.adminService.getAllAbsences().subscribe(res => this.absences = res.absences);
  }

  loadEmployes() {
    this.adminService.getAllEmployes().subscribe(res => this.employes = res.employes);
  }

  onSubmit() {
    if (this.absenceForm.invalid) return;
    const data = this.absenceForm.value;

    if (this.isEditing) {
      this.adminService.updateAbsence(this.currentId, data).subscribe({
        next: () => {
          this.resetForm();
          this.loadAbsences();
          Swal.fire('Succès', 'Absence mise à jour', 'success');
        },
        error: () => Swal.fire('Erreur', 'Échec de la mise à jour', 'error')
      });
    } else {
      this.adminService.addAbsence(data).subscribe({
        next: () => {
          this.resetForm();
          this.loadAbsences();
          Swal.fire('Succès', 'Absence ajoutée', 'success');
        },
        error: () => Swal.fire('Erreur', 'Échec de l\'ajout', 'error')
      });
    }
  }

  edit(abs: any) {
    this.isEditing = true;
    this.currentId = abs._id;
    this.absenceForm.patchValue({
      employeId: abs.employe._id,
      type: abs.type,
      jours: abs.jours
    });
  }

  delete(id: string) {
    Swal.fire({
      title: 'Supprimer ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non'
    }).then(result => {
      if (result.isConfirmed) {
        this.adminService.deleteAbsence(id).subscribe({
          next: () => {
            this.loadAbsences();
            Swal.fire('Supprimé', 'Absence supprimée', 'success');
          },
          error: () => Swal.fire('Erreur', 'Échec de la suppression', 'error')
        });
      }
    });
  }

  resetForm() {
    this.isEditing = false;
    this.currentId = '';
    this.absenceForm.reset();
  }
}