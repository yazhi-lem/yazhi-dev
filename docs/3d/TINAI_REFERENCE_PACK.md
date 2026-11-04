# Tiṇai 3D reference pack

Strict references for the detailed 3D objects in the five tiṇai landscapes.
**No object is modelled until its references are approved.** The object list
and verse counts come from the open-sangam corpus
(`data/knowledge/tinai_context.json`, the `attested` lists). Each count is the
number of corpus verses that name the object.

The corpus's `people` category is left out on purpose: several of those names
are also present-day caste names, and Yazhi never names caste.

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
   - **habitat**: the object in place, from South India where possible.
3. **Licences:** Wikimedia Commons files under CC0, public domain, CC BY or
   CC BY-SA only. Record the file page, author and licence for every image.
   References are for modelling and are not shipped on the site, but they are
   recorded all the same.
4. **Real scale.** Model in metres to the size in the table. Overlay the form
   reference as a Blender image-empty in a `REF_<id>` collection, and check the
   silhouette against it before detailing.
5. **Approval gate.** Assemble one reference board per tiṇai and get it
   approved by the user. Only then model. Then render a turntable, compare it
   with the references, and get approval again before exporting.
6. **Export:** GLB to `public/models/<tinai>/<id>.glb`. Materials use only the
   tiṇai palette in `packages/bubble/src/tinai/environments.ts`. No photo
   textures from the references go into the model.
7. **Undecided objects are marked `decide`.** Do not guess them; ask.

## குறிஞ்சி · Kurinji (mountains)

