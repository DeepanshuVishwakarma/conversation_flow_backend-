const CrudRepository = require("./crud-repo");
const { Question } = require("../models");

class QuestionRepository extends CrudRepository {
  constructor() {
    super(Question);
  }

  async findById(id) {
    return this.model.findById(id);
  }
}

module.exports = QuestionRepository;
