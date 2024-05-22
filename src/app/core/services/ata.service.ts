import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BASE_URL } from "../../config";
import { catchError, of, Subject } from "rxjs";
import "src/app/core/extensions/rxjs-observable-promise";

@Injectable({
  providedIn: "root",
})
export class AtaService {
  private getAtaStatusesUrl: string = BASE_URL + "api/ata/getAtaStatuses";
  private getAtaKSImagesUrl: string = BASE_URL + "api/ata/getAtaKSImages";
  private createAtaUrl: string = BASE_URL + "api/ata/new";
  private getAtasUrl: string = BASE_URL + "api/ata/getAtas";
  private getAllAtasForInvoiceUrl: string =
    BASE_URL + "api/ata/getAllAtasForInvoice";
  private getAtaUrl: string = BASE_URL + "api/ata/getAta";

  private manuallyRejectDeviationUrl: string =
    BASE_URL + "api/ata/manuallyRejectDeviation";
  private updateAtaCommentUrl: string = BASE_URL + "api/ata/updateAtaComment";
  private updateAtaUrl: string = BASE_URL + "api/ata/updateAta";
  private updateAtaLabelingUrl: string = BASE_URL + "api/ata/updateAtaLabeling";
  private updateAtaStatusAndReminderUrl: string =
    BASE_URL + "api/ata/updateAtaStatusAndReminder";
  private makeAtaExternalUrl: string = BASE_URL + "api/ata/makeAtaExternal";
  private addAtaStatusUrl: string = BASE_URL + "api/ata/addAtaStatus";
  private getAtaDeviationUrl: string = BASE_URL + "api/ata/getAllDeviations";
  public createDeviationUrl: string = BASE_URL + "api/ata/createDeviation";
  public becomeAtaUrl: string = BASE_URL + "api/ata/becomeAta";
  public becomeAtaRikiUrl: string = BASE_URL + "api/ata/becomeAtaRiki";
  public messageBecomeAtaUrl: string = BASE_URL + "api/ata/messageBecomeAta";
  public updateDeviationUrl: string = BASE_URL + "api/ata/updateDeviation";
  public getMessagesUrl: string = BASE_URL + "api/ata/getMessages";
  public getTypeDeviationsUrl: string = BASE_URL + "api/ata/getTypeDeviations";
  public getTypeAtasUrl: string = BASE_URL + "api/ata/getTypeAtas";
  public updateAtaPaymentTypeUrl: string =
    BASE_URL + "api/ata/updateAtaPaymentType";
  public createChildAtaUrl: string = BASE_URL + "api/ata/createChildAta";
  public getChildrenAtaUrl: string = BASE_URL + "api/ata/getChildrenAtas";
  public getNextAtaNumberUrl: string = BASE_URL + "api/ata/getNextAtaNumber";
  public getNextDeviationNumberUrl: string =
    BASE_URL + "api/ata/getNextDeviationNumber";
  public getArticlesAdditionalWorkUrl: string =
    BASE_URL + "api/ata/getArticlesAdditionalWork";
  public getArticlesmaterialUrl: string =
    BASE_URL + "api/ata/getArticlesmaterial";
  public getArticlesOtherUrl: string = BASE_URL + "api/ata/getArticlesOther";
  public sendAtaToClientUrl: string = BASE_URL + "api/ata/sendAtaToClient";
  public getAtaAndSubatasUrl: string = BASE_URL + "api/ata/getAtaAndSubatas";
  public getProjectFromAtaUrl: string = BASE_URL + "api/ata/getProjectFromAta";
  public getAtaMessagesUrl: string = BASE_URL + "api/ata/getAtaMessages";
  public sendDeviationEmailUrl: string =
    BASE_URL + "api/ata/sendDeviationEmail";
  public getAtaWorkersUrl: string = BASE_URL + "api/ata/getAtaWorkers";
  public getAtaWorkersAndResponsiblePersonsUrl: string =
    BASE_URL + "api/ata/getAtaWorkersAndResponsiblePersons";
  public getAtasForWorkerUrl: string = BASE_URL + "api/ata/getAtasForWorker";
  public updateAtaWorkersUrl: string = BASE_URL + "api/ata/updateAtaWorkers";
  public getWeeklyReportsByAtaIdUrl: string =
    BASE_URL + "api/ata/getWeeklyReportsByAtaId";
  public getWeeklyReportUrl: string =
    BASE_URL + "api/ata/getWeeklyReportTotals";
  public createWeeklyReportUrl: string =
    BASE_URL + "api/ata/createWeeklyReport";
  public createWeeklyReportItemsUrl: string =
    BASE_URL + "api/ata/createWeeklyReportItems";
  public sendWeeklyReportUrl: string = BASE_URL + "api/ata/sendWeeklyReport";
  public getAtasForProjectManagersAndAdministratorUrl: string =
    BASE_URL + "api/ata/getAtasForProjectManagersAndAdministrator";
  public getAtasForTidUrl: string = BASE_URL + "api/ata/getAtasForTid";
  public getAtasForTidImpUrl: string = BASE_URL + "api/ata/getAtasForTidImp";
  public getCompletedAtasForProjectManagersAndAdministratorUrl: string =
    BASE_URL + "api/ata/getCompletedAtasForProjectManagersAndAdministrator";
  public getAtasForProjectSupplierInvoiceUrl: string =
    BASE_URL + "api/ata/getAtasForProjectSupplierInvoice";
  public getEmailLogsForAtaUrl: string =
    BASE_URL + "api/ata/getEmailLogsForAta";
  public getEmailLogsForDeviationUrl: string =
    BASE_URL + "api/ata/getEmailLogsForDeviation";
  public answerOnEmailUrl: string = BASE_URL + "api/ata/answerOnEmail";
  public answerOnAtaEmailUrl: string = BASE_URL + "api/ata/answerOnAtaEmail";
  public confirmAtaStatusUrl: string = BASE_URL + "api/ata/confirmAtaStatus";
  public createMessageFromClientUrl: string =
    BASE_URL + "api/ata/createMessageFromClient";
  public sendAtasSummaryToClientUrl: string =
    BASE_URL + "api/ata/sendAtasSummaryToClient";
  public sendDeviationSummaryToClientUrl: string =
    BASE_URL + "api/ata/sendDeviationSummaryToClient";
  public disableEditAtaUrl: string = BASE_URL + "api/ata/disableEditAta";
  public getProjectExternalAtasUrl: string =
    BASE_URL + "api/ata/getProjectExternalAtas";
  public getProjectInternalAtasUrl: string =
    BASE_URL + "api/ata/getProjectInternalAtas";
  public getInternalAtaAndSubatasUrl: string =
    BASE_URL + "api/ata/getInternalAtaAndSubatas";
  public getNotSendWeeklyReportsByAtaIdUrl: string =
    BASE_URL + "api/ata/getNotSendWeeklyReportsByAtaId";
  public getNotSendWeeklyReportsByAtaIdOnlyNamesUrl: string =
    BASE_URL + "api/weeklyreport/getNotSendWeeklyReportsByAtaIdOnlyNames";
  public getProjectExternalDeviationsUrl: string =
    BASE_URL + "api/ata/getProjectExternalDeviations";
  public getProjectInternalDeviationsUrl: string =
    BASE_URL + "api/ata/getProjectInternalDeviations";
  public updateWeeklyReportPdfUrl: string =
    BASE_URL + "api/ata/updateWeeklyReportPdf";
  public refreshAdministrationUserAndAtaUrl: string =
    BASE_URL + "api/ata/refreshAdministrationUserAndAta";
  public manuallyAcceptAtaUrl: string = BASE_URL + "api/ata/manuallyAcceptAta";
  public manuallyRejectAtaUrl: string = BASE_URL + "api/ata/manuallyRejectAta";
  public manuallyCreateRevisionUrl: string =
    BASE_URL + "api/ata/manuallyCreateRevision";
  public manuallyAcceptDeviationUrl: string =
    BASE_URL + "api/ata/manuallyAcceptDeviation";
  public removeAtaUpdateIsDeletedUrl: string =
    BASE_URL + "api/ata/removeAtaUpdateIsDeleted";

