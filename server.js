const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const logger = require("./middleware/logger");
const patientRoutes = require("./routes/patient.routes");
const PriorityQueue = require("./services/queue.service");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
  },
});

const patientQueue = new PriorityQueue(io);

app.use(cors());
app.use(express.json());
app.use(logger);

// Inject patientQueue into every request
app.use((req, res, next) => {
  req.patientQueue = patientQueue;
  next();
});

app.use("/patients", patientRoutes);

io.on("connection", (socket) => {
  console.log("⚡ Client connected:", socket.id);
});

server.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
