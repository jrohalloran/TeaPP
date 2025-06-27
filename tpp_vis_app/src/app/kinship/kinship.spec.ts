import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Kinship } from './kinship';

describe('Kinship', () => {
  let component: Kinship;
  let fixture: ComponentFixture<Kinship>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Kinship]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Kinship);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
