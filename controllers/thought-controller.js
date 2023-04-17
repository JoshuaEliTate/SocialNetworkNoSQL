const { Thought, User } = require('../models');
// import sign token function from auth

module.exports = {
  getAllThoughts(req, res) {
    Thought.find({})
      .populate({
        path: "reactions",
        select: "-__v",
      })
      .select("-__v")
      .sort({ _id: -1 })
      .then((dbThoughtData) => res.json(dbThoughtData))
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  getSingleThought({ params }, res) {
    Thought.findOne({_id: params.thoughtId}).populate({
      path: "thoughtText",
      select: "-__v"   
    }).populate({
      path: "reactions",
      select: "-__v",
    })
    
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
            {$push: {thoughts: _id}},
            {new: true}
        )
      })
      .then((user) => res.json(user))
      .catch((err) => res.json(err));
  },

  async updateThought({ params, body }, res) {
    Thought.findOneAndUpdate({_id: params.thoughtId}, body, {
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
    Thought.findOneAndDelete({_id: params.thoughtId})
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          return res
            .status(404)
            .json({ message: "No thought found with this id!" });
        }
        console.log(params.Id)
        return User.findOneAndUpdate(
            {thoughts: params.Id},
            {$pull: {thought: params.id}},
            {new: true}
        )

      })
      .then(() => {

        res.json({message: "thought has been deleted"});
    })
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
    
  },

  async addReaction(req, res) {
    console.log(req.body)
    Thought.findOneAndUpdate(
      {_id: req.params.thoughtId}, 
      // { $push: { reactions: _id } },
      { $addToSet: { reactions: req.body } },
      // { $addToSet: { reactions:  req.body.username } },
      {
      new: true,
      // runValidators: true
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
    Thought.findOneAndUpdate(
      {_id: params.thoughtId}, 
      { $pull: { reactions: {_id: params.reactionId} } },
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