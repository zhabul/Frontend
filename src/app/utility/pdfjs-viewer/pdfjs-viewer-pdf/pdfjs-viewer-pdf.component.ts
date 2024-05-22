import { Component, ElementRef, EventEmitter, Input, OnInit, Output, SecurityContext, SimpleChanges} from '@angular/core';
import { FormControl } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';

@Component({
  selector: 'app-pdfjs-viewer-pdf',
  templateUrl: './pdfjs-viewer-pdf.component.html',
  styleUrls: ['./pdfjs-viewer-pdf.component.css']
})
export class PdfjsViewerPdfComponent implements OnInit {

  @Input() numberOfPages = 0; //Broj stranica PDF dokumenta. Početna vrijednost je postavljena na 0.
  @Input("index") index: any; //Indeks komponente.
  @Input("updateComment") updateComment: boolean; //Zastavica koja označava treba li ažurirati komentare.

  @Output() pageChanged = new EventEmitter<number>(); //Emitira događaj kada se promijeni stranica. Proslijeđuje se novi indeks stranice
  @Output() updatezoomButton = new EventEmitter<number>(); //update zoom nakon upisa vrijednosti zumiranja
  @Output() UpdateResetPdf = new EventEmitter<number>(); //update zoom nakon upisa vrijednosti zumiranja
  @Output() resetzoomButton = new EventEmitter<number>(); //resetiranje zumiranja na pocetnu vrijednost, prva vrijednost nakon ucitavanja pdf-a
  @Output() currentPageIndexChange = new EventEmitter<number>(); //Emitira događaj kada se promijeni trenutni indeks stranice. Proslijeđuje se novi indeks.
  @Output() scalePage = new EventEmitter<string>(); //Emitira događaj kada se treba promijeniti razmjera stranice. Proslijeđuje se nova razmjera
  @Output() updateCommentEvent = new EventEmitter<any>(); //Emitira događaj kada se treba ažurirati komentar. Proslijeđuje se objekt komentara.
  @Output() numberOfData = new EventEmitter<number>(); //Emitira događaj s brojem podataka. Proslijeđuje se broj podataka.
  @Output() imageDataURL = new EventEmitter<string>(); //Emitira događaj s URL-om slike.


  name: any; //Varijabla koja predstavlja ime.
  currentPage = 1; //Trenutna stranica, početna vrijednost je 1.
  pdfState: number = -1; //Stanje PDF dokumenta, početna vrijednost je -1.
  totalPages = 0; //Ukupan broj stranica PDF dokumenta, početna vrijednost je 0.
  pdfUrl: any = ''; //URL PDF dokumenta.
  previousScaleInput: number = 0; //Prethodna vrijednost unosa za skaliranje.
  comment = new FormControl(""); // Form kontrola za unos komentara.
  active: number = -1; //Aktivna stranica, početna vrijednost je -1.
  zoomTtranslate = "translate(0px, 0px) scale(1)"; //Transformacija za zumiranje i pomak platna.
  translateX = "translate(0px, 0px) scale(1)"; //Transformacija za pomak platna.
  rotate = 0; //Rotacija stranice, početna vrijednost je 0.
  zoom = 1; //Razina zumiranja, početna vrijednost je 1.
  scaleinput = 0; //Unos za skaliranje, početna vrijednost je 0.
  move = false; //Zastavica koja označava da li se vrši pomicanje.
  zoomFromParent = 0; //Vrijednost zumiranja koja se dobiva iz nadređene komponente.
  commentOpen = false; //Zastavica koja označava je li otvoren komentar.
  commentEdit = false; //Zastavica koja označava je li u tijeku uređivanje komentara.
  PDFNotAvaliable: string; //Poruka koja se prikazuje kada PDF nije dostupan.
  pdfUnavailable: boolean = false; //Boolean vrijednost koaj se provjerava da li je rendiranje PDF-a u tijeku

  public loading: boolean = false; //Zastavica koja označava je li učitavanje u tijeku.
  public renderTask: pdfjsLib.RenderTask | null = null; // Trenutni zadatak rendiranja PDF-a.
  public spinner = true; //Zastavica koja označava prikazivanje prijelaznog ikona (spinnera).

  private _pageIndex: number;
  // private _zoomButton: number;

  public pdf = {
      id: -1
  };

  @Input("filepdf") set setImage(value) {
      if (this.pdf !== value) {
          this.pdf = value;
          this.pdfState = -1;
          this.refreshPDF();
      }
  };

  @Input("active") set setActive(value) {
      if (this.active !== value) {
          this.spinner = true;
          this.active = value;
          // this.setXTranslation();
      }
  };

