import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import * as printJS from 'print-js';

@Component({
  selector: 'app-pdfjs-viewer',
  templateUrl: './pdfjs-viewer.component.html',
  styleUrls: ['./pdfjs-viewer.component.css']
})
export class PdfjsViewerComponent implements OnInit {

  @Input("canRemove") canRemove: boolean = false;
  @Input("updateComment") updateComment: boolean = false;
  @Input("server") server: boolean = false;
  @Input('position') position = 'fixed';
  @Input('numberOfData') numberOfData : number;
  @Input("swiper") set setSwiper(value) {
      if (value !== this.swiper) {
          this.swiper = value;
          this.initSwiper();
      }
  };

  @ViewChild("imageContainer") imageContainer: ElementRef;
  @Output() closeSwiperEvent = new EventEmitter<any>();
  @Output() removeImageEvent = new EventEmitter<any>();
  @Output() updateCommentEvent = new EventEmitter<any>();
  @Output() setActive = new EventEmitter<any>();
  @Output() resetPdfEvent: EventEmitter<string> = new EventEmitter<string>();

  active: number = 0;
  translateX = "0px";
  zoomTranslate = "translate(0px, 0px) scale(0px)";
  keydownbind;
  file_path;
  containerClass = 'g-container';

  zoom = {
      scale: 1,
      panning: false,
      pointX: 0,
      pointY: 0,
      start: { x: 0, y: 0 },
  };

  swiper = {
      images: [],
      active: -1,
      album: -2,
      index: -1,
      parent: null,
  };
  deg = 0;
  public marginL: any = {}
  public rotation: number = 0;
  public zoomButton;
  public zoomScale: any = 0;
  public cursormove: boolean = true;
  public hovered = {
      download: false,
      pdf: false
  };
  public styleMousClicked: any;
  public LeftArrow:any;
  public RightArrow: any;
  public resetValue: string = '';

  constructor() {}

  ngOnInit(): void {
    this.marginL = this.swiper["margin"];
  }

  zoomBy(action: 'increase' | 'decrease'): void {
    this.zoomButton = action;
  }

  savezoomButton(zoom: number): void {
    this.zoomButton = zoom;
  }

  /*ResetPdf */
  resetPdfOnDefaultValues(reset){
    this.resetValue = reset;
  }

  updateResetPdf($event){
    this.resetValue = $event;
  }

  public res: any;
  /**
   * Postavlja vrijednost polja "res" na zadanu vrijednost "reszoom".
   *
   * @param reszoom Vrijednost za postavljanje polja "res".
   */
  resetZoomButton(reszoom: any): void {
    this.res = reszoom;
  }

  rotateBy(deg: number): void {
    this.rotation = this.rotation + deg;
  }

  /**
   * Inicijalizira Swiper komponentu.
   * Postavlja osluškivanje događaja pritiska tipki, postavlja početne vrijednosti i primjenjuje stilove.
   */
  initSwiper(): void {
    this.keydownbind = this.keydownNext.bind(this);
    document.addEventListener("keydown", this.keydownbind, true);
    this.active = this.swiper.active;
    this.file_path = this.swiper.images[0].file_path;

    document.body.style.overflow = "hidden";
    if (this.position === 'relative') {
      this.containerClass = 'g-container-relative';
    }
  }

  totalPage:number;
  handleNumberOfPages(numberOfPage: number): void {
    this.totalPage = numberOfPage;
  }

  /**
   * Metoda koja se poziva prilikom uništavanja komponente.
   * Vraća stil tijela dokumenta na zadanu vrijednost "auto" za overflow.
   * Ako postoji povezani događaj "keydownbind", uklanja ga s dokumenta.
   */
  ngOnDestroy(): void {
    document.body.style.overflow = "auto";
    if (this.keydownbind) {
      document.removeEventListener("keydown", this.keydownbind, true);
    }
  }

  /**
   * Obrada događaja pritiska tipke za prijelaz na sljedeću stranicu.
   * Ako je pritisnuta tipka "ArrowRight", poziva se metoda "showNextPage()" za prikaz sljedeće stranice.
   * Ako je pritisnuta tipka "ArrowLeft", poziva se metoda "showPrevPage()" za prikaz prethodne stranice.
   * Ako je pritisnuta tipka "Escape", poziva se metoda "closeSwiper()" za zatvaranje swipera.
   *
   * @param e Događaj pritiska tipke.
   */
  keydownNext(e): void {
    const key = e.key;
    if (key === "ArrowRight") {
      this.showNextPage();
    } else if (key === "ArrowLeft") {
      this.showPrevPage();
    } else if (key === "Escape") {
      this.closeSwiper();
    }
  }

