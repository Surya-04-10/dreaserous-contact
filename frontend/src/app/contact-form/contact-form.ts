import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './contact-form.html',
  styleUrls: ['./contact-form.css']
})
export class ContactFormComponent {
  private fb = inject(FormBuilder);   // ✅ inject instead of constructor param
  private http = inject(HttpClient);  // ✅ inject instead of constructor param

  // Define form with validation rules
  contactForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', Validators.required],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  // Submit handler
  submitForm() {
    if (this.contactForm.valid) {
      this.http.post('http://localhost:3000/api/contacts', this.contactForm.value)
        .subscribe(() => alert("✅ Message sent successfully!"));
    } else {
      alert("⚠️ Please fill in all fields correctly before submitting.");
    }
  }
}
