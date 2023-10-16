const BaseFloor = require("./platforms/base_floor")
const Constants = require("./../../../../common/constants.json")
const Protocol = require("./../../../../common/util/protocol")

class Landmine extends BaseFloor {

  constructor(game, data, isEquipDisplay) {
    super(game, data, isEquipDisplay)
  }

  getType() {
    return Protocol.definition().BuildingType.Landmine
  }

  getBaseSpritePath() {
    return "landmine.png"
  }

  getSpritePath() {
    return "landmine.png"
  }

  getConstantsTable() {
    return "Buildings.Landmine"
  }

}

module.exports = Landmine
