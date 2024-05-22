import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-emaildebitering',
  templateUrl: './emaildebitering.component.html',
  styleUrls: ['./emaildebitering.component.css']
})
export class EmaildebiteringComponent implements OnInit {


  public statuss=0;

  /*Prva Tabela*/

  public rez:any;
  public rez1:any;
  public rez2;any;
  public rez3:any;
  public rez4:any;
  public rez5:any;
  public rez6:any;
  public rez7:any;
  public rez8:any;
  public rez9:any;
  public rez10:any;
  public rez11:any;
  public rez12:any;
  public rez13:any;
  public rez14:any;
  public rez15:any;
  public rez16:any;
  public rez17:any;
  public rez18:any;
  public rez19:any;
  public rez20:any;




  public secrez1:any;
  public secrez2:any;
  public secrez3:any;
  public secrez4:any;
  public secrez5:any;
  public secrez6:any;











  public isEmpty=false;


  public secisEmpty=false;



   public check1=false;
   public check2=false;
   public check3=false;
   public check4=false;
   public check5=false;
   public check6=false;
   public check7=false;
   public check8=false;
   public check9=false;
   public check10=false;
   public check11=false;
   public check12=false;
   public check13=false;
   public check14=false;
   public check15=false;
   public check16=false;
   public check17=false;
   public check18=false;





   public reject1=false;
   public reject2=false;
   public reject3=false;
   public reject4=false;
   public reject5=false;
   public reject6=false;
   public reject7=false;
   public reject8=false;
   public reject9=false;
   public reject10=false;
   public reject11=false;
   public reject12=false;
   public reject13=false;
   public reject14=false;
   public reject15=false;
   public reject16=false;
   public reject17=false;
   public reject18=false;
   public reject19=false;














   public statusall=false;
   public statusreject=false;




   constructor() {document.getElementById("sidebar-wrapper").style.display="none";  }

  ngOnInit(): void {




  }
  ngOnDestroy(){
    document.getElementById("sidebar-wrapper").style.display="block";

  }





  getSelectedItem1(){

   this.check1 = !this.check1;
   this.reject1=false;
  }
  getSelectedItem2()
  {
    this.check2 = !this.check2;
    this.reject2=false;
  }
  getSelectedItem3()
  {
    this.check3 = !this.check3;
    this.reject3=false;

  }
  public getSelectedItem4()
  {
    this.check4 = !this.check4;
    this.reject4=false;

  }
  public getSelectedItem5()
  {
    this.check5 = !this.check5;
    this.reject5=false;

  }
  public getSelectedItem6()
  {
    this.check6 = !this.check6;
    this.reject6=false;

  }
  public getSelectedItem7()
  {
    this.check7 = !this.check7;
    this.reject7=false;
  }
  public getSelectedItem8()
  {
    this.check8 = !this.check8;
    this.reject8=false;
  }
  public getSelectedItem9()
  {
    this.check9 = !this.check9;
    this.reject9=false;
  }
  public getSelectedItem10()
  {
    this.check10 = !this.check10;
    this.reject10=false;

  }
  public getSelectedItem11()
  {
    this.check11 = !this.check11;
    this.reject11=false;

  }
  public getSelectedItem12()
  {
    this.check12 = !this.check12;
    this.reject12=false;

  }
  public getSelectedItem13()
  {
    this.check13 = !this.check13;
    this.reject13=false;

  }
  public getSelectedItem14()
  {
    this.check14 = !this.check14;
    this.reject14=false;

  }
  public getSelectedItem15()
  {
    this.check15 = !this.check15;
    this.reject15=false;

  }
  public getSelectedItem16()
  {
    this.check16 = !this.check16;
    this.reject16=false;

  }
  public getSelectedItem17()
  {
    this.check17 = !this.check17;
    this.reject17=false;
  }
  public getSelectedItem18()
  {
    this.check18 = !this.check18;
    this.reject18=false;
  }

