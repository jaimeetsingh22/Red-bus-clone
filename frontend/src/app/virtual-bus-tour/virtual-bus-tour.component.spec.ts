import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VirtualBusTourComponent } from './virtual-bus-tour.component';

describe('VirtualBusTourComponent', () => {
  let component: VirtualBusTourComponent;
  let fixture: ComponentFixture<VirtualBusTourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VirtualBusTourComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VirtualBusTourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
