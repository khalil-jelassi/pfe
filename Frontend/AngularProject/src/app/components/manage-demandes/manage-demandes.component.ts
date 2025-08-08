import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-manage-demandes',
  templateUrl: './manage-demandes.component.html',
  styleUrls: ['./manage-demandes.component.css']
})
export class ManageDemandesComponent implements OnInit {
  demandes: any[] = [];
  user: any;

  constructor(private adminService: AdminService,private authService: AuthService) {
    this.user = this.authService.currentUserValue;
  }

  ngOnInit(): void {
    this.loadDemandes();
  }

  loadDemandes() {
    this.adminService.getAllDemandes().subscribe({
      next: (res) => this.demandes = res.demandes,
      error: () => Swal.fire('Erreur', 'Impossible de charger les demandes', 'error')
    });
  }

  traiter(id: string, action: 'accepter' | 'refuser') {
    Swal.fire({
      title: `Confirmer ${action} ?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Annuler'
    }).then(result => {
      if (result.isConfirmed) {
        this.adminService.traiterDemande(id, action).subscribe({
          next: () => {
            this.loadDemandes();
            Swal.fire('Succès', `Demande ${action}ée`, 'success');
          },
          error: () => Swal.fire('Erreur', `Impossible de ${action} la demande`, 'error')
        });
      }
    });
  }
}
