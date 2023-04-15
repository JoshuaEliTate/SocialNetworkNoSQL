const { Thought, User } = require('../models');
// import sign token function from auth

module.exports = {
  getAllThoughts(req, res) {
    Thought.find({}).populate({
      path: "reactions",
      select: "-__v"
    }).select("-__v")
      .then((thoughts) => res.json(thoughts))
      .catch((err) => res.status(500).json(err));
  },

  getSingleThought({ params }, res) {
    Thought.findOne({_id: params._id}).populate({
      path: "thoughts",
      select: "-__v"   
    }).select("-__v")
    .then((dbUserData) => {
      if (!dbUserData) {
        return res
          .status(404)
          .json({ message: "No thought found with this id!" });
      }
      res.json(dbUserData);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(400);
    });
  },

  async createThought({ params, body }, res) {
    Thought.create(body)
      .then(({_id}) =>{
        return User.findOneAndUpdate(
            {_id: body.userId},
            {$push: {thought: _id}},
            {new: true}
        )
      })
      .then((user) => res.json(user))
      .catch((err) => res.json(err));
  },

  async updateThought({ params, body }, res) {
    Thought.findOneAndUpdate({_id: params._id}, body, {
      new: true,
      runValidators: true
    })
    .then((dbThoughtData) => {
      if (!dbThoughtData) {
        return res
          .status(404)
          .json({ message: "No thought found with this id!" });
      }
      res.json(dbThoughtData);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(400);
    });
  },

  async deleteThought({ params }, res) {
    Thought.findOneAndDelete({_id: params._id})
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          return res
            .status(404)
            .json({ message: "No thought found with this id!" });
        }
        
        return User.findOneAndUpdate(
            {thoughts: params.Id},
            {$pull: {thought: params.id}},
            {new: true}
        )

      })
      .then((dbUserData) => {
        if (!dbUserData) {
          return res
            .status(404)
            .json({ message: "Thought created but no user with this id!" });
        }
        res.json({message: "thought has been deleted"});
    })
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
    
  },

  async addReaction({params}, res) {
    Thought.findOneAndUpdate(
      {_id: params.thoughtId}, 
      { $addToSet: { reactions: body } },
      {
      new: true,
      runValidators: true
    })
    .then((dbThoughtData) => {
      if (!dbThoughtData) {
        return res
          .status(404)
          .json({ message: "No thought found with this id!" });
      }
      res.json(dbThoughtData);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(400);
    });

  },

  async deleteReaction({params}, res) {
    Thought.findOneAndDelete(
      {_id: params.thoughtId}, 
      { $pull: { reactions: params.reactionId } },
      {new: true,}
    )
    .then((dbThoughtData) => {
      if (!dbThoughtData) {
        return res
          .status(404)
          .json({ message: "No thought found with this id!" });
      }
      res.json(dbThoughtData);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(400);
    });

  },



}