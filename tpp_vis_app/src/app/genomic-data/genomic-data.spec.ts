import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenomicData } from './genomic-data';

describe('GenomicData', () => {
  let component: GenomicData;
  let fixture: ComponentFixture<GenomicData>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenomicData]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenomicData);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
