import RESOURCE_TYPES from 'game/RESOURCE_TYPES';
import SpellResourceCost from 'parser/shared/modules/SpellResourceCost';
import { CastEvent } from 'parser/core/Events';
import { TALENTS_DRUID } from 'common/TALENTS';

const debug = false;

const INCARN_COST_MULT = 0.8;

class SpellEnergyCost extends SpellResourceCost {
  static resourceType = RESOURCE_TYPES.ENERGY;

  getResourceCost(event: CastEvent) {
    const cost = super.getResourceCost(event);

    // no need to check for Clearcasting as the zero cost is already applied in the log

    if (this.selectedCombatant.hasBuff(TALENTS_DRUID.INCARNATION_AVATAR_OF_ASHAMANE_TALENT.id)) {
      debug &&
        console.log(
          `Cost of ${event.ability.name} reduced to ${cost * INCARN_COST_MULT} by Incarnation`,
        );
      return cost * INCARN_COST_MULT;
    }

    return cost;
  }
}

export default SpellEnergyCost;
