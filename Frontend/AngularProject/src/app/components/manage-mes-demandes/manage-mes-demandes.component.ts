import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { EmployeService } from 'src/app/services/EmployeService.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-mes-demandes',
  templateUrl: './manage-mes-demandes.component.html',
  styleUrls: ['./manage-mes-demandes.component.css']
})
export class ManageMesDemandesComponent implements OnInit {
  demandes: any[] = [];
  demandeForm: FormGroup;
  currentUser: any;

  constructor(
    private fb: FormBuilder, 
    private employeService: EmployeService,
    private authService: AuthService
  ) {
    this.demandeForm = this.fb.group({
      type: ['', Validators.required],
      jours: [1, [Validators.required, Validators.min(1)]],
      motif: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadDemandes();
    
    // Add validation when type changes
    this.demandeForm.get('type')?.valueChanges.subscribe(type => {
      this.validateLeaveBalance();
    });
    
    // Add validation when jours changes
    this.demandeForm.get('jours')?.valueChanges.subscribe(days => {
      this.validateLeaveBalance();
    });
  }

  loadCurrentUser() {
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUser = user;
      },
      error: (err) => {
        console.error('Failed to load user info', err);
      }
    });
  }

  validateLeaveBalance() {
    if (!this.currentUser) return;
    
    const type = this.demandeForm.get('type')?.value;
    const jours = this.demandeForm.get('jours')?.value;
    
    if (type === 'congé' && jours > this.currentUser.solde) {
      this.demandeForm.get('jours')?.setErrors({ insufficientBalance: true });
    }
  }

  loadDemandes() {
    this.employeService.getMesDemandes().subscribe({
      next: (res) => this.demandes = res.demandes,
      error: (err) => {
        console.error('Failed to load absence requests', err);
        Swal.fire('Erreur', 'Impossible de charger les demandes', 'error');
      }
    });
  }

  onSubmit() {
    if (this.demandeForm.invalid) return;
    
    this.employeService.createDemandeAbsence(this.demandeForm.value).subscribe({
      next: (res) => {
        this.loadDemandes();
        
        // If it's a congé and it was successful, update the local user's solde
        if (this.demandeForm.get('type')?.value === 'congé') {
          // We don't actually update solde until the request is approved,
          // but we might want to reload user data
          this.loadCurrentUser();
        }
        
        this.demandeForm.reset({type: '', jours: 1, motif: ''});
        Swal.fire('Succès', 'Demande envoyée', 'success');
      },
      error: (err) => {
        console.error('Failed to create absence request', err);
        Swal.fire('Erreur', err.error?.message || 'Impossible de créer la demande', 'error');
      }
    });
  }

  delete(id: string) {
    Swal.fire({
      title: 'Supprimer ?',
      text: 'Cette demande sera supprimée si elle est encore en attente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Annuler'
    }).then(result => {
      if (result.isConfirmed) {
        this.employeService.deleteDemande(id).subscribe({
          next: () => {
            this.loadDemandes();
            Swal.fire('Supprimée', 'Demande supprimée', 'success');
          },
          error: (err) => {
            console.error('Failed to delete absence request', err);
            Swal.fire('Erreur', 'Suppression impossible', 'error');
          }
        });
      }
    });
  }
}
