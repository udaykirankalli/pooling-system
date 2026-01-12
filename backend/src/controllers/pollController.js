const pollService = require("../services/pollService");

class PollController {
  
  async createPoll(req, res) {
    try {
      const { question, options, duration } = req.body;
      
      if (!question || !options || options.length < 2) {
        return res.status(400).json({ 
          error: 'Question and at least 2 options required' 
        });
      }

      const poll = await pollService.createPoll(question, options, duration);
      res.status(201).json(poll);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getActivePoll(req, res) {
    try {
      const poll = await pollService.getActivePoll();
      if (!poll) {
        return res.json({ poll: null });
      }

      const remainingTime = pollService.getRemainingTime(poll);
      res.json({ poll, remainingTime });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getPollHistory(req, res) {
    try {
      const history = await pollService.getPollHistory();
      res.json(history);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async submitVote(req, res) {
    try {
      const { pollId, optionIndex, studentName, sessionId } = req.body;
      
      const poll = await pollService.submitVote(
        pollId, 
        optionIndex, 
        studentName, 
        sessionId
      );
      
      res.json({ success: true, poll });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new PollController();