  getRejectItem1(){

    this.reject1 = !this.reject1;
    this.check1=false;
   }
   getRejectItem2()
   {
    this.reject2 = !this.reject2;
    this.check2=false;
   }
   getRejectItem3()
   {
    this.reject3 = !this.reject3;
    this.check3=false;
   }
   getRejectItem4()
   {
    this.reject4 = !this.reject4;
    this.check4=false;

   }
   getRejectItem5()
   {
    this.reject5 = !this.reject5;
    this.check5=false;

   }
   getRejectItem6()
   {
    this.reject6 = !this.reject6;
    this.check6=false;
   }
   getRejectItem7()
   {
    this.reject7 = !this.reject7;
    this.check7=false;
   }
   getRejectItem8()
   {
    this.reject8 = !this.reject8;
    this.check8=false;
   }
   getRejectItem9()
   {
    this.reject9 = !this.reject9;
    this.check9=false;
   }
   getRejectItem10()
   {
    this.reject10 = !this.reject10;
    this.check10=false;
   }
   getRejectItem11()
   {
    this.reject11 = !this.reject11;
    this.check11=false;

   }
   getRejectItem12()
   {
    this.reject12 = !this.reject12;
    this.check12=false;

   }
   getRejectItem13()
   {
    this.reject13 = !this.reject13;
    this.check13=false;


   }
   getRejectItem14()
   {
    this.reject14 = !this.reject14;
    this.check14=false;

   }
   getRejectItem15()
   {
    this.reject15 = !this.reject15;
    this.check15=false;

   }
   getRejectItem16()
   {
    this.reject16 = !this.reject16;
    this.check16=false;

   }
   getRejectItem17()
   {
    this.reject17 = !this.reject17;
    this.check17=false;

   }
   getRejectItem18()
   {
    this.reject18 = !this.reject18;
    this.check18=false;

   }













   getSelectedAllItem(){

    this.statusall = !this.statusall;
    this.statusreject=false;
    this.reject1=false;
    this.reject2=false;
    this.reject3=false;
    this.reject4=false;
    this.reject5=false;
    this.reject6=false;
    this.reject7=false;
    this.reject8=false;
    this.reject9=false;
    this.reject10=false;
    this.reject11=false;
    this.reject12=false;
    this.reject13=false;
    this.reject14=false;
    this.reject15=false;
    this.reject16=false;
    this.reject17=false;
    this.reject18=false;




    if(this.statusall==true)
    {
    this.check1=true;
    this.check2=true;
    this.check3=true;
    this.check4=true;
    this.check5=true;
    this.check6=true;
    this.check7=true;
    this.check8=true;
    this.check9=true;
    this.check10=true;
    this.check11=true;
    this.check12=true;
    this.check13=true;
    this.check14=true;
    this.check15=true;
    this.check16=true;
    this.check17=true;
    this.check18=true;
    }
    else
    {
      this.check1=false;
      this.check2=false;
      this.check3=false;
      this.check4=false;
      this.check5=false;
      this.check6=false;
      this.check7=false;
      this.check8=false;
      this.check9=false;
      this.check10=false;
      this.check11=false;
      this.check12=false;
      this.check13=false;
      this.check14=false;
      this.check15=false;
      this.check16=false;
      this.check17=false;
      this.check18=false;



    }





      }

