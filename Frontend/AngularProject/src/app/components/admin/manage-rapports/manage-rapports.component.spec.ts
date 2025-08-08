import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageRapportsComponent } from './manage-rapports.component';

describe('ManageRapportsComponent', () => {
  let component: ManageRapportsComponent;
  let fixture: ComponentFixture<ManageRapportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageRapportsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageRapportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
