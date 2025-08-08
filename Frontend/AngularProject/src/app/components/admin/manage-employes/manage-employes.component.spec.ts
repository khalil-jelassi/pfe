import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageEmployesComponent } from './manage-employes.component';

describe('ManageEmployesComponent', () => {
  let component: ManageEmployesComponent;
  let fixture: ComponentFixture<ManageEmployesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageEmployesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageEmployesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
