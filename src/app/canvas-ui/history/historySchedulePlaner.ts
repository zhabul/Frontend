import { CpspRef } from "src/app/moments/project-moments-schedule-planer/project-schedule-planer-canvas/resource-project-schedule-planer/CpspRef";
import { SendData } from "../models/SendData";

declare let $;

const MAX_HISTORY_QUEUE = 200;
let historyQueue = [];
let requestQueue = [];
let queuePosition = 0;
let tempIds = {};
let timeout = null;
const changedVariables = [
  "allDisplayProjects",
  "allDisplayProjectsOriginal",
  "allColumns",
  "visibleColumns",
  "selectedProject",
  "copySelectedProject",
  "lineConnections",
];

export default {
  dumpHistory() {
    historyQueue.length = 0;
    requestQueue.length = 0;
  },
  getHistory() {
    return historyQueue;
  },
  getRealId(tempId: number): number {
    return tempIds[tempId];
  },
  setTempId(tempId: number, realId: number) {
    tempIds[tempId] = realId;
  },
  getRequestQueue() {
    return requestQueue;
  },
  addToQueue(
    scheduledFunction: Function = null,
    undoFunction: Function = null,
    sendData: SendData = null
  ) {
    if (historyQueue.length > 0) historyQueue.length = queuePosition + 1;
    // CpspRef.cmp.selectedProject.activities=CpspRef.cmp.deepCopy(CpspRef.cmp.copySelectedProject.activities)
    if (historyQueue.length >= MAX_HISTORY_QUEUE) historyQueue.shift();
    let state = {};
    changedVariables.forEach(
      (variable) => (state[variable] = JSON.stringify(CpspRef.cmp[variable]))
    );
    if (scheduledFunction !== null) {
      requestQueue.push([{ scheduledFunction, sendData }]);
    }

    if (scheduledFunction === null)
      scheduledFunction = () => {
        return true;
      };
    if (undoFunction === null)
      undoFunction = () => {
        return true;
      };
    historyQueue.push({
      requests: [{ scheduledFunction, undoFunction, sendData }],
      state,
      saved: false,
    });
    queuePosition = historyQueue.length - 1;
  },
  appendToQueueGroup(
    scheduledFunction: Function = null,
    undoFunction: Function = null,
    sendData: SendData = null
  ) {
    if (historyQueue.length > 0) historyQueue.length = queuePosition + 1;
    // CpspRef.cmp.selectedProject.activities=CpspRef.cmp.deepCopy(CpspRef.cmp.copySelectedProject.activities)
    if (historyQueue.length >= MAX_HISTORY_QUEUE) historyQueue.shift();

    let state = {};
    changedVariables.forEach(
      (variable) => (state[variable] = JSON.stringify(CpspRef.cmp[variable]))
    );
    if (scheduledFunction !== null) {
      if (requestQueue[requestQueue.length - 1]) {
        requestQueue[requestQueue.length - 1].push({
          scheduledFunction,
          sendData,
        });
      } else {
        requestQueue.push([{ scheduledFunction, sendData }]);
      }
    }

    if (scheduledFunction === null)
      scheduledFunction = () => {
        return true;
      };
    if (undoFunction === null)
      undoFunction = () => {
        return true;
      };

    historyQueue[historyQueue.length - 1].state = state;
    historyQueue[historyQueue.length - 1].requests.push({
      scheduledFunction,
      undoFunction,
      sendData,
    });
  },
  setState(state) {
    for (const key in state) {
      if (Object.prototype.hasOwnProperty.call(state, key))
        CpspRef.cmp[key] = JSON.parse(state[key]);
    }
  },
  async executeQueue() {
    if (requestQueue.length < 1) {
      CpspRef.cmp.toastrMessage(
        "info",
        CpspRef.cmp.getTranslate().instant("No changes made!")
      );
      return false;
    }

    const statuses = [];

    for (let i = 0, n = requestQueue.length; i < n; i++) {
      for (let j = 0, m = requestQueue[i].length; j < m; j++) {
        const res = await requestQueue[i][j].scheduledFunction();
        statuses.push(res);
        if (res && requestQueue[i][j].sendData !== null) {
        }
        // CpspRef.cmp.addResourcePlanningSendMessage(
        //   requestQueue[i][j].sendData
        // );
      }
    }

    const status = statuses.every((s) => s);

    if (status) {
      historyQueue.forEach((group, i) => (group.saved = i <= queuePosition));
      requestQueue.length = 0;
      CpspRef.cmp.toastrMessage(
        "success",
        CpspRef.cmp.getTranslate().instant("Successfully saved changes!")
      );
    }

    return status;
  },
  undo() {
    if (queuePosition < 1) return;

    if (historyQueue[queuePosition].saved) {
      requestQueue.push(
        historyQueue[queuePosition].requests.map((q) => {
          return { scheduledFunction: q.undoFunction, sendData: q.sendData };
        })
      );
    } else {
      requestQueue.pop();
    }
    queuePosition--;
    this.setState(historyQueue[queuePosition].state);
    CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.selectedMomentsContainer =
      null;
    CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.highlightedRow = null;
    CpspRef.cmp.hideColumnValueInput();
    refreshDisplay();
  },
  redo() {
    if (queuePosition >= historyQueue.length - 1) return;
    queuePosition++;
    requestQueue.push(
      historyQueue[queuePosition].requests.map((q) => {
        return { scheduledFunction: q.scheduledFunction, sendData: q.sendData };
      })
    );
    this.setState(historyQueue[queuePosition].state);
    refreshDisplay();
  },
  initializeKeyShortcuts() {
    document.addEventListener("keydown", this.checkPressedKey);
  },
  checkPressedKey(e: KeyboardEvent) {
    if (e.keyCode >= 48 && e.keyCode <= 90) {
      if (
        CpspRef.cmp.columnValueInput.style.display == "block" &&
        CpspRef.cmp.deleteDetails
      ) {
        const inp = document.getElementById(
          "columnValueEditInput1"
        ) as HTMLInputElement;
        //inp.value = "";
        inp.focus();
        inp.select();
        CpspRef.cmp.deleteDetails = false;
      }
    }

    if (e.code === "Delete") {
      e.preventDefault();
      CpspRef.cmp.deleteSchedulePlanOnKeyDown();
    }
    if(!$('#columnValueEditInput1').is(':focus')){
      if (e.code === "ArrowDown" && !$('#user-search-input').is(':focus')) {
          e.preventDefault();
          CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.arrowDownORArrowUPPress(
            true
          );
      }
      if (e.code === "ArrowUp" && !$('#user-search-input').is(':focus')) {
        e.preventDefault();
        CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.arrowDownORArrowUPPress(
          false
        );
      }
      if (e.code === "ArrowRight" && !$('#user-search-input').is(':focus')) {
        e.preventDefault();
        CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.tabPress(
          true
        );
      }
      if (e.code === "ArrowLeft" && !$('#user-search-input').is(':focus')) {
        console.log("left")
        e.preventDefault();
        CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.arowLeftPress();
      }
    }
    if (e.code === "Tab") {
      e.preventDefault();
      CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.tabPress();
    }
    if (e.code === "KeyY" && e.ctrlKey) {
      e.preventDefault();
      this.undo();
    }
    if (e.code === "KeyZ" && e.ctrlKey) {
      e.preventDefault();
      this.redo();
    }
    if (e.code === "KeyS" && e.ctrlKey) {
      e.preventDefault();
      //this.executeQueue();
      CpspRef.cmp.projectSchedulePlanerApp.mainHeader
        .getHeaderMenu()
        .clickOnSave();
    }
    // if (e.code === "KeyC" && e.ctrlKey) {
    //   if(CpspRef.cmp.columnValueInput.style.display == "block"){
    //     CpspRef.cmp.selectedColumns = [];
    //     CpspRef.cmp.selectedColumnsForCopyPaste = [];
    //     CpspRef.cmp.selectedMomentsForStyleChange = []
    //     return;
    //   }
    //   e.preventDefault();
    //   localStorage.setItem("moments", JSON.stringify([]));
    //   // console.log("kopiraj",CpspRef.cmp.selectedColumns,CpspRef.cmp.selectedMomentsForStyleChange)
    //   if (CpspRef.cmp.selectedMomentsForStyleChange.length > 0) {
    //     CpspRef.cmp.selectedMomentsForCopyPaste =
    //       CpspRef.cmp.selectedMomentsForStyleChange;
    //     localStorage.setItem("moments", JSON.stringify(CpspRef.cmp.selectedMomentsForCopyPaste));
    //     CpspRef.cmp.selectedColumns = [];
    //     CpspRef.cmp.selectedColumnsForCopyPaste = [];
    //   } else if(CpspRef.cmp.selectedColumns.length > 0){
    //     // console.log("puni")
    //     CpspRef.cmp.selectedColumnsForCopyPaste = CpspRef.cmp.deepCopy(CpspRef.cmp.selectedColumns);
    //   }
    //   if (CpspRef.cmp.planInput.style.display == "block")
    //     CpspRef.cmp.copyText = CpspRef.cmp.planInput.value;
    //   else if (CpspRef.cmp.columnValueInput.style.display == "block") {
    //     CpspRef.cmp.copyText = CpspRef.cmp.inputValue;
    //   } else if (CpspRef.cmp.newColumnValueInput.style.display == "block") {
    //     CpspRef.cmp.copyText = CpspRef.cmp.newColumnValueInput.value;
    //   }
    // }
    // if (e.code === "KeyV" && e.ctrlKey) {
    //   console.log(this.value)
    //   if(CpspRef.cmp.columnValueInput.style.display == "block" &&
    //   CpspRef.cmp.selectedColumnsForCopyPaste.length == 0// &&
    //   // CpspRef.cmp.selectedMomentsForStyleChange.length == 0
    //   ){
    //     return;
    //   }

    //   e.preventDefault();

    //   if(CpspRef.cmp.selectedColumnsForCopyPaste.length > 0){
    //     // console.log("pastej")
    //     CpspRef.cmp.hideColumnValueInput();
    //     CpspRef.cmp.hideResourceWeekInput();
    //     CpspRef.cmp.hidePlanInput();
    //     console.log("paste")
    //     CpspRef.cmp.hideInput = true;
    //     CpspRef.cmp.executeCopyPasteColumns();
    //     console.log("paste2")
    //   }
    //   // else if (
    //   //   CpspRef.cmp.selectedMomentsForCopyPaste.length == 1 &&
    //   //   (CpspRef.cmp.planInput.style.display == "block" ||
    //   //     CpspRef.cmp.columnValueInput.style.display == "block" ||
    //   //     CpspRef.cmp.newColumnValueInput.style.display == "block")
    //   // )
    //   //   CpspRef.cmp.executeCopyPaste(false);
    //   // else
    //   if(CpspRef.cmp.selectedMomentsForCopyPaste.length > 1){
    //     CpspRef.cmp.constCopy++;
    //     CpspRef.cmp.selectedMomentsForStyleChange = JSON.parse(localStorage.getItem("moments"));
    //   CpspRef.cmp.selectedMomentsForCopyPaste =
    //       CpspRef.cmp.selectedMomentsForStyleChange;
    //     CpspRef.cmp.executeCopyPaste(true);
    //   }
    // }
  },
  initializeBeforeunloadEvent() {
    window.addEventListener("beforeunload", (e) => {
      if (requestQueue.length > 0) {
        e.preventDefault(); // Firefox requred preventDefault
        e.returnValue = ""; // Chrome requires returnValue to be set, if not set no popup
        return true;
      } else {
        return false;
      }
    });
  },
  getNumberOfChanges() {
    return requestQueue.length;
  },
};

function refreshDisplay() {
  if (timeout) clearTimeout(timeout);
  timeout = setTimeout(() => {
    CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer
      .getTableHeadContainer()
      .refreshDisplay();
    CpspRef.cmp.projectSchedulePlanerApp.resourcePlanningContainer.refreshDisplay();
    clearTimeout(timeout);
  }, 150);
}
