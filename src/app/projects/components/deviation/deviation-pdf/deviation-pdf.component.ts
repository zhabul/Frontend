import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import * as moment from "moment";
import { Subject, debounceTime } from "rxjs";

declare var $: any;

@Component({
  selector: "app-deviation-pdf",
  templateUrl: "./deviation-pdf.component.html",
  styleUrls: ["./deviation-pdf.component.css"],
})
export class DeviationPdfComponent implements OnInit {
  @Input() formValues;
  @Input() project;
  @Input() files;
  @Input() type;
  @Input("clientResponses") clientResponses;
  @Input("internalDeviationChat") internalDeviationChat;
  @Input("mainContact") mainContact;
  @Input() generalImage;
  @Input() uploadedFiles = [];
  @Input() nextDeviationNumber;
  @Input() selectedDeviation = 0;
  @Output() runParentFunction = new EventEmitter<any>();
  @Output() totalPage = new EventEmitter<number>();

  private pageSubject = new Subject();

  public DeviationTypes = [];
  public userDetails;
  public language = "en";
  public week = "Week";
  public generals;
  public deviationDeclined = false;
  public showDescription = false;
  public desc = [];
  public res = [];
  public stat = [];
  public sugg = [];
  public lang: any;
  public scrollHeight;
  public pageTotal;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.language = sessionStorage.getItem("lang");
    this.week = this.language === "en" ? "Week" : "Vecka";
    this.userDetails = JSON.parse(sessionStorage.getItem("userDetails"));

