const Constants = require('../../../common/constants.json')
const Protocol = require('../../../common/util/protocol')
const BaseFloor = require("./platforms/base_floor")
const Projectiles = require("./../projectiles/index")

class Landmine extends BaseFloor {

  onConstructionFinished() {
    super.onConstructionFinished()

    this.cooldown = 0
  }

  getConstantsTable() {
    return "Buildings.Landmine"
  }

  getType() {
    return Protocol.definition().BuildingType.Landmine
  }

  remove() {
    super.remove() 
  }

  trigger() {
    if (!this.isReady()) return

    let targets = this.findTargets()
    if (targets.length > 0) {
      let explosion = this.createExplosion()
      let targets = this.findExplosionTargets(explosion)
      this.addFlames(targets)
      this.remove()
    }
  }

  findTargets() {
    return this.getAttackables().map((tree) => {
      return tree.search(this.getBoundingBox())
    }).flat().filter((entity) => {
      return !this.isFriendlyUnit(entity)
    })
  }

  canDamage(entity) {
    if (entity.isPlayer()) {
      return this.getOwner() !== entity.getTeam()
    } else if (entity.isMob()) {
      if (!entity.getOwner()) return true

      return this.getOwner() !== entity.getOwner()
    } else if (entity.isBuilding()) {
      return entity.getOwner() !== this.getOwner()
    } else {
      return true
    }
  }
  
  addFlames(targets) {
    targets.forEach((target) => {
      if (target.isPlayer() || target.isMob()) {
        target.addFire()
      } else if (target.isBuilding()) {
        let building = target
        if (building.hasCategory("platform") || building.isStructure()) {
          if (!building.hasBuildingOnTop() && Math.random() < 0.6) {
            building.addFire(3, { forceFlamable: true })
          }
        }
      }
    })
  }
  
  createExplosion() {
    return this.sector.createProjectile("Explosion", {
      weapon:        this,
      source:      { x: this.getX(),         y: this.getY() },
      destination: { x: this.getX(),         y: this.getY() }
    })
  }

  getAttackables() {
    return [this.sector.playerTree, this.sector.mobTree]
  }

  executeTurn() {
    this.cooldown -= 1

    if (this.cooldown <= 0) {
      this.container.removeProcessor(this)
      this.cooldown = 0
    }
  }

  isReady() {
    return this.cooldown === 0
  }

}

module.exports = Landmine
