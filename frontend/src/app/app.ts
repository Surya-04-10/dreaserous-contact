import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// Import your standalone components (adjust paths if your files are in different folders)
import { ContactFormComponent } from './contact-form/contact-form'; 
import { FaqSectionComponent } from './faq-section/faq-section';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    ContactFormComponent,
    FaqSectionComponent
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css'] // keep if you have app.css, else remove this line
})
export class AppComponent {}
