import { Component ,OnInit} from '@angular/core';

export interface Mosque {
  id: number;
  name: string;
  location: string;
  image: string;
  label: string;
  imamName: string;
  capacity: number;
}

@Component({
  selector: 'app-mosque',
  templateUrl: './mosque.component.html',
  styleUrls: ['./mosque.component.scss']
})
export class MosqueComponent implements OnInit {

mosques: Mosque[] = [];

  ngOnInit(): void {
    this.loadMosques();
  }

  loadMosques(): void {
    this.mosques = [
      {
        id: 1,
        name: 'Masjid-e-Bilal',
        location: 'Multan, Punjab, Pakistan',
        image: '/assets/lcons/mosque1.png',
        label: 'Mother Mosque',
        imamName: 'Muhammad Abdullah',
        capacity: 200
      },
      {
        id: 2,
        name: 'Masjid-e-Bilal',
        location: 'Multan, Punjab, Pakistan',
        image: '/assets/lcons/mosque1.png',
        label: 'Mother Mosque',
        imamName: 'Imam Name',
        capacity: 250
      },
      {
        id: 3,
        name: 'Masjid-e-Bilal',
        location: 'Multan, Punjab, Pakistan',
        image: '/assets/lcons/mosque1.png',
        label: 'Mother Mosque',
        imamName: 'Imam Name',
        capacity: 300
      },
      {
        id: 4,
        name: 'Masjid-e-Bilal',
        location: 'Multan, Punjab, Pakistan',
        image: '/assets/lcons/mosque1.png',
        label: 'Mother Mosque',
        imamName: 'Imam Name',
        capacity: 180
      },
      {
        id: 5,
        name: 'Masjid-e-Bilal',
        location: 'Multan, Punjab, Pakistan',
        image: '/assets/lcons/mosque1.png',
        label: 'Mother Mosque',
        imamName: 'Imam Name',
        capacity: 220
      },
      {
        id: 6,
        name: 'Masjid-e-Bilal',
        location: 'Multan, Punjab, Pakistan',
          image: '/assets/lcons/mosque1.png',
        label: 'Mother Mosque',
        imamName: 'Imam Name',
        capacity: 350
      },
      {
        id: 7,
        name: 'Masjid-e-Bilal',
        location: 'Multan, Punjab, Pakistan',
        image: '/assets/lcons/mosque1.png',
        label: 'Mother Mosque',
        imamName: 'Imam Name',
        capacity: 150
      },
      {
        id: 8,
        name: 'Masjid-e-Bilal',
        location: 'Multan, Punjab, Pakistan',
        image: '/assets/lcons/mosque1.png',
        label: 'Mother Mosque',
        imamName: 'Imam Name',
        capacity: 280
      },
      {
        id: 9,
        name: 'Masjid-e-Bilal',
        location: 'Multan, Punjab, Pakistan',
        image: '/assets/lcons/mosque1.png',
        label: 'Mother Mosque',
        imamName: 'Imam Name',
        capacity: 320
      }
    ];
  }
}

