const CrudRepository = require("./crud-repo");
const { User } = require("../models");

class UserRepository extends CrudRepository {
  constructor() {
    super(User);
  }

  async findByUsername(username) {
    return this.model.findOne({ username });
  }

  async findById(id) {
    return this.model.findById(id);
  }

  async findByIdWithSelect(id, select) {
    return this.model.findById(id).select(select);
  }
}

module.exports = UserRepository;
