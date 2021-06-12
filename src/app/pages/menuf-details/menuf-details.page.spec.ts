import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MenufDetailsPage } from './menuf-details.page';

describe('MenufDetailsPage', () => {
  let component: MenufDetailsPage;
  let fixture: ComponentFixture<MenufDetailsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenufDetailsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MenufDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