   getRejectAllItem()
   {

    this.statusreject = !this.statusreject;
    this.statusall=false;
    this.check1=false;
    this.check2=false;
    this.check3=false;
    this.check4=false;
    this.check5=false;
    this.check6=false;
    this.check7=false;
    this.check8=false;
    this.check8=false;
    this.check9=false;
    this.check10=false;
    this.check11=false;
    this.check12=false;
    this.check13=false;
    this.check14=false;
    this.check15=false;
    this.check16=false;
    this.check17=false;
    this.check18=false;

    if(this.statusreject==true)
    {
    this.reject1=true;
    this.reject2=true;
    this.reject3=true;
    this.reject4=true;
    this.reject5=true;
    this.reject6=true;
    this.reject7=true;
    this.reject8=true;
    this.reject9=true;
    this.reject10=true;
    this.reject11=true;
    this.reject12=true;
    this.reject13=true;
    this.reject14=true;
    this.reject15=true;
    this.reject16=true;
    this.reject17=true;
    this.reject18=true;
    }
    else
    {
      this.reject1=false;
    this.reject2=false;
    this.reject3=false;
    this.reject4=false;
    this.reject5=false;
    this.reject6=false;
    this.reject7=false;
    this.reject8=false;
    this.reject9=false;
    this.reject10=false;
    this.reject11=false;
    this.reject12=false;
    this.reject13=false;
    this.reject14=false;
    this.reject15=false;
    this.reject16=false;
    this.reject17=false;
    this.reject18=false;
    }




   }
   /*Kraj Tabele*/
   removeBorderDU()
   {


    this.rez1 = (<HTMLInputElement>document.getElementById("inputid")).value;
    const myElement1 = document.getElementById("inputid");
    this.rez2 = (<HTMLInputElement>document.getElementById("inputid1")).value;
    const myElement2 = document.getElementById("inputid1");
    this.rez3 = (<HTMLInputElement>document.getElementById("inputid2")).value;
    const myElement3 = document.getElementById("inputid2");


    this.rez4 = (<HTMLInputElement>document.getElementById("inputid3")).value;
    const myElement4 = document.getElementById("inputid3");

    this.rez5 = (<HTMLInputElement>document.getElementById("inputid4")).value;
    const myElement5 = document.getElementById("inputid4");

    this.rez6 = (<HTMLInputElement>document.getElementById("inputid5")).value;
    const myElement6 = document.getElementById("inputid5");


    this.rez7 = (<HTMLInputElement>document.getElementById("inputid6")).value;
    const myElement7 = document.getElementById("inputid6");


    this.rez8 = (<HTMLInputElement>document.getElementById("inputid7")).value;
    const myElement8 = document.getElementById("inputid7");


    this.rez9 = (<HTMLInputElement>document.getElementById("inputid8")).value;
    const myElement9 = document.getElementById("inputid8");

    this.rez10 = (<HTMLInputElement>document.getElementById("inputid9")).value;
    const myElement10 = document.getElementById("inputid9");


    this.rez11 = (<HTMLInputElement>document.getElementById("inputid10")).value;
    const myElement11 = document.getElementById("inputid10");


    this.rez12 = (<HTMLInputElement>document.getElementById("inputid11")).value;
    const myElement12 = document.getElementById("inputid11");


    this.rez13 = (<HTMLInputElement>document.getElementById("inputid12")).value;
    const myElement13 = document.getElementById("inputid12");


    this.rez14 = (<HTMLInputElement>document.getElementById("inputid13")).value;
    const myElement14 = document.getElementById("inputid13");

    this.rez15 = (<HTMLInputElement>document.getElementById("inputid14")).value;
    const myElement15 = document.getElementById("inputid14");


    this.rez16 = (<HTMLInputElement>document.getElementById("inputid15")).value;
    const myElement16 = document.getElementById("inputid15");


    this.rez17 = (<HTMLInputElement>document.getElementById("inputid16")).value;
    const myElement17 = document.getElementById("inputid16");

    this.rez18 = (<HTMLInputElement>document.getElementById("inputid17")).value;
    const myElement18 = document.getElementById("inputid17");


    this.rez19 = (<HTMLInputElement>document.getElementById("inputid18")).value;
    const myElement19 = document.getElementById("inputid18");

    this.rez20 = (<HTMLInputElement>document.getElementById("inputid19")).value;
    const myElement20 = document.getElementById("inputid19");

    if(!(this.rez1=='') || !(this.rez2=='') || !(this.rez3=='') || !(this.rez4=='') || !(this.rez5=='') || !(this.rez6=='') || !(this.rez7=='') || !(this.rez8=='') || !(this.rez9=='')

      || !(this.rez10=='') || !(this.rez11=='') || !(this.rez12=='') || !(this.rez13=='') || !(this.rez14=='') || !(this.rez15=='') || !(this.rez16=='') || !(this.rez17=='') || !(this.rez18=='')
      || !(this.rez19=='') || !(this.rez20=='')
    )
    {


      myElement1.style.outline = "none";
      myElement2.style.outline = "none";
      myElement3.style.outline="none";
      myElement4.style.outline="none";
      myElement5.style.outline="none";
      myElement6.style.outline="none";
      myElement7.style.outline="none";
      myElement8.style.outline="none";
      myElement9.style.outline="none";
      myElement10.style.outline="none";
      myElement11.style.outline="none";
      myElement12.style.outline="none";
      myElement13.style.outline="none";
      myElement14.style.outline="none";
      myElement15.style.outline="none";
      myElement16.style.outline="none";
      myElement17.style.outline="none";
      myElement18.style.outline="none";
      myElement19.style.outline="none";
      myElement20.style.outline="none";


    }
   }