  //Mijenjanje scale vrijednosti dokumenta
  scale: any; //Zoom dokumenta.
  MINZoom = 25; //Minimalni zoom dokumenta
  MAXZoom = 1500; //Maksimalni zoom dokumenta

  /**
   * Postavlja skaliranje stranice na temelju nove skale.
   * Računa postotak nove skale u odnosu na 100 i zaokružuje ga na cijeli broj.
   * Ako postotak nove skale prelazi maksimalni zoom, postavlja se na maksimalni zoom.
   * Ako postotak nove skale je manji od minimalnog zooma, postavlja se na minimalni zoom.
   * Inače, postavlja se nova skala na izračunati postotak nove skale.
   * Ispisuje se nova skala u konzoli.
   *
   * @param newScale Nova skala koja se postavlja.
   */

  scalePage(newScale: any): void {
    const scalePercentage = (((newScale * 100) / 100) * 100).toFixed(0);

    if (parseInt(scalePercentage) >= this.MAXZoom) {
      this.scale = this.MAXZoom;
    } else if (parseInt(scalePercentage) <= this.MINZoom) {
      this.scale = this.MINZoom;
    } else {
      this.scale = scalePercentage;
    }
  }

  /**
   * Promjena skale na temelju unosa.
   * Ako unos prelazi maksimalni zoom, postavlja se na maksimalni zoom.
   * Ako unos je manji od minimalnog zooma, postavlja se na minimalni zoom.
   * Inače, postavlja se nova skala na temelju unosa.
   * Ispisuje se nova skala i unos u konzoli.
   *
   * @param scaleInput Unos koji predstavlja novu skalu.
   */
  changescalewithinput(scaleInput: any): void {
    if (scaleInput > this.MAXZoom) {
      this.zoomScale = this.MAXZoom;
      this.scale = this.zoomScale;
    } else if (scaleInput < this.MINZoom) {
      this.zoomScale = this.MINZoom;
      this.scale = this.zoomScale;
    } else {
      this.zoomScale = scaleInput;
      this.scale = this.zoomScale;
    }
  }
 //end


  //Mijenanje stranica s parenta u childu
  @Output() page = new EventEmitter<any>(); // Emiter događaja za trenutnu stranicu.

  currentPageIndex: number = 1; //Trenutni indeks stranice.

  /**
   * Prikazuje sljedeću stranicu.
   * Ako je trenutni indeks stranice manji od ukupnog broja stranica,
   * povećava se trenutni indeks i ažurira se trenutni unos broja stranice.
   * Inače, postavlja se trenutni indeks na 1 i ažurira trenutni unos broja stranice na 1.
   * Emitira se događaj s trenutnim indeksom stranice.
   */
  showNextPage(): void {
    if (this.currentPageIndex < this.totalPage) {
      this.currentPageIndex++; // Povećava se trenutni indeks stranice.
      this.currentPageInput = this.currentPageIndex; // Ažurira se trenutni unos broja stranice prema trenutnom indeksu.
    } else {
      this.currentPageIndex = 1; // Postavlja se trenutni indeks stranice na 1.
      this.currentPageInput = 1; // Ažurira se trenutni unos broja stranice na 1.
    }
    this.page.emit(this.currentPageIndex); // Emitira se događaj s trenutnim indeksom stranice.
  }

  /**
   * Prikazuje prethodnu stranicu.
   * Ako je trenutni indeks stranice veći od 1,
   * smanjuje se trenutni indeks i ažurira se trenutni unos broja stranice.
   * Inače, postavlja se trenutni indeks na ukupan broj stranica i ažurira se trenutni unos broja stranice na ukupan broj stranica.
   * Emitira se događaj s trenutnim indeksom stranice.
   */
  showPrevPage(): void {
    if (this.currentPageIndex > 1) {
      this.currentPageIndex--; // Smanjuje se trenutni indeks stranice.
      this.currentPageInput = this.currentPageIndex; // Ažurira se trenutni unos broja stranice prema trenutnom indeksu.
    } else {
      this.currentPageIndex = this.totalPage; // Postavlja se trenutni indeks stranice na ukupan broj stranica.
      this.currentPageInput = this.totalPage; // Ažurira se trenutni unos broja stranice na ukupan broj stranica.
    }
    this.page.emit(this.currentPageIndex); // Emitira se događaj s trenutnim indeksom stranice.
  }

