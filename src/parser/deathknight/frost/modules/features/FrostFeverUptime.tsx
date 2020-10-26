import React from 'react';
import Analyzer from 'parser/core/Analyzer';
import { When } from 'parser/core/ParseResults';
import Enemies from 'parser/shared/modules/Enemies';
import SPELLS from 'common/SPELLS';
import SpellLink from 'common/SpellLink';
import { formatPercentage } from 'common/format';
import { i18n } from '@lingui/core';
import { t } from '@lingui/macro';
import STATISTIC_ORDER from 'interface/others/STATISTIC_ORDER';
import Statistic from 'interface/statistics/Statistic';

import BoringSpellValueText from 'interface/statistics/components/BoringSpellValueText';
import UptimeIcon from 'interface/icons/Uptime';

class FrostFeverUptime extends Analyzer {
  static dependencies = {
    enemies: Enemies,
  };

  protected enemies!: Enemies;

  get frostFeverUptime() {
    return this.enemies.getBuffUptime(SPELLS.FROST_FEVER.id) / this.owner.fightDuration;
  }

  suggestions(when: When) {
    when(this.frostFeverUptime).isLessThan(0.95)
      .addSuggestion((suggest, actual, recommended) => suggest(<span>Your <SpellLink id={SPELLS.FROST_FEVER.id} /> uptime can be improved. Try to pay attention to when Frost Fever is about to fall off the priority target, using <SpellLink id={SPELLS.HOWLING_BLAST.id} /> to refresh Frost Fever. Using a debuff tracker can help.</span>)
        .icon(SPELLS.FROST_FEVER.icon)
        .actual(i18n._(t('deathknight.frost.suggestions.frostFever.uptime')`${formatPercentage(actual)}% Frost Fever uptime`))
        .recommended(`>${formatPercentage(recommended)}% is recommended`)
        .regular(recommended - 0.05).major(recommended - 0.15));
  }

  statistic() {
    return (
      <Statistic
        position={STATISTIC_ORDER.CORE(20)}
        size="flexible"
      >
        <BoringSpellValueText spell={SPELLS.FROST_FEVER}>
          <>
            <UptimeIcon /> {formatPercentage(this.frostFeverUptime)}% <small>uptime</small>
          </>
        </BoringSpellValueText>
      </Statistic>
    );
  }
}

export default FrostFeverUptime;
