import { Component,OnInit } from '@angular/core';


export interface Speaker {
  id: number;
  name: string;
  fullName: string;
  profession: string;
  subjects: string;
  subjectsList: string[];
  email: string;
  phone: string;
  designation: string;
  image: string;
  coverLetter?: string;
}

@Component({
  selector: 'app-speaker-list',
  templateUrl: './speaker-list.component.html',
  styleUrls: ['./speaker-list.component.scss']
})
export class SpeakerListComponent implements OnInit {
  speakers: Speaker[] = [];
  selectedSpeaker: Speaker | null = null;
  showDetailsModal = false;
  currentPage = 1;

  ngOnInit(): void {
    this.loadSpeakers();
  }

  loadSpeakers(): void {
    this.speakers = [
      {
        id: 1,
        name: 'Tariq Amjad',
        fullName: 'SALIF SAIF',
        profession: 'Data Scientist',
        subjects: "Google Data Analytics, Simplilearn's Post Graduate, Python.............",
        subjectsList: ['Python.', 'AI Algorithm.'],
        email: 'tariq@example.com',
        phone: '+92 300 1234567',
        designation: 'Senior Data Scientist at Tech Corp',
        image: 'assets/images/speaker-avatar.png',
        coverLetter: 'Experienced data scientist with expertise in machine learning and analytics.'
      },
      {
        id: 2,
        name: 'Mushtaq Ali',
        fullName: 'MUSHTAQ ALI',
        profession: 'Programmer',
        subjects: 'Python, Java, C++, and JavaScript, alongside specialized topics...........',
        subjectsList: ['Python.', 'Java.', 'JavaScript.', 'C++.'],
        email: 'mushtaq@example.com',
        phone: '+92 300 2345678',
        designation: 'Full Stack Developer',
        image: 'assets/images/speaker-avatar.png',
        coverLetter: 'Passionate programmer with 10+ years of experience in software development.'
      },
      {
        id: 3,
        name: 'Danish Taimoor',
        fullName: 'DANISH TAIMOOR',
        profession: 'Designer',
        subjects: 'user research, wireframing, prototyping with Figma or Adobe XD ..........',
        subjectsList: ['User Research.', 'Wireframing.', 'Prototyping.', 'UI/UX Design.'],
        email: 'danish@example.com',
        phone: '+92 300 3456789',
        designation: 'Senior UI/UX Designer',
        image: 'assets/images/speaker-avatar.png',
        coverLetter: 'Creative designer specializing in user-centered design and digital experiences.'
      },
      {
        id: 4,
        name: 'Muzamil Hassan',
        fullName: 'MUZAMIL HASSAN',
        profession: 'Ai Engineer',
        subjects: 'Python, machine learning (ML), deep learning, and generative AI (GenAI).....',
        subjectsList: ['Python.', 'Machine Learning.', 'Deep Learning.', 'Generative AI.'],
        email: 'muzamil@example.com',
        phone: '+92 300 4567890',
        designation: 'AI Research Engineer',
        image: 'assets/images/speaker-avatar.png',
        coverLetter: 'AI researcher focused on cutting-edge machine learning and neural networks.'
      }
    ];
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
}
