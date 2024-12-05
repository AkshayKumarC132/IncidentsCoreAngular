import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlDashboardComponent } from './gl-dashboard.component';

describe('GlDashboardComponent', () => {
  let component: GlDashboardComponent;
  let fixture: ComponentFixture<GlDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GlDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