  public removeDeviationUpdateIsDeletedUrl: string =
    BASE_URL + "api/ata/removeDeviationUpdateIsDeleted";

  public manuallyCreateWeeklyReportUrl: string =
    BASE_URL + "api/ata/manuallyCreateWeeklyReport";
  public getSupplierInoviceForAtaUrl: string =
    BASE_URL + "api/ata/getSupplierInoviceForAta";
  public getAtestedAtaMomentsUrl: string =
    BASE_URL + "api/ata/getAtestedAtaMoments";
  public getAllAtasByProjectIdsUrl: string =
    BASE_URL + "api/ata/getAllAtasByProjectIds";
  private updateAtaAvvikelseDeviationUrl: string =
    BASE_URL + "api/ata/updateAtaAvvikelseDeviation";
  private removeSelectedDocumentsAtaUrl: string =
    BASE_URL + "api/ata/removeSelectedDocumentsAta";
  private removeSelectedDocumentsKSUrl: string =
    BASE_URL + "api/ata/removeSelectedDocumentsKS";
  private removeSelectedDocumentsDeviationUrl: string =
    BASE_URL + "api/ata/removeSelectedDocumentsDeviation";
  public getFilteredAtaStatusesUrl: string =
    BASE_URL + "api/ata/getFilteredAtaStatuses";
  private getPrognosisUrl: string = BASE_URL + "api/ata/getPrognosis";
  private updateAtaPrognosisUrl: string =
    BASE_URL + "api/ata/updateAtaPrognosis";
  private sendSamastalingForPrognosisToClientUrl: string =
    BASE_URL + "api/ata/sendSamastalingForPrognosisToClient";
  private printSamastalingForPrognosisToClientUrl: string =
    BASE_URL + "api/ata/printSamastalingForPrognosisToClient";
  public createAdditionalWorkPdfUrl: string =
    BASE_URL + "api/weeklyreport/createAdditionalWorkPdf";
  private updateAtaLabelingRequirementsUrl: string =
    BASE_URL + "api/ata/updateAtaLabelingRequirements";
  private updateAtaCustomCommentUrl: string =
    BASE_URL + "api/ata/updateAtaCustomComment";
  private getAllowRemoveDeviationUrl: string =
    BASE_URL + "api/ata/getAllowRemoveDeviation";
    public sendAtasWeeklyReportsToClientUrl: string =
    BASE_URL + "api/ata/sendAtasWeeklyReportsToClient";