  currentPageInput: number = 1; //Trenutni unos broja stranice.
  lastValidPageIndex: number = 1; //Posljednji valjani indeks stranice.

  /**
   * Metoda za promjenu broja stranice.
   * Prima uneseni broj stranice kao string.
   * Provjerava se uneseni broj stranice i ažuriraju se vrijednosti trenutne stranice, posljednje valjane stranice i trenutnog indeksa stranice.
   *
   * @param pageNumber Uneseni broj stranice kao string.
   */
  changePageNumber(pageNumber: string): void {
    const page = parseInt(pageNumber); // Pretvara uneseni broj stranice u brojčanu vrijednost.

    if (pageNumber.trim() === '') {
      this.currentPageInput = this.currentPageIndex; // Ako je uneseni broj prazan, postavlja se trenutna vrijednost stranice na trenutni indeks stranice.
    }
    else if (page >= 1 && page <= this.totalPage) {
      this.currentPageInput = page; // Ažurira se unesena vrijednost stranice.
      this.lastValidPageIndex = page; // Ažurira se vrijednost posljednje valjane stranice prema unesenoj vrijednosti.
      this.currentPageIndex = page; // Ažurira se trenutni indeks stranice prema unesenoj vrijednosti.
    }
    else if (page < 1) {
      this.currentPageInput = 1; // Postavlja se uneseni broj stranice na 1.
      this.lastValidPageIndex = 1; // Ažurira se vrijednost posljednje valjane stranice na 1.
      this.currentPageIndex = 1; // Ažurira se trenutni indeks stranice na 1.
    }
    else if (page > this.totalPage) {
      this.currentPageInput = this.totalPage; // Postavlja se uneseni broj stranice na ukupan broj stranica.
      this.lastValidPageIndex = this.totalPage; // Ažurira se vrijednost posljednje valjane stranice na ukupan broj stranica.
      this.currentPageIndex = this.totalPage; // Ažurira se trenutni indeks stranice na ukupan broj stranica.
    }
  }


  /**
   * Metoda koja se pokreće kada se gubi fokus s polja za unos trenutne stranice.
   * Provjerava se vrijednost unesena u polje. Ako je vrijednost manja od 1, postavlja se vrijednost na posljednje valjani indeks stranice.
   * Inače, ažurira se vrijednost posljednjeg valjanog indeksa stranice i trenutnog indeksa stranice prema unesenoj vrijednosti.
   */
  onBlur(): void {
    if (this.currentPageInput < 1) {
      this.currentPageInput = this.lastValidPageIndex; // Postavlja se vrijednost na posljednje valjani indeks stranice ako je unesena vrijednost manja od 1.
    } else {
      this.lastValidPageIndex = this.currentPageInput; // Ažurira se vrijednost posljednjeg valjanog indeksa stranice prema unesenoj vrijednosti.
      this.currentPageIndex = this.currentPageInput; // Ažurira se vrijednost trenutnog indeksa stranice prema unesenoj vrijednosti.
    }
  }
  //kraj

  /**
   * Metoda za dohvaćanje vrijednosti aktivnog atributa.
   * Metoda pretražuje aktivni element i dohvaća vrijednost atributa na temelju navedenih imena.
   *
   * @param names Niz imena atributa koji se pretražuju.
   * @returns Vrijednost prvog pronađenog atributa ili prazan string ako nijedan atribut nije pronađen.
   */
  getActiveAttribute(names: string[]): any {
    const active = this.active; // Dohvaća indeks aktivnog elementa
    const images = this.swiper.images; // Dohvaća slikovne elemente
    let name: any = ""; // Inicijalizacija varijable za spremanje vrijednosti atributa

    for (let i = 0; i < names.length; i++) {
        const key = names[i]; // Trenutno ime atributa koje se pretražuje
        if (images[active][key]) {
            name = images[active][key]; // Dohvaća vrijednost atributa ako postoji
            break; // Prekida petlju nakon pronalaska prvog atributa
        }
    }

    return name; // Vraća vrijednost prvog pronađenog atributa ili prazan string ako nijedan atribut nije pronađen
  }

