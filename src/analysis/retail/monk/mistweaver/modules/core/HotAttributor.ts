import SPELLS from 'common/SPELLS';
import { TALENTS_MONK } from 'common/TALENTS';
import Analyzer, { Options, SELECTED_PLAYER } from 'parser/core/Analyzer';
import Events, { ApplyBuffEvent, RefreshBuffEvent } from 'parser/core/Events';
import HotTracker, { Attribution } from 'parser/shared/modules/HotTracker';
import { isFromHardcast } from '../../normalizers/CastLinkNormalizer';
import HotTrackerMW from '../core/HotTrackerMW';

const debug = false;

class HotAttributor extends Analyzer {
  static dependencies = {
    hotTracker: HotTrackerMW,
  };
  hotTracker!: HotTrackerMW;
  envMistAttrib = HotTracker.getNewAttribution('Enveloping Mist Hardcast');
  REMAttrib = HotTracker.getNewAttribution('Renewing Mist Hardcast');
  EFAttrib = HotTracker.getNewAttribution('Essence Font Hardcast');

  constructor(options: Options) {
    super(options);
    this.addEventListener(
      Events.applybuff.by(SELECTED_PLAYER).spell(SPELLS.RENEWING_MIST_HEAL),
      this.onApplyRem,
    );
    this.addEventListener(
      Events.applybuff
        .by(SELECTED_PLAYER)
        .spell([TALENTS_MONK.ENVELOPING_MIST_TALENT, SPELLS.ENVELOPING_MIST_TFT]),
      this.onApplyEnvm,
    );
    this.addEventListener(
      Events.applybuff.by(SELECTED_PLAYER).spell([SPELLS.ESSENCE_FONT_BUFF]),
      this.onApplyEF,
    );
  }

  onApplyRem(event: ApplyBuffEvent | RefreshBuffEvent) {
    if (event.prepull || isFromHardcast(event)) {
      debug && console.log(event.ability.name + ' true ' + event.targetID + ' ' + event.timestamp);
      this.hotTracker.addAttributionFromApply(this.REMAttrib, event);
    }
  }

  onApplyEnvm(event: ApplyBuffEvent | RefreshBuffEvent) {
    if (event.prepull || isFromHardcast(event)) {
      debug && console.log(event.ability.name + ' true ' + event.targetID);
      this.hotTracker.addAttributionFromApply(this.envMistAttrib, event);
    }
  }

  onApplyEF(event: ApplyBuffEvent | RefreshBuffEvent) {
    this.hotTracker.addAttributionFromApply(this.EFAttrib, event);
  }

  _logAttrib(event: ApplyBuffEvent | RefreshBuffEvent, attrib: Attribution | string | undefined) {
    if (attrib === undefined) {
      console.warn(
        'Could not attribute ' +
          event.ability.name +
          ' on ' +
          event.targetID +
          ' @ ' +
          this.owner.formatTimestamp(event.timestamp) +
          '!',
      );
    } else {
      debug &&
        console.log(
          'Attributed ' +
            event.ability.name +
            ' on ' +
            event.targetID +
            ' @ ' +
            this.owner.formatTimestamp(event.timestamp) +
            ' to ' +
            (typeof attrib === 'object' ? attrib.name : attrib),
        );
    }
  }
}

export default HotAttributor;
