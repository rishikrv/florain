import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DisputesPage } from './disputes.page';

describe('DisputesPage', () => {
  let component: DisputesPage;
  let fixture: ComponentFixture<DisputesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisputesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DisputesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
