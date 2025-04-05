const socket = io("http://localhost:3000");

const messagesDiv = document.getElementById("messages");

function displayMessage(text) {
  const div = document.createElement("div");
  div.className = "message";
  div.innerText = text;
  messagesDiv.appendChild(div);
}

// Listeners for events emitted from server

socket.on("critical-patient", (data) => {
    displayMessage(data.message);
  });
  
  // Listen for patient being treated
  socket.on("patient-treated", (data) => {
    displayMessage(`👨‍⚕️ Patient "${data.name}" is now being treated`);
  });
  
  // Listen for treatment limit alert
  socket.on("treatment-limit-reached", (data) => {
    displayMessage(`⛔ ${data.message}`);
  });
  
  // Listen for discharge notification
  socket.on("patient-discharged", (data) => {
    displayMessage(`✅ Patient "${data.name}" with id "${data.id}" has been discharged`);
  });
  
  // Listen for wait time updates
  socket.on("update-wait-times", (data) => {
    displayMessage(`⏳ Wait times updated for ${data.length} patients`);
  });

  socket.on("staffing-alert", (data) => {
    displayMessage(`⛔ ${data.message}`);
  });



  
