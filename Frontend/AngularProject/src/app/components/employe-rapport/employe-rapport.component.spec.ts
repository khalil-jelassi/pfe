import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeRapportComponent } from './employe-rapport.component';

describe('EmployeRapportComponent', () => {
  let component: EmployeRapportComponent;
  let fixture: ComponentFixture<EmployeRapportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeRapportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeRapportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
