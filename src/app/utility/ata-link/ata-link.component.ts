import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-ata-link',
  templateUrl: './ata-link.component.html',
  styleUrls: ['./ata-link.component.css']
})
export class AtaLinkComponent implements OnInit {

  @Input('relations') relations;
  @Input('type') type;

  constructor() { }

  ngOnInit() {
  }

  navigate(link:string, ataLink: { child_number: string, link: string } ) {
    let hrefLink = link;
    if (link.includes('modify-ata')) {
      const type = ataLink.child_number.includes('Internal') ? 'internal' : 'external';
      const querySeperator = link.includes('?') ? '&' : '?';
      hrefLink = `${link}${querySeperator}type=${type}`;
    }
    location.href = hrefLink;
    window.location.reload();
  }

}
