import { formatPercentage } from 'common/format';
import SPELLS from 'common/SPELLS';
import { SpellLink } from 'interface';
import Analyzer, { Options, SELECTED_PLAYER } from 'parser/core/Analyzer';
import { calculateEffectiveHealing } from 'parser/core/EventCalculateLib';
import Events, {
  ApplyBuffEvent,
  CastEvent,
  EventType,
  HealEvent,
  RefreshBuffEvent,
  RemoveBuffEvent,
} from 'parser/core/Events';
import BoringSpellValueText from 'parser/ui/BoringSpellValueText';
import ItemPercentHealingDone from 'parser/ui/ItemPercentHealingDone';
import { PerformanceBoxRow } from 'interface/guide/components/PerformanceBoxRow';
import { QualitativePerformance } from 'parser/ui/QualitativePerformance';
import Statistic from 'parser/ui/Statistic';
import STATISTIC_CATEGORY from 'parser/ui/STATISTIC_CATEGORY';
import STATISTIC_ORDER from 'parser/ui/STATISTIC_ORDER';
import * as React from 'react';

import { isFromHardcast } from 'analysis/retail/druid/restoration/normalizers/CastLinkNormalizer';
import {
  buffedBySotf,
  getSotfBuffs,
} from 'analysis/retail/druid/restoration/normalizers/SoulOfTheForestLinkNormalizer';
import HotTrackerRestoDruid from 'analysis/retail/druid/restoration/modules/core/hottracking/HotTrackerRestoDruid';
import ConvokeSpiritsResto from 'analysis/retail/druid/restoration/modules/spells/ConvokeSpiritsResto';
import { TALENTS_DRUID } from 'common/TALENTS';
import { explanationAndDataSubsection } from 'interface/guide/components/ExplanationRow';
import { GUIDE_CORE_EXPLANATION_PERCENT } from '../../Guide';

const SOTF_SPELLS = [
  SPELLS.REJUVENATION,
  SPELLS.REJUVENATION_GERMINATION,
  SPELLS.WILD_GROWTH,
  SPELLS.REGROWTH,
];

const REJUVENATION_HEALING_INCREASE = 2;
const REGROWTH_HEALING_INCREASE = 2;
const WILD_GROWTH_HEALING_INCREASE = 0.6;

const debug = false;

/**
 * **Soul of the Forest**
 * Spec Talent Tier 6
 *
 * Swiftmend increases the healing of your next Regrowth or Rejuvenation by 200%,
 * or your next Wild Growth by 60%.
 */
class SoulOfTheForest extends Analyzer {
  static dependencies = {
    hotTracker: HotTrackerRestoDruid,
    convokeSpirits: ConvokeSpiritsResto,
  };

  hotTracker!: HotTrackerRestoDruid;
  convokeSpirits!: ConvokeSpiritsResto;

  sotfRejuvInfo = {
    boost: REJUVENATION_HEALING_INCREASE,
    attribution: HotTrackerRestoDruid.getNewAttribution('SotF Rejuvenation'),
    hardcastUses: 0,
    convokeUses: 0,
  };
  sotfRegrowthInfo = {
    boost: REGROWTH_HEALING_INCREASE,
    attribution: HotTrackerRestoDruid.getNewAttribution('SotF Regrowth'),
    hardcastUses: 0,
    convokeUses: 0,
  };
  sotfWgInfo = {
    boost: WILD_GROWTH_HEALING_INCREASE,
    attribution: HotTrackerRestoDruid.getNewAttribution('SotF Wild Growth'),
    hardcastUses: 0,
    convokeUses: 0,
  };
  sotfSpellInfo = {
    [SPELLS.REJUVENATION.id]: this.sotfRejuvInfo,
    [SPELLS.REJUVENATION_GERMINATION.id]: this.sotfRejuvInfo,
    [SPELLS.REGROWTH.id]: this.sotfRegrowthInfo,
    [SPELLS.WILD_GROWTH.id]: this.sotfWgInfo,
  };

  lastTalliedSotF?: RemoveBuffEvent;
  lastBuffFromHardcast: boolean = false;

  sotfConsumeLog: SotfUse[] = [];

  constructor(options: Options) {
    super(options);
    this.active = this.selectedCombatant.hasTalent(
      TALENTS_DRUID.SOUL_OF_THE_FOREST_RESTORATION_TALENT,
    );

    this.addEventListener(
      Events.removebuff.by(SELECTED_PLAYER).spell(SPELLS.SOUL_OF_THE_FOREST_BUFF),
      this.onSotfRemove,
    );
    this.addEventListener(
      Events.refreshbuff.by(SELECTED_PLAYER).spell(SPELLS.SOUL_OF_THE_FOREST_BUFF),
      this.onSotfRemove,
    );
    this.addEventListener(
      Events.cast.by(SELECTED_PLAYER).spell(SPELLS.SWIFTMEND),
      this.onSwiftmendCast,
    );

    this.addEventListener(
      Events.applybuff.by(SELECTED_PLAYER).spell(SOTF_SPELLS),
      this.onSotfConsume,
    );
    this.addEventListener(
      Events.refreshbuff.by(SELECTED_PLAYER).spell(SOTF_SPELLS),
      this.onSotfConsume,
    );
    this.addEventListener(
      Events.heal.by(SELECTED_PLAYER).spell(SPELLS.REGROWTH),
      this.onSotfConsume,
    );
  }

