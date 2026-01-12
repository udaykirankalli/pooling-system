require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/database');
const pollController = require("./controllers/pollController");
const setupPollSocket = require('./socket/pollSocket');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
 cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

// Connect to database
connectDB();

// REST API routes
app.post('/api/polls', pollController.createPoll.bind(pollController));
app.get('/api/polls/active', pollController.getActivePoll.bind(pollController));
app.get('/api/polls/history', pollController.getPollHistory.bind(pollController));
app.post('/api/votes', pollController.submitVote.bind(pollController));


setupPollSocket(io);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});