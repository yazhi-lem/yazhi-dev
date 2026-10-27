import type { ThinaiKey } from "@/lib/content";

/** Sangam objects: the karupporul (கருப்பொருள்) of the five tinai.

    Tolkāppiyam's Akattiṇaiyiyal sorts every akam poem's world into three
    parts: mutal (முதல் — the land and its time), karu (கரு — the things
    native to it) and uri (உரி — the feeling the poem is about). It names
    the karu categories in one sūtra:

      தெய்வம் உணாவே மாமரம் புள் பறை
      செய்தி யாழின் பகுதியொடு தொகைஇ
      அவ்வகை பிறவும் கருவென மொழிப

    "deity, food, beast, tree, bird, drum, occupation, the yazh and its
    kind — these and others like them, they call karu." Which item belongs
    to which tinai comes from the medieval commentators and the poems
    themselves; the table below is the standard teaching summary.

    The Tolkāppiyam tradition also lists each landscape's people. That
    category is left out on purpose: several of those names are also
    present-day caste names, and Yazhi never names caste (Aram harness,
    Tamil style rule 6).

    DRAFT — compiled for the design book and pending review by a Tamil
    scholar (same process as the Kabilar review of site strings). Items
    are kept to the best-attested two or three per cell. Do not present
    this as authoritative until reviewed. */

export const KARU_DRAFT = true;

export type KaruCategory =
  | "deity"
  | "bird"
  | "beast"
  | "flower"
  | "tree"
  | "food"
  | "water"
  | "drum"
  | "yazh"
  | "pann"
  | "work"
  | "settlement";

export interface Karu {
  ta: string;
  en: string;
}

export interface TinaiKaru {
  key: ThinaiKey;
  /** mutal: land, season(s) and time of day */
  land: Karu;
  season: Karu;
  time: Karu;
  /** uri: the feeling the tinai carries */
  uri: Karu;
  karu: Record<KaruCategory, Karu[]>;
}

export const KARU_CATEGORIES: { key: KaruCategory; ta: string; en: string }[] = [
  { key: "deity", ta: "தெய்வம்", en: "Deity" },
  { key: "bird", ta: "புள்", en: "Bird" },
  { key: "beast", ta: "மா", en: "Beast" },
  { key: "flower", ta: "பூ", en: "Flower" },
  { key: "tree", ta: "மரம்", en: "Tree" },
  { key: "food", ta: "உணா", en: "Food" },
  { key: "water", ta: "நீர்", en: "Water" },
  { key: "drum", ta: "பறை", en: "Drum" },
  { key: "yazh", ta: "யாழ்", en: "Yazh" },
  { key: "pann", ta: "பண்", en: "Melody" },
  { key: "work", ta: "தொழில்", en: "Work" },
  { key: "settlement", ta: "ஊர்", en: "Settlement" },
];

