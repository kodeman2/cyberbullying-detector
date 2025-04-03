/* eslint-disable */
import * as tf from "@tensorflow/tfjs";

// Expanded word-based features with contemporary social media terms
const harmfulWords = [
  // Original insults
  "hate",
  "stupid",
  "idiot",
  "dumb",
  "ugly",
  "fat",
  "loser",
  "worthless",
  "retard",
  "moron",
  "crap",
  "shit",
  "fuck",
  "bitch",
  "whore",
  "slut",
  "gay",
  "faggot",
  "nigger",
  "chink",
  "spic",
  "piece",
  "trash",
  "garbage",
  "scum",
  "filth",
  "disgusting",
  "pathetic",
  "useless",
  "failure",
  "weak",
  "coward",
  "freak",
  "weirdo",
  "creep",
  "psycho",
  "sicko",
  "pervert",
  "monster",
  "beast",
  "animal",
  "pig",
  "dog",
  "rat",
  "worm",
  "snake",
  "traitor",
  "liar",
  "cheater",
  "thief",
  "criminal",
  "murderer",
  "killer",
  "rapist",
  "pedophile",
  "terrorist",
  "nazi",
  "racist",
  "sexist",
  "bigot",
  "hater",
  "bully",
  "abuser",
  "predator",
  "stalker",
  "harasser",
  "troll",

  // Self-harm and violence
  "kill",
  "die",
  "suicide",
  "murder",
  "death",
  "dead",
  "grave",
  "bury",
  "hang",
  "shoot",
  "stab",
  "cut",
  "bleed",
  "pain",
  "suffer",
  "hurt",
  "destroy",
  "ruin",
  "end",
  "finish",
  "stop",
  "quit",
  "leave",
  "go",

  // Contemporary social media insults
  "simp",
  "incel",
  "cuck",
  "boomer",
  "karen",
  "snowflake",
  "triggered",
  "cringe",
  "toxic",
  "gaslighting",
  "narcissist",
  "sociopath",
  "psychopath",
  "beta",
  "chad",
  "thot",
  "catfish",
  "ghosting",
  "flexing",
  "humble-brag",
  "cancel",
  "ratio",
  "salty",
  "sus",
  "problematic",
  "privilege",
  "mansplain",
  "doxx",
  "swat",

  // Leetspeak and common variations (to catch attempts to bypass filters)
  "h8",
  "h8r",
  "h8te",
  "h4te",
  "h8ter",
  "st00pid",
  "1d10t",
  "1di0t",
  "r3t4rd",
  "r3tard",
  "f4t",
  "ph4t",
  "f4gg0t",
  "f4ggot",
  "fagg0t",
  "n1gger",
  "n1gg3r",
  "b1tch",
  "b!tch",
  "b!tch",
  "b1tcH",
  "sh1t",
  "sh!t",
  "cr4p",
  "cr@p",
  "fvck",
  "f*ck",
  "fck",
  "fcuk",
  "f**k",
  "phuck",
  "phuk",
  "fuk",
  "fuxx",
  "kys",
  "kys",

  // Body shaming
  "obese",
  "chubby",
  "anorexic",
  "skeletal",
  "skeleton",
  "fatty",
  "fatso",
  "lardo",
  "chunky",
  "midget",
  "dwarf",
  "giant",
  "twig",
  "stick",
  "flabby",
  "cellulite",
  "stretch-marks",
  "wrinkled",
  "saggy",
  "droopy",
  "pimple",
  "acne",
  "zit",
  "unibrow",

  // Additional degrading terms
  "soulless",
  "heartless",
  "braindead",
  "brainless",
  "untalented",
  "incompetent",
  "basic",
  "poser",
  "wannabe",
  "joke",
  "clown",
  "obnoxious",
  "annoying",
  "irritating",

  // Social exclusion
  "outcast",
  "reject",
  "nobody",
  "irrelevant",
  "invisible",
  "forgotten",
  "ignored",
  "unwanted",
  "alone",
  "lonely",
  "friendless",
  "unfriended",
  "blocked",
  "banned",

  // Identity-based attacks
  "transphobic",
  "homophobic",
  "xenophobic",
  "islamophobic",
  "antisemitic",
  "misogynist",
  "misandrist",
  "ableist",
  "supremacist",
  "terf",
  "radfem",

  // Mental health stigmatization
  "crazy",
  "insane",
  "nuts",
  "psychotic",
  "schizo",
  "bipolar",
  "adhd",
  "autistic",
  "sperg",
  "aspie",
  "special",
  "deranged",
  "demented",
  "unhinged",

  // Self-esteem attacks
  "unloved",
  "unlovable",
  "unwanted",
  "undeserving",
  "unworthy",
  "should-be-dead",
  "better-off-dead",
  "waste-of-space",
  "waste-of-air",
  "waste-of-life",

  // Gendered insults
  "simp",
  "incel",
  "femcel",
  "neckbeard",
  "legbeard",
  "white-knight",
  "orbiter",
  "cuck",
  "beta",
  "soyboy",
  "chad",
  "stacy",
  "becky",
  "thot",
  "e-girl",
  "e-thot",

  // Cancel culture related
  "canceled",
  "cancelled",
  "problematic",
  "toxic",
  "exposed",
  "called-out",
  "receipts",
];

