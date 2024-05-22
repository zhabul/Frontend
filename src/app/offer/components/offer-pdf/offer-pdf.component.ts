import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
// import { OfferDataService } from '../services/offerDataService/offer-data.service';
// import { OffersService } from 'src/app/core/services/offers.service';
// import { PaymentPlanService } from 'src/app/core/services/payment-plan.service';
import { resolveEmailLogStatus } from 'src/app/utility/component-email-status/utils';
import { DomSanitizer } from '@angular/platform-browser';

declare let $;

@Component({
  selector: 'app-offer-pdf',
  templateUrl: './offer-pdf.component.html',
  styleUrls: ['./offer-pdf.component.css'],
  host: {'class': 'blu-scroll overflow'}
})
export class OfferPdfComponent implements OnInit, OnChanges {

  @Input('id') id;
  @Input('generals') generals;
  @Input('offer') offer;
  @Input('logs') logs;
  @Input("changed") changed;

  @Input('offer_i') offer_i = [];
  @Input('lines') lines = [];
  @Input('offer_t') offer_t = [];



  // public offer_i = [];
  // public lines = [];
  // public offer_t = [];
  // private linesFetched = false;
  // private offerIntroductionFetched = false;
  // private offerTerminationFetched = false;
  public spinner = false;

  // private realHtmlContent;
  // private breakHtmlContent = false;
  public pageNumber;
  public pageTotal;

  public introductionComments = [];
  public terminationComments = [];

  private canvas;
  private context;

  constructor(
    // private offersService: OffersService,
    // private paymentPlanService: PaymentPlanService,
    // private offerDataService: OfferDataService,
    public sanitizer: DomSanitizer

    ) { }

  ngOnInit(): void {

    // this.subToData()
    this.canvas = document.createElement("canvas");
    this.context = this.canvas.getContext("2d");
    this.context.font = "16px Arial Narrow";
    this.pageNumber = 1;
    this.setLogo();
    this.setCompanyInfo();
    this.offer_i.forEach(intro => {
      this.introductionComments.push({
        name: intro.name,
        comment: this.textSplit(intro.comment)
      });
      // intro.comment = this.textSplit(intro.comment);
    });

    this.offer_t.forEach(intro => {
      this.terminationComments.push({
        name: intro.name,
        comment: this.textSplit(intro.comment)
      });
      // intro.comment = this.textSplit(intro.comment);
    });
  }

  ngAfterViewInit() {
    // this.pageTotal = Number(Math.ceil(($('#pdfPreview').outerHeight()-139)/1084.4))
    this.pageTotal = Number(Math.ceil(($('#main').outerHeight())/1081.4));
    this.addHeaderToHtmlContent();
  }

  public reversedLogs = [];
  ngOnChanges(changes:SimpleChanges) {
    const logsCopy = this.logs.slice(0);
    this.reversedLogs = logsCopy.reverse();
    // if(this.changed){
    //   this.pageTotal = Number(Math.ceil($('#pdfPreview').outerHeight()/1086))
    //   this.realHtmlContent = document.getElementById("pdfPreview").outerHTML;
    //   this.addHeaderToHtmlContent();
    // }
    // if(!this.changed && this.breakHtmlContent){
    //   document.getElementById("pdfPreview").outerHTML = this.realHtmlContent;
    //   this.breakHtmlContent = false;
    // }
  }

  getEmailLogColor(log) {
    const { color } = resolveEmailLogStatus(log);
    return color;
  }

  renderStatusText(log) {

    if (log.Status == 2) {
      return 'Accepterar offerten enligt redovisat';
    } else if (log.Status == 6) {
      return 'Önskar komplettering enligt beskrivning';
    } else if (log.Status == 3) {
      return 'Accepterar inte offerten';
    } else if (log.Status == 5) {
        return 'Aborted';
    }
    return '';
  }

  renderManualAcceptedText(log) {
    if (log.manualReply == 1) {
      return '- Manuellt accepterad av'
    }
    return '';
  }

  renderStatusQuestion(log) {
    if (log.Status != 6) {
      return 'Beskrivning:';
    } else {
      return 'FRÅGA?';
    }
  }

  public logo = '';
  setLogo() {
    if (this.generals.Logo) {
      this.logo = this.generals.Logo.value;
    }
  }

