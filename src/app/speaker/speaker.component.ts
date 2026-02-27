import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Speaker {
  id: number;
  name: string;
  phone: string;
  email: string;
  majorSubject: string;
  tag: string;
  image: string;
  profession?: string;
  subjects: string[];
  coverLetter?: string;
}

@Component({
  selector: 'app-speaker',
  templateUrl: './speaker.component.html',
  styleUrls: ['./speaker.component.scss']
})
export class SpeakerComponent implements OnInit {
  speakers: Speaker[] = [];
  selectedSpeaker: Speaker | null = null;
  showDetailsModal = false;
  showAddModal = false;

  ngOnInit(): void {
    this.loadSpeakers();
  }

  loadSpeakers(): void {
    // Mock data - replace with actual API call
    this.speakers = Array(12).fill(null).map((_, index) => ({
      id: index + 1,
      name: 'Speaker Name',
      phone: 'Ph No.',
      email: 'speaker@example.com',
      majorSubject: 'Major Subj',
      tag: 'AI Algorithm',
      image: 'assets/images/speaker-avatar.png',
      profession: 'Professor at University',
      subjects: ['Python.', 'AI Algorithm.'],
      coverLetter: 'Cover letter will be shown here....see more'
    }));
  }

  openDetailsModal(speaker: Speaker): void {
    this.selectedSpeaker = speaker;
    this.showDetailsModal = true;
    document.body.classList.add('modal-open');
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedSpeaker = null;
    document.body.classList.remove('modal-open');
  }

  openAddSpeakerModal(): void {
    this.showAddModal = true;
    document.body.classList.add('modal-open');
  }

  closeAddModal(): void {
    this.showAddModal = false;
    document.body.classList.remove('modal-open');
  }

  closeAllModals(): void {
    this.closeDetailsModal();
    this.closeAddModal();
  }
}