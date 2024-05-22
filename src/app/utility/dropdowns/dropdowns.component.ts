import { Component, OnInit } from '@angular/core';
import { Client } from './client';

@Component({
  selector: 'app-dropdowns',
  templateUrl: './dropdowns.component.html',
  styleUrls: ['./dropdowns.component.css']
})
export class DropdownsComponent implements OnInit {

  /**Za MultiSelectDropdown  */
  public selectedItem = [
    {
      id: 1,
      Name: 'Amstrong',
      Surname: 'Nikić',

    },
    {
      id: 2,
      Name: 'Mirso',
      Surname: 'Glavinić',

    },
    {
      id: 3,
      Name: 'Amer',
      Surname: 'Mešanović',

    },
    {
      id: 4,
      Name: 'Bruno',
      Surname: 'Lujanović',

    },
    {
      id: 5,
      Name: 'Adem',
      Surname: 'Ćogić',

    },
    {
      id: 6,
      Name: 'Zlatan',
      Surname: 'Habultron',

    },
    {
      id: 7,
      Name: 'Bruno',
      Surname: 'Lujanović',

    },
    {
      id: 8,
      Name: 'Brunoaaaaaaaaaaaaaa',
      Surname: 'Lujanovićaaaaaaaaaaaaaaaaa',

    },
  ]

  /**Za kategorije*/
  public CategoryItem = [
    {
      id: 1,
      Name: 'Faktura'
    },
    {
      id: 2,
      Name: 'Kreditfaktura'
    }
  ]

  /**Za single select dropdown with plus */
   ClientItem: Client[] = [
    {
      id: 1,
      Name: 'ABB Bygg Sverige AB'
    },
    {
      id: 2,
      Name: 'AF Bygg Göteborg AB'
    },
    {
      id: 3,
      Name: 'AF Bygg Syd AB'
    },
    {
      id: 4,
      Name: 'AF Bygg Göteborg AB'
    },
    {
      id: 5,
      Name: 'Andreasson & Lundström Byggnad'
    },
    {
      id: 6,
      Name: 'Andric Förvaltning AB'
    }
  ];

    /**Za select-dropdown-single-checkbox */
    public MaterialData = [
      {
        id: 1,
        Name: 'V.40',
        Price: '8 855,00 kr'
      },
      {
        id: 2,
        Name: 'V.41',
        Price: '8 855,00 kr'
      },
      {
        id: 3,
        Name: 'V.42',
        Price: '8 855,00 kr'
      },
      {
        id: 4,
        Name: 'V.43',
        Price: '1 880,00 kr'
      },
      {
        id: 5,
        Name: 'V.44',
        Price: '8 855,00 kr'
      },
      {
        id: 6,
        Name: 'V.45',
        Price: '8 855,00 kr'
      },
      {
        id: 7,
        Name: 'V.46',
        Price: '8 855,00 kr'
      },
      {
        id: 8,
        Name: 'V.47',
        Price: '8 855,00 kr'
      },
      {
        id: 9,
        Name: 'V.48',
        Price: '8 855,00 kr'
      },
      {
        id: 10,
        Name: 'V.49',
        Price: '8 855,00 kr'
      },
      {
        id: 11,
        Name: 'V.50',
        Price: '8 855,00 kr'
      },
      {
        id: 12,
        Name: 'V.51',
        Price: '8 855,00 kr'
      },
      {
        id: 13,
        Name: 'V.52',
        Price: '8 855,00 kr'
      },
      {
        id: 14,
        Name: 'V.53',
        Price: '8 855,00 kr'
      },
      {
        id: 15,
        Name: 'V.54',
        Price: '8 855,00 kr'
      },
      {
        id: 16,
        Name: 'V.55',
        Price: '8 855,00 kr'
      }

    ];

      /**Za multiselect-dropdown-project */
      public ProjectData = [
        {
          id: 1,
          Name: 'Plan 2',
        },
        {
          id: 2,
          Name: 'Plan 3',
        },
        {
          id: 3,
          Name: 'Lagenheterna',
        },
        {
          id: 4,
          Name: 'Taket',
        },
        {
          id: 5,
          Name: 'Plan 4',
        },
        {
          id: 6,
          Name: 'Plan 5',
        },

      ];

  /**Za send-print-dropdown-UT */
  public SendPrintUT = [
    {
      id: 1,
      Name: 'Zlatko Lukic',
    },
    {
      id: 2,
      Name: 'Michael Jovich',
    },
    {
      id: 3,
      Name: 'Lena Ankarstrom',
    },
    {
      id: 4,
      Name: 'Leo Stavic',
    },

  ];

    /**Za send-print-dropdown-ATA*/
    public SendPrintUT1 = [
      {
        id: 1,
        Name: 'Zlatko Lukic',
      },
      {
        id: 2,
        Name: 'Michael Jovich',
      },
      {
        id: 3,
        Name: 'Lena Ankarstrom',
      },
      {
        id: 4,
        Name: 'Leo Stavic',
      },

    ];

    /**Za samm-dropdown*/
    public SendPrintUT2 = [
      {
        id: 1,
        Name: 'Zlatko Lukic',
      },
      {
        id: 2,
        Name: 'Michael Jovich',
      },
      {
        id: 3,
        Name: 'Lena Ankarstrom',
      },
      {
        id: 4,
        Name: 'Leo Stavic',
      },

    ];

  /**Za ata-status-dropdown*/
  public ATAStatus = [
    {
      id: 1,
      Name: 'REVIDERA',
    },
    {
      id: 2,
      Name: 'ACCEPTERA MANUELLT',
    },
    {
      id: 3,
      Name: 'AVBRYT FLODET',
    },
    {
      id: 4,
      Name: 'EJ ACCEPTERAD',
    },
    {
      id: 5,
      Name: 'MARKULERA',
    },

  ];

  /**Za ata-status-dropdown*/
  public Authority = [
    {
      id: 1,
      Name: 'Lasa och skriva',
    },
    {
      id: 2,
      Name: 'Endast lasa',
    },
    {
      id: 3,
      Name: 'XXX',
    },
    {
      id: 4,
      Name: 'XXX',
    },
    {
      id: 5,
      Name: 'XXX',
    },

  ];

  /**Za ata-status-dropdown*/
  public Days = [
    {
      id: 1,
      Name: '10 dagar',
    },
    {
      id: 2,
      Name: '15 dagar',
    },
    {
      id: 3,
      Name: '20 dagar',
    },
    {
      id: 4,
      Name: '30 dagar',
    },
    {
      id: 5,
      Name: '60 dagar',
    },
    {
      id: 6,
      Name: '90 dagar',
    },

  ];

    /**Za user-dropdown-multiselect*/
    public User = [
      {
        id: 1,
        Name: 'Zlatko Lukic',
      },
      {
        id: 2,
        Name: 'Aleksandar Kalabic',
      },
      {
        id: 3,
        Name: 'Aleksandra Panic',
      },
      {
        id: 4,
        Name: 'Allen Markovic',
      },
      {
        id: 5,
        Name: 'Amel Husic',
      },
      {
        id: 6,
        Name: 'Bruno Lujanovic Brunoooooooo',
      },

    ];

  constructor() {

  }

  ngOnInit(): void {
    console.log
  }



}
