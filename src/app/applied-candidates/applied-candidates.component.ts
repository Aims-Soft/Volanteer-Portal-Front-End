import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Candidate {
  id: number;
  name: string;
  subject: string;
  topic: string;
  contactNo: string;
  selected: boolean;
}

export interface ArrangeData {
  topic: string;
  seats: string;
}

@Component({
  selector: 'app-applied-candidates',
  templateUrl: './applied-candidates.component.html',
  
  styleUrls: ['./applied-candidates.component.scss']
})
export class AppliedCandidatesComponent implements OnInit {
  candidates: Candidate[] = [];
  selectAll = false;
  showArrangeModal = false;
  currentPage = 1;
  selectedCandidate: Candidate | null = null;
  
  arrangeData: ArrangeData = {
    topic: '',
    seats: ''
  };

  ngOnInit(): void {
    this.loadCandidates();
  }

  loadCandidates(): void {
    this.candidates = [
      {
        id: 1,
        name: 'Tariq Amjad',
        subject: 'Data Scientist',
        topic: 'Google Data Analytics',
        contactNo: '0300--------',
        selected: false
      },
      {
        id: 2,
        name: 'Mushtaq Ali',
        subject: 'Programmer',
        topic: 'Python',
        contactNo: '0300--------',
        selected: false
      },
      {
        id: 3,
        name: 'Danish Taimoor',
        subject: 'Designer',
        topic: 'user research, wireframing',
        contactNo: '0300--------',
        selected: false
      },
      {
        id: 4,
        name: 'Muzamil Hassan',
        subject: 'Ai Engineer',
        topic: 'Python, machine learning (ML)',
        contactNo: '0300--------',
        selected: false
      }
    ];
  }

  toggleSelectAll(): void {
    this.candidates.forEach(candidate => {
      candidate.selected = this.selectAll;
    });
  }

  get selectedCandidatesCount(): number {
    return this.candidates.filter(c => c.selected).length;
  }

  openArrangeLectureModal(candidate?: Candidate): void {
    if (candidate) {
      this.selectedCandidate = candidate;
      candidate.selected = true;
    }
    this.showArrangeModal = true;
    document.body.classList.add('modal-open');
  }

  closeArrangeModal(): void {
    this.showArrangeModal = false;
    this.selectedCandidate = null;
    this.arrangeData = { topic: '', seats: '' };
    document.body.classList.remove('modal-open');
  }

  arrangeLecture(): void {
    const selectedCandidates = this.candidates.filter(c => c.selected);
    
    console.log('Arranging lecture for:', {
      candidates: selectedCandidates,
      topic: this.arrangeData.topic,
      seats: this.arrangeData.seats
    });

    // TODO: Add your API call here to arrange lecture
    
    // Show success message or redirect
    alert('Lecture arranged successfully!');
    this.closeArrangeModal();
  }

  deleteCandidate(candidate: Candidate): void {
    if (confirm(`Are you sure you want to delete ${candidate.name}?`)) {
      this.candidates = this.candidates.filter(c => c.id !== candidate.id);
    }
  }
}