  public companyInfo = {
    name: '',
    address: '',
    email: '',
    site: '',
    phone: '',
    bank_account: ''
  };

  setCompanyInfo() {
    this.companyInfo = {
      name: this.generals.Company_Name.value,
      address: this.generals.Company_Address.value,
      email: this.generals.Company_Email.value,
      site: this.generals.Company_Site.value,
      phone: this.generals.Company_Phone.value,
      bank_account: this.generals.Company_Bank_Account.value,
    };
  }

  // private offer_i_sub;
  // private lines_sub;
  // private offer_t_sub;
  // subToData() {
  //   this.offer_i_sub = this.offerDataService.offer_i.subscribe((data)=>{
  //     this.offer_i = data;
  //     this.fetchOfferIntroduction();
  //   });
  //   this.lines_sub = this.offerDataService.lines.subscribe((data)=>{
  //     this.lines = data;
  //     this.fetchOfferLines();
  //   });
  //   this.offer_t_sub = this.offerDataService.offer_t.subscribe((data)=>{
  //     this.offer_t = data;
  //     this.fetchOfferTermmination();
  //   });

  // }

  addHeaderToHtmlContent(){
    // this.breakHtmlContent = true;

    $(document).ready(function(){

      let total_height = 0;
     // const headerHeight=$("#header").outerHeight();
    //  const footerHeight=$("#footer").outerHeight();
      // const headerHeight=$("#header").style.offsetHeight;
      // const footerHeight=$("#footer").style.offsetHeight;

      const heightDataPage = 1081.4;
      // const heightDataPage = 1403.2 //height pdf full page
      //                       - (38.4 * 2) //default margins of pdf file -top (20px) - bottom (20px)
      //                       - headerHeight // header height of document
      //                       - 35 // margin bottom of header
      //                       - footerHeight // footer height of document
      let maxHeight = heightDataPage;
      let pageNumber = 1;
      let headerHtml = document.getElementById("header").outerHTML;
      $(".nr").each(function(index){

        let eachRowHeight = Math.ceil($(this).outerHeight());
        if(eachRowHeight == 48)eachRowHeight-=2;
        if(eachRowHeight == 37)eachRowHeight-=2;
        total_height += eachRowHeight;
        if(total_height > maxHeight){
          const s='<div style="height:'+ (maxHeight - (total_height - eachRowHeight) )+'px"></div>'
          $(this).before(s);
          $(this).before('<div style="page-break-after:always"></div>');
          $(this).before(document.getElementById("footer").outerHTML);
          // pageNumber =Math.round(total_height/heightDataPage) + 1;
          pageNumber++;
          let replacedHeaderHtml = headerHtml.replace(/\s\d\s/, " "+pageNumber+" ");
          $(this).before('<div style="padding-top: 50px !important; background-color: #e4e4e4;position: relative;width: 100%;"></div>');
          $(this).before(replacedHeaderHtml)
          total_height = eachRowHeight;
          // maxHeight+=heightDataPage;
        }
      }
      );
      // pageNumber++;
      // let emptylast=maxHeight - total_height;
      // let s='<div style="height:'+emptylast+'px"></div>'
      // $(".additional-info").before(s)
      // $(".additional-info").before('<div style="page-break-after:always"></div>');
      // let replacedHeaderHtml = headerHtml.replace(/\s\d\s/, " "+pageNumber+" ");
      // $(".additional-info").before(document.getElementById("footer").outerHTML)
      // $(".additional-info").before('<div style="    padding-top: 50px !important; background-color: #e4e4e4;position: relative;width: 100%;"></div>')
      // $(".additional-info").before(replacedHeaderHtml);

      let emptylast=maxHeight - total_height;
      let s='<div style="height:'+emptylast+'px"></div>'
      $(".footer:last").before(s)

      document.getElementById("pdfPreview").outerHTML = document.getElementById("pdfPreview").outerHTML;
    });

  }

  // unsubFromData() {
  //   if (this.offer_i_sub) {
  //     this.offer_i_sub.unsubscribe();
  //   }
  //   if (this.lines_sub) {
  //     this.lines_sub.unsubscribe();
  //   }
  //   if (this.offer_t_sub) {
  //     this.offer_t_sub.unsubscribe();
  //   }
  // }