   PromjeniStatus(statusnovi)
  {
    this.mouseleave();
    this.mouseleaveBackbtn();
    this.DisableMaterial();



    this.rez1 = (<HTMLInputElement>document.getElementById("inputid")).value;
    const myElement1 = document.getElementById("inputid");
    this.rez2 = (<HTMLInputElement>document.getElementById("inputid1")).value;
    const myElement2 = document.getElementById("inputid1");
    this.rez3 = (<HTMLInputElement>document.getElementById("inputid2")).value;
    const myElement3 = document.getElementById("inputid2");


    this.rez4 = (<HTMLInputElement>document.getElementById("inputid3")).value;
    const myElement4 = document.getElementById("inputid3");

    this.rez5 = (<HTMLInputElement>document.getElementById("inputid4")).value;
    const myElement5 = document.getElementById("inputid4");

    this.rez6 = (<HTMLInputElement>document.getElementById("inputid5")).value;
    const myElement6 = document.getElementById("inputid5");


    this.rez7 = (<HTMLInputElement>document.getElementById("inputid6")).value;
    const myElement7 = document.getElementById("inputid6");


    this.rez8 = (<HTMLInputElement>document.getElementById("inputid7")).value;
    const myElement8 = document.getElementById("inputid7");


    this.rez9 = (<HTMLInputElement>document.getElementById("inputid8")).value;
    const myElement9 = document.getElementById("inputid8");

    this.rez10 = (<HTMLInputElement>document.getElementById("inputid9")).value;
    const myElement10 = document.getElementById("inputid9");


    this.rez11 = (<HTMLInputElement>document.getElementById("inputid10")).value;
    const myElement11 = document.getElementById("inputid10");


    this.rez12 = (<HTMLInputElement>document.getElementById("inputid11")).value;
    const myElement12 = document.getElementById("inputid11");


    this.rez13 = (<HTMLInputElement>document.getElementById("inputid12")).value;
    const myElement13 = document.getElementById("inputid12");


    this.rez14 = (<HTMLInputElement>document.getElementById("inputid13")).value;
    const myElement14 = document.getElementById("inputid13");

    this.rez15 = (<HTMLInputElement>document.getElementById("inputid14")).value;
    const myElement15 = document.getElementById("inputid14");


    this.rez16 = (<HTMLInputElement>document.getElementById("inputid15")).value;
    const myElement16 = document.getElementById("inputid15");


    this.rez17 = (<HTMLInputElement>document.getElementById("inputid16")).value;
    const myElement17 = document.getElementById("inputid16");

    this.rez18 = (<HTMLInputElement>document.getElementById("inputid17")).value;
    const myElement18 = document.getElementById("inputid17");

    this.rez19 = (<HTMLInputElement>document.getElementById("inputid18")).value;
    const myElement19 = document.getElementById("inputid18");

    this.rez20 = (<HTMLInputElement>document.getElementById("inputid19")).value;
    const myElement20 = document.getElementById("inputid19");





    if(this.rez1=='' && this.reject1==true)
    {


    myElement1.style.outline = "1px solid red";



    this.isEmpty=true;
    }
    else if(this.rez2=='' && this.reject2==true)
    {

      myElement2.style.outline = "1px solid red";

      this.isEmpty=true;

    }
    else if(this.rez3=='' && this.reject3==true)
    {

      myElement3.style.outline = "1px solid red";
      this.isEmpty=true;
    }
    else if(this.rez4=='' && this.reject4==true)
    {

      myElement4.style.outline = "1px solid red";
      this.isEmpty=true;
    }
    else if(this.rez5=='' && this.reject5==true)
    {

      myElement5.style.outline = "1px solid red";
      this.isEmpty=true;
    }
    else if(this.rez6=='' && this.reject6==true)
    {

      myElement6.style.outline = "1px solid red";
      this.isEmpty=true;
    }
    else if(this.rez7=='' && this.reject7==true)
    {

      myElement7.style.outline = "1px solid red";
      this.isEmpty=true;
    }
    else if(this.rez8=='' && this.reject8==true)
    {

      myElement8.style.outline = "1px solid red";
      this.isEmpty=true;
    }
    else if(this.rez9=='' && this.reject9==true)
    {

      myElement9.style.outline = "1px solid red";
      this.isEmpty=true;
    }
    else if(this.rez10=='' && this.reject10==true)
    {

      myElement10.style.outline = "1px solid red";
      this.isEmpty=true;
    }
    else if(this.rez11=='' && this.reject11==true)
    {

      myElement11.style.outline = "1px solid red";
      this.isEmpty=true;
    }
    else if(this.rez12=='' && this.reject12==true)
    {

      myElement12.style.outline = "1px solid red";
      this.isEmpty=true;
    }

    else if(this.rez13=='' && this.reject13==true)
    {

      myElement13.style.outline = "1px solid red";
      this.isEmpty=true;
    }
    else if(this.rez14=='' && this.reject14==true)
    {

      myElement14.style.outline = "1px solid red";
      this.isEmpty=true;
    }
    else if(this.rez15=='' && this.reject15==true)
    {

      myElement15.style.outline = "1px solid red";
      this.isEmpty=true;
    }
    else if(this.rez16=='' && this.reject16==true)
    {

      myElement16.style.outline = "1px solid red";
      this.isEmpty=true;
    }
    else if(this.rez17=='' && this.reject17==true)
    {

      myElement17.style.outline = "1px solid red";
      this.isEmpty=true;
    }
    else if(this.rez18=='' && this.reject18==true)
    {

      myElement18.style.outline = "1px solid red";
      this.isEmpty=true;
    }
    else if(this.rez19=='' && this.Manreject1==true)
    {

      myElement19.style.outline = "1px solid red";
      this.isEmpty=true;
    }
    else if(this.rez20=='' && this.Manreject2==true)
    {

      myElement20.style.outline = "1px solid red";
      this.isEmpty=true;
    }
    /*ne moze next button ici, ako su check odbijeno/prihvaceno prazno*/
    else if((this.check1==false && this.reject1==false) || (this.check2==false && this.reject2==false)
     ||  (this.check3==false && this.reject3==false) || (this.check4==false && this.reject4==false)
     || (this.check5==false && this.reject5==false) || ((this.check6==false && this.reject6==false))
      || (this.check7==false && this.reject7==false) || ((this.check8==false && this.reject8==false))
     || (this.check9==false && this.reject9==false) || ((this.check10==false && this.reject10==false))
     || (this.check11==false && this.reject11==false) || ((this.check12==false && this.reject12==false))
     || (this.check13==false && this.reject13==false) || ((this.check14==false && this.reject14==false))
     || (this.check15==false && this.reject15==false) || ((this.check16==false && this.reject16==false))
     || (this.check17==false && this.reject17==false) || ((this.check18==false && this.reject18==false))
     || (this.Manccheck1==false && this.Manreject1==false) || ((this.Manccheck2==false && this.Manreject2==false))











     )

    {
      this.isEmpty=true;


    }
    else
    {
      this.isEmpty=false;


      myElement1.style.outline = "none";
      myElement2.style.outline = "none";
      myElement2.style.outline = "none";
      myElement3.style.outline = "none";



      this.reject1=false;
      this.reject2=false;
      this.reject3=false;
      this.reject4=false;
      this.reject5=false;
      this.reject6=false;
      this.reject7=false;
      this.reject8=false;
      this.reject9=false;
      this.reject10=false;
      this.reject11=false;
      this.reject12=false;
      this.reject13=false;
      this.reject14=false;
      this.reject15=false;
      this.reject16=false;
      this.reject17=false;
      this.reject18=false;


      this.check1=false;
      this.check2=false;
      this.check3=false;
      this.check4=false;
      this.check5=false;
      this.check6=false;
      this.check7=false;
      this.check8=false;
      this.check8=false;
      this.check9=false;
      this.check10=false;
      this.check11=false;
      this.check12=false;
      this.check13=false;
      this.check14=false;
      this.check15=false;
      this.check16=false;
      this.check17=false;
      this.check18=false;

    }



    if(this.isEmpty==false)
    {

    this.statuss=statusnovi;

    }

  }



