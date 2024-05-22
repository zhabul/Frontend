import { CmpRef } from "src/app/moments/project-moments/resource-planning-app/CmpRef";
import { SendData } from "../models/SendData";

const MAX_HISTORY_QUEUE = 200;
let historyQueue = [];
let requestQueue = [];
let queuePosition = 0;
let tempIds = {};
let timeout = null;

let queueChangeNotification = (size) => null;

const changedVariables = [
  "allDisplayProjects",
  "allDisplayProjectsOriginal",
  "allColumns",
  "visibleColumns",
  "allUsers",
];

export default {
  dumpHistory() {
    historyQueue.length = 0;
    requestQueue.length = 0;
  },
  getRealId(tempId: number): number {
    return tempIds[tempId];
  },
  setTempId(tempId: number, realId: number) {
    tempIds[tempId] = realId;
  },
  addToQueue(
    scheduledFunction: Function = null,
    undoFunction: Function = null,
    sendData: SendData = null
  ) {
    if (historyQueue.length > 0) historyQueue.length = queuePosition + 1;
    if (historyQueue.length >= MAX_HISTORY_QUEUE) historyQueue.shift();

    let state = {};
    changedVariables.forEach(
      (variable) => (state[variable] = JSON.stringify(CmpRef.cmp[variable]))
    );
    if (scheduledFunction !== null)
      requestQueue.push([{ scheduledFunction, sendData }]);

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

    queueChangeNotification(historyQueue.length);
  },
  appendToQueueGroup(
    scheduledFunction: Function = null,
    undoFunction: Function = null,
    sendData: SendData = null
  ) {
    if (historyQueue.length > 0) historyQueue.length = queuePosition + 1;
    if (historyQueue.length >= MAX_HISTORY_QUEUE) historyQueue.shift();

    let state = {};
    changedVariables.forEach(
      (variable) => (state[variable] = JSON.stringify(CmpRef.cmp[variable]))
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

    queueChangeNotification(historyQueue.length);
  },
  setState(state) {
    for (const key in state) {
      if (Object.prototype.hasOwnProperty.call(state, key))
        CmpRef.cmp[key] = JSON.parse(state[key]);
    }
  },
  async executeQueue() {
    queueChangeNotification(0);

    if (requestQueue.length < 1) {
      CmpRef.cmp.toastrMessage(
        "info",
        CmpRef.cmp.getTranslate().instant("No changes made!")
      );
      return false;
    }

    const statuses = [];

    for (let i = 0, n = requestQueue.length; i < n; i++) {
      for (let j = 0, m = requestQueue[i].length; j < m; j++) {
        const res = await requestQueue[i][j].scheduledFunction();
        statuses.push(res);
        if (res && requestQueue[i][j].sendData !== null)
          CmpRef.cmp.addResourcePlanningSendMessage(
            requestQueue[i][j].sendData
          );
      }
    }

    const status = statuses.every((s) => s);

    if (status) {
      historyQueue.forEach((group, i) => (group.saved = i <= queuePosition));
      requestQueue.length = 0;
      CmpRef.cmp.toastrMessage(
        "success",
        CmpRef.cmp.getTranslate().instant("Successfully saved changes!")
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
    queueChangeNotification(historyQueue.length);
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
    queueChangeNotification(historyQueue.length);
    refreshDisplay();
  },
  initializeKeyShortcuts() {
    document.addEventListener("keydown", (e) => {
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
        this.executeQueue();
      }
    });
  },
  initializeBeforeunloadEvent() {
    window.addEventListener("beforeunload", (e) => {
      if (requestQueue.length > 0) {
        e.returnValue = ""; // Chrome requires returnValue to be set, if not set no popup
        return true;
      } else {
        return false;
      }
    });
  },
  setQueueChangeNotification(fun) {
    queueChangeNotification = fun;
  },
};

function refreshDisplay() {
  if (timeout) clearTimeout(timeout);
  timeout = setTimeout(() => {
    CmpRef.cmp.planningApp.projectUsersContainer
      .getTableHeadContainer()
      .refreshDisplay();
    CmpRef.cmp.planningApp.resourcePlanningContainer.refreshDisplay();
    clearTimeout(timeout);
  }, 150);
}