  onSwiftmendCast(event: CastEvent) {
    this.lastBuffFromHardcast = true;
  }

  /**
   * Updates tracking logic then true iff the given event benefits from SotF
   */
  onSotfConsume(event: ApplyBuffEvent | RefreshBuffEvent | HealEvent) {
    // check if buffed (link from normalizer)
    const sotf: RemoveBuffEvent | undefined = buffedBySotf(event);
    if (!sotf) {
      return;
    }

    // check source
    const fromHardcast: boolean = isFromHardcast(event);
    const fromConvoke: boolean = !fromHardcast && this.convokeSpirits.isConvoking();

    // tally healing
    const procInfo = this.sotfSpellInfo[event.ability.guid];
    if (!procInfo) {
      // should be impossible
      console.error("Couldn't find spell info for SotF event!", event);
      return;
    }

    if (!this.lastTalliedSotF || this.lastTalliedSotF.timestamp !== sotf.timestamp) {
      this.lastTalliedSotF = sotf;
      if (fromHardcast) {
        procInfo.hardcastUses += 1;
        debug &&
          console.log(
            'New HARDCAST ' +
              procInfo.attribution.name +
              ' @ ' +
              this.owner.formatTimestamp(event.timestamp, 1),
          );
      } else if (fromConvoke) {
        procInfo.convokeUses += 1;
        debug &&
          console.log(
            'New CONVOKE ' +
              procInfo.attribution.name +
              ' @ ' +
              this.owner.formatTimestamp(event.timestamp, 1),
          );
      } else {
        console.warn(
          procInfo.attribution.name +
            ' @ ' +
            this.owner.formatTimestamp(event.timestamp, 1) +
            ' not from hardcast or convoke??',
        );
      }
    }

    if (event.type === EventType.Heal) {
      procInfo.attribution.healing += calculateEffectiveHealing(event, procInfo.boost);
    } else {
      this.hotTracker.addBoostFromApply(
        procInfo.attribution,
        procInfo.boost,
        event as ApplyBuffEvent,
      );
    }
  }

  onSotfRemove(event: RemoveBuffEvent | RefreshBuffEvent) {
    const timestamp = event.timestamp;
    if (event.type === EventType.RefreshBuff) {
      if (this.lastBuffFromHardcast) {
        this.sotfConsumeLog.push({ timestamp, use: 'Overwritten' });
      }
      this.lastBuffFromHardcast = false;
      return;
    }

    const buffed = getSotfBuffs(event);
    if (buffed.length === 0) {
      this.sotfConsumeLog.push({ timestamp, use: 'Expired' });
    } else {
      if (!isFromHardcast(buffed[0]) && !this.lastBuffFromHardcast) {
        // SM during Convoke also consumed during Convoke - don't count it
        return;
      }

      // even if generated during Convoke, we count it if consumed by hardcast
      const firstGuid = buffed[0].ability.guid;
      if (
        firstGuid === SPELLS.REJUVENATION.id ||
        firstGuid === SPELLS.REJUVENATION_GERMINATION.id
      ) {
        this.sotfConsumeLog.push({ timestamp, use: 'Rejuvenation' });
      } else if (firstGuid === SPELLS.REGROWTH.id) {
        this.sotfConsumeLog.push({ timestamp, use: 'Regrowth' });
      } else if (firstGuid === SPELLS.WILD_GROWTH.id) {
        this.sotfConsumeLog.push({ timestamp, use: 'Wild Growth' });
      } else {
        console.warn('SOTF reported as consumed by unexpected spell ID: ' + firstGuid);
      }
    }
    this.lastBuffFromHardcast = false;
  }

  get rejuvHardcastUses() {
    return this.sotfRejuvInfo.hardcastUses;
  }

  get regrowthHardcastUses() {
    return this.sotfRegrowthInfo.hardcastUses;
  }

  get wgHardcastUses() {
    return this.sotfWgInfo.hardcastUses;
  }

  get rejuvConvokeUses() {
    return this.sotfRejuvInfo.convokeUses;
  }

  get regrowthConvokeUses() {
    return this.sotfRegrowthInfo.convokeUses;
  }

  get wgConvokeUses() {
    return this.sotfWgInfo.convokeUses;
  }

  get rejuvTotalUses() {
    return this.rejuvHardcastUses + this.rejuvConvokeUses;
  }