   public fill = '#8A8B8D';


  public fill1 = '#8A8B8D';




  mouseOver()
  {


      this.fill = 'var(--orange-dark)';

  }
  mouseleave()
  {

      this.fill = '#8A8B8D';


  }

  mouseOverBackbtn()
  {


      this.fill1 = 'var(--orange-dark)';

  }
  mouseleaveBackbtn()
  {

      this.fill1 = '#8A8B8D';


  }


  removeBorderMaterial()
  {


    this.secrez1 = (<HTMLInputElement>document.getElementById("valueinput")).value;
    const myElement1 = document.getElementById("valueinput");
    this.secrez2 = (<HTMLInputElement>document.getElementById("valueinput1")).value;
    const myElement2 = document.getElementById("valueinput1");
     this.secrez3 = (<HTMLInputElement>document.getElementById("valueinput2")).value;
    const myElement3 = document.getElementById("valueinput2");


    this.secrez4 = (<HTMLInputElement>document.getElementById("valueinput3")).value;
    const myElement4 = document.getElementById("valueinput3");

    this.secrez5 = (<HTMLInputElement>document.getElementById("valueinput4")).value;
    const myElement5 = document.getElementById("valueinput4");

    this.secrez6 = (<HTMLInputElement>document.getElementById("valueinput5")).value;
    const myElement6 = document.getElementById("valueinput5");

   if(!(this.secrez1=='') || !(this.secrez2=='') || !(this.secrez3=='') ||!(this.secrez3=='') || !(this.secrez4=='') || !(this.secrez4=='') || !(this.secrez4=='')

   ||!(this.secrez5=='') || !(this.secrez6=='')

   )
   {


     myElement1.style.outline = "none";
     myElement2.style.outline = "none";
     myElement3.style.outline="none";
     myElement4.style.outline="none";
     myElement5.style.outline="none";
     myElement6.style.outline="none";



   }
  }