  // ngOnDestroy(): void {
  //   this.unsubFromData();
  // }

  // async fetchOfferIntroduction() {
  //   if (this.offerIntroductionFetched === false && !this.offer_i.length) {
  //     this.offerIntroductionFetched = true;
  //     this.spinner = true;
  //     const res:any = await this.paymentPlanService.getTheComments(this.id, 'offer_i').toPromise2();
  //     const { data } = res;
  //     this.offerDataService.nextIntroData(data);
  //     this.spinner = false;
  //   }
  // }

  // async fetchOfferLines() {
  //   if (this.linesFetched === false && !this.lines.length) {
  //     this.linesFetched = true;
  //     const res:any = await this.offersService.getLines(this.id);
  //     const { data } = res;
  //     this.offerDataService.nextLinesData(data);
  //   }
  // }

  // async fetchOfferTermmination() {
  //   if (this.offerTerminationFetched === false && !this.lines.length) {
  //     this.offerTerminationFetched = true;
  //     const res:any = await this.paymentPlanService.getTheComments(this.id, 'offer_t').toPromise2();
  //     const { data } = res;
  //     this.offerDataService.nextTerminationData(data);
  //   }
  // }

  textSplit(string){
    let splited = string.split(/<\/p>|<\/ol>|<\/ul>/);
    let newString = "";
    let rowWords = "";
    // console.log(string)
    splited.forEach(row => {
      if(row === "") return;
      rowWords = "";
      const rightAligment = row.includes("ql-align-right");
      const centerAligment = row.includes("ql-align-center");
      const justifyAligment = row.includes("ql-align-justify");

      const isLi = row.includes("<li");

      if(isLi){
        const isUl = row.includes("<ul");

        // row = row.replaceAll('<ul>','')
        // row = row.replaceAll('</ul>','')
        if(rightAligment){
          row = row.replaceAll(
            isUl ?
              '<ul>'
              :
              '<ol>',
            isUl ?
              '<ul class="nr" style="margin: 0; font-size:16px; list-style-position: inside; text-align: right;">'
              :
              '<ol class="nr" style="margin: 0; font-size:16px; list-style-position: inside; text-align: right;">'
              );
        } else if(centerAligment){
          row = row.replaceAll(
            isUl ?
              '<ul>'
              :
              '<ol>',
            isUl ?
              '<ul class="nr" style="margin: 0; font-size:16px; list-style-position: inside; text-align: center;">'
              :
              '<ol class="nr" style="margin: 0; font-size:16px; list-style-position: inside; text-align: center;">'
              );
        } else if(justifyAligment){
          row = row.replaceAll(
            isUl ?
              '<ul>'
              :
              '<ol>',
            isUl ?
              '<ul class="nr" style="margin: 0; font-size:16px; list-style-position: inside; text-align: justify;">'
              :
              '<ol class="nr" style="margin: 0; font-size:16px; list-style-position: inside; text-align: justify;">'
              );
        } else {
          row = row.replaceAll(
            isUl ?
              '<ul>'
              :
              '<ol>',
            isUl ?
              '<ul class="nr" style="margin: 0; font-size:16px; list-style-position: inside; text-align: left;">'
              :
              '<ol class="nr" style="margin: 0; font-size:16px; list-style-position: inside; text-align: left;">'
              )
        }

        // row = row.replaceAll('</li>',isUl ? '</li></ul></div>' : '</li></div>')

        row = row.replaceAll('<li','<li style="padding-top:5px;"')

        row += isUl ?
						'</ul>'
						:
						'</ol>';

        newString += row;
        return;
      }

      // if(isLi){
      //   const isUl = row.includes("<ul");

      //   row = row.replaceAll('<ul>','')
      //   row = row.replaceAll('</ul>','')
      //   if(rightAligment){
      //     row = row.replaceAll(
      //       '<li class="ql-align-right">',
      //       isUl ?
      //         '<div class="nr" style="padding-top:5px; margin-bottom: 0; font-size:16px; text-align: right;"><ul><li>'
      //         :
      //         '<div class="nr" style="padding-top:5px; margin-bottom: 0; font-size:16px; text-align: right;"><li>'
      //         );
      //   } else if(centerAligment){
      //     row = row.replaceAll(
      //       '<li class="ql-align-center">',
      //       isUl ?
      //         '<div class="nr" style="padding-top:5px; margin-bottom: 0; font-size:16px; text-align: center;"><ul><li>'
      //         :
      //         '<div class="nr" style="padding-top:5px; margin-bottom: 0; font-size:16px; text-align: center;"><li>'
      //         );
      //   } else if(justifyAligment){
      //     row = row.replaceAll(
      //       '<li class="ql-align-justify">',
      //       isUl ?
      //         '<div class="nr" style="padding-top:5px; margin-bottom: 0; font-size:16px; text-align: justify;"><ul><li>'
      //         :
      //         '<div class="nr" style="padding-top:5px; margin-bottom: 0; font-size:16px; text-align: justify;"><li>'
      //         );
      //   } else {
      //     row = row.replaceAll(
      //       '<li>',
      //       isUl ?
      //         '<div class="nr" style="padding-top:5px; margin-bottom: 0; font-size:16px; text-align: left;"><ul><li>'
      //         :
      //         '<div class="nr" style="padding-top:5px; margin-bottom: 0; font-size:16px; text-align: left;"><li>'
      //         )
      //   }

      //   row = row.replaceAll('</li>',isUl ? '</li></ul></div>' : '</li></div>')

      //   newString += row;
      //   return;
      // }

      row = row.replaceAll('<p class="ql-align-right">',"<p>")
      row = row.replaceAll('<p class="ql-align-center">',"<p>")
      row = row.replaceAll('<p class="ql-align-justify">',"<p>")

      rowWords = row;

      // let words = row.replaceAll("<p",'<p class="nr"').split(" ");
      // rowWords = row.replaceAll("<p",'<p class="nr"').split(" ");
      // console.log(words)
      // let length = 0;

      // let sentence = "";
      // words.forEach((word,index) => {
      //   if(index == 0){
      //     rowWords += "<p>" + word + " ";
      //     // length += word.length + 1;
      //     sentence = word + " ";
      //   }
      //   else if(this.getTextWidth(sentence + " " + word) > 735){
      //     // console.log(sentence, this.getTextWidth(sentence))
      //   // else if(word.length + length > 129){
      //     rowWords += "</p><p>" + word + " ";
      //     // length = word.length + 1;
      //     sentence = word + " ";
      //   } else if(index == words.length - 1){
      //     rowWords += " " + word + "</p>";
      //     sentence += " " + word;
      //   }
      //   else {
      //     rowWords += word + " ";
      //     // length += word.length + 1;
      //     sentence += word + " ";
      //   }
      // });

      if(rightAligment){
        rowWords = rowWords.split("<p>").join('<p class="nr" style="padding-top:5px; margin-bottom: 0; font-size:16px; text-align: right;">')
      } else if(centerAligment){
        rowWords = rowWords.split("<p>").join('<p class="nr" style="padding-top:5px; margin-bottom: 0; font-size:16px; text-align: center;">')
      } else if(justifyAligment){
        rowWords = rowWords.split("<p>").join('<p class="nr" style="padding-top:5px; margin-bottom: 0; font-size:16px; text-align: justify;">')
      } else {
        rowWords = rowWords.split("<p>").join('<p class="nr" style="padding-top:5px; margin-bottom: 0; font-size:16px; text-align: left;">')
      }

      newString += rowWords;
    });
    newString += "</p>";
    // const replacedString = string.replaceAll("<p>",'<p class="nr" style="padding-top:5px; margin-bottom: 0; font-size:16px;">');
    // const replacedString = newString.split("<p>").join('<p class="nr" style="padding-top:5px; margin-bottom: 0; font-size:16px;">')
    return newString;
  }

  getTextWidth(text) {
    // if given, use cached canvas for better performance
    // else, create new canvas

    let metrics = this.context.measureText(text);
    return metrics.width;
  }

  getArticlesSum(articles){
    let total = 0;
    articles.forEach(article => {
      total += Number(article.total)
    });

    return total;
  }

  showLines(articles){

    for(let i = 0; i < articles.length; i++){
      if(articles.at(i).description.length > 0) return true;
    }

    return false;
  }

  formatNumber(data) {
    let type = typeof data;
    return ( type == 'number' ) ? data : Number(data.replace(/\s/g, '').trim());
  }
}
