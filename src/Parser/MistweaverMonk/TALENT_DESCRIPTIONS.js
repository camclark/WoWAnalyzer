import React from 'react';

import SPELLS from 'common/SPELLS';
// import SpellLink from 'common/SpellLink';

export default {
  // Note: Descriptions have been pulled from the WoWHead guide, written by Garg.
  descriptions: {
    [SPELLS.CHI_BURST_TALENT.id]: <span>Chi Burst is an excellent raid healing spell. It does moderate healing for no mana, so you should try to use it often. This should be your default choice for raiding.</span>,
    [SPELLS.ZEN_PULSE_TALENT.id]: <span>Zen Pulse can be a really strong single target heal if there are multiple enemies near the target. This is a great spell for dungeons since there are almost always many enemies surrounding your tank and melee.</span>,
    [SPELLS.CHI_WAVE_TALENT.id]: <span>Chi Wave does less healing and damage than  Chi Burst and  Zen Pulse with multiple mobs around a single target. However,  Chi Wave is useful when doing solo content as a Msitweaver.</span>,
    [SPELLS.CHI_TORPEDO_TALENT.id]: <span>Chi Torpedo replaces  Roll and causes you to go farther, as well as increasing your movement speed after casting it. This can be a really strong burst movement choice or if you just enjoy the way it looks.</span>,
    [SPELLS.TIGERS_LUST_TALENT.id]: <span>Tiger's Lust tends to be the raider's go-to choice since it has an extra bonus of being able to remove roots and snares, which can counter some boss mechanics, saving mana on dispells. Otherwise, an on-demand sprint is generally a strong thing to have.</span>,
    [SPELLS.CELERITY_TALENT.id]: <span>Celerity lets you  Roll more often which can be useful if you have a more frequent need for extra mobility.</span>,
    [SPELLS.LIFECYCLES_TALENT.id]: <span>Lifecycles saves mana whenever you alternate casts of  Enveloping Mist and  Vivify. This encourages using more  Enveloping Mist than is usually needed in raids, which can make this talent amount to a healing loss if not used properly.  Lifecycles is a good choice for when there's both consistent single target damage and group damage in a raid.</span>,
    [SPELLS.SPIRIT_OF_THE_CRANE_TALENT.id]: <span>Spirit of the Crane is one of two talents in the tree that allow your damaging abilities to help your healing. This is commonly referred to as Fistweaving.   Spirit of the Crane is regarded as the best talent in the row for sustaining and regenerating your mana, but at the cost of needing downtime between healing, as well as using almost never Soothing Mist in order to maximize mana return. </span>,
    [SPELLS.MIST_WRAP_TALENT.id]: <span>Mist Wrap is an amazing choice for dungeons as it not only increases the effectiveness of one of your main dungeon spells,  Enveloping Mist, but it also allows you to cast  Soothing Mist while moving. Can be used in raiding when the fights aren't suitable for  Lifecycles or  Spirit of the Crane.</span>,
    [SPELLS.RING_OF_PEACE_TALENT.id]: <span>Ring of Peace, and knockbacks used in PvE, have generally niche uses in fights. Whether you use it to speed up adds that need to get somewhere quickly, or if you need to protect your tank while you heal them up from a particularly nasty trash pack.</span>,
    [SPELLS.SONG_OF_CHIJI_TALENT.id]: <span>Song of Chi-Ji is in a similar position to  Ring of Peace, but for different reasons. There is very little non-stun crowd control used in raids and even in dungeons the short duration (20 seconds) often is not worth having over the other option in this talent row. Could potentially be used in very niche situations where multiple adds must be controlled, but only for a brief amount of time.</span>,
    [SPELLS.LEG_SWEEP_TALENT.id]: <span>Leg Sweep is the go-to choice for this talent tier. Stuns are widely used in both raids and dungeons and an AoE, 5-second stun with a 45 second cooldown is a welcome addition to most groups.</span>,
    [SPELLS.HEALING_ELIXIR_TALENT.id]: <span>Healing Elixir, with two charges and a 30-second cooldown, you will want to use this often to save your and other healers' mana. This can be a great default choice for any situation.</span>,
    [SPELLS.DIFFUSE_MAGIC_TALENT.id]: <span>Diffuse Magic is still a strong defensive cooldown, but it no longer provides practical immunity to damage as it did before. This can be an excellent choice if you know you will take huge magical damage at predictable moments in a fight.</span>,
    [SPELLS.DAMPEN_HARM_TALENT.id]: <span>Dampen Harm is good for the same reasons as Diffuse, but it will reduce all damage instead of just magic.   Dampen Harm is more versatile than  Diffuse Magic, but it's also less powerful.</span>,
    [SPELLS.REFRESHING_JADE_WIND_TALENT.id]: <span>Refreshing Jade Wind is a powerful burst healing tool that can be used to supplement your group healing when used in combination with Essence Font. There is a heavy cost on this ability, so it will require you to be much more aware of your mana management. If you are still learning the spec or feel like you are already struggling with your mana, this talent is not recommended.</span>,
    [SPELLS.INVOKE_CHIJI_TALENT.id]: <span>Invoke Chi-Ji, the Red Crane is a free, sustained healing cooldown. With a 45-second duration, you would want to take this for situations where you will need to be healing the group or raid for extended periods of time. Chi-Ji will cast  Crane Heal, during which he will pick three targets to heal. This means he is extra powerful when the raid or group is clumped up or even just lightly spread out. He is the recommended talent for both dungeon and raid healing, as he helps smooth out incoming damage considerably.</span>,
    [SPELLS.JADE_SERPENT_STATUE.id]: <span>Summon Jade Serpent Statue is a good option if you're going to be doing mostly single target healing. It can be really good in dungeons if you find yourself struggling to keep the tank alive or if you're going to be the main tank healer in a raid. The statue will only channel on the targets that you begin your own  Soothing Mist channel on, but it will continue to channel its own  Soothing Mist if you cancel yours. It will continue that channel until the duration ends or you cast  Soothing Mist on another target.</span>,
    [SPELLS.MANA_TEA_TALENT.id]: <span>Mana Tea is a good choice for healing periods of burst damage in raids by chain casting  Essence Font together. This is most powerful when used with high cost spells such as the  Essence Font and  Refreshing Jade Wind combo, or whenever you might be chain casting multiple spells in succession.</span>,
    [SPELLS.FOCUSED_THUNDER_TALENT.id]: <span>Focused Thunder gives your  Thunder Focus Tea an extra charge. This is the default choice in dungeons, as the extra charge will come in handy whenever you use  Thunder Focus Tea.</span>,
    [SPELLS.RISING_THUNDER_TALENT.id]: <span>Rising Thunder is the other talent that, allows our damaging abilities to help with out healing. When talented,  Rising Thunder causes your Rising Sun Kick to reset the cooldown of  Thunder Focus Tea. This can be very powerful as  Rising Sun Kick's cooldown is reduced by Haste. With  Rising Thunder, you'll be making much more frequent use of  Thunder Focus Tea, so it's important to quickly assess how you will use it depending on the situation. You don't have to take  Spirit of the Crane with  Rising Thunder and vice versa, but together they make a very powerful combination that can be a lot of fun. You'll want to be using  Rising Sun Kick, and thus  Thunder Focus Tea, as often as possible to get the most out of this talent.</span>,
  },
  // attribution: <span>Parts of the descriptions for talents came from the <a href="http://www.wowhead.com/holy-paladin-talent-guide" target="_blank" rel="noopener noreferrer">Holy Paladin Wowhead guide</a> by Pelinal.</span>,
};
