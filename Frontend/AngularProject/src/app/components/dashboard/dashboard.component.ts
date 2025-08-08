import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { EmployeService } from 'src/app/services/EmployeService.service';
import { AdminService } from 'src/app/services/admin.service';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit, AfterViewInit {
  currentUser: any = null;
  loading = true;
  user: any;

  // Employee data
  absences: any[] = [];
  rapports: any[] = [];
  absenceChart: any;
  rapportChart: any;
  isLoading = true;
  error: string | null = null;
  employeeDataLoaded = {
    absences: false,
    rapports: false
  };

  // Admin data
  allEmployes: any[] = [];
  allAbsences: any[] = [];
  allRapports: any[] = [];
  allDemandes: any[] = [];
  adminCharts: {
    employesChart?: Chart;
    absencesChart?: Chart;
    rapportsChart?: Chart;
    demandesChart?: Chart;
  } = {};
  adminStats = {
    totalEmployes: 0,
    totalAbsences: 0,
    totalRapports: 0,
    totalDemandes: 0,
    pendingDemandes: 0,
    approvedDemandes: 0,
    rejectedDemandes: 0
  };
  adminIsLoading = true;
  adminError: string | null = null;
  adminDataLoaded = {
    employes: false,
    absences: false,
    rapports: false,
    demandes: false
  };

  constructor(
    private authService: AuthService,
    private employeeService: EmployeService,
    private adminService: AdminService
  ) { 
    this.user = this.authService.currentUserValue;
  }

  ngOnInit(): void {
    this.getCurrentUser();
    
    if (this.user?.role === 'employé') {
      this.loadEmployeeData();
    } 
    
    if (this.user?.role === 'Admin_RH' || this.user?.role === 'manager') {
      this.loadAdminData();
    }
  }

  ngAfterViewInit(): void {
    // We'll handle chart creation after data loading now
  }

  // Employee dashboard methods
  loadEmployeeData(): void {
    this.isLoading = true;
    this.employeeDataLoaded = { absences: false, rapports: false };
    
    // Load absences
    this.employeeService.getMesAbsences().subscribe({
      next: (res) => {
        this.absences = res.absences;
        this.employeeDataLoaded.absences = true;
        this.checkAndCreateEmployeeCharts();
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des absences';
        console.error(err);
        this.employeeDataLoaded.absences = true;
        this.checkEmployeeLoadingComplete();
      }
    });
    
    // Load reports
    this.employeeService.getMesRapports().subscribe({
      next: (res) => {
        this.rapports = res.rapports;
        this.employeeDataLoaded.rapports = true;
        this.checkAndCreateEmployeeCharts();
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des rapports';
        console.error(err);
        this.employeeDataLoaded.rapports = true;
        this.checkEmployeeLoadingComplete();
      }
    });
  }

  checkEmployeeLoadingComplete(): void {
    if (this.employeeDataLoaded.absences && this.employeeDataLoaded.rapports) {
      this.isLoading = false;
    }
  }

  checkAndCreateEmployeeCharts(): void {
    this.checkEmployeeLoadingComplete();
    
    if (!this.isLoading) {
      // Set a small delay to ensure DOM elements are ready
      setTimeout(() => {
        if (this.absences && this.absences.length > 0) {
          this.createAbsenceChart();
        }
        
        if (this.rapports && this.rapports.length > 0) {
          this.createRapportChart();
        }
      }, 300);
    }
  }

  createAbsenceChart(): void {
    // First check if there's any data to show
    if (!this.absences || this.absences.length === 0) {
      return;
    }
  
    // Check if DOM element exists
    const ctx = document.getElementById('absenceChart') as HTMLCanvasElement;
    if (!ctx) {
      console.error('Cannot find canvas element with id "absenceChart"');
      return;
    }
  
    // Destroy previous chart instance if it exists
    if (this.absenceChart) {
      this.absenceChart.destroy();
    }
  
    // Count absences by type
    const absenceTypes = this.absences.reduce((acc: any, absence) => {
      acc[absence.type] = (acc[absence.type] || 0) + 1;
      return acc;
    }, {});
  
    const labels = Object.keys(absenceTypes);
    const data = Object.values(absenceTypes);
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'];
    
    // Create the chart
    this.absenceChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: data as number[],
          backgroundColor: colors.slice(0, labels.length),
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Répartition des absences par type'
          }
        }
      }
    });
  }

  createRapportChart(): void {
    if (!this.rapports || this.rapports.length === 0) {
      return;
    }

    // Check if DOM element exists
    const ctx = document.getElementById('rapportChart') as HTMLCanvasElement;
    if (!ctx) {
      console.error('Cannot find canvas element with id "rapportChart"');
      return;
    }

    // Destroy previous chart if it exists
    if (this.rapportChart) {
      this.rapportChart.destroy();
    }

    // Group reports by rendement
    const rendementGroups = this.rapports.reduce((acc: any, rapport) => {
      acc[rapport.rendement] = (acc[rapport.rendement] || 0) + 1;
      return acc;
    }, {});

    const labels = Object.keys(rendementGroups);
    const data = Object.values(rendementGroups);
    const colors = ['#4BC0C0', '#FFCE56', '#36A2EB', '#FF6384', '#9966FF'];
    
    // Create the chart
    this.rapportChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: data as number[],
          backgroundColor: colors.slice(0, labels.length),
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Répartition des rapports par rendement'
          }
        }
      }
    });
  }

  // Admin dashboard methods
  loadAdminData(): void {
    this.adminIsLoading = true;
    this.adminDataLoaded = {
      employes: false,
      absences: false,
      rapports: false,
      demandes: false
    };
    
    // Load all employees
    this.adminService.getAllEmployes().subscribe({
      next: (res) => {
        this.allEmployes = res.employes;
        this.adminStats.totalEmployes = this.allEmployes.length;
        this.adminDataLoaded.employes = true;
        this.checkAndCreateAdminCharts();
      },
      error: (err) => {
        this.adminError = 'Erreur lors du chargement des employés';
        console.error(err);
        this.adminDataLoaded.employes = true;
        this.checkAdminLoadingComplete();
      }
    });
    
    // Load all absences
    this.adminService.getAllAbsences().subscribe({
      next: (res) => {
        this.allAbsences = res.absences;
        this.adminStats.totalAbsences = this.allAbsences.length;
        this.adminDataLoaded.absences = true;
        this.checkAndCreateAdminCharts();
      },
      error: (err) => {
        this.adminError = 'Erreur lors du chargement des absences';
        console.error(err);
        this.adminDataLoaded.absences = true;
        this.checkAdminLoadingComplete();
      }
    });
    
    // Load all reports
    this.adminService.getAllRapports().subscribe({
      next: (res) => {
        this.allRapports = res.rapports;
        this.adminStats.totalRapports = this.allRapports.length;
        this.adminDataLoaded.rapports = true;
        this.checkAndCreateAdminCharts();
      },
      error: (err) => {
        this.adminError = 'Erreur lors du chargement des rapports';
        console.error(err);
        this.adminDataLoaded.rapports = true;
        this.checkAdminLoadingComplete();
      }
    });
    
    // Load all absence requests
    this.adminService.getAllDemandes().subscribe({
      next: (res) => {
        this.allDemandes = res.demandes;
        this.adminStats.totalDemandes = this.allDemandes.length;
        this.adminStats.pendingDemandes = this.allDemandes.filter(d => d.statut === 'en_attente').length;
        this.adminStats.approvedDemandes = this.allDemandes.filter(d => d.statut === 'acceptée').length;
        this.adminStats.rejectedDemandes = this.allDemandes.filter(d => d.statut === 'refusée').length;
        this.adminDataLoaded.demandes = true;
        this.checkAndCreateAdminCharts();
      },
      error: (err) => {
        this.adminError = 'Erreur lors du chargement des demandes';
        console.error(err);
        this.adminDataLoaded.demandes = true;
        this.checkAdminLoadingComplete();
      }
    });
  }

  checkAdminLoadingComplete(): void {
    if (this.adminDataLoaded.employes && 
        this.adminDataLoaded.absences && 
        this.adminDataLoaded.rapports && 
        this.adminDataLoaded.demandes) {
      this.adminIsLoading = false;
    }
  }

  checkAndCreateAdminCharts(): void {
    this.checkAdminLoadingComplete();
    
    if (!this.adminIsLoading) {
      // Set a small delay to ensure DOM elements are ready
      setTimeout(() => {
        if (this.allEmployes && this.allEmployes.length > 0) {
          this.createEmployesChart();
        }
        
        if (this.allAbsences && this.allAbsences.length > 0) {
          this.createAllAbsencesChart();
        }
        
        if (this.allRapports && this.allRapports.length > 0) {
          this.createAllRapportsChart();
        }
        
        if (this.allDemandes && this.allDemandes.length > 0) {
          this.createDemandesChart();
        }
      }, 300);
    }
  }

  createEmployesChart(): void {
    if (!this.allEmployes || this.allEmployes.length === 0) {
      return;
    }

    // Check if DOM element exists
    const ctx = document.getElementById('employesChart') as HTMLCanvasElement;
    if (!ctx) {
      console.error('Cannot find canvas element with id "employesChart"');
      return;
    }

    // Destroy previous chart if it exists
    if (this.adminCharts.employesChart) {
      this.adminCharts.employesChart.destroy();
    }

    // Group employees by role
    const roleGroups = this.allEmployes.reduce((acc: any, employe) => {
      acc[employe.role] = (acc[employe.role] || 0) + 1;
      return acc;
    }, {});

    const labels = Object.keys(roleGroups);
    const data = Object.values(roleGroups);
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];
    
    // Create the chart
    this.adminCharts.employesChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: data as number[],
          backgroundColor: colors.slice(0, labels.length),
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Répartition des employés par rôle'
          }
        }
      }
    });
  }

  createAllAbsencesChart(): void {
    if (!this.allAbsences || this.allAbsences.length === 0) {
      return;
    }

    // Check if DOM element exists
    const ctx = document.getElementById('allAbsencesChart') as HTMLCanvasElement;
    if (!ctx) {
      console.error('Cannot find canvas element with id "allAbsencesChart"');
      return;
    }

    // Destroy previous chart if it exists
    if (this.adminCharts.absencesChart) {
      this.adminCharts.absencesChart.destroy();
    }

    // Group absences by type
    const typeGroups = this.allAbsences.reduce((acc: any, absence) => {
      acc[absence.type] = (acc[absence.type] || 0) + 1;
      return acc;
    }, {});

    const labels = Object.keys(typeGroups);
    const data = Object.values(typeGroups);
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'];
    
    // Create the chart
    this.adminCharts.absencesChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: data as number[],
          backgroundColor: colors.slice(0, labels.length),
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Répartition des absences par type'
          }
        }
      }
    });
  }

  createAllRapportsChart(): void {
    if (!this.allRapports || this.allRapports.length === 0) {
      return;
    }

    // Check if DOM element exists
    const ctx = document.getElementById('allRapportsChart') as HTMLCanvasElement;
    if (!ctx) {
      console.error('Cannot find canvas element with id "allRapportsChart"');
      return;
    }

    // Destroy previous chart if it exists
    if (this.adminCharts.rapportsChart) {
      this.adminCharts.rapportsChart.destroy();
    }

    // Group reports by rendement
    const rendementGroups = this.allRapports.reduce((acc: any, rapport) => {
      acc[rapport.rendement] = (acc[rapport.rendement] || 0) + 1;
      return acc;
    }, {});

    const labels = Object.keys(rendementGroups);
    const data = Object.values(rendementGroups);
    const colors = ['#4BC0C0', '#FFCE56', '#36A2EB', '#FF6384', '#9966FF'];
    
    // Create the chart
    this.adminCharts.rapportsChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: data as number[],
          backgroundColor: colors.slice(0, labels.length),
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Répartition des rapports par rendement'
          }
        }
      }
    });
  }

  createDemandesChart(): void {
    if (!this.allDemandes || this.allDemandes.length === 0) {
      return;
    }

    // Check if DOM element exists
    const ctx = document.getElementById('demandesChart') as HTMLCanvasElement;
    if (!ctx) {
      console.error('Cannot find canvas element with id "demandesChart"');
      return;
    }

    // Destroy previous chart if it exists
    if (this.adminCharts.demandesChart) {
      this.adminCharts.demandesChart.destroy();
    }

    // Group requests by status
    const statusGroups = this.allDemandes.reduce((acc: any, demande) => {
      acc[demande.statut] = (acc[demande.statut] || 0) + 1;
      return acc;
    }, {});

    const labels = Object.keys(statusGroups);
    const data = Object.values(statusGroups);
    const colors = ['#FFA500', '#4BC0C0', '#FF6384']; // orange for pending, green for approved, red for rejected
    
    // Create the chart
    this.adminCharts.demandesChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: data as number[],
          backgroundColor: colors.slice(0, labels.length),
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Répartition des demandes par statut'
          }
        }
      }
    });
  }

  getCurrentUser(): void {
    this.authService.getCurrentUser().subscribe({
      next: (response) => {
        this.currentUser = response.user;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }

  refreshData(): void {
    if (this.user?.role === 'employé') {
      this.loadEmployeeData();
    } else if (this.user?.role === 'Admin_RH' || this.user?.role === 'manager') {
      this.loadAdminData();
    }
  }
}
