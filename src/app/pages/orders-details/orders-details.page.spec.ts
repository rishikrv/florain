import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OrdersDetailsPage } from './orders-details.page';

describe('OrdersDetailsPage', () => {
  let component: OrdersDetailsPage;
  let fixture: ComponentFixture<OrdersDetailsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdersDetailsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OrdersDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