| Object | Species / subject | Verses | Size | Must match | References |
|---|---|---|---|---|---|
| அருவி · Waterfall | Western Ghats cascade | 85 | 30–60 m drop | Stepped granite ledges, thin braided falls, a plunge pool | Habitat search only: "Western Ghats waterfall", Commons |
| வேங்கை · Venkai | *Pterocarpus marsupium* | 77 | 15–25 m | Crooked trunk; grey, cracked bark; pinnate leaves of 5–7 leaflets; dense golden-yellow panicles at branch tips | [Category](https://commons.wikimedia.org/wiki/Category:Pterocarpus_marsupium) · [Vengai AJTJ IMG8408](https://commons.wikimedia.org/wiki/File:Vengai,_Pterocarpus_marsupium_AJTJ_IMG8408.jpg) |
| யானை · Elephant | *Elephas maximus indicus* | 68 | 2.5–3 m at the shoulder | Twin-domed head, small rounded ears, back highest mid-body, one "finger" on the trunk tip, a tusked bull | [Category](https://commons.wikimedia.org/wiki/Category:Elephas_maximus) · [Asian elephant (Tamil file)](https://commons.wikimedia.org/wiki/File:%E0%AE%86%E0%AE%9A%E0%AE%BF%E0%AE%AF_%E0%AE%AF%E0%AE%BE%E0%AE%A9%E0%AF%88_-_Asian_elephant_-_Elephas_maximus.jpg) · [Bull Indian elephant](https://commons.wikimedia.org/wiki/File:Bull_Indian_elephant.jpg) |
| காந்தள் · Glory lily | *Gloriosa superba* | 40 | 6–8 cm flower | Six wavy tepals swept back, red with a yellow base; spreading stamens; climbing, with tendrils at the leaf tips | [Category](https://commons.wikimedia.org/wiki/Category:Gloriosa_superba) · [Silent Valley 2016 (CC BY-SA 4.0)](https://commons.wikimedia.org/wiki/File:Gloriosa_superba-Silent_Valley-2016-08-14-001.jpg) · [செங்காந்தள் மலர்](https://commons.wikimedia.org/wiki/File:%E0%AE%9A%E0%AF%86%E0%AE%99%E0%AF%8D%E0%AE%95%E0%AE%BE%E0%AE%A8%E0%AF%8D%E0%AE%A4%E0%AE%B3%E0%AF%8D_%E0%AE%AE%E0%AE%B2%E0%AE%B0%E0%AF%8D_-_Flame_lily_flower_-_Gloriosa_superba.jpg) |
| மயில் · Peacock | *Pavo cristatus*, male | 21 | about 1 m body; 1–1.5 m train | Crest fan of spatula-tipped feathers, blue neck, a train with eye-spots | [Male category](https://commons.wikimedia.org/wiki/Pavo_cristatus_(male)) · [Quality images](https://commons.wikimedia.org/wiki/Category:Quality_images_of_Pavo_cristatus) |

## முல்லை · Mullai (forest)

| Object | Species / subject | Verses | Size | Must match | References |
|---|---|---|---|---|---|
| முல்லை · Jasmine | *Jasminum auriculatum* | 66 | 1.5 cm flower; 2–3 m climber | Small white flowers with 5–8 lobes in loose clusters; small "eared" lateral leaflets | [Talakona forest, AP](https://commons.wikimedia.org/wiki/File:Jasminum_auriculatum_(Juhi)_in_Talakona_forest,_AP_W_IMG_8325.jpg) · [Plant (CC BY-SA 4.0)](https://commons.wikimedia.org/wiki/File:Jasminum_auriculatum_plant_(Chukka_malle_chettu).jpg) |
| கொன்றை · Golden shower | *Cassia fistula* | 27 | 10–15 m | Hanging racemes 30–60 cm long of bright yellow flowers; long dark cylindrical pods | [Category](https://commons.wikimedia.org/wiki/Category:Cassia_fistula) · [Flowers](https://commons.wikimedia.org/wiki/Category:Cassia_fistula_(flowers)) · [Kolkata 2011](https://commons.wikimedia.org/wiki/File:Cassia_fistula_-_Kolkata_2011-04-29_2367.JPG) |
| பசு · Cow | *Bos indicus*, a Tamil breed | 8 | 1.3 m at the shoulder | Hump, dewlap, horns. **decide**: the Kangayam or the Umblachery breed | Search Commons for "Kangayam" |
| முயல் · Hare | *Lepus nigricollis* | 4 | 45 cm | Black patch on the nape; long ears with dark tips | Search Commons for "Lepus nigricollis" |

## மருதம் · Marutham (farmland)

| Object | Species / subject | Verses | Size | Must match | References |
|---|---|---|---|---|---|
| ஆம்பல் · White water lily | *Nymphaea pubescens* | 32 | 15 cm flower | White, toothed pads lying flat on the water | Search Commons for "Nymphaea pubescens" |
| எருமை · Water buffalo | *Bubalus bubalis* | 20 | 1.5 m at the shoulder | Swept-back crescent horns, slate-black hide, often half-submerged | [Category](https://commons.wikimedia.org/wiki/Category:Bubalus_bubalis) · [In Tamil Nadu](https://commons.wikimedia.org/wiki/Category:Water_buffaloes_in_Tamil_Nadu) |
| வயல் · Paddy field | Transplanted rice | 12 | 20×20 m plot | Earth bunds, standing water, rows of seedlings | Habitat search only: "paddy field Thanjavur" |
| நாரை · Painted stork | *Mycteria leucocephala* | 5 | 95 cm | Yellow down-curved bill, bare orange face, pink tertials, a black-and-white wing band | [Category](https://commons.wikimedia.org/wiki/Category:Mycteria_leucocephala) · [Juveniles at nest, AP (CC BY 3.0)](https://commons.wikimedia.org/wiki/File:Painted_Stork_(Mycteria_leucocephala)-_juveniles_at_nest_W3_IMG_7214.jpg) |
| மருதம் · Arjuna tree | *Terminalia arjuna* | 5 | 20–25 m | Smooth, pale grey-white bark peeling in flakes, a buttressed base, a riverbank setting | [Category](https://commons.wikimedia.org/wiki/Category:Terminalia_arjuna) · [Bark](https://commons.wikimedia.org/wiki/File:Bark_of_Terminalia_arjuna.jpg) · [Kakinada tree](https://commons.wikimedia.org/wiki/File:(Terminalia_Arjuna)_tree_at_Vivekananda_park_in_Kakinada.jpg) |

## நெய்தல் · Neytal (coast)

| Object | Species / subject | Verses | Size | Must match | References |
|---|---|---|---|---|---|
| புன்னை · Punnai | *Calophyllum inophyllum* | 75 | 8–20 m | A dense crown of glossy oblong leaves with fine parallel veins; white flowers with yellow stamens; round fruit; leans over the shore | [Category](https://commons.wikimedia.org/wiki/Category:Calophyllum_inophyllum) · [Punna](https://commons.wikimedia.org/wiki/File:Punna_(Malayalam-_%E0%B4%AA%E0%B5%81%E0%B4%A8%E0%B5%8D%E0%B4%A8)_(3438219419).jpg) · [Ponna](https://commons.wikimedia.org/wiki/File:Ponna_(Telugu-_%E0%B0%AA%E0%B1%8A%E0%B0%A8%E0%B1%8D%E0%B0%A8)_(2065676227).jpg) |
| நெய்தல் · Blue water lily | *Nymphaea nouchali* | 50 | 10–15 cm flower | Star-shaped pale blue petals, yellow centre, held above the water | [Category](https://commons.wikimedia.org/wiki/Category:Nymphaea_nouchali) · [South India 2014 (23)](https://commons.wikimedia.org/wiki/File:Nymphaea_nouchali_-_Blue_Water_Lily_2014_(23).jpg) |
| நாரை · Egret | *Ardea alba* or *Egretta garzetta* | 32 | 65–90 cm | White, with an S-curved neck and long legs. **decide** which species | Search Commons for each species |
| தாழை · Screwpine | *Pandanus odorifer* (syn. *odoratissimus*) | 30 | 3–6 m | Sword leaves arranged in a spiral, with spiny edges; stilt roots; a pineapple-like fruit | [Category](https://commons.wikimedia.org/wiki/Category:Pandanus_odorifer) · [Kewda](https://commons.wikimedia.org/wiki/File:Kewda(Pandanus_odoratissimus).jpeg) |
| சுறா · Shark | **decide** the species | 18 | 2–3 m | Probably only a dorsal fin breaking the water | Choose the species first |
| கண்டல் · Mangrove | **decide**: *Rhizophora* (stilt roots) or *Avicennia* (pneumatophores) | 10 | 3–8 m | Depends on the choice | Choose the genus first |

## பாலை · Palai (drylands)

| Object | Species / subject | Verses | Size | Must match | References |
|---|---|---|---|---|---|
| சுரம் · The wild road | A path through dry thorn scrub | 106 | 100 m stretch | Cracked red earth, thorn scrub, a dry stream bed | Habitat search only: "thorn scrub Tamil Nadu" |
| புலி · Tiger | *Panthera tigris tigris* | 46 | 2.7–3 m including the tail | Bengal stripe pattern, a white patch behind each ear, a heavy forequarter | [Category](https://commons.wikimedia.org/wiki/Category:Panthera_tigris_tigris) · [Tigers in India](https://commons.wikimedia.org/wiki/Category:Tigers_in_India) |
| காக்கை · Crow | **decide**: *Corvus splendens* (grey collar) or *C. macrorhynchos* | 7 | 40 cm | Depends on the choice | Choose the species first |
| நரி · Jackal | *Canis aureus indicus* | 6 | 70 cm body | Tawny coat with a black-flecked saddle, a black-tipped tail | [Category](https://commons.wikimedia.org/wiki/Category:Canis_aureus_indicus) · [Male, Kanha](https://commons.wikimedia.org/wiki/File:Golden_jackal_(Canis_aureus_indicus)_male.jpg) |

## Status

- Category and file pages were found by web search on 2026-11-04. Licences have
  **not** yet been read on each file page. The session that downloads the
  images must record the licence of each one, and drop any file that isn't
  CC0, public domain, CC BY or CC BY-SA.
- Five objects are waiting on a decision (marked **decide** above).
- Next: download the images into `docs/3d/refs/<tinai>/<id>/`, outside the
  build. Make one board per tiṇai. Get them approved. Then model.