  cngStatus(statusnovi)
  {


    this.mouseleave();
    this.mouseleaveBackbtn();
    this.DisableCheckUE();



    this.secrez1 = (<HTMLInputElement>document.getElementById("valueinput")).value;
    const myElement1 = document.getElementById("valueinput");
    this.secrez2 = (<HTMLInputElement>document.getElementById("valueinput1")).value;
    const myElement2 = document.getElementById("valueinput1");
     this.secrez3 = (<HTMLInputElement>document.getElementById("valueinput2")).value;
    const myElement3 = document.getElementById("valueinput2");


    this.secrez4 = (<HTMLInputElement>document.getElementById("valueinput3")).value;
    const myElement4 = document.getElementById("valueinput3");

    this.secrez5 = (<HTMLInputElement>document.getElementById("valueinput4")).value;
    const myElement5 = document.getElementById("valueinput4");

    this.secrez6 = (<HTMLInputElement>document.getElementById("valueinput5")).value;
    const myElement6 = document.getElementById("valueinput5");








    if(this.secrez1=='' && this.secreject1==true)
    {


    myElement1.style.outline = "1px solid red";



    this.secisEmpty=true;
    }
    else if(this.secrez2=='' && this.secreject2==true)
    {
      myElement2.style.outline = "1px solid red";

      this.secisEmpty=true;

    }
    else if(this.secrez3=='' && this.secreject3==true)
    {

      myElement3.style.outline = "1px solid red";

      this.secisEmpty=true;

    }
    else if(this.secrez4=='' && this.secreject4==true)
    {

      myElement4.style.outline = "1px solid red";

      this.secisEmpty=true;

    }
    else if(this.secrez5=='' && this.secreject5==true)
    {

      myElement5.style.outline = "1px solid red";

      this.secisEmpty=true;

    }
    else if(this.secrez6=='' && this.secreject6==true)
    {

      myElement6.style.outline = "1px solid red";

      this.secisEmpty=true;

    }
    else if((this.seccheck1==false && this.secreject1==false) || (this.seccheck2==false && this.secreject2==false) || (this.seccheck3==false && this.secreject3==false) || (this.seccheck4==false && this.secreject4==false) || (this.seccheck5==false && this.secreject5==false) || ((this.seccheck6==false && this.secreject6==false)))
    {
      this.secisEmpty=true;
      console.log("Crtanje bordera");



    }



    else
    {
      this.secisEmpty=false;


      myElement1.style.outline = "none";
      myElement2.style.outline = "none";
      myElement2.style.outline = "none";
      myElement3.style.outline = "none";

   this.secreject1=false;
   this.secreject2=false;
   this.secreject3=false;
   this.secreject4=false;
   this.secreject5=false;
   this.secreject6=false;


   this.seccheck1=false;
   this.seccheck2=false;
   this.seccheck3=false;
   this.seccheck4=false;
   this.seccheck5=false;
   this.seccheck6=false;

    }




    if(this.secisEmpty==false)
    {
    this.statuss=statusnovi;
    }








  }
  backStatus(statusnovi)
  {

    this.statuss=statusnovi;
    this.mouseleave();
    this.mouseleaveBackbtn();
    this.DisableDUFirstTable();
    this.DisableMaterial();
    this.DisableCheckUE();
    this.DisableManuallyTable();
  }
  /*DRUGA TABELA*/


   public getall=false;
   public getreject=false;



   public seccheck1=false;
   public seccheck2=false;
   public seccheck3=false;
   public seccheck4=false;
   public seccheck5=false;
   public seccheck6=false;



   public secreject1=false;
   public secreject2=false;
   public secreject3=false;
   public secreject4=false;
   public secreject5=false;
   public secreject6=false;


  getAllSecTab(){

    this.getall = !this.getall;
    this.getreject=false;
    this.secreject1=false;
    this.secreject2=false;
    this.secreject3=false;
    this.secreject4=false;
    this.secreject5=false;
    this.secreject6=false;

    if(this.getall==true)
    {
      this.seccheck1=true;
    this.seccheck2=true;
    this.seccheck3=true;
    this.seccheck4=true;
    this.seccheck5=true;
    this.seccheck6=true;
    }
    else
    {
      this.seccheck1=false;
      this.seccheck2=false;
      this.seccheck3=false;
      this.seccheck4=false;
      this.seccheck5=false;
      this.seccheck6=false;
    }



      }






