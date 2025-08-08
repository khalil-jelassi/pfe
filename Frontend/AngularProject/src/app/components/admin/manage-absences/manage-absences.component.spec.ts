import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAbsencesComponent } from './manage-absences.component';

describe('ManageAbsencesComponent', () => {
  let component: ManageAbsencesComponent;
  let fixture: ComponentFixture<ManageAbsencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageAbsencesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageAbsencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
