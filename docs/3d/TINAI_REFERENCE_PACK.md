# Tiṇai 3D reference pack

Strict references for the detailed 3D objects and scenes in the five tiṇai
landscapes. **No object is modelled until its references are approved.**

Where the numbers come from (open-sangam corpus, `data/`):

- **Core objects:** exact counts from `knowledge/tinai_context.json`, its
  `attested` lists.
- **Ecosystem additions:** rough counts, written `~N`. Each is the number of
  tiṇai-tagged verses (5,912 of them, across every text in `texts/`) whose Tamil
  contains the stem. These overcount (a stem can sit inside a longer word) and
  undercount (sandhi changes letters), so they say how present a thing is, not
  an exact figure.
- Season, time of day and kind of work come from `packages/bubble/src/lib/karupporul.ts`,
  a draft still waiting for a Tamil scholar's review.

**People appear only as roles:** herder, farmer, fisher, traveller, bard,
millet guard. The corpus's `people` category is never used, because several of
those names are present-day caste names, and Yazhi never names caste.

Machine-readable version: [`tinai-references.json`](./tinai-references.json).

## The rules

1. **Lock the species.** Every living object is fixed to one scientific name.
   A photo of a look-alike is rejected, even when it is beautiful. Known traps:
   - *Peltophorum pterocarpum* is not venkai (*Pterocarpus marsupium*).
   - Commons once applied *Nymphaea nouchali* to *N. pubescens*.
   - The "Canis aureus naria" category holds Kerala photos.
2. **At least three references per object:**
   - **form**: a full side or three-quarter view, used for the silhouette and proportions;
   - **detail**: head, flower, bark, leaf or fruit;
   - **habitat**: the object in place, from South India where possible (Tamil Nadu first).
3. **Licences:** Wikimedia Commons files under CC0, public domain, CC BY or
   CC BY-SA only. Record the file page, author and licence for every image.
   References are for modelling and are not shipped on the site.
4. **Real scale.** Model in metres to the size in the table. Overlay the form
   reference as a Blender image-empty in a `REF_<id>` collection, and check the
   silhouette against it before detailing.
5. **Approval gate.** Assemble one reference board per tiṇai and get it
   approved by the user. Only then model. Then render a turntable, compare it
   with the references, and get approval again before exporting.
6. **Export:** GLB to `public/models/<tinai>/<id>.glb`. Materials use only the
   tiṇai palette in `packages/bubble/src/tinai/environments.ts`. No photo
   textures go into the model.
7. **Objects marked `scholar`** (chariot, watch platform and so on) depend on
   how things looked in the Sangam period. Their references come from
   archaeology or sculpture, and a scholar signs them off before modelling.

### What was decided (2026-11-04)

- Cow: the **Kangayam** breed.
- Egret: the **little egret** (*Egretta garzetta*).
- Shark: **a dorsal fin only**, cutting the water.
- Mangrove: ***Rhizophora***, the stilt-rooted kind.
- Crow: the **house crow** (*Corvus splendens*).

---

## குறிஞ்சி · Kurinji (mountains)

Time **யாமம் · midnight**. Season **கூதிர், முன்பனி · autumn, early dew**.
Feeling **புணர்தல் · union**. Spring: buoyant (k 120, c 15).

### Core objects

