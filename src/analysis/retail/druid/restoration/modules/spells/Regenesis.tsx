import Analyzer, { SELECTED_PLAYER } from 'parser/core/Analyzer';
import { Options } from 'parser/core/Module';
import { TALENTS_DRUID } from 'common/TALENTS';
import { REJUVENATION_BUFFS } from 'analysis/retail/druid/restoration/constants';
import SPELLS from 'common/SPELLS';
import Events, { HealEvent } from 'parser/core/Events';
import { calculateEffectiveHealing } from 'parser/core/EventCalculateLib';
import Statistic from 'parser/ui/Statistic';
import STATISTIC_ORDER from 'parser/ui/STATISTIC_ORDER';
import STATISTIC_CATEGORY from 'parser/ui/STATISTIC_CATEGORY';
import BoringSpellValueText from 'parser/ui/BoringSpellValueText';
import ItemPercentHealingDone from 'parser/ui/ItemPercentHealingDone';
import { SpellLink } from 'interface';

const REJUV_MAX_BOOST_PER_RANK = 0.1;
const TRANQ_MAX_BOOST_PER_RANK = 0.2;

/**
 * **Regenesis**
 * Spec Talent
 *
 * Rejuvenation healing is increased by up to (10 / 20)%, and Tranquility healing is increased by
 * up to (20 / 40)%, healing for more on low-health targets.
 */
class Regenesis extends Analyzer {
  ranks: number;
  rejuvBoostHealing: number = 0;
  tranqBoostHealing: number = 0;

  constructor(options: Options) {
    super(options);

    this.ranks = this.selectedCombatant.getTalentRank(TALENTS_DRUID.REGENESIS_TALENT);
    this.active = this.ranks > 0;

    this.addEventListener(
      Events.heal.by(SELECTED_PLAYER).spell(REJUVENATION_BUFFS),
      this.onRejuvHeal,
    );
    this.addEventListener(
      Events.heal.by(SELECTED_PLAYER).spell(SPELLS.TRANQUILITY_HEAL),
      this.onTranqHeal,
    );
  }

  onRejuvHeal(event: HealEvent) {
    this.rejuvBoostHealing += this._getBoostHealing(event, REJUV_MAX_BOOST_PER_RANK * this.ranks);
  }

  onTranqHeal(event: HealEvent) {
    this.tranqBoostHealing += this._getBoostHealing(event, TRANQ_MAX_BOOST_PER_RANK * this.ranks);
  }

  _getBoostHealing(event: HealEvent, boostAmount: number): number {
    // looks like the scaling on the boost is linear, with max boost when target is at 0% and no boost when target is full
    const healthPercentMissingBeforeHeal =
      1 - (event.hitPoints - event.amount) / event.maxHitPoints;
    return calculateEffectiveHealing(event, boostAmount * healthPercentMissingBeforeHeal);
  }

  get totalHealing() {
    return this.rejuvBoostHealing + this.tranqBoostHealing;
  }

  statistic() {
    return (
      <Statistic
        size="flexible"
        position={STATISTIC_ORDER.OPTIONAL(7)} // number based on talent row
        category={STATISTIC_CATEGORY.TALENTS}
        tooltip={
          <>
            Breakdown by boosted spell:
            <ul>
              <li>
                <SpellLink id={SPELLS.REJUVENATION.id} />:{' '}
                <strong>{this.owner.formatItemHealingDone(this.rejuvBoostHealing)}</strong>
              </li>
              <li>
                <SpellLink id={SPELLS.TRANQUILITY_HEAL.id} />:{' '}
                <strong>{this.owner.formatItemHealingDone(this.tranqBoostHealing)}</strong>
              </li>
            </ul>
          </>
        }
      >
        <BoringSpellValueText spellId={TALENTS_DRUID.REGENESIS_TALENT.id}>
          <ItemPercentHealingDone amount={this.totalHealing} />
          <br />
        </BoringSpellValueText>
      </Statistic>
    );
  }
}

export default Regenesis;