  /**
   * Metoda za dohvaćanje URL-a aktivnog elementa.
   * Metoda koristi metodu getActiveAttribute() kako bi dohvatila vrijednost atributa "Url", "url", "image_path" ili "file".
   *
   * @returns URL aktivnog elementa.
   */
  activeUrl(): string {
    return this.getActiveAttribute(["Url", "url", "image_path", "file"]); // Dohvaća vrijednost atributa "Url", "url", "image_path" ili "file" aktivnog elementa.
  }

  /**
   * Metoda za dohvaćanje naziva aktivnog elementa.
   * Metoda koristi metodu getActiveAttribute() kako bi dohvatila vrijednost atributa "Name" ili "name".
   *
   * @returns Naziv aktivnog elementa.
   */
  activeName(): string {
    return this.getActiveAttribute(["Name", "name"]); // Dohvaća vrijednost atributa "Name" ili "name" aktivnog elementa.
  }

  /**
   * Metoda za provjeru je li aktivni element označen kao izbrisan.
   * Metoda provjerava vrijednost atributa "deleted" roditeljskog elementa ako postoji, inače provjerava vrijednost atributa "deleted" ili "Deleted" aktivnog elementa.
   *
   * @returns True ako je aktivni element označen kao izbrisan, inače False.
   */
  activeDeleted(): boolean {
    let deleted = false;
    if (this.swiper.parent) {
        deleted = this.swiper.parent.deleted; // Provjerava vrijednost atributa "deleted" roditeljskog elementa ako postoji
    } else {
        deleted = this.getActiveAttribute(["deleted", "Deleted"]); // Provjerava vrijednost atributa "deleted" ili "Deleted" aktivnog elementa
    }

    return deleted;
  }

  /**
   * Metoda za dohvaćanje putanje aktivne datoteke.
   * Metoda koristi metodu getActiveAttribute() kako bi dohvatila vrijednost atributa "file_path" ili "url".
   *
   * @returns Putanja aktivne datoteke.
   */
  activeFilePath(): string {
    return this.getActiveAttribute(["file_path", "url"]); // Dohvaća vrijednost atributa "file_path" ili "url" aktivnog elementa.
  }

  /**
   * Metoda za dohvaćanje URL-a za preuzimanje aktivnog sadržaja.
   * Ako postoji putanja do datoteke (file_path), vraća se putanja do aktivne datoteke.
   * Inače, vraća se URL aktivnog sadržaja.
   *
   * @returns URL za preuzimanje aktivnog sadržaja.
   */
  downloadActive(): string {
    let download_url = ""; // Inicijalno prazan URL za preuzimanje

    if (this.file_path) {
        const file_path = this.activeFilePath(); // Dohvaća putanju do aktivne datoteke
        download_url = file_path; // Postavlja putanju do aktivne datoteke kao URL za preuzimanje
    } else {
        download_url = this.activeUrl(); // Dohvaća URL aktivnog sadržaja
    }

    return download_url; // Vraća URL za preuzimanje aktivnog sadržaja
  }

  /**
   * Metoda za dohvaćanje tipa dokumenta na temelju URL-a.
   * Metoda koristi Fetch API kako bi izvršila zahtjev na zadani URL i dohvatila "content-disposition" zaglavlje odgovora.
   *
   * @param url URL dokumenta koji se dohvaća.
   * @returns Tip dokumenta dobiven iz zaglavlja "content-disposition".
   */
  fetchDocumentType(url: string): Promise<string> {
    return fetch(`/${url}`, { mode: "cors" }) // Izvršava zahtjev na URL s omogućenom CORS politikom
        .then((response) => response.headers.get("content-disposition")) // Dohvaća "content-disposition" zaglavlje odgovora
        .then((data) => data); // Vraća dobiveni tip dokumenta
  }

    /**
   * Metoda za ispisivanje datoteke.
   * Ovisno o ekstenziji datoteke, koristi se odgovarajući način ispisivanja (PDF ili slika).
   *
   * @param ext Ekstenzija datoteke koja se ispisuje ("pdf" ili neka druga ekstenzija).
   * @param file_path Putanja do datoteke koja se ispisuje.
   * @param name Naziv dokumenta koji se prikazuje prilikom ispisivanja.
   */
  printFile(ext: string, file_path: string, name: string): void {
    if (ext === "pdf") {
        printJS({ printable: `${file_path}`, type: "pdf", documentTitle: name }); // Ispisuje PDF datoteku
    } else {
        printJS({ printable: `${file_path}`, type: "image", documentTitle: name }); // Ispisuje sliku
    }
  }


