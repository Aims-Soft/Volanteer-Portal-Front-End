import { Component, OnInit } from '@angular/core';
import { SharedDataService } from '../../shared/services/shared-data.service';

interface Domain {
  domainID: number;
  domainTitle: string;
}

interface SkillCategory {
  categoryID: number;
  categoryTitle: string;
  domain: string;
  parsedDomains?: Domain[];
}

@Component({
  selector: 'app-who-we-need',
  templateUrl: './who-we-need.component.html',
  styleUrls: ['./who-we-need.component.scss']
})
export class WhoWeNeedComponent implements OnInit {
  
  skillsList: SkillCategory[] = [];
  isLoading: boolean = false;
  
  constructor(private dataService: SharedDataService) {}
  
  ngOnInit(): void {
    this.loadSkills();
  }
  
  loadSkills(): void {
    this.isLoading = true;
    
    this.dataService.getHttp('admin-api/Admin/getSkills').subscribe({
      next: (res: any) => {
        console.log('Skills API Response:', res);
        console.log('Is Array:', Array.isArray(res));
        console.log('Response Length:', res?.length);
        
        // Handle different response structures
        let rawData: SkillCategory[] = [];
        
        if (Array.isArray(res)) {
          rawData = res;
          console.log('Direct array, length:', rawData.length);
        } else if (res?.data && Array.isArray(res.data)) {
          rawData = res.data;
          console.log('Nested in data, length:', rawData.length);
        } else if (res?.result && Array.isArray(res.result)) {
          rawData = res.result;
          console.log('Nested in result, length:', rawData.length);
        } else {
          console.warn('Unknown response structure:', res);
          rawData = [];
        }
        
        console.log('Raw Data Before Parsing:', rawData);
        
        // Parse domain JSON string for each category
        this.skillsList = rawData.map((category, index) => {
          let parsedDomains: Domain[] = [];
          
          if (category.domain) {
            try {
              parsedDomains = typeof category.domain === 'string'
                ? JSON.parse(category.domain)
                : category.domain;
              
              console.log(`Category ${index} (${category.categoryTitle}): ${parsedDomains.length} domains`);
            } catch (error) {
              console.error('Error parsing domain JSON for category:', category.categoryTitle, error);
              console.error('Domain value:', category.domain);
              parsedDomains = [];
            }
          } else {
            console.warn(`Category ${index} (${category.categoryTitle}): No domain field`);
          }
          
          return {
            categoryID: category.categoryID,
            categoryTitle: category.categoryTitle,
            domain: category.domain,
            parsedDomains
          };
        });
        
        console.log('Total Categories Loaded:', this.skillsList.length);
        console.log('Parsed Skills List:', this.skillsList);
        
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error loading skills:', err);
        console.error('Error details:', err.error);
        console.error('Error status:', err.status);
        this.skillsList = [];
        this.isLoading = false;
      }
    });
  }
}