const { Thought, User } = require("../models");

module.exports = {
  // get thoughts
  getThoughts(req, res) {
    Thought.find()
      .then((thought) => res.json(thought))
      .catch((err) => res.status(500).json(err));
  },
  // get single thought
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .select("__v")
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No thought with that ID" })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
  // create a new thought
  createThought(req, res) {
    Thought.create(req.body)
      .then((thought) => {
        return User.findOneAndUpdate(
          { _id: req.body.userId },
          { $push: { thoughts: thought_id } },
          { new: true }
        );
      })
      .then((dbUserData) => {
        if (!dbUserData) {
          return res
            .status(404)
            .json({ message: "No user ID to match with this thought!" });
        }
        res.json({ message: "Thought successful" });
      })
      .catch((err) => res.status(500).json(err));
  },
  // Update Thought
  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { new: true }
    )
      .then((thought) => {
        if (!thought) {
          return res.status(404).json({ message: "No user with this ID" });
        }
        res.json(thought);
      })
      .catch((err) => res.status(500).json(err));
  },
  // Delete Thought
  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.thoughtId })
      .then((thought) => {
        if (!thought) {
          return res
            .status(404)
            .json({ message: "No user ID to match with this thought!" });
        }

        return User.findOneAndUpdate(
          { _id: req.body.userId },
          { $pull: { thoughts: req.params.thoughtId } },
          { new: true }
        );
      })
      .then((thought) => {
        if (!thought) {
          return res.json({ message: "Thought successfully deleted" });
        }
      })
      .catch((err) => res.status(500).json(err));
  },
  // Add Reaction
  addReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $push: { reactions: body } },
      { new: true, runValidators: true }
    )
      .then((thoughts) => {
        if (!thoughts) {
          res
            .status(404)
            .json({ messages: "No user ID to match with this thought!" });
          return;
        }
        res.json(thoughts);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },
  // Remove Reaction
  removeReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { runValidators: true, new: true }
    )
      .then((thought) => {
        if (!thought) {
          return res.status(404).json({ message: "Reaction Failed" });
        }
        res.json(thought);
      })
      .catch((err) => res.status(500).json(err));
  },
};
