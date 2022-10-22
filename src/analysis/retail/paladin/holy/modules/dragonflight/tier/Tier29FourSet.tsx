import { formatDuration } from 'common/format';
import SPELLS from 'common/SPELLS';
import TALENTS from 'common/TALENTS/paladin';
import SpellIcon from 'interface/SpellIcon';
import SpellLink from 'interface/SpellLink';
import Analyzer, { Options, SELECTED_PLAYER } from 'parser/core/Analyzer';
import Events, { HealEvent, CastEvent } from 'parser/core/Events';
import SpellUsable from 'parser/shared/modules/SpellUsable';
import BoringValueText from 'parser/ui/BoringValueText';
import Statistic from 'parser/ui/Statistic';
import STATISTIC_CATEGORY from 'parser/ui/STATISTIC_CATEGORY';
import STATISTIC_ORDER from 'parser/ui/STATISTIC_ORDER';

//https://www.wowhead.com/beta/spell=393672/paladin-holy-class-set-4pc
// Paladin Holy Class Set 4pc
// Requires Paladin
// Lightspark: Holy Light, Flash of Light, Light of Dawn, Word of Glory, and Bestow Faith healing is increased by 6% and their critical effects
// increase the damage or healing of your next Holy Shock by 20%.

// Module is encouraging use of Holy Shock on cooldown when empowered by lightspark

class Tier29FourSet extends Analyzer {
  static dependencies = {
    spellUsable: SpellUsable,
  };
  lightsparkConsumedCount: number = 0;
  lightsparkConsumptionMissCount: number = 0;
  protected spellUsable!: SpellUsable;

  constructor(options: Options) {
    super(options);
    this.active = this.selectedCombatant.has4Piece();
    if (!this.active) {
      return;
    }

    if (this.selectedCombatant.hasTalent(TALENTS.HOLY_LIGHT_TALENT.id)) {
      this.addEventListener(
        Events.heal.spell(TALENTS.HOLY_LIGHT_TALENT).by(SELECTED_PLAYER),
        this.checklightsparkConsumptionMiss,
      );
    }

    this.addEventListener(
      Events.heal.spell(SPELLS.FLASH_OF_LIGHT).by(SELECTED_PLAYER),
      this.checklightsparkConsumptionMiss,
    );

    this.addEventListener(
      Events.heal.spell(SPELLS.LIGHT_OF_DAWN_HEAL).by(SELECTED_PLAYER),
      this.checklightsparkConsumptionMiss,
    );

    this.addEventListener(
      Events.heal.spell(SPELLS.WORD_OF_GLORY).by(SELECTED_PLAYER),
      this.checklightsparkConsumptionMiss,
    );

    if (this.selectedCombatant.hasTalent(TALENTS.BESTOW_FAITH_TALENT.id)) {
      this.addEventListener(
        Events.heal.spell(TALENTS.BESTOW_FAITH_TALENT).by(SELECTED_PLAYER),
        this.checklightsparkConsumptionMiss,
      );
    }

    if (this.selectedCombatant.hasTalent(TALENTS.LIGHT_OF_THE_MARTYR_TALENT.id)) {
      this.addEventListener(
        Events.heal.spell(TALENTS.LIGHT_OF_THE_MARTYR_TALENT).by(SELECTED_PLAYER),
        this.checklightsparkConsumptionMiss,
      );
    }

    if (this.selectedCombatant.hasTalent(TALENTS.HOLY_SHOCK_TALENT.id)) {
      this.addEventListener(
        Events.cast.spell(TALENTS.HOLY_SHOCK_TALENT).by(SELECTED_PLAYER),
        this.checklightsparkConsumption,
      );
    }
  }

  checklightsparkConsumptionMiss(event: HealEvent) {
    if (
      this.spellUsable.chargesAvailable(SPELLS.LIGHTSPARK.id) &&
      this.spellUsable.isAvailable(TALENTS.HOLY_SHOCK_TALENT.id)
    ) {
      this.lightsparkConsumptionMissCount += 1;
    }
  }

  checklightsparkConsumption(event: CastEvent) {
    if (this.spellUsable.chargesAvailable(SPELLS.LIGHTSPARK.id)) {
      this.lightsparkConsumedCount += 1;
    }
  }

  statistic() {
    return (
      <Statistic
        position={STATISTIC_ORDER.OPTIONAL(13)}
        size="flexible"
        category={STATISTIC_CATEGORY.ITEMS}
        tooltip={
          <>
            Total <SpellLink id={SPELLS.LIGHTSPARK.id} /> use count:{' '}
            {formatDuration(this.lightsparkConsumedCount)}
            <br />
            Count of healing spells used instead of <SpellLink
              id={TALENTS.HOLY_SHOCK_TALENT.id}
            />{' '}
            when <SpellLink id={SPELLS.LIGHTSPARK.id} /> is active:{' '}
            {formatDuration(this.lightsparkConsumptionMissCount)}
          </>
        }
      >
        <BoringValueText
          label={
            <>
              <SpellIcon id={SPELLS.DAWN_WILL_COME_4PC.id} /> Average CDR of{' '}
              <SpellLink id={SPELLS.AVENGING_WRATH.id} />
            </>
          }
        >
          <>{formatDuration(this.lightsparkConsumedCount)}</>
        </BoringValueText>
      </Statistic>
    );
  }
}

export default Tier29FourSet;