  get regrowthTotalUses() {
    return this.regrowthHardcastUses + this.regrowthConvokeUses;
  }

  get wgTotalUses() {
    return this.wgHardcastUses + this.wgConvokeUses;
  }

  get totalUses() {
    return this.rejuvTotalUses + this.regrowthTotalUses + this.wgTotalUses;
  }

  get totalHealing() {
    return (
      this.sotfWgInfo.attribution.healing +
      this.sotfRegrowthInfo.attribution.healing +
      this.sotfRejuvInfo.attribution.healing
    );
  }

  /** Guide subsection describing the proper usage of Soul of the Forest */
  get guideSubsection(): JSX.Element {
    const explanation = (
      <p>
        <strong>
          <SpellLink id={TALENTS_DRUID.SOUL_OF_THE_FOREST_RESTORATION_TALENT.id} />
        </strong>{' '}
        procs are highest value consumed with <SpellLink id={SPELLS.WILD_GROWTH.id} />, but{' '}
        <SpellLink id={SPELLS.REJUVENATION.id} /> or <SpellLink id={SPELLS.REGROWTH.id} /> are
        acceptable when one target needs big healing.{' '}
        {this.selectedCombatant.hasTalent(TALENTS_DRUID.CONVOKE_THE_SPIRITS_TALENT) && (
          <>
            <SpellLink id={SPELLS.CONVOKE_SPIRITS.id} /> can overwrite procs - always use your proc
            before casting Convoke. Never let a proc expire.
          </>
        )}
      </p>
    );

    const castPerfBoxes = this.sotfConsumeLog.map((sotfUse) => {
      let value: QualitativePerformance;
      if (sotfUse.use === 'Expired') {
        value = 'fail';
      } else if (sotfUse.use === 'Wild Growth') {
        value = 'good';
      } else {
        // rejuv or regrowth
        value = 'ok';
      }
      return {
        value,
        tooltip: `@ ${this.owner.formatTimestamp(sotfUse.timestamp)} - ${sotfUse.use}`,
      };
    });
    const data = (
      <div>
        <strong>Soul of the Forest usage</strong>
        <small>
          {' '}
          - Green is a Wild Growth use, Yellow is a Rejuvenation or Regrowth use, and Red is an
          expired or overwritten proc. Mouseover for more details.
        </small>
        <PerformanceBoxRow values={castPerfBoxes} />
      </div>
    );

    return explanationAndDataSubsection(explanation, data, GUIDE_CORE_EXPLANATION_PERCENT);
  }

  _spellReportLine(totalUses: number, hardcastUses: number, healing: number): React.ReactNode {
    return this.convokeSpirits.active ? (
      <>
        {' '}
        consumed <strong>{hardcastUses}</strong> hardcast /{' '}
        <strong>{totalUses - hardcastUses}</strong> convoke :{' '}
        <strong>{formatPercentage(this.owner.getPercentageOfTotalHealingDone(healing), 1)}%</strong>{' '}
        healing
      </>
    ) : (
      <>
        {' '}
        consumed <strong>{totalUses}</strong> procs :{' '}
        <strong>{formatPercentage(this.owner.getPercentageOfTotalHealingDone(healing), 1)}%</strong>{' '}
        healing
      </>
    );
  }

  statistic() {
    return (
      <Statistic
        size="flexible"
        position={STATISTIC_ORDER.OPTIONAL(6)} // number based on talent row
        category={STATISTIC_CATEGORY.TALENTS}
        tooltip={
          <>
            You used <strong>{this.totalUses}</strong> Soul of the Forest procs.
            <ul>
              <li>
                <SpellLink id={SPELLS.REJUVENATION.id} />
                {this._spellReportLine(
                  this.rejuvTotalUses,
                  this.rejuvHardcastUses,
                  this.sotfRejuvInfo.attribution.healing,
                )}
              </li>
              <li>
                <SpellLink id={SPELLS.REGROWTH.id} />
                {this._spellReportLine(
                  this.regrowthTotalUses,
                  this.regrowthHardcastUses,
                  this.sotfRegrowthInfo.attribution.healing,
                )}
              </li>
              <li>
                <SpellLink id={SPELLS.WILD_GROWTH.id} />
                {this._spellReportLine(
                  this.wgTotalUses,
                  this.wgHardcastUses,
                  this.sotfWgInfo.attribution.healing,
                )}
              </li>
            </ul>
          </>
        }
      >
        <BoringSpellValueText spellId={TALENTS_DRUID.SOUL_OF_THE_FOREST_RESTORATION_TALENT.id}>
          <ItemPercentHealingDone amount={this.totalHealing} />
          <br />
        </BoringSpellValueText>
      </Statistic>
    );
  }
}

type SotfUse = {
  timestamp: number;
  use: 'Rejuvenation' | 'Regrowth' | 'Wild Growth' | 'Expired' | 'Overwritten';
};

export default SoulOfTheForest;
