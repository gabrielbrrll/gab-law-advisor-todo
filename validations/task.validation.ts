import Joi from 'joi';

const addTask = Joi.object({
  content: Joi.string().min(1).max(200).required()
});

const updateTask = Joi.object({
  content: Joi.string().min(1).max(200).required(),
  isComplete: Joi.boolean()
}).min(1); // at least one field should be updated

const reorderTask = Joi.object({
  prevRank: Joi.string().required(),
  nextRank: Joi.string().required()
});

export default {
  addTask,
  updateTask,
  reorderTask
};
