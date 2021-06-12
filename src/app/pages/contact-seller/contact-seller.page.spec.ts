import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ContactSellerPage } from './contact-seller.page';

describe('ContactSellerPage', () => {
  let component: ContactSellerPage;
  let fixture: ComponentFixture<ContactSellerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactSellerPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ContactSellerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
