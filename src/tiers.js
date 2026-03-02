export const TIERS = [
  {
    min: 0.1, max: 1.9,
    maleTag: 'LTN-', femaleTag: 'LTB-',
    maleLabel: 'Lower Low Tier Normie', femaleLabel: 'Lower Low Tier Becky',
    description: 'Totally below average. Considered really ugly by conventional standards.',
    color: '#8B0000',
    bgColor: 'rgba(139,0,0,0.15)',
  },
  {
    min: 2, max: 3.5,
    maleTag: 'LTN', femaleTag: 'LTB',
    maleLabel: 'Low Tier Normie', femaleLabel: 'Low Tier Becky',
    description: 'Badly below average. Considered ugly.',
    color: '#c0392b',
    bgColor: 'rgba(192,57,43,0.15)',
  },
  {
    min: 3.6, max: 5.5,
    maleTag: 'LTN+', femaleTag: 'LTB+',
    maleLabel: 'Higher Low Tier Normie', femaleLabel: 'Higher Low Tier Becky',
    description: 'Slightly below average. Considered kinda ugly.',
    color: '#e67e22',
    bgColor: 'rgba(230,126,34,0.15)',
  },
  {
    min: 5.6, max: 5.9,
    maleTag: 'MTN-', femaleTag: 'MTB-',
    maleLabel: 'Lower Mid Tier Normie', femaleLabel: 'Lower Mid Tier Becky',
    description: 'Almost average. Considered mid.',
    color: '#f39c12',
    bgColor: 'rgba(243,156,18,0.15)',
  },
  {
    min: 6, max: 6.5,
    maleTag: 'MTN', femaleTag: 'MTB',
    maleLabel: 'Mid Tier Normie', femaleLabel: 'Mid Tier Becky',
    description: 'Average. Still considered mid, but on the upper end.',
    color: '#f1c40f',
    bgColor: 'rgba(241,196,15,0.15)',
  },
  {
    min: 6.6, max: 7.1,
    maleTag: 'MTN+', femaleTag: 'MTB+',
    maleLabel: 'Higher Mid Tier Normie', femaleLabel: 'Higher Mid Tier Becky',
    description: 'Still average, but upper end. Considered slightly handsome.',
    color: '#2ecc71',
    bgColor: 'rgba(46,204,113,0.15)',
  },
  {
    min: 7.2, max: 7.5,
    maleTag: 'HTN-', femaleTag: 'HTB-',
    maleLabel: 'Lower High Tier Normie', femaleLabel: 'Lower High Tier Becky',
    description: 'Slightly above average. Considered handsome.',
    color: '#1abc9c',
    bgColor: 'rgba(26,188,156,0.15)',
  },
  {
    min: 7.6, max: 8,
    maleTag: 'HTN', femaleTag: 'HTB',
    maleLabel: 'High Tier Normie', femaleLabel: 'High Tier Becky',
    description: 'Slightly above average. Considered handsome, on the upper end.',
    color: '#3498db',
    bgColor: 'rgba(52,152,219,0.15)',
  },
  {
    min: 8.1, max: 8.5,
    maleTag: 'HTN+', femaleTag: 'HTB+',
    maleLabel: 'Higher High Tier Normie', femaleLabel: 'Higher High Tier Becky',
    description: 'Above average. Considered really handsome.',
    color: '#9b59b6',
    bgColor: 'rgba(155,89,182,0.15)',
  },
  {
    min: 8.6, max: 9,
    maleTag: 'CL', femaleTag: 'SL',
    maleLabel: 'Chadlite', femaleLabel: 'Stacylite',
    description: 'Definitely above average. Really handsome.',
    color: '#8e44ad',
    bgColor: 'rgba(142,68,173,0.2)',
  },
  {
    min: 9.1, max: 9.5,
    maleTag: 'Chad', femaleTag: 'Stacy',
    maleLabel: 'Chad', femaleLabel: 'Stacy',
    description: '"I wish I would look like him/her."',
    color: '#e91e8c',
    bgColor: 'rgba(233,30,140,0.2)',
  },
  {
    min: 9.51, max: 10,
    maleTag: 'True Adam', femaleTag: 'True Eve',
    maleLabel: 'True Adam', femaleLabel: 'True Eve',
    description: '"He/she can\'t be real."',
    color: '#ffd700',
    bgColor: 'rgba(255,215,0,0.15)',
  },
];

export function getTier(score, gender = 'male') {
  for (const tier of TIERS) {
    if (score >= tier.min && score <= tier.max) {
      return {
        ...tier,
        tag: gender === 'male' ? tier.maleTag : tier.femaleTag,
        label: gender === 'male' ? tier.maleLabel : tier.femaleLabel,
      };
    }
  }
  return TIERS[TIERS.length - 1];
}

export const FAKE_MATCHES = [
  { name: 'Ethan K.', major: 'CS', year: '3rd Year', score: null, avatar: '👨‍💻' },
  { name: 'Maya L.', major: 'Psych', year: '2nd Year', score: null, avatar: '🧠' },
  { name: 'Jordan T.', major: 'Econ', year: '4th Year', score: null, avatar: '📈' },
  { name: 'Priya S.', major: 'Biology', year: '1st Year', score: null, avatar: '🔬' },
  { name: 'Marcus W.', major: 'Film', year: '3rd Year', score: null, avatar: '🎬' },
  { name: 'Chloe R.', major: 'Political Sci', year: '2nd Year', score: null, avatar: '🏛️' },
  { name: 'Alex C.', major: 'Math', year: '4th Year', score: null, avatar: '∞' },
  { name: 'Samira A.', major: 'Theater', year: '3rd Year', score: null, avatar: '🎭' },
];