// Normalize harmful words to handle letter substitutions
const normalizeText = (text) => {
  return (
    text
      .toLowerCase()
      // Replace common letter substitutions
      .replace(/1/g, "i")
      .replace(/4/g, "a")
      .replace(/3/g, "e")
      .replace(/0/g, "o")
      .replace(/5/g, "s")
      .replace(/\$/g, "s")
      .replace(/@/g, "a")
      .replace(/\*/g, "")
      .replace(/\!/g, "i")
      // Remove common punctuation used to bypass filters, but preserve word boundaries
      .replace(/[\.\,\;\:\-\_\+\=\'\"\`\~\|\[\]\(\)\{\}\<\>\?\/\\]+/g, " ")
      .trim()
  );
};

// Enhanced pattern matching to detect cyberbullying even with punctuation
const harmfulPatterns = [
  // Direct insults with flexible punctuation handling - added word boundaries (\b)
  /\b(?:you\s*(?:are|'?re))\s*(?:a\s*)?(?:piece\s*of|pile\s*of|fucking|damn|so|just)?\s*(?:shit|crap|trash|garbage|scum|filth|worthless|useless|pathetic|disgusting|gross|vile|repulsive|revolting|sickening|nasty|filthy|dirty|rotten|corrupt|evil|wicked|sinful|damned|cursed)\b/i,

  // Self-harm encouragement with punctuation flexibility - added word boundaries
  /\b(?:go|just\s*go|go\s*ahead\s*and|why\s*don'?t\s*you)\s*(?:k[i1!]ll\s*(?:yo)?[u\*]r?s[e3]lf|d[i1!][e3]|jump\s*off|hang\s*(?:yo)?[u\*]r?s[e3]lf|[e3]nd\s*(?:[i1!]t|(?:yo)?[u\*]r?s[e3]lf)|c[o0]mm[i1!]t\s*s[u\*][i1!]c[i1!]d[e3]|k[iy]s)\b/i,

  // Degrading patterns with punctuation handling - added word boundaries
  /\b(?:you\s*(?:are|'?re))\s*(?:n[o0]th[i1!]ng|w[o0]rthl[e3]ss|[u\*]s[e3]l[e3]ss|p[a4]th[e3]t[i1!]c|d[i1!]sg[u\*]st[i1!]ng|gr[o0]ss|v[i1!]l[e3]|r[e3]p[u\*]ls[i1!]v[e3]|r[e3]v[o0]lt[i1!]ng|s[i1!]ck[e3]n[i1!]ng|n[a4]sty|f[i1!]lthy|d[i1!]rty|r[o0]tt[e3]n|c[o0]rr[u\*]pt|[e3]v[i1!]l|w[i1!]ck[e3]d|s[i1!]nf[u\*]l|d[a4]mn[e3]d|c[u\*]rs[e3]d)\b/i,

  // Threatening patterns with punctuation flexibility - added word boundaries
  /\b(?:[i1!]\s*(?:w[i1!]ll|[a4]m\s*g[o0][i1!]ng\s*t[o0]|w[a4]nn[a4]|'?ll))\s*(?:k[i1!]ll|h[u\*]rt|h[a4]rm|[a4]tt[a4]ck|d[e3]str[o0]y|r[u\*][i1!]n|b[e3][a4]t\s*(?:[u\*]p)?|f[u\*]ck\s*(?:[u\*]p)?|[e3]nd|c[a4]nc[e3]l|d[o0]xx|sw[a4]t|h[a4]ck|t[a4]k[e3]\s*d[o0]wn)\s*y[o0][u\*]\b/i,

  // Hope/wish for harm with punctuation handling - added word boundaries
  /\b(?:[i1!]\s*(?:w[i1!]sh|h[o0]p[e3]|pr[a4]y))\s*(?:y[o0][u\*]\s*(?:d[i1!][e3]|g[e3]t\s*c[a4]nc[e3]r|g[e3]t\s*[a4][i1!]ds|g[e3]t\s*h[u\*]rt|s[u\*]ff[e3]r|[a4]r[e3]\s*d[e3][a4]d|d[i1!]s[a4]pp[e3][a4]r|l[o0]s[e3]\s*[e3]v[e3]ryth[i1!]ng))\b/i,

  // Social media specific patterns - added word boundaries
  /\b(?:n[o0]\s*[o0]n[e3]\s*(?:l[o0]v[e3]s|c[a4]r[e3]s\s*[a4]b[o0][u\*]t|l[i1!]k[e3]s|w[a4]nts|n[e3][e3]ds)\s*y[o0][u\*])\b/i,
  /\b(?:(?:y[o0][u\*]r|[u\*]r)\s*(?:s[o0]\s*)?(?:[u\*]gly|f[a4]t|d[u\*]mb|p[a4]th[e3]t[i1!]c|cr[i1!]ng[e3]|[a4]nn[o0]y[i1!]ng|[i1!]rr[i1!]t[a4]t[i1!]ng))\b/i,

  // Ratio, canceled, and modern social media attack patterns - added word boundaries
  /\b(?:r[a4]t[i1!][o0]'?d|g[e3]t\s*r[a4]t[i1!][o0]'?d|[i1!]'?m\s*g[o0]nn[a4]\s*r[a4]t[i1!][o0]\s*y[o0][u\*])\b/i,
  /\b(?:y[o0][u\*]'?r[e3]\s*c[a4]nc[e3]l[e3]d|[i1!]'?m\s*g[o0][i1!]ng\s*t[o0]\s*c[a4]nc[e3]l\s*y[o0][u\*]|g[e3]t\s*c[a4]nc[e3]l[e3]d)\b/i,

  // Identity attacks with flexible punctuation - added word boundaries
  /\b(?:y[o0][u\*]'?r[e3]\s*(?:[a4]\s*)?(?:r[a4]c[i1!]st|s[e3]x[i1!]st|h[o0]m[o0]ph[o0]b[e3]|tr[a4]nsph[o0]b[e3]|n[a4]z[i1!]|f[a4]sc[i1!]st|b[i1!]g[o0]t))\b/i,

  // Exclusion and isolation attacks - added word boundaries
  /\b(?:n[o0]\s*[o0]n[e3]\s*w[o0][u\*]ld\s*m[i1!]ss\s*y[o0][u\*]|th[e3]\s*w[o0]rld\s*w[o0][u\*]ld\s*b[e3]\s*b[e3]tt[e3]r\s*w[i1!]th[o0][u\*]t\s*y[o0][u\*])\b/i,

  // Mental health stigmatization - added word boundaries
  /\b(?:y[o0][u\*]'?r[e3]\s*(?:[a4]\s*)?(?:cr[a4]zy|[i1!]ns[a4]n[e3]|m[e3]nt[a4]l|ps?ych[o0]|sch[i1!]z[o0]|[a4][u\*]t[i1!]st[i1!]c|sp[e3]c[i1!][a4]l\s*n[e3][e3]ds|r[e3]t[a4]rd[e3]d|sp[e3]rg))\b/i,

  // Self-worth attacks - added word boundaries
  /\b(?:y[o0][u\*]'?r[e3]\s*(?:[a4]\s*)?(?:w[a4]st[e3]\s*[o0]f\s*(?:sp[a4]c[e3]|[a4][i1!]r|l[i1!]f[e3]|t[i1!]m[e3]|[e3]ff[o0]rt|r[e3]s[o0][u\*]rc[e3]s)))\b/i,

  // Multi-part attacks (combining insults with threats) - added word boundaries
  /\b(?:y[o0][u\*]'?r[e3]\s*(?:[a4]\s*)?(?:p[i1!][e3]c[e3]\s*[o0]f\s*sh[i1!]t|b[i1!]tch|wh[o0]r[e3]|sl[u\*]t|[a4]ssh[o0]l[e3]|d[i1!]cj?k|j[e3]rk|m[o0]r[o0]n|[i1!]d[i1!][o0]t))\s*[a4]nd\s*(?:[i1!]\s*h[o0]p[e3]\s*y[o0][u\*]\s*(?:d[i1!][e3]|r[o0]t\s*[i1!]n\s*h[e3]ll|b[u\*]rn\s*[i1!]n\s*h[e3]ll|s[u\*]ff[e3]r))\b/i,

  // Leet-speak patterns for common attacks - added word boundaries
  /\b(?:kys|k\s*y\s*s|k\.\s*y\.\s*s\.)\b/i, // Kill yourself
  /\b(?:gtfo|g\s*t\s*f\s*o|g\.\s*t\.\s*f\.\s*o\.)\b/i, // Get the f*** out
  /\b(?:stfu|s\s*t\s*f\s*u|s\.\s*t\.\s*f\.\s*u\.)\b/i, // Shut the f*** up
  /\b(?:kms|k\s*m\s*s|k\.\s*m\.\s*s\.)\b/i, // Kill myself (often used in a way that can be triggering)

  // Patterns to detect when someone repeats hostile words for emphasis - added word boundaries
  /\b(?:d[i1!][e3]\s*d[i1!][e3]\s*d[i1!][e3]|k[i1!]ll\s*y[o0][u\*]rs[e3]lf\s*k[i1!]ll\s*y[o0][u\*]rs[e3]lf)\b/i,

  // Patterns with emoji substitutions (represented as text here) - added word boundaries
  /\b(?:y[o0][u\*]\s*sh[o0][u\*]ld\s*:knife:|:skull:|\(skull\)|\(knife\))\b/i,
];

// Function to detect emoji substitutions in text that might be used for cyberbullying
const detectEmojiSubstitutions = (text) => {
  // Common emoji substitutions that could be part of cyberbullying
  const emojiPatterns = [
    // Threatening emoji combinations
    /(?:🔪|🗡️|⚔️|🪓|🔫|💣|💥|☠️|💀|⚰️|⚱️)/g,
    // Suicide/self-harm related emoji
    /(?:🩸|💊|💉|🧪|🔪.*(?:🙂|😊|😀))/g,
    // Insulting emoji combinations
    /(?:🤡|🐷|🐽|🐮|🐄|🐀|🐁|🦨|🦝|💩)/g,
    // Slurs often accompanied by these emoji
    /(?:🙊|🙉|🙈)/g,
  ];

  return emojiPatterns.some((pattern) => pattern.test(text));
};

export class CyberbullyingModel {
  constructor() {
    this.model = null;
    this.isLoaded = false;
    this.wordMap = new Map(); // To store word variations for better detection

    // Initialize word map with variations
    this._initializeWordMap();
  }

  _initializeWordMap() {
    // Create variations of harmful words to catch substitution attempts
    harmfulWords.forEach((word) => {
      this.wordMap.set(word, true);

      // Add common variations
      this.wordMap.set(word.replace(/a/g, "4"), true);
      this.wordMap.set(word.replace(/e/g, "3"), true);
      this.wordMap.set(word.replace(/i/g, "1"), true);
      this.wordMap.set(word.replace(/o/g, "0"), true);
      this.wordMap.set(word.replace(/s/g, "5"), true);
      this.wordMap.set(word.replace(/s/g, "$"), true);

      // Add variations with spaces or dots between letters
      this.wordMap.set(word.split("").join(" "), true);
      this.wordMap.set(word.split("").join("."), true);
    });
  }

  async load() {
    if (this.isLoaded) return;

    // Create a more complex model for better detection
    this.model = tf.sequential({
      layers: [
        tf.layers.dense({
          inputShape: [harmfulWords.length + harmfulPatterns.length + 5], // +5 for additional features
          units: 64,
          activation: "relu",
        }),
        tf.layers.dropout({ rate: 0.3 }),
        tf.layers.dense({ units: 32, activation: "relu" }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 16, activation: "relu" }),
        tf.layers.dense({ units: 1, activation: "sigmoid" }),
      ],
    });

    this.model.compile({
      optimizer: tf.train.adam(0.0005),
      loss: "binaryCrossentropy",
      metrics: ["accuracy"],
    });

    this.isLoaded = true;
  }

  // Helper method to properly escape characters for regex
  _escapeRegExp(string) {
    // Escape special regex characters
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  // Helper method to safely create flexible word patterns with word boundaries
  _createFlexibleWordPattern(word) {
    // Safely escape the characters and create a pattern that allows punctuation between letters
    // but requires word boundaries at start and end
    const flexiblePattern =
      "\\b" +
      word
        .split("")
        .map(
          (char) =>
            // Escape special regex characters in the letter
            this._escapeRegExp(char) + "[\\s\\.,;:\\-_]*"
        )
        .join("") +
      "\\b";

    // Create and return the regex pattern
    return new RegExp(flexiblePattern, "i");
  }

  preprocessText(text) {
    const originalText = text;
    const lowercaseText = text.toLowerCase();
    const normalizedText = normalizeText(text);

    // Create feature vector based on harmful words
    // Now with word boundary checks to prevent partial word matches
    const wordFeatures = harmfulWords.map((word) => {
      // Create a regex with word boundaries to match whole words only
      const wordRegex = new RegExp(`\\b${this._escapeRegExp(word)}\\b`, "i");
      const normalizedWordRegex = new RegExp(
        `\\b${this._escapeRegExp(word)}\\b`,
        "i"
      );

      return wordRegex.test(lowercaseText) ||
        normalizedWordRegex.test(normalizedText) ||
        this._createFlexibleWordPattern(word).test(lowercaseText)
        ? 1
        : 0;
    });

    // Check for harmful patterns
    const patternMatches = harmfulPatterns.map((pattern) =>
      pattern.test(originalText) ||
      pattern.test(lowercaseText) ||
      pattern.test(normalizedText)
        ? 1
        : 0
    );

    // Additional features for more complex patterns
    const additionalFeatures = [
      // Ratio of uppercase letters (SHOUTING)
      text.split("").filter((char) => /[A-Z]/.test(char)).length /
        Math.max(text.length, 1),

      // Repeated punctuation (!!!, ???)
      /(\!{2,}|\?{2,}|\!+\?+|\?+\!+)/.test(text) ? 1 : 0,

      // Excessive use of emoji that could be threatening
      detectEmojiSubstitutions(text) ? 1 : 0,

      // Repeated words that might indicate emphasis in bullying - fixed to match whole words
      /\b(\w+)\b(\s+\1\b){2,}/i.test(text) ? 1 : 0,

      // Presence of ALL CAPS words (excluding common acronyms)
      /\b[A-Z]{4,}\b/.test(text) ? 1 : 0,
    ];

    // Combine all features
    return [...wordFeatures, ...patternMatches, ...additionalFeatures];
  }

  async predict(text) {
    if (!this.isLoaded) {
      await this.load();
    }

    const features = this.preprocessText(text);
    const input = tf.tensor2d([features]);

    try {
      const prediction = await this.model.predict(input).data();
      const confidence = prediction[0];

      // Determine if text is cyberbullying based on confidence threshold
      const isCyberbullying = confidence > 0.5;

      // For better explainability, find which words and patterns triggered the detection
      const detectedWords = harmfulWords.filter(
        (word, index) => features[index] === 1
      );

      const detectedPatterns = harmfulPatterns
        .filter((pattern, index) => features[harmfulWords.length + index] === 1)
        .map((pattern) => pattern.toString());

      return {
        isCyberbullying,
        confidence,
        severity: this._calculateSeverity(
          confidence,
          detectedWords,
          detectedPatterns
        ),
        features: {
          harmfulWords: detectedWords,
          harmfulPatterns: detectedPatterns,
          textProperties: {
            containsAllCaps: features[features.length - 1] === 1,
            containsRepeatedPunctuation: features[features.length - 4] === 1,
            containsThreateningEmoji: features[features.length - 3] === 1,
            containsRepeatedWords: features[features.length - 2] === 1,
          },
        },
      };
    } finally {
      input.dispose();
    }
  }

  _calculateSeverity(confidence, detectedWords, detectedPatterns) {
    // Simple severity calculation based on confidence and number of detected harmful elements
    const wordCount = detectedWords.length;
    const patternCount = detectedPatterns.length;

    // Weight patterns more heavily as they represent more complex harmful expressions
    const weightedCount = wordCount + patternCount * 2;

    // Combine confidence with weighted count
    const severityScore =
      confidence * 0.6 + Math.min(1, weightedCount / 10) * 0.4;

    // Map to severity levels
    if (severityScore > 0.8) return "critical";
    if (severityScore > 0.6) return "high";
    if (severityScore > 0.4) return "medium";
    if (severityScore > 0.2) return "low";
    return "minimal";
  }

  // Method to handle text with intentional obfuscation
  async predictWithObfuscationHandling(text) {
    // First try with the original text
    const result = await this.predict(text);

    // If not detected as cyberbullying, try additional preprocessing
    if (!result.isCyberbullying && result.confidence < 0.4) {
      // Handle common obfuscation techniques but preserve word boundaries
      const deobfuscatedText = text
        // Replace zero-width spaces and other invisible characters
        .replace(/[\u200B-\u200D\uFEFF]/g, "")
        // Replace homoglyphs (similar looking characters)
        .replace(/\$/g, "s")
        .replace(/0/g, "o")
        .replace(/1/g, "i")
        .replace(/3/g, "e")
        .replace(/4/g, "a")
        .replace(/5/g, "s")
        .replace(/\@/g, "a")
        // Handle word segmentation with special characters but maintain word boundaries
        .replace(/([a-zA-Z])[.\-_,;:!?]([a-zA-Z])/g, "$1$2")
        // Add spaces around punctuation that might be used to join words
        .replace(/([a-zA-Z])([.\-_,;:!?])([a-zA-Z])/g, "$1 $3");

      // Try prediction with deobfuscated text
      const deobfuscatedResult = await this.predict(deobfuscatedText);

      // Return the result with higher confidence
      return deobfuscatedResult.confidence > result.confidence
        ? deobfuscatedResult
        : result;
    }

    return result;
  }

  // New method to check if a word is part of another word (to prevent false positives)
  _isStandaloneWord(text, word) {
    const regex = new RegExp(`\\b${this._escapeRegExp(word)}\\b`, "i");
    return regex.test(text);
  }

  // New method that provides better context awareness for harmless phrases
  async predictWithContextAwareness(text) {
    // Check if this is a common harmless phrase that contains potentially flagged words
    const harmlessPhrases = [
      // Common phrases that might trigger false positives
      /\byou are a good friend\b/i,
      /\bhave a good day\b/i,
      /\bsee you later\b/i,
      /\bnice to meet you\b/i,
      /\bgood luck\b/i,
      /\bthank you\b/i,
      /\bhow are you doing\b/i,
      /\bi hope you are well\b/i,
      /\bi hope you feel better\b/i,
      /\bi hope you enjoy\b/i,
      /\bi wish you all the best\b/i,
      /\btake care of yourself\b/i,
      /\bstay safe\b/i,
      /\blet's end the meeting\b/i,
      /\blet me know when you're free\b/i,
      /\bdo you want to go\b/i,
      /\bhow do you feel\b/i,
      /\blet's finish this\b/i,
      /\bwe should stop here\b/i,
    ];

    // If the text matches a harmless phrase, return a very low confidence score
    const isHarmlessPhrase = harmlessPhrases.some((phrase) =>
      phrase.test(text)
    );
    if (isHarmlessPhrase) {
      return {
        isCyberbullying: false,
        confidence: 0.05,
        severity: "minimal",
        features: {
          harmfulWords: [],
          harmfulPatterns: [],
          textProperties: {
            containsAllCaps: false,
            containsRepeatedPunctuation: false,
            containsThreateningEmoji: false,
            containsRepeatedWords: false,
          },
        },
      };
    }

    // Otherwise, proceed with normal prediction
    return this.predictWithObfuscationHandling(text);
  }
}

// Create and export a singleton instance
export const cyberbullyingModel = new CyberbullyingModel();
