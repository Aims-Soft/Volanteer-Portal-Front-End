import { Component,OnInit } from '@angular/core';

@Component({
  selector: 'app-hero-section',
  templateUrl: './hero-section.component.html',
  styleUrls: ['./hero-section.component.scss']
})
export class HeroSectionComponent 
implements OnInit {
  
  slides = [
    {
        image: 'assets/lcons/hero1.svg',
   
      description: 'Join the national registry of emergency responders and volunteers. We connect skilled individuals with communities in Incidents. When you\'re needed, we\'ll let you know.'
    },
    {
      image: 'assets/lcons/hero2.png',
      description: 'Be part of the rapid response team during earthquakes and natural disasters. Your skills can save lives and rebuild communities when disaster strikes.'
    },
    {
      image: 'assets/lcons/hero3.png',
      description: 'Support firefighting and rescue operations across the nation. Register now to be connected with emergency response teams in your area.'
    },
    {
      image: 'assets/lcons/hero4.png',
      description: 'Medical professionals and volunteers needed for emergency healthcare response. Join our network to provide critical care during disasters.'
    }
  ];
  
  constructor() { }
  
  ngOnInit(): void {
  }
  
}