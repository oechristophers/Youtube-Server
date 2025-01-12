import { createError } from "../error.js";
import User from "../models/User.js";
import Video from "../models/Video.js";

export const update = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    try {
      // Validate and sanitize incoming data
      const allowedUpdates = (({ name, email, img }) => ({ name, email, img }))(
        req.body
      );

      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { $set: allowedUpdates },
        { new: true, runValidators: true }
      );

      // Respond with sanitized user data
      res.status(200).json({
        ...updatedUser._doc,
        password: undefined, // Hide sensitive data
      });
    } catch (err) {
      next(err);
    }
  } else {
    return next(createError(403, "You can update only your account!"));
  }
};

export const deletee = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    try {
      const updatedUser = await User.findByIdAndDelete(req.params.id);
      res.status(200).json("User has been deleted");
    } catch (err) {
      next(err);
    }
  } else {
    return next(createError(403, "You can delete only your account!"));
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};
export const subscribe = async (req, res, next) => {
  try {
    console.log("Subscription request received:", {
      userId: req.user.id,
      channelId: req.params.id,
    });

    const user = await User.findById(req.user.id);
    if (!user) {
      throw createError(404, "User not found");
    }

    const channel = await User.findById(req.params.id);
    if (!channel) {
      throw createError(404, "Channel not found");
    }

    await User.findByIdAndUpdate(req.user.id, {
      $addToSet: { subscribedUsers: req.params.id },
    });
    await User.findByIdAndUpdate(req.params.id, {
      $inc: { subscribers: 1 },
    });

    console.log("Subscription successful");
    res.status(200).json("Subscription successful");
  } catch (err) {
    console.error("Error during subscription:", err);
    next(err);
  }
};
export const unsubscribe = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { subscribedUsers: req.params.id },
    });
    await User.findByIdAndUpdate(req.params.id, {
      $inc: { subscribers: -1 },
    });
    console.log("you are no longer subscribed");
    res.status(200).json("You are no longer subscribed to this Channel");
  } catch (err) {
    next(err);
  }
};
export const like = async (req, res, next) => {
  const id = req.user.id;
  const videoId = req.params.videoId;
  try {
    await Video.findByIdAndUpdate(videoId, {
      $addToSet: { likes: id },
      $pull: { dislikes: id },
    });
    res.status(200).json("The video has been liked.");
  } catch (err) {
    next(err);
  }
};
export const dislike = async (req, res, next) => {
  const id = req.user.id;
  const videoId = req.params.videoId;
  try {
    await Video.findByIdAndUpdate(videoId, {
      $addToSet: { dislikes: id },
      $pull: { likes: id },
    });
    res.status(200).json("The video has been disliked.");
  } catch (err) {
    next(err);
  }
};