  @Input() set rotation(value: any) {
    this.rotateBy(value);
  }

  @Input() zoomButton :string;

  @Input() ResetPdf: string;

  @Input() set zoomScale(value: any) {
    this.zoomScales(value);
  }

  @Input() set pageIndex(value: number) {
    if (this._pageIndex !== value) {
      this._pageIndex = value;
      // Izvršite akcije koje želite izvršiti kada se promijeni pageIndex
      this.cancelRenderTask();
      this.renderPdf(this.rotate, this.zoom, this.scaleinput);
    }
  }


  constructor(public sanitizer: DomSanitizer, private elementRef: ElementRef, private translate: TranslateService) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.6.172/build/pdf.worker.js';
    // pdfjsLib.GlobalWorkerOptions.workerSrc = 'WEMAX/fortend-dev/node_modules/pdfjs-dist/legacy/build/pdf.worker.js';
  }


  ngOnInit() {
    //this.refreshPDF(); // Osvježava sliku
    this.PDFNotAvaliable = this.translate.instant('PDF file not available.'); // Postavlja poruku "PDF file not available." na temelju trenutnog jezika kada datoteka nije dostupna
  }

  ngAfterViewInit() {
    const canvasEl = this.elementRef.nativeElement.querySelector('#pdf-canvas') as HTMLCanvasElement; // Pronalazi canvas element u DOM-u pomoću selektora '#pdf-canvas'

    // Provjerava postojanje canvas elementa
    if (canvasEl) {
      this.cancelRenderTask(); // Prekida prethodni render zadatak
      this.renderPdf(this.rotate, this.zoom, this.scaleinput);// Renderira PDF na canvas uz zadane vrijednosti rotacije, zumiranja i skale
    } else {
      //console.log('Canvas element nije pronađen.'); // Ispisuje poruku u konzoli ako canvas element nije pronađen
    }
  }


  ngOnChanges(changes: SimpleChanges) {
    this.pageIndex;
    this.cancelRenderTask();

    if (changes.ResetPdf && changes.ResetPdf.currentValue !== 'update' && changes.ResetPdf.currentValue !== undefined) {
      const newValue = changes.ResetPdf.currentValue;
      this.ResetPdfOnInitialScaleRotateZoom(newValue);
    }

    //this.renderPdf(this.rotate, this.zoom, this.scaleinput);
    if (changes.zoomButton && changes.zoomButton.currentValue !== undefined) {
      this.zoomButtons(this.zoomButton);
    }
  }

  ngOnDestroy(){
    this.destroyPdfContent();

    if (this.pdfDocument) {
      for (let pageNum = 1; pageNum <= this.totalPages; pageNum++) {
        this.pdfDocument.getPage(pageNum).then((page) => {
          page.cleanup(); // Oslobodi resurse stranice
        });
      }
      this.pdfDocument.cleanup(); // Oslobodi resurse PDF-a
      this.pdfDocument = null;
    }
  }

  private pdfDocument: any; // Referenca na PDF dokument

  destroyPdfContent() {
    const canvasEl = document.getElementById('pdf-canvas') as HTMLCanvasElement;
    const container = document.getElementById('pdf-container');

    if (canvasEl) {
      const context = canvasEl.getContext('2d');
      if (context) {
        context.clearRect(0, 0, canvasEl.width, canvasEl.height);
      }
    }

    if (container) {
      container.scrollTop = 0;
      container.scrollLeft = 0;
    }

  }

  /**
 * Metoda renderPdf() izvršava proces renderiranja PDF-a na canvas elementu.
 * Prima parametre za rotaciju (rotate), zum (zoom) i skaliranje ulaza (scaleinput).
 * Postavlja atribut "loading" na true prije početka renderiranja.
 * Metoda koristi PDF.js biblioteku za dohvaćanje PDF-a i prikazivanje na canvas elementu.
 * Na kraju postavlja odgovarajuće vrijednosti atributa "loading" i "pdfState".
 *
 * Prva sekcija funkcije služi za prilagodbu širine i visine platna (canvas elementa) na temelju veličine prikaza stranice PDF-a. Ovdje se također koristi skaliranje kako bi se postigla odgovarajuća razlučivost.
 * Zatim slijedi dio funkcije koji obavlja renderiranje stranice PDF-a na platno. Uzima se u obzir trenutno skaliranje, rotacija i razlučivost.
 * Nakon renderiranja stranice, provjerava se je li aktivna animacija zumiranja. Ako je, prekida se izvršavanje jer se ne može izvoditi više od jedne animacije zumiranja istovremeno.
 * Sljedeći dio funkcije obrađuje događaj zumiranja kotačićem miša (wheel event). U ovom dijelu se određuje osjetljivost zumiranja, nova razina zumiranja i točka oko koje se vrši zumiranje.
 * Nakon toga slijedi animacija zumiranja koja glatko mijenja razinu zumiranja tijekom određenog vremenskog razdoblja. Ovisno o potrebama, moguće je primijeniti funkciju animacijskog ublažavanja (easing) kako bi se postigao glatkiji prijelaz.
 * Konačno, kada se animacija zumiranja dovrši, funkcija prekida izvršavanje renderiranja stranice PDF-a i ponovno pokreće funkciju za renderiranje s ažuriranim postavkama zumiranja.
 * Ova funkcija omogućuje korisniku da zumira PDF dokument pomoću kotačića miša. Ona također podržava animaciju zumiranja i prilagodbu veličine prikaza stranice PDF-a na temelju razlučivosti i skaliranja, zumiranje također određuje
 * na osnovu velicine dokumenta(MB) i formata dokumenta(A4, A3, ...).
 * Funkcija sadrži progress bar koji se računa na temelju trenutnog vremena i početka animacije, i završava kada se fajl rendira.
 *
 * @param rotate - Broj koji predstavlja kut rotacije PDF-a.
 * @param zoom - Broj koji predstavlja faktor zumiranja PDF-a.
 * @param scaleinput - Broj koji predstavlja skaliranje ulaza.
 */

  isScrolling: boolean = false;
  initialScale;
  zoomLevels = [0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4, 5, 7.5, 9, 11, 13, 15]; // Zoom levels
  renderPdf(rotate: number, zoom: number, scaleinput: number): void {

  this.loading = true;

  // Uništavanje sadržaja prethodne komponente
  this.destroyPdfContent();

  // Uništavanje prethodnog PDF-a
  if (this.pdfDocument) {
    this.pdfDocument.destroy();
    this.pdfDocument = null;
  }

    let fileSizeInMegabytes: number; // Velicina fajla

    const progressBar = document.getElementById('progress-bar') as HTMLDivElement;
    const animationDuration = 200; // Trajanje animacije u milisekundama

    let animationStart: number;
    let animationFrameId: number;

    // Funkcija za animiranje indikatora napretka
    const animateProgressBar = () => {
      const currentTime = performance.now();
      const elapsed = currentTime - animationStart;
      const progress = elapsed / animationDuration;

      if (progress < 1) {
        progressBar.style.width = `${progress * 100}%`;
        animationFrameId = requestAnimationFrame(animateProgressBar);
      } else {
        if (!this.loading) {
          progressBar.style.width = '100%';
        }
        cancelAnimationFrame(animationFrameId);
      }
    };

    // Funkcija za zaustavljanje animacije indikatora napretka
    function stopProgressBarAnimation() {
      cancelAnimationFrame(animationFrameId);
    }

    // Postavite početno stanje indikatora napretka
    progressBar.style.width = '0%';

    this.pdfState = 1;

    let currentResolution = 72; //razlucivost na pocetku prikaza

    //const MAX_ZOOM = 15; // maksimalni zoom
    //const MIN_ZOOM = 0.25; // minimalni zoom

    const pdfUrl = this.getUrl1().toString();

    const canvasEl = document.getElementById('pdf-canvas') as HTMLCanvasElement;
    var container = document.getElementById('pdf-container');

    if (canvasEl) {

      pdfjsLib.getDocument({ url: pdfUrl, disableAutoFetch:true, disableStream:true}).promise.then(async (pdf) => {

        this.totalPages = pdf.numPages;
        this.numberOfData.emit(this.totalPages);

        //Velicina dokumenta
        pdf.getDownloadInfo()
        .then((info) => {
          const fileSizeInBytes = info.length;
          fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);
        })
        .catch((error) => {
          //console.log('Greška pri dohvaćanju informacija o preuzimanju:', error);
        });
        //end

        // Dodijeli referencu PDF viewer-a kako bi je mogli koristiti u ngOnDestroy()
        this.pdfDocument = pdf;

        // Dodaj slušača događaja "pagesloaded"
        pdf.getPage(this._pageIndex).then((page) => {

          let startX = 0;
          let startY = 0;

          const containerWidth = container.clientWidth; //širina kontenjera gdje se prikaziva canvas element
          const containerHeight = container.clientHeight; //visina kontenjera gdje se prikaziva canvas element

          const viewport = page.getViewport({ scale: 1, rotation: rotate }); // vidljivo područje dokumenta

          const documentWidth = viewport.width; //širina canvas elementa
          const documentHeight = viewport.height; //visina canvas dokumenta

          if (scaleinput > 0) {
            if (scaleinput !== this.previousScaleInput && zoom > 1) {
              zoom = 1; // Postavi zoom na 1 samo ako se promijenio scaleinput i zoom je veći od 1
              this.updatezoomButton.emit(zoom = 0);
              this.previousScaleInput = scaleinput; // Ažuriraj prethodnu vrijednost scaleinput
              this.initialScale = scaleinput * zoom;
            } else {
              this.previousScaleInput = scaleinput; // Ažuriraj prethodnu vrijednost scaleinput
              this.initialScale = scaleinput;
            }
          } else if (scaleinput === 0) {
            this.initialScale = Math.min(containerWidth / documentWidth, containerHeight / documentHeight); // scale podesen na osnovu širine i visine dokumenta
            this.resetzoomButton.emit(this.initialScale);
          }

          const loadCanvasStyles = async () => {
            let scale: number;
            scale = this.initialScale * zoom * currentResolution / 72; // Prilagodba skaliranja na temelju razlučivosti
            this.scalePage.emit(scale.toString());

            const viewport = page.getViewport({ scale: scale, rotation: rotate });

            const outputScale = window.devicePixelRatio || 1;

            canvasEl.width = Math.floor(viewport.width * outputScale);
            canvasEl.height = Math.floor(viewport.height * outputScale);
            canvasEl.style.width = Math.floor(viewport.width) + 'px';
            canvasEl.style.height = Math.floor(viewport.height) + 'px';

            const transform = new DOMMatrix();
            transform.a = outputScale;
            transform.d = outputScale;

            const context = canvasEl.getContext('2d');
            context?.setTransform(transform);
            context?.clearRect(0, 0, canvasEl.width, canvasEl.height);

            const renderPage = async () => {
              if (this.renderTask && !this.renderTask._internalRenderTask) {
                this.renderTask.cancel();
              }
              this.renderTask = page.render(renderContext);
              // Pokrenite animaciju indikatora napretka
              this.loading = true; // Uključite spinner prije početka rendiranja
              animationStart = performance.now();
              animateProgressBar();
            };

            const renderPageIfNeeded = async () => {
              if (this.renderTask && !this.renderTask._internalRenderTask) {
                await new Promise((resolve) => requestAnimationFrame(resolve));
              }
              console.error = () => {}; // Ignoriranje errora RenderingCancelledException: Rendering cancelled pdfjs

              const offsetX = startX - container.offsetLeft;
              const offsetY = startY - container.offsetTop;

              const offsetXPercentage = offsetX / container.clientWidth;
              const offsetYPercentage = offsetY / container.clientHeight;

              renderPage();

              renderPage();


              if (this.renderTask) {
                await this.renderTask.promise;
                this.loading = false; // Isključite spinner nakon završetka rendiranja
                stopProgressBarAnimation();
                page.cleanup(); // Oslobodi resurse stranice
                pdf.cleanup(); // Oslobodi resurse PDF-a

                if (!this.loading) {
                  progressBar.style.width = '100%';
                  setTimeout(() => {
                    progressBar.style.width = '0%';
                  }, 500); // Skrivanje nakon pola sekunde
                }
              }

              container.scrollLeft = offsetXPercentage * container.scrollWidth - offsetX;
              container.scrollTop = offsetYPercentage * container.scrollHeight - offsetY;

            };

            const renderContext = {
              canvasContext: context,
              viewport: viewport,
            };

            if (pdf._transport._readyCapability) {
              pdf._transport._readyCapability.promise.then(renderPageIfNeeded);
            } else {
              renderPageIfNeeded();
            }

          };

          if (pdf._transport._readyCapability) {
            pdf._transport._readyCapability.promise.then(loadCanvasStyles);
          } else {
            loadCanvasStyles();
          }

        //Format dokumenta za uzimanje drugog nacina zumiranja
        const formatA1 = { width: 2383, height: 1682 }; // Dimenzije formata A1 u pikselima
        const formatA2 = { width: 1682, height: 1190 }; // Dimenzije formata A2 u pikselima
        const formatA3 = { width: 1190, height: 842 }; // Dimenzije formata A3 u pikselima
        const formatA4 = { width: 595, height: 842 }; // Dimenzije formata A4 u pikselima
        const formatLetter = { width: 612, height: 792 }; // Dimenzije formata Letter u pikselima

        const formatThreshold = 10; // Prag za određivanje najbližeg formata

        function getClosestFormat(width, height, rotate) {
          let rotatedWidth = width;
          let rotatedHeight = height;

          // Ako je dokument rotiran, zamijeni dimenzije
          if (rotate % 180 !== 0) {
            rotatedWidth = height;
            rotatedHeight = width;
          }

          const distances = {
            A1: Math.abs(rotatedWidth - formatA1.width) + Math.abs(rotatedHeight - formatA1.height),
            A2: Math.abs(rotatedWidth - formatA2.width) + Math.abs(rotatedHeight - formatA2.height),
            A3: Math.abs(rotatedWidth - formatA3.width) + Math.abs(rotatedHeight - formatA3.height),
            A4: Math.abs(rotatedWidth - formatA4.width) + Math.abs(rotatedHeight - formatA4.height),
            Letter: Math.abs(rotatedWidth - formatLetter.width) + Math.abs(rotatedHeight - formatLetter.height),
          };

          let closestFormat = null;
          let minDistance = Infinity;

          for (const format in distances) {
            if (distances[format] < minDistance && distances[format] <= formatThreshold) {
              closestFormat = format;
              minDistance = distances[format];
            }
          }
          return closestFormat;
        }

        const closestFormat = getClosestFormat(documentWidth, documentHeight, rotate);
        //end

          //Whell zoom and ctrl+whell zoom
        if (((closestFormat === 'A4' &&  fileSizeInMegabytes < 1 ) || (documentWidth < formatA4.width && documentHeight < formatA4.height) || (documentWidth < formatA4.height && documentHeight < formatA4.width))) {
            const debounce = (func, delay) => {
              let timerId;

              return (...args) => {
                if (timerId) {
                  clearTimeout(timerId);
                }

                timerId = setTimeout(() => {
                  func.apply(null, args);
                  timerId = null;
                }, delay);
              };
            };


            const handleScroll = (event) => {
              if (!event.ctrlKey) {
                event.preventDefault();
                event.stopPropagation();
              }
            };

            // function calculateExponentialZoomStep(currentZoom: number): number {
            //   const baseStep = 0.0001; // Osnovni korak
            //   const exponentialRate = 0.0001; // Stopa eksponencijalnog rasta
            //   return baseStep + Math.pow(1.1, exponentialRate * currentZoom);
            // }

            const handleWheel = debounce((event) => {
              event.preventDefault();
              const delta = Math.sign(event.deltaY);
              let newZoom = zoom;

              // Pronađi trenutni indeks razine zuma
              const currentZoomIndex = this.zoomLevels.indexOf(newZoom);

              // Ako trenutni zoom nije u popisu, postavi na najbliži
              if (currentZoomIndex === -1) {
                newZoom = this.findClosestZoom(newZoom);
              }

              // Pomakni indeks prema gore ili dolje ovisno o smjeru kotača
              const newIndex = currentZoomIndex - delta;

              // Postavi novi zoom na temelju indeksa i provjeri granice
              newZoom = this.zoomLevels[Math.max(0, Math.min(newIndex, this.zoomLevels.length - 1))];

              zoom = newZoom;
              loadCanvasStyles();
            }, 200); // Podesite željeni vremenski interval ovdje

            container?.addEventListener('wheel', handleScroll, { passive: false });
            container?.addEventListener('wheel', handleWheel);

        }else{

          const debounce = (func, delay) => {
            let timerId;

            return (...args) => {
              if (timerId) {
                clearTimeout(timerId);
              }

              timerId = setTimeout(() => {
                func.apply(null, args);
                timerId = null;
              }, delay);
            };
          };


          const handleScroll = (event) => {
            if (!event.ctrlKey) {
              event.preventDefault();
              event.stopPropagation();
            }
          };

          const handleWheel = debounce((event) => {
            event.preventDefault();
            const delta = Math.sign(event.deltaY);
            let newZoom = zoom;

            // Pronađi trenutni indeks razine zuma
            const currentZoomIndex = this.zoomLevels.indexOf(newZoom);

            // Ako trenutni zoom nije u popisu, postavi na najbliži
            if (currentZoomIndex === -1) {
              newZoom = this.findClosestZoom(newZoom);
            }

            // Pomakni indeks prema gore ili dolje ovisno o smjeru kotača
            const newIndex = currentZoomIndex - delta;

            // Postavi novi zoom na temelju indeksa i provjeri granice
            newZoom = this.zoomLevels[Math.max(0, Math.min(newIndex, this.zoomLevels.length - 1))];

            zoom = newZoom;
            loadCanvasStyles();
          }, 200); // Podesite željeni vremenski interval ovdje

          container?.addEventListener('wheel', handleScroll, { passive: false });
          container?.addEventListener('wheel', handleWheel);

        //   let zoomAnimationInProgress = false;
        //   let zoomAnimationRequestId = null;

        //   console.log('Current Zoom:', zoom);
        //   let newZoom = zoom;

        //   canvasEl.onwheel = (event) => {
        //     event.preventDefault();

        //     if (zoomAnimationInProgress) {
        //       cancelAnimationFrame(zoomAnimationRequestId);
        //       zoomAnimationInProgress = false;
        //     }

        //     const delta = Math.max(-1, Math.min(1, event.deltaY || -event.detail));
        //     const boundingRect = canvasEl.getBoundingClientRect();
        //     const mouseX = event.clientX - boundingRect.left;
        //     const mouseY = event.clientY - boundingRect.top;

        //     const pivotX = mouseX / boundingRect.width;
        //     const pivotY = mouseY / boundingRect.height;

        //     // Pronađi trenutni indeks razine zuma
        //     const currentZoomIndex = this.zoomLevels.indexOf(newZoom);

        //     // Ako trenutni zoom nije u popisu, postavi na najbliži
        //     if (currentZoomIndex === -1) {
        //       newZoom = this.findClosestZoom(newZoom);
        //     }

        //     // Pomakni indeks prema gore ili dolje ovisno o smjeru kotača
        //     const newIndex = currentZoomIndex - delta;

        //     // Postavi novi zoom na temelju indeksa i provjeri granice
        //     newZoom = this.zoomLevels[Math.max(0, Math.min(newIndex, this.zoomLevels.length - 1))];

        //     console.log('Current Zoom:', newZoom);

        //     const newMouseX = boundingRect.width * pivotX;
        //     const newMouseY = boundingRect.height * pivotY;

        //     const zoomAnimation = (timestamp) => {
        //       const progress = Math.min(1, (timestamp - startTimestamp) / 200);
        //       easeOutQuad(progress);

        //       const updatedZoom = newZoom;

        //       container.scrollLeft += (newMouseX - mouseX) * (zoom - updatedZoom);
        //       container.scrollTop += (newMouseY - mouseY) * (zoom - updatedZoom);

        //       if (progress < 1) {
        //         zoomAnimationRequestId = requestAnimationFrame(zoomAnimation);
        //       } else {
        //         zoomAnimationInProgress = false;
        //         zoomAnimationRequestId = null;
        //         this.cancelRenderTask();
        //         this.renderPdf(rotate, updatedZoom, scaleinput);
        //       }
        //     };

        //     const startTimestamp = performance.now();
        //     zoomAnimationInProgress = true;
        //     zoomAnimationRequestId = requestAnimationFrame(zoomAnimation);
        //   };
        };

          //Funkcija za animacijsko ublažavanje (easing)
          // function easeOutQuad(t) {
          //   return t * (2 - t);
          // }
          //end

          //Mouse event pomjeranje
          canvasEl.onmousedown = (event) => {
             //event.preventDefault();
            startX = event.clientX;
            startY = event.clientY;
            const containerStartScrollLeft = container.scrollLeft;
            const containerStartScrollTop = container.scrollTop;

            const handleMouseMove = (event) => {
              const deltaX = event.clientX - startX;
              const deltaY = event.clientY - startY;

              container.scrollLeft = containerStartScrollLeft - deltaX;
              container.scrollTop = containerStartScrollTop - deltaY;
            };

            const handleMouseUp = () => {
              document.removeEventListener('mousemove', handleMouseMove);
              document.removeEventListener('mouseup', handleMouseUp);
            };

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
          };
          //End


        });
      }, function(greska) {
        //  console.log('Error: ' + greska.message);
        this.pdfUnavailable = true;
        this.loading = false;
      }.bind(this));
    } else {
      // console.log('Canvas element nije pronađen.');
    }
  }

  /**
   * Prekida trenutni zadani render zadatak, ako postoji.
   * Ako je zadani render zadatak aktivan, on se prekida.
   * Ako se dogodi iznimka prilikom prekida zadatka rendiranja, prikazuje se poruka o grešci i može se dodati dodatni kod za rukovanje greškom.
   */
  cancelRenderTask(): void {
    if (this.renderTask) {
      try {
        // Prekida zadani render zadatak
        this.renderTask.cancel();
      } catch (error) {
        //console.log("Uhvaćena iznimka pri prekidu zadatka rendiranja:", error);
        // Ovdje možete dodati svoj kod za rukovanje greškom prilikom prekida zadatka rendiranja
      }
      this.renderTask = null;
    }
  }

  findClosestZoom(currentZoom: number): number {
    // Pronađi najbližu razinu zuma
    return this.zoomLevels.reduce((closest, level) => {
      return Math.abs(level - currentZoom) < Math.abs(closest - currentZoom) ? level : closest;
    }, this.zoomLevels[0]);
  }

  /**
   * Metoda koja se poziva kada se promijeni indeks trenutne stranice.
   * Postavlja vrijednost trenutne stranice na novi indeks i emitira događaj o promjeni indeksa trenutne stranice.
   * @param newIndex Novi indeks trenutne stranice.
   */
  onPageIndexChange(newIndex: number): void {
    this.currentPage = newIndex;
    this.currentPageIndexChange.emit(this.currentPage);
  }

  /**
   * Metoda koja se poziva kada se pritisne gumb za prethodnu stranicu.
   * Ako je trenutna stranica veća od 1, smanjuje vrijednost trenutne stranice za 1 i emitira događaj o promjeni stranice.
   */
  onPrevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.pageChanged.emit(this.currentPage);// Emitiranje događaja o promjeni stranice
    }
  }

  /**
   * Metoda koja se poziva kada se pritisne gumb za sljedeću stranicu.
   * Ako je trenutna stranica manja od ukupnog broja stranica, povećava vrijednost trenutne stranice za 1 i emitira događaj o promjeni stranice.
   */
  onNextPage(): void {
    if (this.currentPage < this.numberOfPages) {
      this.currentPage++;
      this.pageChanged.emit(this.currentPage);// Emitiranje događaja o promjeni stranice
    }
  }

  /**
   * Metoda koja osvježava prikaz slike.
   * Postavlja novu vrijednost URL-a PDF-a i ažurira opis slike.
   */
  refreshPDF(): void {
    this.pdfUrl = this.getUrl1();
    this.comment.patchValue(this.getDescription());
  }

  /**
   * Metoda koja vraća opis aktivog PDF-a.
   * Opis se traži iz aktivnog atributa koji može biti "description" ili "Description".
   * @returns Opis aktivnog PDF-a.
   */
  getDescription(): string {
    return this.getActiveAttribute(["description", "Description"]);
  }

  /**
 * Metoda getUrl1() generira URL za prikaz aktivne slike.
 * URL se dohvaća iz aktivnog atributa koji može biti "Url", "url", "file_path" ili "file".
 * @returns Generirani URL kao siguran URL objekt.
 */
  public getUrl1(): SafeUrl {
    const url = this.getActiveAttribute(['Url', 'url', 'file_path', 'file']); // Dohvaćanje aktivnog atributa koji sadrži URL

    const currentUrl = window.location.href;  // Dobivanje trenutnog URL-a stranice
    const newPart = '/' + url;

    // Provjera je li URL već sadržan u trenutnom URL-u stranice
    if (!currentUrl.includes(newPart)) {
      const updatedUrl = currentUrl + '/' + url;

      // Ažuriranje URL-a stranice i prikazivanje novog URL-a bez ponovnog učitavanja stranice
      if (!url.startsWith('blob:')) {
        window.history.pushState(null, '', updatedUrl);
      }
    }

    // Provjera je li URL u formatu "blob"
    if (url.startsWith('blob:')) {
      this.sanitizer.bypassSecurityTrustResourceUrl(url); // Bypassing sigurnosne provjere za URL u formatu "blob"
      return url;
    }

    // Sanitizacija URL-a i vraćanje sigurnog URL objekta
    return this.sanitizer.sanitize(SecurityContext.URL, url);
  }

  /**
   * Metoda getActiveAttribute(names) dohvaća vrijednost aktivnog atributa iz objekta pdf.
   * Prolazi kroz niz naziva atributa i traži prvi dostupni atribut u objektu pdf.
   * @param names - Niz naziva atributa koji se provjeravaju.
   * @returns Vrijednost prvog dostupnog atributa ili prazan string ako nijedan atribut nije pronađen.
   */
  getActiveAttribute(names: string[]): string {
    const pdf = this.pdf;
    let name = "";

    // Prolazak kroz niz naziva atributa i traženje prvog dostupnog atributa u objektu pdf
    for (let i = 0; i < names.length; i++) {
      const key = names[i];

      // Provjera postojanja atributa u objektu pdf
      if (pdf[key]) {
        name = pdf[key];
        break;
      }
    }

    return name;
  }

  /**
 * Metoda zoomButtons(s) postavlja vrijednost za uvećavanje/umanjivanje prikaza PDF-a na temelju parametra s.
 * Izračunava vrijednost za uvećanje/umanjivanje na temelju dobivenog parametra s i sprema je u varijablu zoom.
 * @param s - Vrijednost za uvećavanje/umanjivanje prikaza PDF-a.
 */
  zoomButtons(zoomButton: string): void {
    const currentIndex = this.zoomLevels.indexOf(this.zoom);
    const delta = zoomButton === 'decrease' ? -1 : zoomButton === 'increase' ? 1 : 0;

    const newIndex = currentIndex + delta;
    this.zoom = this.zoomLevels[Math.max(0, Math.min(newIndex, this.zoomLevels.length - 1))];

    this.updatezoomButton.emit(this.zoom);
    this.renderPdf(this.rotate, this.zoom, this.scaleinput);
  }

  /**
 * Metoda zoomScales(ss) postavlja vrijednost za skaliranje prikaza PDF-a na temelju parametra ss.
 * Izračunava vrijednost za skaliranje na temelju dobivenog parametra ss i sprema je u varijablu scaleinput.
 * @param ss - Vrijednost za skaliranje prikaza PDF-a.
 */
  zoomScales(ss: number): void {
    // Izračunavanje vrijednosti za skaliranje na temelju parametra ss
    this.scaleinput = ss / 100;
  }

  /**
   * Metoda rotateBy(deg) rotira prikaz PDF-a za zadanu vrijednost kuta deg.
   * Postavlja vrijednost rotacije na temelju dobivenog parametra deg.
   * @param deg - Vrijednost kuta za rotaciju prikaza PDF-a.
   */
  rotateBy(deg: number): void {
    this.rotate = +deg;
    this.renderPdf(this.rotate, this.zoom, this.scaleinput);
  }

  /**
   * Metoda ResetPdfOnInitialScaleRotateZoom(reset) resetira pdf na button s parenta an defaltnu vrijednost
   * @param reset - Vrijednost stringa i uvijek je reset
   */

  ResetPdfOnInitialScaleRotateZoom(reset: string): void{
    if(reset == 'reset'){
      this.renderPdf(0, 1, 0);
      this.UpdateResetPdf.emit();
    }
  }

  /**
   * Metoda toggleCommentOpen() prebacuje stanje otvorenosti komentara.
   * Postavlja vrijednost this.commentOpen na suprotnu vrijednost trenutnog stanja,
   * a this.commentEdit postavlja na false.
   */
  toggleCommentOpen(): void {
    this.commentEdit = false;
    this.commentOpen = !this.commentOpen;
  }

  /**
   * Metoda toggleCommentEdit() prebacuje stanje uređivanja komentara.
   * Postavlja vrijednost this.commentEdit na suprotnu vrijednost trenutnog stanja,
   * a this.commentOpen postavlja na false.
   */
  toggleCommentEdit(): void {
    this.commentOpen = false;
    this.commentEdit = !this.commentEdit;
  }

  /**
   * Metoda saveComment() sprema komentar ako je izmijenjen.
   * Ako trenutna vrijednost komentara this.comment.value nije jednaka aktivnom atributu
   * 'description' ili 'Description', emitira se događaj updateCommentEvent s objektom
   * koji sadrži ID PDF-a i novi komentar.
   */
  saveComment(): void {
    if (this.comment.value !== this.getActiveAttribute(["description", "Description"])) {
      this.updateCommentEvent.emit({
        id: this.pdf.id,
        comment: this.comment.value,
      });
    }
  }

  /**
 * Metoda isPdf() provjerava je li trenutni PDF datoteka.
 * Provjerava ekstenziju naziva datoteke u atributu 'name' PDF-a i tipu type.
 * Ako je ekstenzija 'pdf' i stanje PDF-a (this.pdfState) je -1, metoda prekida
 * prethodni zadatak rendiranja, a zatim ponovno pokreće rendiranje PDF-a s
 * definiranim rotacijom, zumom i skaliranjem.
 * Vraća true ako je PDF datoteka, inače vraća false.
 */
  isPdf(): boolean {

    if (this.pdf['type'] || this.pdf['name'].endsWith('Pdf') || this.pdf['name'].endsWith('pdf')) {
      if (this.pdfState === -1) {
        this.cancelRenderTask();
        this.renderPdf(this.rotate, this.zoom, this.scaleinput);
      }
      return true;
    }
    return false;
  }

  // Funkcija koja se poziva nakon uspješnog učitavanja PDF-a
  pdfLoaded(): void {
  this.pdfState = 1;
  }

  // Funkcija koja se poziva tijekom učitavanja PDF-a
  pdfLoading(): void {
  this.pdfState = 0;
  }

  // Funkcija koja se poziva u slučaju greške prilikom učitavanja PDF-a
  pdfError(): void {
  this.pdfState = -1;
  }

}


