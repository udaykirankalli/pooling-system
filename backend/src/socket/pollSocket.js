const pollService = require('../services/pollService');

module.exports = (io) => {
  
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Teacher creates and starts poll
    socket.on('teacher:start-poll', async (pollId) => {
      try {
        const poll = await pollService.startPoll(pollId);
        io.emit('poll:started', {
          poll,
          remainingTime: poll.duration
        });

        // Auto-end poll after duration
        setTimeout(async () => {
          const endedPoll = await pollService.endPoll(pollId);
          io.emit('poll:ended', endedPoll);
        }, poll.duration * 1000);

      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    // Student joins and requests current state
    socket.on('student:join', async () => {
      try {
        const poll = await pollService.getActivePoll();
        if (poll) {
          const remainingTime = pollService.getRemainingTime(poll);
          socket.emit('poll:state', { poll, remainingTime });
        }
      } catch (error) {
        socket.emit('error', { message: 'Failed to fetch poll state' });
      }
    });

    // Student submits vote
    socket.on('student:vote', async (data) => {
      try {
        const { pollId, optionIndex, studentName, sessionId } = data;
        const poll = await pollService.submitVote(
          pollId, 
          optionIndex, 
          studentName, 
          sessionId
        );
        
        // Broadcast updated results to everyone
        io.emit('poll:update', poll);
        socket.emit('vote:success', { poll });
      } catch (error) {
        socket.emit('vote:error', { message: error.message });
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};