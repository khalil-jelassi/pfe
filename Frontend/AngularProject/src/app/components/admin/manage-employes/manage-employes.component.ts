import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from 'src/app/services/admin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-employes',
  templateUrl: './manage-employes.component.html',
  styleUrls: ['./manage-employes.component.css']
})
export class ManageEmployesComponent implements OnInit {
  employes: any[] = [];
  employeForm: FormGroup;
  isEditing = false;
  currentId: string = '';

  constructor(private fb: FormBuilder, private adminService: AdminService) {
    this.employeForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      departement: ['', Validators.required],
      solde: [30, [Validators.required, Validators.min(0), Validators.max(30)]],
      password: ['']
    });
  }

  ngOnInit(): void {
    this.loadEmployes();
    this.employeForm.get('username')?.valueChanges.subscribe(() => this.checkUsernameExists());
  }

  // Charger tous les employés
  loadEmployes() {
    this.adminService.getAllEmployes().subscribe({
      next: (res) => {
        this.employes = res.employes;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des employés :', err);
      }
    });
  }

  // Soumettre le formulaire (ajout ou mise à jour)
  onSubmit() {
    if (this.employeForm.invalid) return;

    const data = this.employeForm.value;
    
    if (this.isEditing) {
      this.adminService.updateEmploye(this.currentId, data).subscribe({
        next: () => {
          this.resetForm();
          this.loadEmployes();
          Swal.fire({
            icon: 'success',
            title: 'Employé mis à jour !',
            showConfirmButton: false,
            timer: 1500
          });
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour :', err);
          Swal.fire({
            icon: 'error',
            title: 'Erreur de mise à jour',
            text: err.error?.message || 'Une erreur est survenue',
            confirmButtonColor: '#dc3545'
          });
        }
      });
    } else {
      this.adminService.createEmploye(data).subscribe({
        next: () => {
          this.resetForm();
          this.loadEmployes();
          Swal.fire({
            icon: 'success',
            title: 'Employé créé avec succès !',
            showConfirmButton: false,
            timer: 1500
          });
        },
        error: (err) => {
          console.error('Erreur lors de la création :', err);
          if (err.status === 400 && err.error?.message?.includes('exists')) {
            Swal.fire({
              icon: 'error',
              title: 'Échec de la création',
              text: err.error.message,
              confirmButtonColor: '#dc3545'
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Erreur inconnue',
              text: 'Une erreur est survenue lors de la création.',
              confirmButtonColor: '#dc3545'
            });
          }
        }
      });
    }
  }

  checkUsernameExists() {
    const username = this.employeForm.get('username')?.value;
    if (!username) return;

    // Vérifie si un utilisateur avec ce username existe
    const exists = this.employes.some(
      emp => emp.username === username && (!this.isEditing || emp._id !== this.currentId)
    );
    
    if (exists) {
      this.employeForm.get('username')?.setErrors({ usernameTaken: true });
    }
  }

  // Pré-remplir le formulaire pour modifier
  edit(employe: any) {
    this.isEditing = true;
    this.currentId = employe._id;
    this.employeForm.patchValue({
      username: employe.username,
      email: employe.email,
      departement: employe.departement,
      solde: employe.solde
    });
    this.employeForm.get('password')?.setValue('');
  }

  // Supprimer un employé avec confirmation via Swal
  delete(id: string) {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Cette action supprimera définitivement l'employé.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminService.deleteEmploye(id).subscribe({
          next: () => {
            this.loadEmployes();
            Swal.fire('Supprimé !', 'L\'employé a été supprimé avec succès.', 'success');
          },
          error: (err) => {
            console.error('Erreur lors de la suppression :', err);
            Swal.fire('Erreur', 'La suppression a échoué.', 'error');
          }
        });
      }
    });
  }

  // Réinitialiser le formulaire
  resetForm() {
    this.isEditing = false;
    this.currentId = '';
    this.employeForm.reset({solde: 30});
  }
}
