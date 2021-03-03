import React from 'react';

import { acornellier } from 'CONTRIBUTORS';
import SPECS from 'game/SPECS';
import SPELLS from 'common/SPELLS';
import { SpellLink } from 'interface';
import Config from 'parser/Config';

import CHANGELOG from './CHANGELOG';

const config: Config = {
  contributors: [acornellier],
  patchCompatibility: '9.0.2',
  isPartial: false,
  description: (
    <>
      Hey! I hope the suggestions will help you improve your performance. Remember: focus on
      improving only one or two important things at a time. Improving isn't easy and will need your
      full focus until it becomes second nature to you.
      <br />
      <br />
      You might have noticed the suggestions focus mostly on improving your cast efficiencies. This
      might seem silly, but it's actually one of the most important things for us Holy Paladins.
      Avoid having your <SpellLink id={SPELLS.AVENGING_WRATH.id} /> and other cooldowns available
      unused for long periods of time (they're not raid cooldowns, they're required for you to have
      decent throughput and not run OOM) and <b>hit those buttons</b> that have short cooldowns
      (such as <SpellLink id={SPELLS.HOLY_SHOCK_CAST.id} /> and{' '}
      <SpellLink id={SPELLS.LIGHT_OF_DAWN_CAST.id} />
      ). Ohh and don't cast <SpellLink id={SPELLS.LIGHT_OF_THE_MARTYR.id} /> unless there's nothing
      else to cast.
      <br />
      <br />
      If you want to learn more about Holy Paladins, join the Paladin community at the{' '}
      <a
        href="https://discordapp.com/invite/hammerofwrath"
        target="_blank"
        rel="noopener noreferrer"
      >
        Hammer of Wrath discord
      </a>
      . The <kbd>#holy-faq</kbd> channel has a lot of useful information including links to good
      guides.
    </>
  ),
  exampleReport: '/report/DPwyKpWBZ6F947mx/2-Normal+Mekkatorque+-+Kill+(7:19)/7-Riftie',

  //
  spec: SPECS.HOLY_PALADIN,
  changelog: CHANGELOG,
  parser: () =>
    import('./CombatLogParser' /* webpackChunkName: "HolyPaladin" */).then(
      (exports) => exports.default,
    ),
  path: __dirname,
};

export default config;
