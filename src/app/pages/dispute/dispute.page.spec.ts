import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DisputePage } from './dispute.page';

describe('DisputePage', () => {
  let component: DisputePage;
  let fixture: ComponentFixture<DisputePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisputePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DisputePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
