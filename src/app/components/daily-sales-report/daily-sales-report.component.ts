import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { SalesService } from '../../services/sales.service';
import { Sale } from '../../models/sale';

@Component({
  selector: 'app-daily-sales-report',
  standalone: true,
  templateUrl: './daily-sales-report.component.html',
  styleUrls: ['./daily-sales-report.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatInputModule,
  ],
  providers: [SalesService],
})
export class DailySalesReportComponent implements OnInit {
  sales: Sale[] = [];
  displayedColumns: string[] = ['id', 'name', 'totalAmount', 'date', 'items'];
  dateControl = new FormControl(new Date().toISOString().split('T')[0]);
  totalAmount: number = 0;

  constructor(private salesService: SalesService) {}

  ngOnInit(): void {
    this.getReport();
  }

  getReport(): void {
    const date = this.dateControl.value;
    if (date) {
      this.salesService.getDailySalesReport(date).subscribe((response: any) => {
        this.sales = response;
        this.calculateTotalAmount();
      });
    }
  }

  calculateTotalAmount() {
    this.totalAmount = this.sales.reduce(
      (acc, sale) => acc + sale.totalAmount,
      0
    );
  }
}
