import { Injectable } from "@angular/core";
import { BehaviorSubject, take } from 'rxjs';

@Injectable({
  providedIn: "root",
})
export class AtaInfoService {

    private initialKsData = {
        activeReport: -1,
        activeReportIndex: -1,
        keys: [],
        data: {},
        loading: false,
        isMax: true,
        isMin: true
    };
    private initialAtaData = {
        ATAID: -1,
        Status: -1,
        AtaNumber: -1,
        Name: ''
    };

    public selectedAta$ = new BehaviorSubject(this.initialAtaData); 
    public atas$ = new BehaviorSubject([]);
    public weeklyReports$ = new BehaviorSubject(this.initialKsData);
    public weeklyReport$ = new BehaviorSubject(null);
    public allowUpdateWeeklyReport$ = new BehaviorSubject(null);
    public allowSendOrPrintWeeklyReport$ = new BehaviorSubject(null);
    public hasChangesOnForm$ = new BehaviorSubject(false);
    public setReloadWeeklyReportByNames$ = new BehaviorSubject(false);
    public reloadWeeklyReportByNamesWithIndex$ = new BehaviorSubject(false);
    public setAllowManualCreateWeeklyReport$ = new BehaviorSubject(false);
    public allowManualAcceptWeeklyReport$ = new BehaviorSubject(false);
    public allowManualDeclineWeeklyReport$ = new BehaviorSubject(false);
    public allowManualDeclineAta$ = new BehaviorSubject(false);
    public allowManualAcceptAta$ = new BehaviorSubject(false);
    public allowPrintAta = new BehaviorSubject(false);
    public allowdownloadAtaPdf = new BehaviorSubject(false);
    public allowCreateRevisionAta$ = new BehaviorSubject(false);
    public change_ata_status = new BehaviorSubject(null);
    public allowUpdateAta$ = new BehaviorSubject(null)
    public selectedTab$ = new BehaviorSubject(0);
    public weeklyReportId$ = new BehaviorSubject(0);
    public activeKSIndex$ = new BehaviorSubject(0);
    public setActiveChildrenKSIndex$ = new BehaviorSubject(0);
    public reloadAta$ = new BehaviorSubject(0);
    public activeTab$ = new BehaviorSubject('ata');
    public allowSendtAta = new BehaviorSubject(false);
    public weeklyReportStatus = new BehaviorSubject(null);
    public ataStatus = new BehaviorSubject(null);
    public selectedAtaSub;
    public spinner$ = new BehaviorSubject(false);
    public reminderStatus= new BehaviorSubject(0);
    public ataReminderStatus= new BehaviorSubject(0);
    public ataActive: boolean = true;
    public parentKSActiv: boolean = false;
    public childKSActiv: boolean = false;
    public active: any ={}
    public activeComponent$ = new BehaviorSubject(false);
    public number_of_avaible_supp_inv:any = new BehaviorSubject(0);
    public supplier_invoices:any = new BehaviorSubject(null);
    public client_workers_and_contacts:any = new BehaviorSubject(null);
    public allowEditAta = new BehaviorSubject(true);
    public selectedTab = new BehaviorSubject(null);
    public reloadAtaFromTab = new BehaviorSubject(false);
    public reloadAtaPdf = new BehaviorSubject(false);

    constructor() {}

        /* GETTERS AND SETTERS  */


    setClientWorkers(data) {
        this.client_workers_and_contacts.next(data);
    }

    getClientWorkers() {
        return this.client_workers_and_contacts.asObservable();
    }

    setSupplierInvoices(data) {
        this.supplier_invoices.next(data);
    }

    getSupplierInvoices() {
        return this.supplier_invoices.asObservable();
    }

    setNumberOfInvoices(number) {
        this.number_of_avaible_supp_inv.next(number);
    }

    getNumberOfInvoices() {
        return this.number_of_avaible_supp_inv.asObservable();
    }


    setReminderStatus(status) {
        this.reminderStatus.next(status);
    }

    getReminderStatus() {
        return this.reminderStatus.asObservable();
    }

    setAtaReminderStatus(status) {
        this.ataReminderStatus.next(status);
    }

    getAtaReminderStatus() {
        return this.ataReminderStatus.asObservable();
    }


    setWeeklyReportStatus(status) {
        this.weeklyReportStatus.next(status);
    }

    getWeeklyReportStatus() {
        return this.weeklyReportStatus.asObservable();
    }

    setAtaStatus(status) {
        this.ataStatus.next(status);
    }

    getAtaStatus() {
        return this.ataStatus.asObservable();
    }

    setAllowSendtAta(status) {
        this.allowSendtAta.next(status);
    }

    getAllowSendtAta() {
        return this.allowSendtAta.asObservable();
    }

    setAllowCreateRevisionAta(status) {
        this.allowCreateRevisionAta$.next(status);
    }

    getAllowCreateRevisionAta() {
        return this.allowCreateRevisionAta$.asObservable();
    }

    setAllowUpdateAtaStatus(data) {
        this.change_ata_status.next(data);
    }

    getAllowUpdateAtaStatus() {
        return this.change_ata_status.asObservable();
    }

    getAllowManualDeclineAta() {
        return this.allowManualDeclineAta$.asObservable();
    }

    setAllowManualDeclineAta(status) {
        this.allowManualDeclineAta$.next(status);
    }

    setReloadAta(status) {
        this.reloadAta$.next(status);
    }


    getReloadAta() {
        return this.reloadAta$.asObservable();
    }

    setAllowManualAcceptAta(status) {
        this.allowManualAcceptAta$.next(status);
    }

