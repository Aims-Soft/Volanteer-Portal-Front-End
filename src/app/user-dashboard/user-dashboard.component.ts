import { Component,OnInit } from '@angular/core';

export interface Statistics {
  applied: number;
  pending: number;
  attended: number;
}

export interface PendingTopic {
  id: number;
  subject: string;
  topicDescription: string;
  candidates: number;
  status: 'Pending' | 'Scheduled';
}

export interface UpcomingLecture {
  id: number;
  venue: string;
  subject: string;
  topic: string;
  speaker: string;
  dateTime: string;
  image: string;
  statusBadge: string;
}

export interface RequestData {
  subject: string;
  candidates: number | null;
  topic: string;
  others: string;
}

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent implements OnInit {
  statistics: Statistics = {
    applied: 26,
    pending: 26,
    attended: 26
  };

  pendingTopics: PendingTopic[] = [];
  upcomingLectures: UpcomingLecture[] = [];
  
  showRequestModal = false;
  currentPage = 1;

  requestData: RequestData = {
    subject: '',
    candidates: null,
    topic: '',
    others: ''
  };

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    // Mock pending topics
    this.pendingTopics = [
      {
        id: 1,
        subject: 'Data Structures and Algorithms (DSA)',
        topicDescription: 'Data organization and problem-solving techniques',
        candidates: 2,
        status: 'Pending'
      },
      {
        id: 2,
        subject: 'Computer Systems and Architecture',
        topicDescription: 'How hardware and low-level software function and interact',
        candidates: 3,
        status: 'Scheduled'
      },
      {
        id: 3,
        subject: 'Operating Systems (OS)',
        topicDescription: 'Management of computer resources and processes.',
        candidates: 1,
        status: 'Scheduled'
      },
      {
        id: 4,
        subject: 'Operating Systems (OS)',
        topicDescription: 'Management of computer resources and processes.',
        candidates: 1,
        status: 'Scheduled'
      }
    ];

    // Mock upcoming lectures
    this.upcomingLectures = [
      {
        id: 1,
        venue: 'Province Town High School',
        subject: 'Roots of Computer Languages',
        topic: 'Basic Languages',
        speaker: 'Salif Saif',
        dateTime: '21 Feb 2026 (11:00AM)',
        image: 'assets/images/lecture-venue.jpg',
        statusBadge: 'Upcoming'
      },
      {
        id: 2,
        venue: 'Province Town High School',
        subject: 'Roots of Computer Languages',
        topic: 'Basic Languages',
        speaker: 'Salif Saif',
        dateTime: '21 Feb 2026 (11:00AM)',
        image: 'assets/images/lecture-venue.jpg',
        statusBadge: 'Upcoming'
      },
      {
        id: 3,
        venue: 'Province Town High School',
        subject: 'Roots of Computer Languages',
        topic: 'Basic Languages',
        speaker: 'Salif Saif',
        dateTime: '21 Feb 2026 (11:00AM)',
        image: 'assets/images/lecture-venue.jpg',
        statusBadge: 'Upcoming'
      }
    ];
  }

  get scheduledCount(): number {
    return this.pendingTopics.filter(t => t.status === 'Scheduled').length;
  }

  get pendingCount(): number {
    return this.pendingTopics.filter(t => t.status === 'Pending').length;
  }

  openRequestLectureModal(): void {
    this.showRequestModal = true;
    document.body.classList.add('modal-open');
  }

  closeRequestModal(): void {
    this.showRequestModal = false;
    this.requestData = {
      subject: '',
      candidates: null,
      topic: '',
      others: ''
    };
    document.body.classList.remove('modal-open');
  }

  submitRequest(): void {
    if (!this.requestData.subject || !this.requestData.candidates) {
      alert('Please fill in all required fields');
      return;
    }

    if (!this.requestData.topic && !this.requestData.others) {
      alert('Please select a topic or specify in Others field');
      return;
    }

    console.log('Lecture request submitted:', this.requestData);
    
    // TODO: Add API call here
    
    alert('Lecture request submitted successfully!');
    this.closeRequestModal();
  }
}