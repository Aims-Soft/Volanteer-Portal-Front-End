import { Component,OnInit} from '@angular/core';

export interface Subject {
  id: number;
  name: string;
}

export interface Topic {
  id: number;
  subjectId: number;
  name: string;
}


@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit {
  activeTab: 'subjects' | 'topics' = 'subjects';
  subjects: Subject[] = [];
  topics: Topic[] = [];
  searchQuery: string = '';
  currentPage = 1;
  
  newSubjectName: string = '';
  newTopic = {
    subjectId: '',
    name: ''
  };

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    // Mock data - replace with API calls
    this.subjects = [
      { id: 1, name: 'Data Scientist' },
      { id: 2, name: 'Programmer' },
      { id: 3, name: 'Designer' },
      { id: 4, name: 'Ai Engineer' }
    ];

    this.topics = [
      { id: 1, subjectId: 1, name: 'Google Data Analytics' },
      { id: 2, subjectId: 2, name: 'Python' },
      { id: 3, subjectId: 3, name: 'user research, wireframing' },
      { id: 4, subjectId: 4, name: 'Python, machine learning (ML)' }
    ];
  }

  switchTab(tab: 'subjects' | 'topics'): void {
    this.activeTab = tab;
    this.searchQuery = '';
  }

  get filteredSubjects(): Subject[] {
    if (!this.searchQuery) {
      return this.subjects;
    }
    return this.subjects.filter(subject => 
      subject.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  get filteredTopics(): Topic[] {
    if (!this.searchQuery) {
      return this.topics;
    }
    return this.topics.filter(topic => {
      const subjectName = this.getSubjectName(topic.subjectId);
      return topic.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
             subjectName.toLowerCase().includes(this.searchQuery.toLowerCase());
    });
  }

  addSubject(): void {
    if (!this.newSubjectName.trim()) {
      alert('Please enter a subject name');
      return;
    }

    const newSubject: Subject = {
      id: this.subjects.length + 1,
      name: this.newSubjectName
    };

    this.subjects.push(newSubject);
    this.newSubjectName = '';
    
    // TODO: Add API call to save subject
    console.log('Added subject:', newSubject);
  }

  addTopic(): void {
    if (!this.newTopic.subjectId || !this.newTopic.name.trim()) {
      alert('Please select a subject and enter a topic name');
      return;
    }

    const newTopicData: Topic = {
      id: this.topics.length + 1,
      subjectId: parseInt(this.newTopic.subjectId),
      name: this.newTopic.name
    };

    this.topics.push(newTopicData);
    this.newTopic = { subjectId: '', name: '' };
    
    // TODO: Add API call to save topic
    console.log('Added topic:', newTopicData);
  }

  deleteSubject(subject: Subject): void {
    if (confirm(`Are you sure you want to delete "${subject.name}"?`)) {
      // Check if any topics exist for this subject
      const hasTopics = this.topics.some(t => t.subjectId === subject.id);
      if (hasTopics) {
        alert('Cannot delete subject. Topics exist for this subject.');
        return;
      }
      
      this.subjects = this.subjects.filter(s => s.id !== subject.id);
      // TODO: Add API call to delete subject
    }
  }

  deleteTopic(topic: Topic): void {
    if (confirm(`Are you sure you want to delete "${topic.name}"?`)) {
      this.topics = this.topics.filter(t => t.id !== topic.id);
      // TODO: Add API call to delete topic
    }
  }

  editSubject(subject: Subject): void {
    const newName = prompt('Edit Subject Name:', subject.name);
    if (newName && newName.trim()) {
      subject.name = newName.trim();
      // TODO: Add API call to update subject
    }
  }

  editTopic(topic: Topic): void {
    const newName = prompt('Edit Topic Name:', topic.name);
    if (newName && newName.trim()) {
      topic.name = newName.trim();
      // TODO: Add API call to update topic
    }
  }

  getSubjectName(subjectId: number): string {
    const subject = this.subjects.find(s => s.id === subjectId);
    return subject ? subject.name : 'Unknown';
  }
}
