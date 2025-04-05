 Emergency Room Queue Management API ->
 
A backend system that manages ER patient queues based on triage level and real-time treatment limits. Built with Node.js, Express, and Socket.IO.

Base URL   http://localhost:3000/patients

Endpoints

1.  Add Patient
    POST /
    Request Body:
    {
     "name": "John Doe",
      "triageLevel": 1
    }
   triageLevel: Integer (1-5), where 1 is most critical.

  Automatically adds the patient to the sorted queue and emits:

  critical-patient if triageLevel is 1.

  update-wait-times

  staffing-alert if staff capacity exceeded.

  Responses:

  201 Created – Patient added

  400 Bad Request – Invalid input

2.  Get All Patients
    GET /

    Returns the full queue of patients sorted by:

    Triage Level (ascending)

    Arrival Time (earlier first)

    Responses:

    200 OK – Array of patients

3.  Treat Patient
    PUT /treat

    Moves the next waiting patient to "being treated".

   Logic:

   Max 3 patients can be treated at a time.

   If max is reached, emits treatment-limit-reached.

   Responses:

   200 OK – Treated patient object

   403 Forbidden – Treatment limit reached

   404 Not Found – No patients in waiting queue

4.  Discharge Patient
    DELETE /discharge/:id

   Changes patient's status to "discharged" without removing them from the queue.

   Emits:

   patient-discharged

   update-wait-times

   staffing-alert (if applicable)

   Responses:

   200 OK – Updated patient

   404 Not Found – Invalid patient ID


 Internal Logic Summary :

   1. Queue Sorting: Priority is by triageLevel, then arrivalTime.

   2. Status Options: "waiting", "being treated", "discharged"

   3. Treatment Cap: Only 3 patients can be treated at a time.

   4. Staffing Rule: 6 staff × 2 patients = 12 capacity. If waiting.length > 12, a staffing-alert is triggered.

 Technologies Used :
 
  1. Node.js + Express

  2. Socket.IO for real-time alerts

  3. In-memory queue (no database)

  4. Custom middleware for logging
