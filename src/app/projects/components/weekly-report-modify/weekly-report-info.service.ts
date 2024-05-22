import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeeklyReportInfoService {

    public update_wr = new BehaviorSubject(null);
    public allowSendOrPrintWeeklyReport$ = new BehaviorSubject(null);
    public weeklyReport$ = new BehaviorSubject(null);
    public weeklyReportPdfUrl$ = new BehaviorSubject(null); 
    public setReloadWeeklyReportByNames$ = new BehaviorSubject(false);
    public spinner$ = new BehaviorSubject(false);
    public activeTab$ = new BehaviorSubject('parent');
    public reminder$ = new BehaviorSubject(false);
    public allowUpdate$ = new BehaviorSubject(null);
    public get_last_email_log_but_first_client_wr = new BehaviorSubject(null);
    public selectedStatus$ = new BehaviorSubject(null);
    public active_du$ = new BehaviorSubject(null);
    public number_of_invoice = new BehaviorSubject(0);
    public selectedTab$ = new BehaviorSubject(0);
    
    constructor() { }

    setSpinner(spinner) {
        this.spinner$.next(spinner);
    }

    getSpinner() {
        return this.spinner$.asObservable();
    }

    setReloadWeeklyReportByNames(status) {
        this.setReloadWeeklyReportByNames$.next(status);
    }

    getReloadWeeklyReportByNames() {
        return this.setReloadWeeklyReportByNames$.asObservable();
    }

    setAllowUpdateWeeklyReport(data) {
        this.update_wr.next(data);
    }

    getAllowUpdateWeeklyReport() {
        return this.update_wr.asObservable();
    }

    setAllowSendOrPrintWeeklyReport(status) {
        this.allowSendOrPrintWeeklyReport$.next(status);
    }

    getAllowSendOrPrintWeeklyReport() {
        return this.allowSendOrPrintWeeklyReport$.asObservable();
    }

    setWeeklyReport(weeklyReport) {
        this.weeklyReport$.next(weeklyReport);
    }

    getWeeklyReport() {
        return this.weeklyReport$.asObservable();
    }

    setPdfUrl(url) {
        this.weeklyReportPdfUrl$.next(url);
    }

    getPdfUrl() {
        return this.weeklyReportPdfUrl$.asObservable();
    }

    setActiveTab(value) {
        this.activeTab$.next(value);
    }

    getActiveTab() {
        return this.activeTab$.asObservable();
    }

    setReminder(value) {
        this.reminder$.next(value);
    }

    getReminder() {
        return this.reminder$.asObservable();
    }

    setAllowUpdateWrAndPDF(value) {
        this.allowUpdate$.next(value);
    }

    getAllowUpdateWrAndPDF() {
        return this.allowUpdate$.asObservable();
    }

    setLastEmailLogButFirstClient(value) {
        this.get_last_email_log_but_first_client_wr.next(value);
    }

    getLastEmailLogButFirstClient() {
        return this.get_last_email_log_but_first_client_wr.asObservable();
    }

    setSelectedStatus(value) {
        this.selectedStatus$.next(value);
    }

    getSelectedStatus() {
        return this.selectedStatus$.asObservable();
    }

    setActiveDU(value) {
        this.active_du$.next(value);
    }

    getActiveDU() {
        return this.active_du$.asObservable();
    }

    setNumberOfInvoice(value) {
        this.number_of_invoice.next(value);
    }

    getNumberOfInvoice() {
        return this.number_of_invoice.asObservable();
    }

    setSelectedTab(number) {
        this.selectedTab$.next(number);
    }

    getSelectedTab() {
        return this.selectedTab$.asObservable();
    }
}