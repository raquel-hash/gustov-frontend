import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailySalesReportComponent } from './daily-sales-report.component';

describe('DailySalesReportComponent', () => {
  let component: DailySalesReportComponent;
  let fixture: ComponentFixture<DailySalesReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailySalesReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DailySalesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