  printActive(): void {
    const name = this.activeName(); // Dohvaća naziv aktivne datoteke

    if (this.file_path) {
        const file_path = this.activeFilePath(); // Dohvaća putanju do aktivne datoteke
        const index = file_path.indexOf("file");
        const realUrl = file_path.slice(index, file_path.length); // Dohvaća stvarni URL datoteke

        const ext = name.split(".").pop(); // Dohvaća ekstenziju datoteke

        if (ext === "") {
            this.fetchDocumentType(realUrl).then((res) => {
                const index = res.indexOf("filename");
                const queryStrings = res.slice(index, res.length);

                const urlParams = new URLSearchParams(queryStrings);
                const fileName = urlParams.get("filename").replace(/(['"])/g, ""); // Dohvaća ime datoteke iz zaglavlja

                const ext_ = fileName.split(".").pop(); // Dohvaća ekstenziju datoteke iz imena

                this.printFile(ext_, `/${realUrl}`, name); // Ispisuje datoteku s dobivenom ekstenzijom
            });
        } else {
            this.printFile(ext, file_path, name); // Ispisuje datoteku s postojećom ekstenzijom
        }
    } else {
        printJS({
            printable: `${this.activeUrl()}`,
            type: "image",
            documentTitle: name,
        }); // Ispisuje sliku
    }
  }

  closeSwiper() {
    this.closeSwiperEvent.emit("close"); //Emitira događaj "closeSwiperEvent" s parametrom "close"

    /**
     * Ove linije obrađuju trenutnu URL adresu pomoću objekta "window.location.href".
     * Provjerava se postoji li u URL-u dio "/blob:" ili "/file/". Ako se nalazi "/blob:" u URL-u, ažurira se URL izrezivanjem teksta od početka do tog indeksa
     * i ažurira se povijest preglednika pomoću "window.history.replaceState()".
     * Slično tome, ako se nalazi "/file/" u URL-u, ažurira se URL na sličan način
     */
    const currentUrl = window.location.href;
    const blobIndex = currentUrl.indexOf("/blob:");
    const fileIndex = currentUrl.indexOf("/file/");

    if (blobIndex !== -1) {
        const updatedUrl = currentUrl.substring(0, blobIndex);
        window.history.replaceState(null, '', updatedUrl);
    } else if (fileIndex !== -1) {
        const updatedUrl = currentUrl.substring(0, fileIndex);
        window.history.replaceState(null, '', updatedUrl);
    }

  }

  /**
   * Metoda za uklanjanje slike ili PDF datoteke iz albuma.
   * Ova metoda emitira događaj "removeImageEvent" s podacima o indeksu, albumu i tipu sadržaja koji se uklanja.
   * Ovisno o trenutnom stanju, aktivna slika ili PDF datoteka se može promijeniti.
   */
  removeImage(): void {
    let active = this.active; // Trenutno aktivna slika ili PDF datoteka
    let type = "images"; // Podrazumijevani tip sadržaja je slika
    const album = this.swiper.album; // Trenutni album
    const index = this.swiper.index; // Indeks trenutne slike ili PDF datoteke u swiperu

    // Provjerava je li trenutna slika posljednja i nije učitana sa servera
    if (this.active === this.swiper.images.length - 1 && !this.server) {
        this.active = this.active - 1; // Smanjuje indeks trenutne slike ili PDF datoteke
    }

    // Provjerava je li index valjan (različit od -1)
    if (index !== -1) {
        active = index; // Postavlja aktivnu sliku ili PDF datoteku na temelju indeksa
        type = "pdfs"; // Postavlja tip sadržaja na "pdfs" za PDF datoteke
    }

    // Emitira događaj "removeImageEvent" s podacima o uklanjanju sadržaja
    this.removeImageEvent.emit({
        index: active, // Indeks uklonjene slike ili PDF datoteke
        album: album, // Album iz kojeg se uklanja sadržaj
        type: type, // Tip sadržaja koji se uklanja ("images" za slike, "pdfs" za PDF datoteke)
    });
  }

  /**
   * Metoda za spremanje komentara.
   * Emitira događaj "updateCommentEvent" kako bi ažurirao komentar s proslijeđenim podacima.
   *
   * @param e Podaci komentara koji se sprema.
   */
  saveComment(e: any): void {
    this.updateCommentEvent.emit(e); // Emitira događaj "updateCommentEvent" s proslijeđenim podacima komentara radi ažuriranja komentara.
  }

}
