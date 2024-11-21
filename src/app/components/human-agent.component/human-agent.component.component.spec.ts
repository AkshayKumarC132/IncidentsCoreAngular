import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HumanAgentComponentComponent } from './human-agent.component.component';

describe('HumanAgentComponentComponent', () => {
  let component: HumanAgentComponentComponent;
  let fixture: ComponentFixture<HumanAgentComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HumanAgentComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HumanAgentComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
