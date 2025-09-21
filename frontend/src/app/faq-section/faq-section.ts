import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-faq-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faq-section.html',
  styleUrls: ['./faq-section.css']
})
export class FaqSectionComponent {
  private http = inject(HttpClient);
  faqs: any[] = [];
  expandedIndex: number | null = null;

  constructor() {
  this.http.get<any[]>('/api/faqs').subscribe({
    next: (data) => {
      console.log("✅ FAQ data from backend:", data);
      this.faqs = data;
    },
    error: (err) => {
      console.error("❌ Error loading FAQs:", err);
    }
  });
}


  toggleFAQ(index: number) {
    this.expandedIndex = this.expandedIndex === index ? null : index;
  }
}
