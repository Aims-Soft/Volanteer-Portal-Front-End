import { Component } from '@angular/core';

@Component({
  selector: 'app-recomended-books',
  templateUrl: './recomended-books.component.html',
  styleUrls: ['./recomended-books.component.scss']
})
export class RecomendedBooksComponent {

  activeTab: 'compulsory' | 'elective' = 'compulsory';
  selectedSubject: string = '';

  compulsorySubjects = [
    { name: 'English Essay',                category: 'english'  },
    { name: 'English (Precis & Composition)', category: 'english'  },
    { name: 'General Science & Ability',    category: 'science'  },
    { name: 'Current Affairs',              category: 'current'  },
    { name: 'Pakistan Affairs',             category: 'pakistan' },
    { name: 'Islamic Studies',              category: 'islamic'  },
  ];

  electiveSubjects = [
    { name: 'Physics',                category: 'science'  },
    { name: 'Chemistry',              category: 'science'  },
    { name: 'Mathematics',            category: 'science'  },
    { name: 'History of Pakistan',    category: 'pakistan' },
    { name: 'English Literature',     category: 'english'  },
    { name: 'Arabic & Islamic Culture', category: 'islamic' },
  ];

  switchTab(tab: 'compulsory' | 'elective'): void {
    this.activeTab = tab;
    this.selectedSubject = '';
  }

  onFilterChange(value: string): void {
    this.selectedSubject = value;
  }

  get filteredSubjects() {
    const list = this.activeTab === 'compulsory'
      ? this.compulsorySubjects
      : this.electiveSubjects;

    return this.selectedSubject
      ? list.filter(s => s.category === this.selectedSubject)
      : list;
  }

  downloadSubject(subjectName: string): void {
    // Hook your download logic here
    console.log('Downloading:', subjectName);
  }
}