| Object | Species / subject | Verses | Size | Must match | References |
|---|---|---|---|---|---|
| அருவி · Waterfall | Western Ghats cascade | 85 | 30–60 m drop | Stepped granite ledges, thin braided falls, a plunge pool | Search Commons for "Western Ghats waterfall" |
| வேங்கை · Venkai | *Pterocarpus marsupium* | 77 | 15–25 m | Crooked trunk; grey, cracked bark; pinnate leaves of 5–7 leaflets; dense golden-yellow panicles at branch tips | [Category](https://commons.wikimedia.org/wiki/Category:Pterocarpus_marsupium) · [Vengai AJTJ IMG8408](https://commons.wikimedia.org/wiki/File:Vengai,_Pterocarpus_marsupium_AJTJ_IMG8408.jpg) |
| யானை · Elephant | *Elephas maximus indicus* | 68 | 2.5–3 m at the shoulder | Twin-domed head, small rounded ears, back highest mid-body, one "finger" on the trunk tip, a tusked bull | [Category](https://commons.wikimedia.org/wiki/Category:Elephas_maximus) · [Asian elephant (Tamil file)](https://commons.wikimedia.org/wiki/File:%E0%AE%86%E0%AE%9A%E0%AE%BF%E0%AE%AF_%E0%AE%AF%E0%AE%BE%E0%AE%A9%E0%AF%88_-_Asian_elephant_-_Elephas_maximus.jpg) · [Bull Indian elephant](https://commons.wikimedia.org/wiki/File:Bull_Indian_elephant.jpg) |
| காந்தள் · Glory lily | *Gloriosa superba* | 40 | 6–8 cm flower | Six wavy tepals swept back, red with a yellow base; spreading stamens; climbing, with tendrils at the leaf tips | [Category](https://commons.wikimedia.org/wiki/Category:Gloriosa_superba) · [Silent Valley 2016 (CC BY-SA 4.0)](https://commons.wikimedia.org/wiki/File:Gloriosa_superba-Silent_Valley-2016-08-14-001.jpg) · [செங்காந்தள் மலர்](https://commons.wikimedia.org/wiki/File:%E0%AE%9A%E0%AF%86%E0%AE%99%E0%AF%8D%E0%AE%95%E0%AE%BE%E0%AE%A8%E0%AF%8D%E0%AE%A4%E0%AE%B3%E0%AF%8D_%E0%AE%AE%E0%AE%B2%E0%AE%B0%E0%AF%8D_-_Flame_lily_flower_-_Gloriosa_superba.jpg) |
| மயில் · Peacock | *Pavo cristatus*, male | 21 | about 1 m body; 1–1.5 m train | Crest fan of spatula-tipped feathers, blue neck, a train with eye-spots | [Male category](https://commons.wikimedia.org/wiki/Pavo_cristatus_(male)) · [Quality images](https://commons.wikimedia.org/wiki/Category:Quality_images_of_Pavo_cristatus) |

### Ecosystem additions

| Object | Species / subject | Verses | Size | Must match | References |
|---|---|---|---|---|---|
| தினை · Foxtail millet | *Setaria italica* | ~74 | 1–1.5 m stalks | Drooping, bristly golden heads; the field is a hillside clearing | Search Commons for "Setaria italica" |
| கிளி · Parrot | *Psittacula krameri* | ~48 | 40 cm | Green; red hooked bill; long tail; flies in flocks onto the millet | Search Commons for "Psittacula krameri" |
| சுனை · Mountain spring | A rock pool in granite | ~45 | 2–4 m across | Still water in a granite hollow, ferns at the rim | Search Commons for "Western Ghats rock pool" |
| தேன் · Rock-bee comb | *Apis dorsata* | ~30 | 1 m wide | A single crescent comb under a cliff overhang | Search Commons for "Apis dorsata comb" |
| கடுவன் · Male monkey | *Macaca radiata* | ~11 | 55 cm body | A cap of hair parted in the middle, long tail | Search Commons for "Macaca radiata" |
| குறிஞ்சி · Kurinji bloom | *Strobilanthes kunthiana* | 8 | 1–2 m shrub | Blue-violet flower spikes carpeting a whole slope | Search Commons for "Strobilanthes kunthiana" |
| இதண் · Millet-guard platform | A raised watch hut | — | 3–4 m high | Wood or bamboo on stilts, a thatched roof (scholar) | Ethnographic photos plus scholar sign-off |

### Scenes

- **K1 · யாமம், அருவியருகே · Midnight by the waterfall.** Moonlight and mist
  layers on the ridge. Venkai in bloom, kantal on the slope, an elephant passing
  below, the waterfall as the one bright stroke. Camera: a slow climb up the
  ridge. Verse: Kuruntokai 40 (rain on red earth).
- **K2 · தினை காத்தல் · Guarding the millet.** Late-morning sun. A millet
  clearing, the watch platform, parrot flocks swooping in and scattering, a
  rock-bee comb on the cliff, a monkey watching from the venkai.
- **K3 · கூதிர் மழை · Rain on the ridge.** Rain bands sweep through, the
  waterfall swells, the spring fills, and the slope turns kurinji-blue.

## முல்லை · Mullai (forest)

Time **மாலை · evening**. Season **கார் · the rains**. Feeling **இருத்தல் ·
patient waiting**. Spring: patient (k 85, c 18).

### Core objects

| Object | Species / subject | Verses | Size | Must match | References |
|---|---|---|---|---|---|
| முல்லை · Jasmine | *Jasminum auriculatum* | 66 | 1.5 cm flower; 2–3 m climber | Small white flowers with 5–8 lobes in loose clusters; small "eared" lateral leaflets | [Talakona forest, AP](https://commons.wikimedia.org/wiki/File:Jasminum_auriculatum_(Juhi)_in_Talakona_forest,_AP_W_IMG_8325.jpg) · [Plant (CC BY-SA 4.0)](https://commons.wikimedia.org/wiki/File:Jasminum_auriculatum_plant_(Chukka_malle_chettu).jpg) |
| கொன்றை · Golden shower | *Cassia fistula* | 27 | 10–15 m | Hanging racemes 30–60 cm long of bright yellow flowers; long dark cylindrical pods | [Category](https://commons.wikimedia.org/wiki/Category:Cassia_fistula) · [Flowers](https://commons.wikimedia.org/wiki/Category:Cassia_fistula_(flowers)) · [Kolkata 2011](https://commons.wikimedia.org/wiki/File:Cassia_fistula_-_Kolkata_2011-04-29_2367.JPG) |
| பசு · Cow | *Bos indicus*, Kangayam breed | 8 | 1.3–1.4 m at the shoulder | Grey-white coat (bulls darker on the hump and neck), a compact hump, a small dewlap, stout horns curving outward and back | Search Commons for "Kangayam cattle" |
| முயல் · Hare | *Lepus nigricollis* | 4 | 45 cm | Black patch on the nape; long ears with dark tips | Search Commons for "Lepus nigricollis" |

### Ecosystem additions

| Object | Species / subject | Verses | Size | Must match | References |
|---|---|---|---|---|---|
| மான் · Spotted deer | *Axis axis* | ~22 | 90 cm at the shoulder | White spots on a russet coat; the stag's antlers have three tines | Search Commons for "Axis axis" |
| தோன்றி · Glory lily | *Gloriosa superba* | ~16 | 6–8 cm flower | Same species as Kurinji's kantal, but in forest light | Use the Kurinji references |
| காயா · Kaya | *Memecylon umbellatum* | ~14 | 3–5 m shrub | Dense clusters of blue-purple flowers on the stems | Search Commons for "Memecylon umbellatum" |
| வண்டு · Bees | *Apis cerana* or carpenter bees | ~13 | 1–2 cm | Small, flown as particles over the jasmine | Search Commons for "Apis cerana" |
| தேர் · Chariot | A Sangam-era light chariot | ~40 | about 3 m | Two wheels, a small box, horses or bullocks (scholar) | Archaeology and sculpture references plus scholar sign-off |
| குழல் · Herder's flute | A bamboo flute | ~11 | 40 cm | A plain bamboo tube with finger holes | Search Commons for "bamboo flute India" |
| பாடி · Herders' camp | Thatched huts and a cattle pen | — | Several huts | Round huts, a thorn fence (scholar) | Ethnographic photos plus scholar sign-off |

### Scenes

- **M1 · கார்ப் பருவம் · Evening, first rains.** Konrai racemes swinging,
  jasmine opening at dusk, Kangayam cattle walking home, the sound of a flute,
  a pair of deer at the forest edge. Verse: Ainkurunuru 437.
- **M2 · தேர் வரவு · The chariot returns.** A chariot on the forest road at
  dusk, bees over the jasmine, fireflies rising. This is the payoff of waiting.
- **M3 · காத்திருப்பு · Waiting, as a timeline.** Scroll scrubs the season from
  dry to rain: bare konrai turns golden, the jasmine buds open, the stream
  fills.

## மருதம் · Marutham (farmland)

Time **வைகறை · before dawn**. Season **every season**. Feeling **ஊடல் ·
lovers' quarrel**. Spring: critically damped (k 100, c 20).

### Core objects

| Object | Species / subject | Verses | Size | Must match | References |
|---|---|---|---|---|---|
| ஆம்பல் · White water lily | *Nymphaea pubescens* | 32 | 15 cm flower | White, toothed pads lying flat on the water | Search Commons for "Nymphaea pubescens" |
| எருமை · Water buffalo | *Bubalus bubalis* | 20 | 1.5 m at the shoulder | Swept-back crescent horns, slate-black hide, often half-submerged | [Category](https://commons.wikimedia.org/wiki/Category:Bubalus_bubalis) · [In Tamil Nadu](https://commons.wikimedia.org/wiki/Category:Water_buffaloes_in_Tamil_Nadu) |
| வயல் · Paddy field | Transplanted rice | 12 | 20×20 m plot | Earth bunds, standing water, rows of seedlings | Search Commons for "paddy field Thanjavur" |
| நாரை · Painted stork | *Mycteria leucocephala* | 5 | 95 cm | Yellow down-curved bill, bare orange face, pink tertials, a black-and-white wing band | [Category](https://commons.wikimedia.org/wiki/Category:Mycteria_leucocephala) · [Juveniles at nest, AP (CC BY 3.0)](https://commons.wikimedia.org/wiki/File:Painted_Stork_(Mycteria_leucocephala)-_juveniles_at_nest_W3_IMG_7214.jpg) |
| மருதம் · Arjuna tree | *Terminalia arjuna* | 5 | 20–25 m | Smooth, pale grey-white bark peeling in flakes, a buttressed base, a riverbank setting | [Category](https://commons.wikimedia.org/wiki/Category:Terminalia_arjuna) · [Bark](https://commons.wikimedia.org/wiki/File:Bark_of_Terminalia_arjuna.jpg) · [Kakinada tree](https://commons.wikimedia.org/wiki/File:(Terminalia_Arjuna)_tree_at_Vivekananda_park_in_Kakinada.jpg) |

### Ecosystem additions

| Object | Species / subject | Verses | Size | Must match | References |
|---|---|---|---|---|---|
| தாமரை · Lotus | *Nelumbo nucifera* | ~34 | 1 m stalks; 20 cm flower | Pink flower held above the water, round leaves standing clear of the surface, seed pods | Search Commons for "Nelumbo nucifera" |
| பொய்கை · Pond | A village tank with steps | ~39 | 30 m | Stone steps, lilies at the edge | Search Commons for "temple tank Tamil Nadu" |
| வாளை · Valai fish | *Wallago attu* | ~16 | 1 m | A long catfish with a wide mouth; leaps out of the water | Search Commons for "Wallago attu" |
| கரும்பு · Sugarcane | *Saccharum officinarum* | ~8 | 3 m | Jointed canes, arching leaves, planted in rows | Search Commons for "sugarcane field Tamil Nadu" |
| காஞ்சி · Kanji tree | **scholar**: the species identification varies | ~14 | — | Hold until it is identified | Scholar first |
| குருகு · Heron | *Ardeola grayii* (pond heron) | ~7 | 45 cm | Brown and streaky at rest, flashing white wings in flight | Search Commons for "Ardeola grayii" |
| கிணை · Harvest drum | A small frame drum | — | 30 cm | Hide stretched on a wooden frame (scholar) | Museum references plus scholar sign-off |
| குதிர் · Grain store | A clay granary | — | 2–3 m | A coiled clay bin on legs, with a lid | Search Commons for "kuthir granary" |

### Scenes

- **R1 · வைகறை · Before dawn.** Mist on the ponds, white water lilies opening
  as the light comes (Ainkurunuru 68), a painted stork stepping through the
  shallows, buffalo wallowing, valai fish leaping.
- **R2 · நெல்லரிதல் · The paddy harvest.** Golden paddy, reapers as roles,
  sheaves on the bunds, the harvest drum, clay granaries, sugarcane at the edge.
- **R3 · ஊர்த் துறை · The village landing.** Arjuna trees along the river,
  a lotus pond, the bard on his way to the house.

## நெய்தல் · Neytal (coast)

Time **எற்பாடு · late afternoon**. Season **every season**. Feeling **இரங்கல்
· lament**. Spring: tidal (k 55, c 10).

### Core objects

| Object | Species / subject | Verses | Size | Must match | References |
|---|---|---|---|---|---|
| புன்னை · Punnai | *Calophyllum inophyllum* | 75 | 8–20 m | A dense crown of glossy oblong leaves with fine parallel veins; white flowers with yellow stamens; round fruit; leans over the shore | [Category](https://commons.wikimedia.org/wiki/Category:Calophyllum_inophyllum) · [Punna](https://commons.wikimedia.org/wiki/File:Punna_(Malayalam-_%E0%B4%AA%E0%B5%81%E0%B4%A8%E0%B5%8D%E0%B4%A8)_(3438219419).jpg) · [Ponna](https://commons.wikimedia.org/wiki/File:Ponna_(Telugu-_%E0%B0%AA%E0%B1%8A%E0%B0%A8%E0%B1%8D%E0%B0%A8)_(2065676227).jpg) |
| நெய்தல் · Blue water lily | *Nymphaea nouchali* | 50 | 10–15 cm flower | Star-shaped pale blue petals, yellow centre, held above the water | [Category](https://commons.wikimedia.org/wiki/Category:Nymphaea_nouchali) · [South India 2014 (23)](https://commons.wikimedia.org/wiki/File:Nymphaea_nouchali_-_Blue_Water_Lily_2014_(23).jpg) |
| நாரை · Little egret | *Egretta garzetta* | 32 | 55–65 cm | White; black bill; black legs with yellow feet; two long nape plumes when breeding | Search Commons for "Egretta garzetta" |
| தாழை · Screwpine | *Pandanus odorifer* (syn. *odoratissimus*) | 30 | 3–6 m | Sword leaves arranged in a spiral, with spiny edges; stilt roots; a pineapple-like fruit | [Category](https://commons.wikimedia.org/wiki/Category:Pandanus_odorifer) · [Kewda](https://commons.wikimedia.org/wiki/File:Kewda(Pandanus_odoratissimus).jpeg) |
| சுறா · Shark fin | A requiem-shark dorsal fin, *Carcharhinus* | 18 | 30–40 cm above the water | A tall triangle with a slightly curved back edge, and a wake behind it. Fin only, no body | Search Commons for "Carcharhinus dorsal fin" |
| கண்டல் · Mangrove | *Rhizophora mucronata* | 10 | 3–8 m | Arching stilt roots, glossy elliptic leaves, long hanging seedlings, brackish water | Search Commons for "Rhizophora mucronata" (Pichavaram, Tamil Nadu, first) |

### Ecosystem additions

| Object | Species / subject | Verses | Size | Must match | References |
|---|---|---|---|---|---|
| கழி · Backwater creek | A brackish lagoon | ~128 | 100 m | Still, shallow water, mudflats, mangrove edges | Search Commons for "Pichavaram backwaters" |
| கானல் · Shore grove | A punnai and screwpine grove | ~100 | 50 m | Shade on sand, the sea seen between trunks | Habitat composite |
| திரை · Waves | Bay of Bengal surf | ~101 | — | Low long breakers, foam lines | Search Commons for "Coromandel coast waves" |
| துறை · Landing | A beach landing | ~144 | — | Boats drawn up the sand, nets | Search Commons for "fishing hamlet Tamil Nadu beach" |
| திமில் · Catamaran | A log raft (kattumaram) | ~16 | 6–8 m | Three to five logs lashed together, a raised bow, a triangular sail (scholar) | Search Commons for "kattumaram" |
| வலை · Fishing net | A hand-knotted net | ~38 | — | Drying on poles, floats along its edge | Search Commons for "fishing nets drying Tamil Nadu" |
| உப்பு · Salt pans | Rectangular salt pans | ~12 | 10×10 m pans | Shallow pans, white heaps of salt, earth dykes | Search Commons for "salt pans Tamil Nadu" |
| உமணர் சகடம் · Salt carts | Bullock carts carrying salt | ~9 | 4 m | Solid wheels, a covered bed (scholar) | Ethnographic photos plus scholar sign-off |
| குருகு · Heron | *Ardea cinerea* | ~26 | 95 cm | Grey; a black stripe behind the eye | Search Commons for "Ardea cinerea India" |
| அடும்பு · Beach morning glory | *Ipomoea pes-caprae* | ~9 | Creeping vines | Two-lobed leaves, pink-purple trumpet flowers across the dunes | Search Commons for "Ipomoea pes-caprae" |
| முண்டகம் · Holly mangrove | *Acanthus ilicifolius* | ~6 | 1–2 m | Holly-like spiny leaves, pale violet flower spikes | Search Commons for "Acanthus ilicifolius" |

### Scenes

- **N1 · எற்பாடு · Boats coming home.** Late-afternoon light, catamarans
  coming in through the surf, nets drying, a punnai grove, little egrets on
  the creek.
- **N2 · உப்பளம் · The salt pans.** White pans, a caravan of salt carts on the
  dyke, screwpine hedges, a heron in the shallows.
- **N3 · ஏக்கம் · Tide and longing.** The tide rising into the creek, beach
  morning glory on the dunes, a fin offshore, the moon coming up. Verse:
  Ainkurunuru 101 (his chariot crushing the adumbu vines).

## பாலை · Palai (drylands)

Time **நண்பகல் · midday**. Season **வேனில், பின்பனி · summer, late dew**.
Feeling **பிரிதல் · separation**. Spring: heavy (k 70, c 17).

### Core objects

| Object | Species / subject | Verses | Size | Must match | References |
|---|---|---|---|---|---|
| சுரம் · The wild road | A path through dry thorn scrub | 106 | 100 m stretch | Cracked red earth, thorn scrub, a dry stream bed | Search Commons for "thorn scrub Tamil Nadu" |
| புலி · Tiger | *Panthera tigris tigris* | 46 | 2.7–3 m including the tail | Bengal stripe pattern, a white patch behind each ear, a heavy forequarter | [Category](https://commons.wikimedia.org/wiki/Category:Panthera_tigris_tigris) · [Tigers in India](https://commons.wikimedia.org/wiki/Category:Tigers_in_India) |
| காக்கை · House crow | *Corvus splendens* | 7 | 40 cm | Glossy black, a grey nape and collar, a thick bill | Search Commons for "Corvus splendens" |
| நரி · Jackal | *Canis aureus indicus* | 6 | 70 cm body | Tawny coat with a black-flecked saddle, a black-tipped tail | [Category](https://commons.wikimedia.org/wiki/Category:Canis_aureus_indicus) · [Male, Kanha](https://commons.wikimedia.org/wiki/File:Golden_jackal_(Canis_aureus_indicus)_male.jpg) |

### Ecosystem additions

| Object | Species / subject | Verses | Size | Must match | References |
|---|---|---|---|---|---|
| யானை · Worn-out elephant | *Elephas maximus indicus* | ~105 | 2.5 m | The Kurinji elephant, gaunt and dusty, at a dried spring | Use the Kurinji references |
| கவலை · Forked paths | Paths that split | ~42 | — | Where the road branches, with a stone marking the fork | Habitat composite |
| கள்ளி · Kalli | *Euphorbia antiquorum* | ~23 | 2–5 m | Three-angled green stems with paired spines | Search Commons for "Euphorbia antiquorum" |
| இருப்பை · Mahua | *Madhuca longifolia* | ~17 | 12–15 m | A round crown; fleshy cream flowers dropping onto the ground | Search Commons for "Madhuca longifolia" |
| எருவை · Vulture | *Gyps bengalensis* | ~15 | 90 cm; 2 m wingspan | Dark plumage, a white rump, circling on thermals | Search Commons for "Gyps bengalensis" |
| பருந்து · Kite | *Milvus migrans* | ~13 | 60 cm | A forked tail, gliding | Search Commons for "Milvus migrans India" |
| செந்நாய் · Wild dog | *Cuon alpinus* | ~12 | 90 cm body | A rust-red coat, a bushy dark tail, hunting in packs | Search Commons for "Cuon alpinus" |
| நடுகல் · Hero stone | A memorial stone with a carved warrior | ~10 | 1–2 m | An upright granite slab, a carved relief, an inscription band | Search Commons for "hero stones Tamil Nadu" (scholar on the inscription) |
| புறா · Dove | *Streptopelia chinensis* | ~6 | 30 cm | A spotted collar | Search Commons for "Streptopelia chinensis" |
| மாஞ்சினை · Mango bough | *Mangifera indica* | Aink. 349 | 2 m branch | A scorched bough putting out new, flame-red leaves | Search Commons for "mango new leaves" |

### Scenes

- **P1 · நண்பகல் கடத்தல் · The midday crossing.** Heat haze, short
  shadows, travellers as roles at the forked paths, kalli and thorn scrub, a
  hero stone at the fork, a tiger on the ridge.
- **P2 · வற்றிய சுனை · The dried spring.** A worn-out elephant at a dried
  spring and a dug pit, vultures and kites circling, a pack of wild dogs at
  the edge.
- **P3 · இளவேனில் · The season turns.** Mahua flowers drop, the scorched mango
  bough sprouts red leaves (Ainkurunuru 349), a house crow on the branch. He
  has not come, but the season has.

---

## Status

- Category and file pages were found by web search on 2026-11-04. Licences have
  **not** yet been read on each file page. The session that downloads the
  images records the licence of each one, and drops any file that isn't CC0,
  public domain, CC BY or CC BY-SA.
- Waiting on scholar sign-off: the chariot, the millet-guard platform, the
  herders' camp, the identity of the kanji tree, the harvest drum, the
  catamaran's form, the salt carts, and the hero-stone inscription.
- Next: download the images into `docs/3d/refs/<tinai>/<id>/`, outside the
  build. Make one board per tiṇai. Get them approved. Then model, one tiṇai at
  a time, starting with Kurinji K1.