    this.generals = this.route.snapshot.data["generals"];
    this.DeviationTypes = this.route.snapshot.data["type_deviations"];
    this.isDeviationDeclined();
    this.responseHasContent();
    this.generateGeneralsKeys();
    this.lang = sessionStorage.getItem("lang");
    this.subToPage();
  }

  subToPage() {
    this.pageSubject.pipe(debounceTime(1000)).subscribe(() => {
      this.resetContainerWithTimeout();
    });
  }

  resetContainerWithTimeout() {
    this.showContainer = false;
    setTimeout(() => {
      this.showContainer = true;
      this.addHeaderToHtmlContent();
      this.filterDuplicates();
    }, 10);
  }

  unsubFromPage() {
    if (this.pageSubject) {
      this.pageSubject.unsubscribe();
    }
  }

  splitData(str: string) {
    if (!str) {
      return [];
    }

    var temparray = str.split("");
    var row = "";
    var spliteDateArray = [];

    for (let index = 0; index < temparray.length; index++) {
      const element = temparray[index];
      row += element;
      if (element == "\n") {
        spliteDateArray.push(row);
        row = "";
      }
      if (row.length >= 108) {
        while (temparray[index] != "\n" && temparray[index] != " ") {
          row = row.slice(0, -1);
          index--;
        }
        spliteDateArray.push(row);
        row = "";
      }
    }
    if (row != "") spliteDateArray.push(row);
    return spliteDateArray;
  }

  getDescription() {
    var spliteDescritpionArray = [];
    spliteDescritpionArray = this.splitData(this.formValues.Description);
    this.desc = spliteDescritpionArray;
  }

  getReason() {
    var spliteReasonArray = [];
    spliteReasonArray = this.splitData(this.formValues.Reason);
    this.res = spliteReasonArray;
  }
  getState() {
    var spliteStateArray = [];
    spliteStateArray = this.splitData(this.formValues.State);
    this.stat = spliteStateArray;
  }

  getSuggestion() {
    var spliteSuggestionArray = [];
    spliteSuggestionArray = this.splitData(this.formValues.Suggestion);
    this.sugg = spliteSuggestionArray;
  }

  public showContainer = true;
  runResetContainer() {
    this.pageSubject.next(true);
  }

  addHeaderToHtmlContent() {
    if ($("#heightemailbox").outerHeight() <= 300) {
      $("#prefooterbox").css({ height: "auto" });
    }

    $(document).ready(function () {
      var total_height = 0;
      var headerheight = $("#allforheader").outerHeight() - 22;
      /* var footerheight = $("#forfooter").outerHeight(); */
      var maxHeight = 1086 - 22;
      let numpage = 1;
      $(".row-break").each(function (index) {
        var eachRowHeight = $(this).height();
        total_height += eachRowHeight;
        if (total_height >= maxHeight) {
          numpage++;
          $(this).before('<hr class="hr" />');
          let str = document.getElementById("forfooter").outerHTML;
          let str0 = document.getElementById("allforheader").outerHTML;
          /*  let newstr = str.replace(/\s\d+\//, " " + numpage + "/"); */
          let newstr1 = str0.replace(/\s\d\s/, " " + numpage + " ");
          $(this).before(str);
          $(this).before(
            '<div style="padding-top: 25px !important; background-color: #F6ECDD;position: relative;width:105.8%;left: -21px;"></div>'
          );
          $(this).before('<div style="padding-top:40px"></div>');
          total_height = total_height + headerheight + 40;
          $(this).before(newstr1);
          maxHeight += 1086;
        }
      });

      let emptylast = Math.ceil(total_height / 1086) * 1086 - total_height - 65; //(foterheight=65);
      let s = '<div style="height:' + emptylast + 'px"></div>';
      if ($(".footer").length) {
        $(".footer").before(s);
      } else {
        $(".footer-text").before(s);
      }
    });
  }
  ngAfterViewInit() {
    this.runResetContainer();
    this.getHeight();
  }
  ngOnChanges() {
    this.getDescription();
    this.getReason();
    this.getState();
    this.getSuggestion();
    this.runResetContainer();
    this.getHeight();
    this.filterDuplicates();
  }
  ngOnDestroy() {
    this.unsubFromPage();
  }
  public getHeight() {
    this.pageTotal = Math.ceil(($("#pdfPreview").outerHeight() - 139) / 1084.4);
    this.totalPage.emit(this.pageTotal);
  }
  public generalKeys = {};
  generateGeneralsKeys() {
    this.generals.forEach((general) => {
      this.generalKeys[general.key] = general.value;
    });
  }

  isDeviationDeclined() {
    if (
      this.clientResponses &&
      this.clientResponses.length &&
      this.clientResponses[this.clientResponses.length - 1].Status == 3
    ) {
      this.deviationDeclined = true;
    }
  }

  responseHasContent() {
    if (this.clientResponses) {
      for (let i = 0; i < this.clientResponses.length - 1; i++) {
        const response = this.clientResponses[i];
        if (response.client_message) {
          this.showDescription = true;
          break;
        }
      }
    }
  }

  get allFiles() {
    return this.files.concat(this.uploadedFiles);
  }

  getDeviationType(id) {
    const type = this.DeviationTypes.find((type) => type.id == id);
    if (type) {
      return type.Name;
    }
  }

  getToday() {
    return moment().format(`YYYY-MM-DD [${this.week}] w`);
  }
  clientMessageClass(first, last) {
    /*
    if (first) {
      return "client-message-top";
    } else if (last) {
      return "client-message-bottom";
    } else {
      return "client-message";
    }*/
  }
  checkClientResponse(formValue) {
    if (formValue) {
      for (let index = 0; index < formValue.length; index++) {
        if (
          formValue[index].hasOwnProperty("client_message") &&
          formValue[index].client_message != null
        ) {
          return true;
        }
      }
      return false;
    } else return false;
  }

  test(status) {
    if (status == 2) {
      return "Löpande arbete";
    } else if (status == 4) {
      return "Beställer åtgärd";
    } else if (status == 1 || status == 0) {
      return "Fråga";
    } else if (status == 3) {
      return "Ingen Atgard";
    } else if (status == 6) {
      return "Svar";
    }
  }

  delicendStatus(clientResponse) {
    for (let index = 0; index < clientResponse.length; index++) {
      if (
        clientResponse[index].hasOwnProperty("Status") &&
        clientResponse[index].Status == 3
      ) {
        return true;
      }
    }
    return false;
  }

  statusDescription(acceptedAsFast, Status) {
    if (Status == 2 && acceptedAsFast == 0) {
      return "Härmed beställer jag utförande av arbetet på löpande räkning.";
    } else if (acceptedAsFast == 1 && (Status == 2 || Status == 4)) {
      return "Härmed beställer jag åtgärd enligt beskrivning.";
    } else if (Status == 1 || Status == 0) {
      return "Fråga enligt ovan.";
    } else if (Status == 3) {
      return "Vi väljer att inte åtgärda underrättelsen/ÄTA och ansvarar för eventuella framtida konsekvenser.";
    }
  }

  getBgForStatus(status) {
    if (status == 2 || status == 4) {
      return "accepted-bg";
    }
    if (status == 1 || status == 0) {
      return "question-bg";
    }
    if (status == 3) {
      return "declined-bg";
    }
  }

  generatePdf(functionName) {
    this.runParentFunction.emit(functionName);
  }

  shouldCrossover(index) {
    if(this.type == 'external'){
      const lastIndex = this.clientResponses.length - 1;
      const lastResponse = this.clientResponses[lastIndex];

      if (lastResponse.Status == 3 && index != lastIndex) {
        return {
          textDecoration: "line-through",
          textDecorationColor: "#FF5454",
        };
      }

      return {};
    }else if(this.type == 'internal'){
      const lastIndex = this.internalDeviationChat.length - 1;
      const lastResponse = this.internalDeviationChat[lastIndex];

      if (lastResponse.InternalDevReplayStatus == 3 && index != lastIndex) {
        return {
          textDecoration: "line-through",
          textDecorationColor: "#FF5454",
        };
      }

      return {};
    }

  }

  checkMessage(internalDeviationChat: any[]): boolean {
    if (!internalDeviationChat) {
      return false;
    }
    for (const chat of internalDeviationChat) {
      if (chat.message.trim() !== '') {
        return true;
      }
    }
    return false;
  }

  filteredClientResponses: any[];
  filterDuplicates() {
    if (!this.clientResponses) {
      return;
    }

    if (!this.internalDeviationChat || this.internalDeviationChat.length === 0) {
      // Ako je internalDeviationChat prazan, dodajte sve elemente iz clientResponses
      this.filteredClientResponses = [...this.clientResponses];
      return;
    }

    this.filteredClientResponses = this.clientResponses.reduce((acc, clientResponse) => {
      const existsInInternalDeviationChat = this.internalDeviationChat.some(
        (internalDeviation) =>
          internalDeviation.user_email === clientResponse.answerEmail &&
          Number(internalDeviation.InternalDevReplayStatus) === Number(clientResponse.Status) &&
          Number(internalDeviation.replay) === Number(clientResponse.manualReply)
      );

      // Ako nije pronađen element koji je dupli u oba arraya, dodaj ga
      if (!existsInInternalDeviationChat) {
        acc.push({ ...clientResponse });
      }

      return acc;
    }, []);

  }
}