    getAllowManualAcceptAta() {
        return this.allowManualAcceptAta$.asObservable();
    }

    setAllowPrintAta(status) {
        this.allowPrintAta.next(status);
    }

    getAllowPrintAta() {
        return this.allowPrintAta.asObservable();
    }


    getAllowdownloadAtaPdf() {
        return this.allowdownloadAtaPdf.asObservable();
    }

    setAllowDownloadAtaPdf(status) {
        this.allowdownloadAtaPdf.next(status);
    }

    setAllowUpdateAta(status) {
        this.allowUpdateAta$.next(status);
    }

    getAllowUpdateAta() {
        return this.allowUpdateAta$.asObservable();
    }

    setSelectedTab(number) {
        this.selectedTab$.next(number);
    }

    getSelectedTab() {
        return this.selectedTab$.asObservable();
    }


    setWeeklyReportId(id) {
        this.weeklyReportId$.next(id);
    }

    getWeeklyReportId() {
        return this.weeklyReportId$.asObservable();
    }

    setActiveKSIndex(index) {
        this.activeKSIndex$.next(index);
    }

    getActiveKSIndex() {
        return this.activeKSIndex$.asObservable();
    }

    setActiveChildrenKSIndex(index) {
        this.setActiveChildrenKSIndex$.next(index);
    }

    getActiveChildrenKSIndex() {
        return this.setActiveChildrenKSIndex$.asObservable();
    }

    setAllowManualAcceptWeeklyReport(status) {
        this.allowManualAcceptWeeklyReport$.next(status);
    }

    getAllowManualDeclineWeeklyReport() {
        return this.allowManualDeclineWeeklyReport$.asObservable();
    }

    setAllowManualDeclineWeeklyReport(status) {
        this.allowManualDeclineWeeklyReport$.next(status);
    }

    setActiveTab(tab) {
        this.activeTab$.next(tab);
    }
    
    getActiveTab() {
        return this.activeTab$.asObservable();
    }

    getAllowManualAcceptWeeklyReport() {
        return this.allowManualAcceptWeeklyReport$.asObservable();
    }

    setAllowManualCreateWeeklyReport(status) {
        this.setAllowManualCreateWeeklyReport$.next(status);
    }
    
    getAllowManualCreateWeeklyReport() {
        return this.setAllowManualCreateWeeklyReport$.asObservable();
    }

    setAtas(atas) {
        this.atas$.next(atas);
    }

    setReloadWeeklyReportByNames(status) {
        this.setReloadWeeklyReportByNames$.next(status);
    }

    setReloadWeeklyReportByNamesWithIndex(status) {
        this.reloadWeeklyReportByNamesWithIndex$.next(status);
    }

    getReloadWeeklyReportByNamesWithIndex() {
        return this.reloadWeeklyReportByNamesWithIndex$.asObservable();
    }

    getReloadWeeklyReportByNames() {
        return this.setReloadWeeklyReportByNames$.asObservable();
    }

    setIfHasChangesOnForm(status) {
        this.hasChangesOnForm$.next(status);
    }

    getIfHasChangesOnForm() {
        return this.hasChangesOnForm$.asObservable();
    }

    setAllowSendOrPrintWeeklyReport(status) {
        this.allowSendOrPrintWeeklyReport$.next(status);
    }

    getAllowSendOrPrintWeeklyReport() {
        return this.allowSendOrPrintWeeklyReport$.asObservable();
    }

    setAllowUpdateWeeklyReport(status) {
        this.allowUpdateWeeklyReport$.next(status);
    }

    getAllowUpdateWeeklyReport() {
        return this.allowUpdateWeeklyReport$.asObservable();
    }

    setSpinner(spinner) {
        this.spinner$.next(spinner);
    }

    getSpinner() {
        return this.spinner$.asObservable();
    }

    setActiveComponents(type) {
        this.activeComponent$.next(type);
    }

    getActiveComponents() {
        return this.activeComponent$.asObservable();
    }

    getAtas() {
        return this.atas$.asObservable();
    }

    resetAtas() {
        this.setAtas(this.initialAtaData);
    }

    setSelectedAta(index) {
        const sub = this.getAtas().subscribe((atas)=>{
            let selected_ata = atas[index];
            selected_ata.ata_index = index;
            this.selectedAta$.next(selected_ata);
        });
        sub.unsubscribe();
    }

    getSelectedAta() {
        return this.selectedAta$.asObservable();
    }

    setWeeklyReport(weeklyReport) {
        this.weeklyReport$.next(weeklyReport);
    }

    getWeeklyReport() {
        return this.weeklyReport$.asObservable();
    }

    setWeeklyReports(weeklyReports) {
        this.weeklyReports$.next(weeklyReports);
    }

    getWeeklyReports() {
        return this.weeklyReports$.asObservable();
    }

    resetWeeklyReports() {
        this.setWeeklyReports(this.initialKsData);
    }

    setKsLoading(loading: boolean) {
        const sub = this.weeklyReports$.pipe(take(1)).subscribe(value => { this.weeklyReports$.next({ ...value, loading: loading }) });
        sub.unsubscribe();
    }

    setAllowEditAta(edit_ata) {
        this.allowEditAta.next(edit_ata);
    }

    getAllowEditAta() {
        return this.allowEditAta.asObservable();
    }

    setReloadAtaFromTab(status) {
        this.reloadAtaFromTab.next(status);
    }

    getReloadAtaFromTab() {
        return this.reloadAtaFromTab.asObservable();
    }

    setReloadAtaPDF(status) {
        this.reloadAtaPdf.next(status);
    }

    getReloadAtaPDF() {
        return this.reloadAtaPdf.asObservable();
    }
}