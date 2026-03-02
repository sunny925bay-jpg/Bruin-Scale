export async function analyzeImage(base64Image, mimeType, gender, roastMode) {
  const genderWord = gender === 'male' ? 'male' : 'female';
  const maleScale = 'LTN-/LTN/LTN+/MTN-/MTN/MTN+/HTN-/HTN/HTN+/CL/Chad/True Adam';
  const femaleScale = 'LTB-/LTB/LTB+/MTB-/MTB/MTB+/HTB-/HTB/HTB+/SL/Stacy/True Eve';
  const tierScale = gender === 'male' ? maleScale : femaleScale;

  const systemPrompt = roastMode
    ? `You are a brutally honest PSL (Perceived Sexual Market Value) analyst who combines scientific facial assessment with savage, darkly comedic roasting.
You are merciless, specific, and funny — like a looksmaxxing forum moderator doing stand-up comedy.
Despite the roasting tone, your underlying numerical scores must still be ACCURATE and evidence-based.
Call out specific features by name (e.g. "your gonial angle looks like it gave up", "that canthal tilt is begging for mercy").
End with one genuine, actionable improvement tip.`
    : `You are an expert forensic facial analyst and PSL evaluator with deep knowledge of:
- Facial symmetry research (Grammer & Thornhill, 1994; Little et al., 2011)
- Sexual dimorphism markers in ${genderWord} faces
- Golden ratio / phi-based facial proportions (Marquardt Beauty Mask principles)
- Fitzpatrick skin type assessment
- Canthal tilt, gonial angle, and mandibular projection analysis
- Cheekbone prominence and zygomatic arch assessment
- Orbital bone depth and brow ridge evaluation
- Nasal bridge and tip projection ratios
- Lip-to-philtrum ratios and vermillion border definition
- Jaw width to facial width ratios (bizygomatic vs bigonial)

You give ACCURATE, CALIBRATED scores. You do NOT give inflated scores to be kind.
Use the full range — most people score between 4 and 7. Scores above 8.5 are extremely rare.
Be specific about WHICH features are strong or weak. Never be vague.`;

  const userPrompt = `Analyze this ${genderWord} face using the PSL tier system below and give an accurate score from 0.1 to 10.

PSL TIER SYSTEM (${genderWord}):
0.1–1.9: ${gender === 'male' ? 'LTN- (Lower Low Tier Normie)' : 'LTB- (Lower Low Tier Becky)'} — really ugly
2–3.5: ${gender === 'male' ? 'LTN (Low Tier Normie)' : 'LTB (Low Tier Becky)'} — ugly
3.6–5.5: ${gender === 'male' ? 'LTN+ (Higher Low Tier Normie)' : 'LTB+ (Higher Low Tier Becky)'} — kinda ugly / below average
5.6–5.9: ${gender === 'male' ? 'MTN- (Lower Mid Tier Normie)' : 'MTB- (Lower Mid Tier Becky)'} — almost average, mid
6–6.5: ${gender === 'male' ? 'MTN (Mid Tier Normie)' : 'MTB (Mid Tier Becky)'} — average, still mid
6.6–7.1: ${gender === 'male' ? 'MTN+ (Higher Mid Tier Normie)' : 'MTB+ (Higher Mid Tier Becky)'} — above average, slightly attractive
7.2–7.5: ${gender === 'male' ? 'HTN- (Lower High Tier Normie)' : 'HTB- (Lower High Tier Becky)'} — handsome/pretty
7.6–8: ${gender === 'male' ? 'HTN (High Tier Normie)' : 'HTB (High Tier Becky)'} — handsome/pretty, upper end
8.1–8.5: ${gender === 'male' ? 'HTN+ (Higher High Tier Normie)' : 'HTB+ (Higher High Tier Becky)'} — really handsome/beautiful
8.6–9: ${gender === 'male' ? 'CL (Chadlite)' : 'SL (Stacylite)'} — definitely above average, very attractive
9.1–9.5: ${gender === 'male' ? 'Chad' : 'Stacy'} — "I wish I looked like him/her"
9.51–10: ${gender === 'male' ? 'True Adam' : 'True Eve'} — "He/she can't be real"

SCORING CALIBRATION:
- Average person on the street: 5.5–6.5
- Attractive but normal: 6.5–7.5
- Model-tier: 8.0+
- Most people do NOT score above 7.5
- Be honest. Scores above 8.5 require genuinely exceptional bone structure.

WHAT TO ANALYZE (be specific about each):
1. SYMMETRY: Measure left-right facial balance. Look at eye level, nostril symmetry, lip corners, brow arch matching.
2. HARMONY: How well all features work together — nose size relative to face, eye spacing, forehead height, chin length.
3. PROPORTIONS: Thirds rule (forehead:midface:lower face), fifths rule (eye width = 1/5 face width), golden ratio compliance.
4. SKIN QUALITY: Texture, tone evenness, visible pores, blemishes, aging signs, overall clarity.
5. FACIAL STRUCTURE: Bone structure quality — cheekbone prominence, jawline definition, chin projection, gonial angle sharpness.
6. AVERAGENESS: How close to population average (higher averageness = more symmetrical, less unusual features).
7. SEXUAL DIMORPHISM: For ${genderWord}s — ${gender === 'male' ? 'strong jaw, prominent brow ridge, angular features, facial width-to-height ratio' : 'large eyes relative to face, small nose, high cheekbones, fuller lips, smooth brow ridge'}.
8. MEMORABLE FEATURES: Does this face have a standout feature (striking eyes, perfect lips, exceptional jaw) that elevates the overall rating?

${roastMode ? `ROAST INSTRUCTIONS: Be savage and specific. Attack the weakest 2-3 features by name. Be funny. End with one real improvement tip.` : ''}

Respond ONLY with valid JSON (no markdown, no code blocks):
{
  "score": 6.4,
  "tier_tag": "${gender === 'male' ? 'MTN' : 'MTB'}",
  "summary": "One precise sentence describing the face overall — mention the strongest and weakest feature by name.",
  ${roastMode ? '"roast": "2-3 sentence brutal roast. Be savage and specific. End with one real tip.",' : '"roast": null,'}
  "breakdown": {
    "symmetry": 6.5,
    "harmony": 6.3,
    "proportions": 6.2,
    "skin": 6.8,
    "structure": 6.0,
    "averageness": 6.5,
    "dimorphism": 6.4,
    "memorable": 5.5
  },
  "positives": [
    "Specific strength (name the feature)",
    "Second specific strength"
  ],
  "negatives": [
    "Specific weakness (name the feature and why it lowers the score)",
    "Second specific weakness"
  ],
  "advice": "One specific, actionable improvement tip based on the actual weaknesses identified."
}`;

  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ base64Image, mimeType, systemPrompt, userPrompt }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(err || 'API call failed');
  }

  const text = await response.text();
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return JSON.parse(cleaned);
}
