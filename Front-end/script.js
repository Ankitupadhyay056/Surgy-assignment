const socket = io("http://localhost:3000");

const messagesDiv = document.getElementById("messages");

function displayMessage(text) {
  const div = document.createElement("div");
  div.className = "message";
  div.innerText = text;
  messagesDiv.appendChild(div);
}

socket.on("critical-patient", (data) => {
    displayMessage(data.message);
  });

  socket.on("patient-treated", (data) => {
    displayMessage(`👨‍⚕️ Patient "${data.name}" is now being treated`);
  });
  
  socket.on("treatment-limit-reached", (data) => {
    displayMessage(`⛔ ${data.message}`);
  });
  
  socket.on("patient-discharged", (data) => {
    displayMessage(`✅ Patient "${data.name}" with id "${data.id}" has been discharged`);
  });
  
  socket.on("update-wait-times", (data) => {
    displayMessage(`⏳ Wait times updated for ${data.length} patients`);
  });

  socket.on("staffing-alert", (data) => {
    displayMessage(`⛔ ${data.message}`);
  });



  
