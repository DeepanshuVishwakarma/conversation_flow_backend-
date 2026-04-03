const CrudRepository = require("./crud-repo");
const { Module } = require("../models");

class ModuleRepository extends CrudRepository {
  constructor() {
    super(Module);
  }

  async findByModuleId(moduleId) {
    return this.model.findOne({ module_id: moduleId });
  }

  async findByModuleIdWithStartQuestion(moduleId) {
    return this.model.findOne({ module_id: moduleId }).populate("startQuestion");
  }

  async getAllWithQuestions() {
    return this.model.find({}).populate("startQuestion").populate("questions");
  }
}

module.exports = ModuleRepository;
