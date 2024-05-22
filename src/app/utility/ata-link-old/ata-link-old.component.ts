import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-ata-link-old',
  templateUrl: './ata-link-old.component.html',
  styleUrls: ['./ata-link-old.component.css']
})
export class AtaLinkOldComponent implements OnInit {

  @Input('ata') ata;
  @Input('type') type;
  @Input('parent') parent;

  public parentName = '';
  public link = '';

  constructor() { }

  ngOnInit(): void {
    this.initializeLink();
  }

  initializeLink() {
    this.setParentName();
    this.generateLink();
  }

  setParentName() {
    this.parentName = this.generateParentName();
  }

  generateParentName() {

    if (this.type === 'ATA') {
      return this.generateAtaName();
    }

    if (this.type === 'Deviation') {
      return this.generateDeviationName();
    }

    return '';
  }

  generateAtaName() {
    if (this.ata.ExternalAtaNumber && this.ata.Ata == 1) return "ÄTA-" + this.ata.ExternalAtaNumber;
    if (this.ata.AtaInternalNumber && this.ata.Ata == 1) return "ÄTA-" + this.ata.AtaInternalNumber;
    if (this.ata.AtaNumber && this.ata.Ata == 1) return "ÄTA-" + this.ata.AtaNumber;
    return '';
  }

  generateDeviationName() {
    if (this.ata.ExternalAtaNumber && this.ata.Deviation == 1) return "U-" + this.ata.ExternalAtaNumber;
    if (this.ata.AtaInternalNumber && this.ata.Deviation == 1) return "U-" + this.ata.AtaInternalNumber;
    if (this.ata.DeviationNumber && this.ata.Deviation == 1 && this.parent == 'ata') return "U-" + this.ata.DeviationNumber;
    return '';
  }

  generateLink() {
    if (this.parentName.includes('U')) {
      this.link = `${window.location.origin}/#/projects/view/deviation/edit/${this.ata.ProjectID}/${this.ata.ATAID}?type=external`;
    } else {
      const type = this.ata.ExternalAtaNumber ? 'internal' : 'external';
      this.link = `${window.location.origin}/#/projects/view/ata/modify-ata/${this.ata.ATAID}?type=${type}&projectId=${this.ata.ProjectID}`;
    }
  }

  navigate() {
    location.href = this.link;
    window.location.reload();
  }

}
