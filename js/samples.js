/**
 * Curated sample articles for demo mode.
 * Demonstrates a variety of linguistic styles:
 * - Formal, attributed investigative science and economics reporting
 * - Sensationalist, alarmist clickbait headlines
 * - Fragmented or ambiguous queries triggering 'Unable to Assess'
 * - Nuanced editorial commentary
 */

export const SAMPLE_ARTICLES = [
  {
    id: 'sample-science',
    title: 'Plastic-Degrading Enzyme Discovery',
    category: 'Science & Health',
    expectedVerdict: 'Likely Reliable',
    badgeClass: 'badge-reliable',
    description: 'Peer-reviewed research reporting with formal source attribution and balanced qualifiers.',
    headline: 'Researchers Synthesize Novel Enzyme Capable of Accelerating Plastic Degradation, Study Finds',
    text: `According to a peer-reviewed study published in the journal Nature Materials, an international consortium of biochemists has engineered an enzymatic catalyst capable of degrading polyethylene terephthalate (PET) polymers within 72 hours under ambient temperatures.

Lead author Dr. Elena Vance of Cambridge University stated in an official release: "While laboratory trials demonstrate an 84% conversion efficiency into non-toxic organic monomers, scalable industrial deployment requires further independent field validation and lifecycle assessment."

Officials from the European Environmental Agency confirmed that preliminary data correlates with parallel research conducted by Tokyo Institute of Technology. The authors noted that commercial viability will depend on upcoming pilot facilities scheduled for late 2027.`
  },
  {
    id: 'sample-miracle-cure',
    title: 'Banned Miracle Cure Clickbait',
    category: 'Viral Health Claim',
    expectedVerdict: 'Possibly Misleading',
    badgeClass: 'badge-misleading',
    description: 'Sensationalist health claim utilizing alarmism, hyperbolic promises, and zero citations.',
    headline: 'SHOCKING SECRET: Banned Ancient Root Dissolves High Blood Pressure Overnight! Doctors are FURIOUS!',
    text: `SHOCKING SECRET REVEALED! Big Pharma does NOT want you to know about this mind-blowing ancient root that completely cures cardiovascular disease in just 24 hours!

Corrupt medical elites have tried to ban this miracle cure for decades to protect their billions, but the secret truth is finally exposed! Thousands of ordinary people are throwing away their medication and experiencing absolute 100% cure with zero side effects! 

Nobody can deny this undeniable fact anymore. Wake up people and share this urgent alert before the censors take it down forever!! Don't let them hide the truth from your family!`
  },
  {
    id: 'sample-economics',
    title: 'Central Bank Inflation Report',
    category: 'Financial Journalism',
    expectedVerdict: 'Likely Reliable',
    badgeClass: 'badge-reliable',
    description: 'Objective wire-service financial reporting citing official labor statistics and economic data.',
    headline: 'Central Bank Holds Benchmark Interest Rate Steady Amid Moderating Inflation Trends',
    text: `The Federal Reserve maintained its benchmark federal funds rate between 5.25% and 5.50% on Wednesday, citing steady economic expansion and continuing moderation in core consumer price indices.

Data published by the Bureau of Labor Statistics indicated headline inflation eased to 2.8% annualized, marginally lower than consensus forecasts reported by Reuters. In an official press conference, Chair Jerome Powell noted that while progress remains consistent, the Federal Open Market Committee requires sustained evidence before contemplating policy easing.

Independent economists surveyed by Bloomberg highlighted competing perspectives, noting that wage growth persistence could delay future rate cuts into the fourth quarter.`
  },
  {
    id: 'sample-conspiracy-alert',
    title: 'Viral Conspiracy & Urgency Alert',
    category: 'Social Media Alert',
    expectedVerdict: 'Possibly Misleading',
    badgeClass: 'badge-misleading',
    description: 'Urgent alarmist warning featuring emotional triggers, conspiracy rhetoric, and all-caps emphasis.',
    headline: 'URGENT DISASTER WARNING: Sinister Deep State Plot Leaked to Shut Down Power Grid!',
    text: `URGENT ALERT!! A catastrophic plot by sinister global elites has just been leaked by an anonymous insider! A complete nationwide power blackout is planned for this weekend to trigger total chaos and panic across the country! 

The corrupt mainstream media is completely silent about this horrifying treason! You won't believe what they are preparing to do to our cities! This is an absolute nightmare scenario and disaster looms. Trust me, mark my words: stock up on food immediately and share this urgent warning with everyone you know before it's too late!!`
  },
  {
    id: 'sample-brief-fragment',
    title: 'Ambiguous Short Fragment',
    category: 'Insufficient Text',
    expectedVerdict: 'Unable to Assess',
    badgeClass: 'badge-ambiguous',
    description: 'A brief 6-word phrase lacking sufficient context or linguistic signals.',
    headline: 'Secret space object spotted by witnesses',
    text: `Secret space object spotted by witnesses yesterday.`
  },
  {
    id: 'sample-opinion-editorial',
    title: 'Nuanced Editorial Essay',
    category: 'Opinion / Commentary',
    expectedVerdict: 'Unable to Assess / Nuanced',
    badgeClass: 'badge-ambiguous',
    description: 'First-person perspective mixed with factual discussion, illustrating the boundary between news and commentary.',
    headline: 'The Shifting Fabric of Remote Work: A Reflection on Community and Corporate Space',
    text: `In my opinion, the debate surrounding return-to-office mandates frequently overlooks the subtle human dimension of serendipitous collaboration. 

While productivity metrics compiled during remote quarters remained surprisingly resilient, some managers argue that long-term mentorship has suffered. On the other hand, remote workers legitimately point out the tangible improvements in quality of life and reduced commute stress. As urban centers continue to adapt, both employers and city planners must acknowledge that there are no simple, one-size-fits-all solutions to this cultural transformation.`
  }
];