/** Ordered as THINAI on the site: palai, mullai, kurinji, marutham, neytal. */
export const KARUPPORUL: TinaiKaru[] = [
  {
    key: "palai",
    land: { ta: "சுரம் (வறண்ட நிலம்)", en: "parched wasteland" },
    season: { ta: "வேனில், பின்பனி", en: "summer, late dew" },
    time: { ta: "நண்பகல்", en: "midday" },
    uri: { ta: "பிரிதல்", en: "separation" },
    karu: {
      deity: [{ ta: "கொற்றவை", en: "Korravai" }],
      bird: [{ ta: "புறா", en: "dove" }, { ta: "பருந்து", en: "kite" }],
      beast: [{ ta: "செந்நாய்", en: "wild dog" }, { ta: "வலியிழந்த யானை", en: "worn-out elephant" }],
      flower: [{ ta: "குரவம்", en: "kuravam" }, { ta: "பாதிரி", en: "trumpet flower" }],
      tree: [{ ta: "இலுப்பை", en: "mahua" }, { ta: "பாலை", en: "palai tree" }],
      food: [{ ta: "வழிப்பறிப் பொருள்", en: "spoils of the road" }],
      water: [{ ta: "வற்றிய சுனை", en: "dried spring" }, { ta: "கூவல்", en: "dug pit" }],
      drum: [{ ta: "துடி", en: "tudi, the hourglass drum" }],
      yazh: [{ ta: "பாலை யாழ்", en: "palai yazh" }],
      pann: [{ ta: "பஞ்சுரம்", en: "panchuram" }],
      work: [{ ta: "வழிப்பறி", en: "raiding travellers" }, { ta: "நிரை கவர்தல்", en: "cattle raids" }],
      settlement: [{ ta: "குறும்பு", en: "fort-hamlet" }],
    },
  },
  {
    key: "mullai",
    land: { ta: "காடு", en: "forest and pasture" },
    season: { ta: "கார்", en: "rains" },
    time: { ta: "மாலை", en: "evening" },
    uri: { ta: "இருத்தல்", en: "patient waiting" },
    karu: {
      deity: [{ ta: "மாயோன்", en: "Mayon" }],
      bird: [{ ta: "காட்டுக்கோழி", en: "jungle fowl" }],
      beast: [{ ta: "மான்", en: "deer" }, { ta: "முயல்", en: "hare" }],
      flower: [{ ta: "முல்லை", en: "jasmine" }, { ta: "தோன்றி", en: "glory lily" }],
      tree: [{ ta: "கொன்றை", en: "golden shower" }, { ta: "காயா", en: "kaya" }, { ta: "குருந்தம்", en: "wild lime" }],
      food: [{ ta: "வரகு", en: "kodo millet" }, { ta: "சாமை", en: "little millet" }],
      water: [{ ta: "காட்டாறு", en: "forest stream" }],
      drum: [{ ta: "ஏறுகோட் பறை", en: "bull-taming drum" }],
      yazh: [{ ta: "முல்லை யாழ்", en: "mullai yazh" }],
      pann: [{ ta: "சாதாரி", en: "sadari" }],
      work: [{ ta: "நிரை மேய்த்தல்", en: "herding cattle" }],
      settlement: [{ ta: "பாடி", en: "herders' camp" }],
    },
  },
  {
    key: "kurinji",
    land: { ta: "மலை", en: "mountains" },
    season: { ta: "கூதிர், முன்பனி", en: "autumn, early dew" },
    time: { ta: "யாமம்", en: "midnight" },
    uri: { ta: "புணர்தல்", en: "union" },
    karu: {
      deity: [{ ta: "சேயோன் (முருகன்)", en: "Seyon (Murugan)" }],
      bird: [{ ta: "கிளி", en: "parrot" }, { ta: "மயில்", en: "peacock" }],
      beast: [{ ta: "புலி", en: "tiger" }, { ta: "யானை", en: "elephant" }, { ta: "கரடி", en: "bear" }],
      flower: [{ ta: "குறிஞ்சி", en: "kurinji" }, { ta: "காந்தள்", en: "glory lily" }],
      tree: [{ ta: "சந்தனம்", en: "sandalwood" }, { ta: "வேங்கை", en: "venkai" }, { ta: "மூங்கில்", en: "bamboo" }],
      food: [{ ta: "தினை", en: "foxtail millet" }, { ta: "மூங்கிலரிசி", en: "bamboo rice" }],
      water: [{ ta: "அருவி", en: "waterfall" }, { ta: "சுனை", en: "mountain spring" }],
      drum: [{ ta: "தொண்டகப் பறை", en: "tondagam drum" }],
      yazh: [{ ta: "குறிஞ்சி யாழ்", en: "kurinji yazh" }],
      pann: [{ ta: "குறிஞ்சிப் பண்", en: "kurinji pann" }],
      work: [{ ta: "தேன் எடுத்தல்", en: "gathering honey" }, { ta: "தினை காத்தல்", en: "guarding millet" }],
      settlement: [{ ta: "சிறுகுடி", en: "hill hamlet" }],
    },
  },
  {
    key: "marutham",
    land: { ta: "வயல்", en: "farmland" },
    season: { ta: "எல்லாப் பருவமும்", en: "every season" },
    time: { ta: "வைகறை", en: "before dawn" },
    uri: { ta: "ஊடல்", en: "lovers' quarrel" },
    karu: {
      deity: [{ ta: "வேந்தன் (இந்திரன்)", en: "Vendan (Indra)" }],
      bird: [{ ta: "நாரை", en: "stork" }, { ta: "குருகு", en: "heron" }],
      beast: [{ ta: "எருமை", en: "buffalo" }, { ta: "நீர்நாய்", en: "otter" }],
      flower: [{ ta: "தாமரை", en: "lotus" }, { ta: "கழுநீர்", en: "blue water lily" }],
      tree: [{ ta: "மருதம்", en: "arjuna" }, { ta: "காஞ்சி", en: "kanji" }],
      food: [{ ta: "செந்நெல்", en: "red paddy" }, { ta: "வெண்ணெல்", en: "white paddy" }],
      water: [{ ta: "ஆறு", en: "river" }, { ta: "பொய்கை", en: "pond" }],
      drum: [{ ta: "நெல்லரி கிணை", en: "harvest drum" }, { ta: "மண முழவு", en: "wedding drum" }],
      yazh: [{ ta: "மருத யாழ்", en: "marutha yazh" }],
      pann: [{ ta: "மருதப் பண்", en: "marutham pann" }],
      work: [{ ta: "களை கட்டல்", en: "weeding" }, { ta: "நெல்லரிதல்", en: "reaping paddy" }],
      settlement: [{ ta: "ஊர்", en: "village" }],
    },
  },
  {
    key: "neytal",
    land: { ta: "கடல்", en: "seashore" },
    season: { ta: "எல்லாப் பருவமும்", en: "every season" },
    time: { ta: "எற்பாடு", en: "late afternoon" },
    uri: { ta: "இரங்கல்", en: "lament" },
    karu: {
      deity: [{ ta: "வருணன் (கடலோன்)", en: "Varunan" }],
      bird: [{ ta: "கடற்காக்கை", en: "sea crow" }],
      beast: [{ ta: "சுறா", en: "shark" }, { ta: "முதலை", en: "crocodile" }],
      flower: [{ ta: "நெய்தல்", en: "water lily" }, { ta: "தாழை", en: "screwpine" }],
      tree: [{ ta: "புன்னை", en: "punnai" }, { ta: "கண்டல்", en: "mangrove" }],
      food: [{ ta: "மீன்", en: "fish" }, { ta: "உப்பு விற்ற பண்டம்", en: "goods bartered for salt" }],
      water: [{ ta: "கடல்", en: "sea" }, { ta: "உவர்க்குழி", en: "brackish pit" }],
      drum: [{ ta: "மீன்கோட் பறை", en: "fish-catch drum" }],
      yazh: [{ ta: "விளரி யாழ்", en: "vilari yazh" }],
      pann: [{ ta: "செவ்வழி", en: "sevvazhi" }],
      work: [{ ta: "மீன் பிடித்தல்", en: "fishing" }, { ta: "உப்பு விளைத்தல்", en: "making salt" }],
      settlement: [{ ta: "பட்டினம்", en: "port town" }, { ta: "பாக்கம்", en: "fishing hamlet" }],
    },
  },
];

export const KARU_BY_KEY = Object.fromEntries(KARUPPORUL.map((t) => [t.key, t])) as Record<ThinaiKey, TinaiKaru>;

/** Where the table was checked; the per-tinai items need a scholar's pass. */
export const KARU_SOURCES: { label: string; href?: string }[] = [
  { label: "Tolkāppiyam, Poruḷatikāram, Akattiṇaiyiyal (the karu sūtra quoted above)" },
  { label: "Sangam landscape — Wikipedia", href: "https://en.wikipedia.org/wiki/Sangam_landscape" },
  { label: "Eco-regions during the Sangam age — Rau's IAS", href: "https://compass.rauias.com/ancient-history/eco-regions-during-sangam-age/" },
  { label: "Landscape in Sangam literature — P. Aruna Devi", href: "https://tamilliterature.in/landscape-sangam-literature-dr-p-aruna-devi/" },
  { label: "How Sangam literature imagined a coastal world — The Wire", href: "https://m.thewire.in/article/culture/how-sangam-literature-imagined-a-coastal-world-of-balance" },
];
