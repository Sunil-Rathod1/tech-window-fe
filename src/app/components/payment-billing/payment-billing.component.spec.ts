import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentBillingComponent } from './payment-billing.component';

describe('PaymentBillingComponent', () => {
  let component: PaymentBillingComponent;
  let fixture: ComponentFixture<PaymentBillingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentBillingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentBillingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