  public ata = new Subject<any>();
  public deviation = new Subject<any>();
  public messages = new Subject<any>();
  public showQuestionsAndAnswers = new Subject<any>();
  public informAboutNewAnswers = new Subject<any>();
  public showDeviation = new Subject<any>();
  public updateSupplierInvoicesIsNewFieldUrl: string =
    BASE_URL + "api/ata/updateSupplierInvoicesIsNewField";

  public updateStatusUrl: string = BASE_URL + "api/ata/updateStatus";

  private headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
      "X-Requested-With": "XMLHttpRequest",
    });
  }

  getAtaStatuses() {
    return this.http.get(this.getAtaStatusesUrl, { headers: this.headers });
  }

  createAta(data) {
    return this.http.post(this.createAtaUrl, data, {
      headers: this.headers,
      reportProgress: true,
      observe: "events",
    });
  }

  getAtas(id) {
    return this.http.get(`${this.getAtasUrl}/${id}`, { headers: this.headers });
  }

  getAllAtasForInvoice(id, from_newInvComponent:any = 'new') {
    return this.http.get(`${this.getAllAtasForInvoiceUrl}/${id}/${from_newInvComponent}`, {
      headers: this.headers,
    });
  }

  getAtaDeviation(id) {
    return this.http.get(`${this.getAtaDeviationUrl}/${id}`, {
      headers: this.headers,
    });
  }

  setAta(data) {
    this.ata.next(data);
  }

  setMessages(data) {
    this.messages.next(data);
  }

  setDeviation(deviation, messages) {
    let object = {
      deviation: deviation,
      messages: messages,
    };
    this.deviation.next(object);
  }

  setShowQuestionsAndAnswers(data) {
    this.showQuestionsAndAnswers.next(data);
  }

  setInformAboutNewAnswers(data) {
    this.informAboutNewAnswers.next(data);
  }

  showDeviationComponent() {
    this.showDeviation.next(false);
  }

  getAta(id) {
    return this.http.get(`${this.getAtaUrl}/${id}`, { headers: this.headers });
  }

  updateAtaComment(data) {
    return this.http.post(this.updateAtaCommentUrl, data, {
      headers: this.headers,
    });
  }

  updateAta(ata): Promise<any> {
    return this.http
      .post(this.updateAtaUrl, ata, { headers: this.headers })
      .toPromise2();
  }

  updateAtaStatusAndReminder(ata): Promise<any> {
    return this.http
      .post(this.updateAtaStatusAndReminderUrl, ata, { headers: this.headers })
      .toPromise2();
  }

  updateAtaLabeling(data): Promise<any> {
    return this.http
      .post(this.updateAtaLabelingUrl, data, { headers: this.headers })
      .toPromise2();
  }

  updateStatus(ata_id, status): Promise<any> {
    let obj = {
      ata_id: ata_id,
      status: status,
    };
    return this.http
      .post(this.updateStatusUrl, obj, { headers: this.headers })
      .toPromise2();
  }

  makeAtaExternal(ataId) {
    return this.http.post(this.makeAtaExternalUrl, ataId, {
      headers: this.headers,
    });
  }

  createAtaStatus(ata_status) {
    return this.http.post(this.addAtaStatusUrl, ata_status, {
      headers: this.headers,
    });
  }

  createDeviation(deviation) {
    return this.http.post(this.createDeviationUrl, deviation, {
      headers: this.headers,
      reportProgress: true,
      observe: "events",
    });
  }

  BecomeATA(ataId, projectId, selectedPaymentType, becomeAtaFromDeviation = 0) {
    return this.http.post(
      `${this.becomeAtaUrl}/${ataId}/${projectId}/${selectedPaymentType}/${becomeAtaFromDeviation}`,
      { headers: this.headers }
    );
  }

  BecomeATARiki(data) {
    return this.http.post(`${this.becomeAtaRikiUrl}`, data, {
      headers: this.headers,
    });
  }

  messageBecomeATA(deviation) {
    return this.http.post(this.messageBecomeAtaUrl, deviation, {
      headers: this.headers,
    });
  }

  updateDeviation(data) {
    return this.http.post(this.updateDeviationUrl, data, {
      headers: this.headers,
      reportProgress: true,
      observe: "events",
    });
  }

  getMessages(ata_id) {
    return this.http.get(`${this.getMessagesUrl}/${ata_id}`, {
      headers: this.headers,
    });
  }

  getTypeDeviations() {
    return this.http.get(this.getTypeDeviationsUrl, { headers: this.headers });
  }

  getTypeAtas() {
    return this.http.get(this.getTypeAtasUrl, { headers: this.headers });
  }

  updateAtaPaymentType(payment, ata) {
    ata = {
      payment: payment,
      ata: ata,
    };

    return this.http.post(this.updateAtaPaymentTypeUrl, ata, {
      headers: this.headers,
    });
  }

  createChildAta(data) {
    return this.http.post(this.createChildAtaUrl, data, {
      headers: this.headers,
    });
  }

  getChildrenAta(ata_id) {
    return this.http.get(`${this.getChildrenAtaUrl}/${ata_id}`, {
      headers: this.headers,
    });
  }

  getArticlesAdditionalWork(id, projectId) {
    return this.http.get(`${this.getArticlesAdditionalWorkUrl}/${id}/${projectId}`, {
      headers: this.headers,
    });
  }

  getArticlesmaterial(id, projectId) {
    return this.http.get(`${this.getArticlesmaterialUrl}/${id}/${projectId}`, {
      headers: this.headers,
    });
  }

  getArticlesOther(id, projectId) {
    return this.http.get(`${this.getArticlesOtherUrl}/${id}/${projectId}`, {
      headers: this.headers,
    });
  }

  getNextAtaNumber(projectId) {
    return this.http.get(`${this.getNextAtaNumberUrl}/${projectId}`, {
      headers: this.headers,
    });
  }

  getNextDeviationNumber(projectId) {
    return this.http.get(`${this.getNextDeviationNumberUrl}/${projectId}`, {
      headers: this.headers,
    });
  }

  getAtaAndSubatas(ataId): Promise<any> {
    return this.http
      .get(`${this.getAtaAndSubatasUrl}/${ataId}`, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })))
      .toPromise2();
  }

  getInternalAtaAndSubatas2(ataId): Promise<any> {
    return this.http
      .get(`${this.getInternalAtaAndSubatasUrl}/${ataId}`, {
        headers: this.headers,
      })
      .pipe(catchError(() => of({ status: false })))
      .toPromise2();
  }

  getInternalAtaAndSubatas(ataId, projectId, type) {
    return this.http
      .get(`${this.getInternalAtaAndSubatasUrl}/${ataId}/${projectId}/${type}`, {
        headers: this.headers,
      })
      .pipe(catchError(() => of({ status: false })));
  }

  getProjectFromAta(ataId) {
    return this.http
      .get(`${this.getProjectFromAtaUrl}/${ataId}`, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  getAtaMessages(id) {
    return this.http.get(`${this.getAtaMessagesUrl}/${id}`, {
      headers: this.headers,
    });
  }

  sendAtaToClient(ata, data) {
    return this.http
      .post(
        `${this.sendAtaToClientUrl}`,
        { ata, data },
        { headers: this.headers }
      )
      .pipe(catchError(() => of({ status: false })));
  }

  sendAtasSummaryToClient(emails, atas, project, type = "externalAta") {
    const data = {
      emails: emails,
      atas: atas,
      project: project,
      type: type,
    };

    return this.http
      .post(`${this.sendAtasSummaryToClientUrl}`, data, {
        headers: this.headers,
      })
      .pipe(catchError(() => of({ status: false })));
  }

  sendDeviationSummaryToClient(emails, atas, project, type_of_deviation) {
    const data = {
      emails: emails,
      atas: atas,
      project: project,
      type_of_deviation: type_of_deviation,
    };

    return this.http
      .post(`${this.sendDeviationSummaryToClientUrl}`, data, {
        headers: this.headers,
      })
      .pipe(catchError(() => of({ status: false })));
  }

  sendDeviationEmail(ata, data) {
    return this.http.post(`${this.sendDeviationEmailUrl}/${ata}`, data, {
      headers: this.headers,
    });
  }

  getAtaWorkers(projectId, ataId) {
    return this.http.get(`${this.getAtaWorkersUrl}/${projectId}/${ataId}`, {
      headers: this.headers,
    });
  }

  getAtaWorkersAndResponsiblePersons(projectId, ataId) {
    return this.http.get(
      `${this.getAtaWorkersAndResponsiblePersonsUrl}/${projectId}/${ataId}`,
      { headers: this.headers }
    );
  }

  getAtasForWorker(projectId, userId) {
    return this.http.get(`${this.getAtasForWorkerUrl}/${projectId}/${userId}`, {
      headers: this.headers,
    });
  }

  getAtasForProjectManagersAndAdministrator(projectId): Promise<any> {
    return this.http
      .get(
        `${this.getAtasForProjectManagersAndAdministratorUrl}/${projectId}`,
        { headers: this.headers }
      )
      .toPromise2();
  }

  getAtasForTid(projectId) {
    return this.http.get(`${this.getAtasForTidUrl}/${projectId}`, {
      headers: this.headers,
    });
  }

  getAtasForTidImp(project_id, user_id) {
    const data = {
      project_id: project_id,
      user_id: user_id,
    };

    return this.http.post(this.getAtasForTidImpUrl, data, {
      headers: this.headers,
    });
  }

  getCompletedAtasForProjectManagersAndAdministrator(projectId) {
    return this.http.get(
      `${this.getCompletedAtasForProjectManagersAndAdministratorUrl}/${projectId}`,
      { headers: this.headers }
    );
  }

  getAtasForProjectSupplierInvoice(projectId) {
    return this.http.get(
      `${this.getAtasForProjectSupplierInvoiceUrl}/${projectId}`,
      { headers: this.headers }
    );
  }

  getAllAtasByProjectIds(ids) {
    return this.http.post(this.getAllAtasByProjectIdsUrl, ids, {
      headers: this.headers,
    });
  }

  updateAtaWorkers(userId, ataId, isChecked, projectId) {
    return this.http.get(
      `${this.updateAtaWorkersUrl}/${userId}/${ataId}/${isChecked}/${projectId}`,
      { headers: this.headers }
    );
  }

  getWeeklyReportsByAtaId(ataId, project_id = 0): Promise<any> {
    return this.http
      .get(`${this.getWeeklyReportsByAtaIdUrl}/${ataId}/${project_id}`, {
        headers: this.headers,
      })
      .toPromise2();
  }

  getWeeklyReportTotals(wrId) {
    return this.http.get(`${this.getWeeklyReportUrl}/${wrId}`, {
      headers: this.headers,
    });
  }

  createWeeklyReport(data) {
    return this.http.post(this.createWeeklyReportUrl, data, {
      headers: this.headers,
    });
  }

  createWeeklyReportItems(id) {
    return this.http.get(`${this.createWeeklyReportItemsUrl}/${id}`, {
      headers: this.headers,
    });
  }

  sendWeeklyReport(contacts, report) {
    return this.http.post(
      this.sendWeeklyReportUrl,
      { contacts, report },
      { headers: this.headers }
    );
  }


  getEmailLogsForAta(ataId, projectid = 0) {
    return this.http.get(`${this.getEmailLogsForAtaUrl}/${ataId}/${projectid}`, {
      headers: this.headers,
    });
  }

  getEmailLogsForDeviation(ataId, projectId) {
    return this.http.get(`${this.getEmailLogsForDeviationUrl}/${ataId}/${projectId}`, {
      headers: this.headers,
    });
  }

  answerOnEmail(email, ataID, messageID, token, CwId, group) {
    return this.http.get(
      `${this.answerOnEmailUrl}/${email}/${ataID}/${messageID}/${token}/${CwId}/${group}`,
      { headers: this.headers }
    );
  }

  answerOnAtaEmail(email, ataID, messageID, token, CwId, group) {
    return this.http.get(
      `${this.answerOnAtaEmailUrl}/${email}/${ataID}/${messageID}/${token}/${CwId}/${group}`,
      { headers: this.headers }
    );
  }

  confirmAtaStatus(data) {
    return this.http.post(this.confirmAtaStatusUrl, data, {
      headers: this.headers,
    });
  }

  createMessageFromClient(data) {
    return this.http.post(this.createMessageFromClientUrl, data, {
      headers: this.headers,
    });
  }

  disableEditAta(ataId) {
    return this.http.post(this.disableEditAtaUrl, ataId, {
      headers: this.headers,
    });
  }

  getProjectExternalAtas(projectId) {
    return this.http.get(`${this.getProjectExternalAtasUrl}/${projectId}`, {
      headers: this.headers,
    });
  }

  getProjectInternalAtas(projectId) {
    return this.http.get(`${this.getProjectInternalAtasUrl}/${projectId}`, {
      headers: this.headers,
    });
  }

  getNotSendWeeklyReportsByAtaId(ataId, wrId = null, projectId): Promise<any> {
    return this.http
      .get(`${this.getNotSendWeeklyReportsByAtaIdUrl}/${ataId}/${wrId}/${projectId}`, {
        headers: this.headers,
      })
      .toPromise2();
  }

  getNotSendWeeklyReportsByAtaIdOnlyNames(ataId, wrId = null, notification_wr_id = 0): Promise<any> {
    return this.http
      .get(
        `${this.getNotSendWeeklyReportsByAtaIdOnlyNamesUrl}/${ataId}/${wrId}/${notification_wr_id}`,
        { headers: this.headers }
      )
      .toPromise2();
  }

  getProjectExternalDeviations(projectId) {
    return this.http.get(
      `${this.getProjectExternalDeviationsUrl}/${projectId}`,
      { headers: this.headers }
    );
  }

  updateWeeklyReportPdf(wrId, client_worker = null, sendCopy): Promise<any> {
    return this.http
      .get(
        `${this.updateWeeklyReportPdfUrl}/${wrId}/${client_worker}/${sendCopy}`,
        { headers: this.headers }
      )
      .toPromise2();
  }

  getProjectInternalDeviations(projectId) {
    return this.http.get(
      `${this.getProjectInternalDeviationsUrl}/${projectId}`,
      { headers: this.headers }
    );
  }

  refreshAdministrationUserAndAta(ata_id, projectId): Promise<any> {
    return this.http
      .get(`${this.refreshAdministrationUserAndAtaUrl}/${ata_id}/${projectId}`, {
        headers: this.headers,
      })
      .toPromise2();
  }

  manuallyAcceptAta(ataId) {
    return this.http.get(`${this.manuallyAcceptAtaUrl}/${ataId}`, {
      headers: this.headers,
    });
  }

  manuallyRejectAta(ataId, projectId) {
    return this.http.get(`${this.manuallyRejectAtaUrl}/${ataId}/${projectId}`, {
      headers: this.headers,
    });
  }

  manuallyCreateRevision(data) {
    return this.confirmAtaStatus(data);
  }

  manuallyAcceptDeviation(messageId, ataId, projectId) {
    return this.http.get(
      `${this.manuallyAcceptDeviationUrl}/${messageId}/${ataId}/${projectId}`,
      { headers: this.headers }
    );
  }

  removeAtaUpdateIsDeleted(data) {
    return this.http.post(this.removeAtaUpdateIsDeletedUrl, data, {
      headers: this.headers,
    });
  }

  removeDeviationUpdateIsDeleted(data) {
    return this.http.post(this.removeDeviationUpdateIsDeletedUrl, data, {
      headers: this.headers,
    });
  }

  manuallyCreateWeeklyReport(projectId, ataId) {
    return this.http.get(
      `${this.manuallyCreateWeeklyReportUrl}/${projectId}/${ataId}`,
      { headers: this.headers }
    );
  }

  removeSelectedDocumentsAta(data) {
    return this.http.post(this.removeSelectedDocumentsAtaUrl, data, {
      headers: this.headers,
    });
  }

  removeSelectedDocumentsDeviation(data) {
    return this.http.post(this.removeSelectedDocumentsDeviationUrl, data, {
      headers: this.headers,
    });
  }

  removeSelectedDocumentsKS(data) {
    return this.http.post(this.removeSelectedDocumentsKSUrl, data, {
      headers: this.headers,
    });
  }

  getSupplierInoviceForAta(projectId, ataId, ataNumber, ataParentId) {
    return this.http.get(
      `${this.getSupplierInoviceForAtaUrl}/${projectId}/${ataId}/${ataNumber}/${ataParentId}`,
      { headers: this.headers }
    );
  }

  updateSupplierInvoicesIsNewField(data) {
    return this.http.post(this.updateSupplierInvoicesIsNewFieldUrl, data, {
      headers: this.headers,
    });
  }

  getAtestedAtaMoments(project_id, ata_id, ata_number, parent_ata_id) {
    return this.http.get(
      `${this.getAtestedAtaMomentsUrl}/${project_id}/${ata_id}/${ata_number}/${parent_ata_id}`,
      { headers: this.headers }
    );
  }

  updateAtaAvvikelseDeviation(data): Promise<any> {
    return this.http
      .post(this.updateAtaAvvikelseDeviationUrl, data, {
        headers: this.headers,
      })
      .pipe(catchError(() => of({ status: false })))
      .toPromise2();
  }

  getAtaKSImages(ata_id, projectId) {
    return this.http.get(`${this.getAtaKSImagesUrl}/${ata_id}/${projectId}`, {
      headers: this.headers,
    });
  }

  getFilteredAtaStatuses(ata_status, type, ata_id = 0, project_id = 0) {
    return this.http.get(
      `${this.getFilteredAtaStatusesUrl}/${ata_status}/${type}/${ata_id}/${project_id}`,
      { headers: this.headers }
    );
  }

  createAdditionalWorkPdf(data) {
    return this.http.post(this.createAdditionalWorkPdfUrl, data, {
      headers: this.headers,
    });
  }

  getPrognosis(id) {
    return this.http.get(`${this.getPrognosisUrl}/${id}`, {
      headers: this.headers,
    });
  }

  updateAtaPrognosis(data) {
    return this.http.post(this.updateAtaPrognosisUrl, data, {
      headers: this.headers,
    });
  }

  sendSamastalingForPrognosisToClient(data) {
    return this.http.post(this.sendSamastalingForPrognosisToClientUrl, data, {
      headers: this.headers,
    });
  }

  printSamastalingForPrognosisToClient(data) {
    return this.http.post(this.printSamastalingForPrognosisToClientUrl, data, {
      headers: this.headers,
    });
  }

  private manuallyAbortDeviationUrl: string =
  BASE_URL + "api/ata/manuallyAbortDeviation";

  manuallyAbortDeviation(messageId, ataId, projectId) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http.get(
      `${this.manuallyAbortDeviationUrl}/${messageId}/${ataId}/${projectId}`,
      { headers: headers }
    );
  }

  manuallyRejectDeviation(messageId, ataId, projectId) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http.get(
      `${this.manuallyRejectDeviationUrl}/${messageId}/${ataId}/${projectId}`,
      { headers: headers }
    );
  }

  manuallyCreateRevisionDeviation(data) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.createMessageFromClient(data);
  }

  downloadDocumentsZip(
    project_id: number,
    type: "ata" | "du" | "deviation",
    emails: string[]
  ) {
    return this.http.post(
      `${BASE_URL}api/project/document/collection/${project_id}/${type}`,
      { emails },
      { headers: this.headers }
    );
  }

  updateAtaLabelingRequirements(data) {
    return this.http.post(this.updateAtaLabelingRequirementsUrl, data, {
      headers: this.headers,
    });
  }

  updateAtaCustomComment(data) {
    return this.http.post(this.updateAtaCustomCommentUrl, data, {
      headers: this.headers,
    });
  }

  getAllowRemoveDeviation(data) {
    return this.http.post(this.getAllowRemoveDeviationUrl, data, {
      headers: this.headers,
    });
  }

  sendAtasWeeklyReportsToClient(emails, atas, project, type = "ks") {
    const data = {
      emails: emails,
      atas: atas,
      project: project,
      type: type,
    };

    return this.http
      .post(`${this.sendAtasWeeklyReportsToClientUrl}`, data, {
        headers: this.headers,
      })
      .pipe(catchError(() => of({ status: false })));
  }
}
