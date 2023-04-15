const { User } = require('../models');

module.exports = {
  getAllUsers(req, res) {
    User.find()
    .populate({
      path: "friends",
      
    }
    )
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => res.status(500).json(err));
  },

  getSingleUser({ params }, res) {
    User.findOne({_id: params.userId}).populate({
      path: "thoughts",
      select: "-__v"
    }).populate({
      path: "friends",
      select: "-__v"      
    }).select("-__v")
    .then((dbUserData) => {
      if (!dbUserData) {
        return res
          .status(404)
          .json({messsage: "the user you are looking for does no exist"});
      }
      res.json(dbUserData);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(400);
    });
  },

  async createUser({ body }, res) {
    User.create(body)
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => res.json(err));
  },

  async updateUser({ params, body }, res) {
    User.findOne({_id: params.userId}, body, {
      new: true,
      runValidators: true
    })
    .then((dbUserData) => {
      if (!dbUserData) {
        return res
          .status(404)
          .json({ message: "No user found with this id!" });
      }
      res.json(dbUserData);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(400);
    });
  },

  async deleteUser({ params }, res) {
    User.findOneAndDelete({_id: params.userId})
      .then((dbUserData) => {
        if (!dbUserData) {
          return res
            .status(404)
            .json({ message: "No user found with this id!" });
        }
        res.json({message: "user has been deleted"});
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
    
  },

  async addFriend({params}, res) {
    User.findOneAndUpdate({_id: params.userId}, 
      { $addToSet: { friends: params.friendId } },
      {
      new: true,
      runValidators: true
    })
    .then((dbUserData) => {
      if (!dbUserData) {
        return res
          .status(404)
          .json({ message: "No user found with this id!" });
      }
      res.json(dbUserData);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(400);
    });

  },

  async deleteFriend({params}, res) {
    User.findOneAndDelete({_id: params.userId}, 
      { $pull: { friends: params.friendId } },
      {new: true,}
    )
    .then((dbUserData) => {
      if (!dbUserData) {
        return res
          .status(404)
          .json({ message: "No user found with this id!" });
      }
      res.json(dbUserData);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(400);
    });

  },



}