   getRejectSecTab()
   {

    this.getreject = !this.getreject;


    this.getall=false;
    this.seccheck1=false;
    this.seccheck2=false;
    this.seccheck3=false;
    this.seccheck4=false;
    this.seccheck5=false;
    this.seccheck6=false;

    if(this.getreject==true)
    {
      this.secreject1=true;
      this.secreject2=true;
      this.secreject3=true;
      this.secreject4=true;
      this.secreject5=true;
      this.secreject6=true;
    }
    else
    {
      this.secreject1=false;
      this.secreject2=false;
      this.secreject3=false;
      this.secreject4=false;
      this.secreject5=false;
      this.secreject6=false;
    }


   }
   getSecTab1(){

    this.seccheck1 = !this.seccheck1;
    this.secreject1=false;
   }
   getSecTab2(){

    this.seccheck2 = !this.seccheck2;
    this.secreject2=false;
   }
   getSecTab3(){

    this.seccheck3 = !this.seccheck3;
    this.secreject3=false;
   }
   getSecTab4(){

    this.seccheck4 = !this.seccheck4;
    this.secreject4=false;
   }
   getSecTab5(){

    this.seccheck5 = !this.seccheck5;
    this.secreject5=false;
   }
   getSecTab6(){

    this.seccheck6 = !this.seccheck6;
    this.secreject6=false;
   }
   rejectItem1()
   {
    this.secreject1 = !this.secreject1;
    this.seccheck1=false;

   }
   rejectItem2()
   {
    this.secreject2 = !this.secreject2;
    this.seccheck2=false;

   }

   rejectItem3()
   {
    this.secreject3 = !this.secreject3;
    this.seccheck3=false;

   }
   rejectItem4()
   {
    this.secreject4 = !this.secreject4;
    this.seccheck4=false;

   }
   rejectItem5()
   {
    this.secreject5 = !this.secreject5;
    this.seccheck5=false;

   }
   rejectItem6()
   {
    this.secreject6 = !this.secreject6;
    this.seccheck6=false;
   }

   /**UE TABELA*/

   public UEccheck1=false;
   public UEccheck2=false;
   public UEccheck3=false;





   public UEreject1=false;
   public UEreject2=false;
   public UEreject3=false;






   public getUEall=false;
   public getUEreject=false;


   getUEAllSelectedCheck(){

    this.getUEall = !this.getUEall;
    this.getUEreject=false;
    this.UEreject1=false;
    this.UEreject2=false;
    this.UEreject3=false;

    if(this.getUEall==true)
    {
      this.UEccheck1=true;
    this.UEccheck2=true;
    this.UEccheck3=true;
    }
    else
    {
      this.UEccheck1=false;
      this.UEccheck2=false;
    this.UEccheck3=false;

    }
  }

  getUERejectSelectedCheck()
   {
    this.getUEreject = !this.getUEreject;
    this.getUEall=false;
    this.UEccheck1=false;
    this.UEccheck2=false;
    this.UEccheck3=false;

    if(this.getUEreject==true)
    {
      this.UEreject1=true;
      this.UEreject2=true;
      this.UEreject3=true;

    }
    else
    {
      this.UEreject1=false;
      this.UEreject2=false;
      this.UEreject3=false;

    }


   }

   getUESelectedTab1(){

    this.UEccheck1 = !this.UEccheck1;
    this.UEreject1=false;
   }

   getUESelectedTab2(){

    this.UEccheck2 = !this.UEccheck2;
    this.UEreject2=false;
   }
   getUESelectedTab3(){

    this.UEccheck3 = !this.UEccheck3;
    this.UEreject3=false;
   }

   rejectEUItem1()
   {
    this.UEreject1 = !this.UEreject1;
    this.UEccheck1=false;

   }
   rejectEUItem2()
   {
    this.UEreject2 = !this.UEreject2;
    this.UEccheck2=false;

   }
   rejectEUItem3()
   {
    this.UEreject3 = !this.UEreject3;
    this.UEccheck3=false;

   }



   public UErez1:any;
   public UErez2:any;
   public UErez3:any;
   public UEisEmpty=false;

   removeBorderUE()
   {


    this.UErez1 = (<HTMLInputElement>document.getElementById("valueinputUE")).value;
    const myElement1 = document.getElementById("valueinputUE");
    this.UErez2 = (<HTMLInputElement>document.getElementById("valueinputUE1")).value;
    const myElement2 = document.getElementById("valueinputUE1");

    this.UErez3 = (<HTMLInputElement>document.getElementById("valueinputUE2")).value;
    const myElement3 = document.getElementById("valueinputUE2");

    if(!(this.UErez2=='') || !(this.UErez1=='') || !(this.UErez3==''))
    {


      myElement1.style.outline = "none";
      myElement2.style.outline = "none";
      myElement3.style.outline="none";


    }
   }

