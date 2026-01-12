const Poll = require("../models/poll");
const Vote = require("../models/vote");

class PollService {
  
  async createPoll(question, options, duration = 60) {
    try {
      const poll = new Poll({
        question,
        options: options.map(opt => ({ text: opt, votes: 0 })),
        duration,
        status: 'pending'
      });
      await poll.save();
      return poll;
    } catch (error) {
      throw new Error('Failed to create poll: ' + error.message);
    }
  }

  async startPoll(pollId) {
    try {
      const poll = await Poll.findById(pollId);
      if (!poll) throw new Error('Poll not found');
      
      poll.isActive = true;
      poll.status = 'active';
      poll.startTime = new Date();
      poll.endTime = new Date(Date.now() + poll.duration * 1000);
      
      await poll.save();
      return poll;
    } catch (error) {
      throw new Error('Failed to start poll: ' + error.message);
    }
  }

  async getActivePoll() {
    try {
      const poll = await Poll.findOne({ status: 'active' });
      return poll;
    } catch (error) {
      console.error('Error fetching active poll:', error);
      return null;
    }
  }

  async submitVote(pollId, optionIndex, studentName, sessionId) {
    try {
      // Check if poll exists and is active
      const poll = await Poll.findById(pollId);
      if (!poll || poll.status !== 'active') {
        throw new Error('Poll is not active');
      }

      if (new Date() > poll.endTime) {
        throw new Error('Poll time expired');
      }

      // Check if student already voted 
      const existingVote = await Vote.findOne({ pollId, sessionId });
      if (existingVote) {
        throw new Error('Already voted');
      }

      // Create vote
      const vote = new Vote({
        pollId,
        studentName,
        optionIndex,
        sessionId
      });
      await vote.save();

      // Update poll vote count
      poll.options[optionIndex].votes += 1;
      await poll.save();

      return poll;
    } catch (error) {
      throw error;
    }
  }

  async endPoll(pollId) {
    try {
      const poll = await Poll.findById(pollId);
      if (!poll) throw new Error('Poll not found');
      
      poll.isActive = false;
      poll.status = 'completed';
      await poll.save();
      
      return poll;
    } catch (error) {
      throw new Error('Failed to end poll: ' + error.message);
    }
  }

  async getPollHistory() {
    try {
      const polls = await Poll.find({ status: 'completed' })
        .sort({ createdAt: -1 })
        .limit(20);
      return polls;
    } catch (error) {
      console.error('Error fetching poll history:', error);
      return [];
    }
  }

  getRemainingTime(poll) {
    if (!poll || !poll.endTime) return 0;
    const remaining = Math.ceil((poll.endTime - new Date()) / 1000);
    return Math.max(0, remaining);
  }
}

module.exports = new PollService();