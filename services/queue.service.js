class PriorityQueue {
  constructor(io) {
    this.queue = [];
    this.io = io;
  }

  enqueue(patient) {
    this.queue.push(patient);
    this.sortQueue();

    if (patient.triageLevel === 1) {
     
      this.io.emit("critical-patient", {
        message: `🚨 Critical patient "${patient.name}" arrived!`,
      });
      //console.log("transmitted crictical patient arrived")
    }

    this.emitWaitTimes();
    console.log("checking staffing")
    this.checkStaffing();
  }

  dequeue() {
    return this.queue.shift();
  }

  getAll() {
    return this.queue;
  }

  sortQueue() {
    const waiting = this.queue.filter(p => p.status === "waiting");
    const beingTreated = this.queue.filter(p => p.status === "being treated");
    const discharged = this.queue.filter(p => p.status === "discharged");
  
    // Sort waiting patients by triage + arrival time
    waiting.sort((a, b) => {
      if (a.triageLevel !== b.triageLevel) {
        return a.triageLevel - b.triageLevel;
      }
      return a.arrivalTime - b.arrivalTime;
    });
  
    this.queue = [...waiting, ...beingTreated, ...discharged];
  }
  

  emitWaitTimes() {
    const now = Date.now();
    const waitTimes = this.queue.map((patient) => ({
      id: patient.id,
      name: patient.name,
      triageLevel: patient.triageLevel,
      waitTime: Math.floor((now - patient.arrivalTime) / 1000), // seconds
    }));

    this.io.emit("update-wait-times", waitTimes);
  }

  checkStaffing() {
    //const DOCTOR_LIMIT = 3;
    const STAFF_COUNT = 2;
    const SUPPORT_CAPACITY = STAFF_COUNT * 2; // Each staff handles 2 waiting patients
  
    const waitingPatients = this.queue.filter(p => p.status === "waiting");
    const beingTreated = this.queue.filter(p => p.status === "being treated");

    if (waitingPatients.length > SUPPORT_CAPACITY) {
      this.io.emit("staffing-alert", {
        message: `⚠️ Overload! ${waitingPatients.length} waiting patients exceeds support capacity of ${SUPPORT_CAPACITY} (6 staff x 2 patients).`,
      });
    }
  }
  
}

module.exports = PriorityQueue;