   cngUEStatus(statusnovi)
   {
     this.mouseleave();
     this.mouseleaveBackbtn();



     this.UErez1 = (<HTMLInputElement>document.getElementById("valueinputUE")).value;
     const myElement1 = document.getElementById("valueinputUE");
     this.UErez2 = (<HTMLInputElement>document.getElementById("valueinputUE1")).value;
     const myElement2 = document.getElementById("valueinputUE1");


    this.UErez3 = (<HTMLInputElement>document.getElementById("valueinputUE2")).value;
    const myElement3 = document.getElementById("valueinputUE2");


     if(this.UErez1=='' && this.UEreject1==true)
     {


     myElement1.style.outline = "1px solid red";



     this.UEisEmpty=true;
     }
     else if(this.UErez2=='' && this.UEreject2==true)
     {

       myElement2.style.outline = "1px solid red";

       this.UEisEmpty=true;

     }
     else if(this.UErez3=='' && this.UEreject3==true)
     {

       myElement3.style.outline = "1px solid red";

       this.UEisEmpty=true;

     }


     else if((this.UEccheck1==false && this.UEreject1==false) || (this.UEccheck2==false && this.UEreject2==false) || (this.UEccheck3==false && this.UEreject3==false))
     {
       this.UEisEmpty=true;






     }


    else
    {
      this.UEisEmpty=false;
    }





     if(this.UEisEmpty==false)
     {
     this.statuss=statusnovi;
     }










   }



   /** Manally Table*/


   public Manccheck1=false;
   public Manccheck2=false;

   public Manreject1=false;
   public Manreject2=false;


   public getManall=false;
   public getManreject=false;


   getManAllSelectedCheck(){

    this.getManall = !this.getManall;
    this.getManreject=false;
    this.Manreject1=false;
    this.Manreject2=false;
    if(this.getManall==true)
    {
      this.Manccheck1=true;
    this.Manccheck2=true;

    }
    else
    {
      this.Manccheck1=false;
      this.Manccheck2=false;

    }
  }

  getManRejectSelectedCheck()
   {
    this.getManreject = !this.getManreject;
    this.getManall=false;
    this.Manccheck1=false;
    this.Manccheck2=false;


    if(this.getManreject==true)
    {
      this.Manreject1=true;
      this.Manreject2=true;
    }
    else
    {
      this.Manreject1=false;
      this.Manreject2=false;
    }


   }

   getManSelectedTab1(){

    this.Manccheck1 = !this.Manccheck1;
    this.Manreject1=false;
   }

   getManSelectedTab2(){

    this.Manccheck2 = !this.Manccheck2;
    this.Manreject2=false;
   }


   rejectManItem1()
   {
    this.Manreject1 = !this.Manreject1;
    this.Manccheck1=false;

   }
   rejectManItem2()
   {
    this.Manreject2 = !this.Manreject2;
    this.Manccheck2=false;

   }








   /**gasenje svih inputa na click next*/

   DisableManuallyTable()
   {
    this.getManall=false;
   this.getManreject=false;
     this.Manccheck1=false;
     this.Manccheck2=false;
    this.Manreject1=false;
   this.Manreject2=false;

   }
   DisableCheckUE()
   {
    this.getUEall=false;
   this.getUEreject=false;
     this.UEccheck1=false;
     this.UEccheck2=false;
     this.UEccheck3=false;

    this.UEreject1=false;
   this.UEreject2=false;
   this.UEreject3=false;

   }

   DisableMaterial()
   {
      this.getall=false;
      this.getreject=false;

      this.secreject1=false;
      this.secreject2=false;
      this.secreject3=false;
      this.secreject4=false;
      this.secreject5=false;
      this.secreject6=false;

      this.seccheck1=false;
      this.seccheck2=false;
      this.seccheck3=false;
      this.seccheck4=false;
      this.seccheck5=false;
      this.seccheck6=false;
   }



   DisableDUFirstTable()
   {

    this.statusreject=false;
    this.statusall=false;

    this.reject1=false;
    this.reject2=false;
    this.reject3=false;
    this.reject4=false;
    this.reject5=false;
    this.reject6=false;
    this.reject7=false;
    this.reject8=false;
    this.reject9=false;
    this.reject10=false;
    this.reject11=false;
    this.reject12=false;
    this.reject13=false;
    this.reject14=false;
    this.reject15=false;
    this.reject16=false;
    this.reject17=false;
    this.reject18=false;


    this.check1=false;
    this.check2=false;
    this.check3=false;
    this.check4=false;
    this.check5=false;
    this.check6=false;
    this.check7=false;
    this.check8=false;
    this.check9=false;
    this.check10=false;
    this.check11=false;
    this.check12=false;
    this.check13=false;
    this.check14=false;
    this.check15=false;
    this.check16=false;
    this.check17=false;
    this.check18=false;



   }








}


