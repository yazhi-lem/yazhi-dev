import type { ThinaiKey } from "../../tinai/keys";
import type { HairlineFigureDef } from "../types";
import cairn from "./cairn.js";
import grove from "./grove.js";
import peaks from "./peaks.js";
import paddy from "./paddy.js";
import tide from "./tide.js";
import yazh from "./yazh.js";
import parai from "./parai.js";
import vilakku from "./vilakku.js";
import olai from "./olai.js";

/** One Hairline figure per tinai, each built to Hairline's ten rules:
    a cairn for the drylands, a grove for the forest, a range for the
    mountains, terraced paddy for the farmland, boats at their moorings
    for the coast. */
export const TINAI_FIGURES: Record<ThinaiKey, HairlineFigureDef> = {
  palai: cairn as HairlineFigureDef,
  mullai: grove as HairlineFigureDef,
  kurinji: peaks as HairlineFigureDef,
  marutham: paddy as HairlineFigureDef,
  neytal: tide as HairlineFigureDef,
};

/** what each figure's slider changes, for the control's label */
export const FIGURE_DIAL: Record<ThinaiKey, string> = {
  palai: "gap",
  mullai: "reach",
  kurinji: "reach",
  marutham: "stagger",
  neytal: "swell reach",
};

export interface SangamObject {
  key: "yazh" | "parai" | "vilakku" | "olai";
  ta: string;
  en: string;
  figure: HairlineFigureDef;
  /** what the slider changes */
  dial: string;
  /** which karupporul category it belongs to, if any */
  karu?: "yazh" | "drum";
  /** one or two sentences; no claim the book cannot source */
  note: string;
}

/** Things from the Sangam world, drawn as Hairline objects. The yazh and
    the parai are karupporul — every tinai has its own kind of each. */
export const SANGAM_OBJECTS: SangamObject[] = [
  {
    key: "yazh",
    ta: "யாழ்",
    en: "Yazh",
    figure: yazh as HairlineFigureDef,
    dial: "sympathy",
    karu: "yazh",
    note: "The harp of the poems, and the instrument Yazhi is named for: one carved S-shaped body, a scroll above and a resonating belly below. Tolkāppiyam counts the yazh among the karu, so each landscape has its own. Turn on its sound and run a finger across the strings — tuned to Sempaalai pann.",
  },
  {
    key: "parai",
    ta: "பறை",
    en: "Parai",
    figure: parai as HairlineFigureDef,
    dial: "ring speed",
    karu: "drum",
    note: "The frame drum. Each tinai has its own parai in the karu, beaten for its own occasions — harvest, the catch, the bull-taming.",
  },
  {
    key: "vilakku",
    ta: "விளக்கு",
    en: "Vilakku",
    figure: vilakku as HairlineFigureDef,
    dial: "catch delay",
    note: "The standing oil lamp of the Tamil home and temple: a turned brass solid with wicks round its bowl.",
  },
  {
    key: "olai",
    ta: "ஓலைச்சுவடி",
    en: "Olai chuvadi",
    figure: olai as HairlineFigureDef,
    dial: "fan spread",
    note: "A palm-leaf manuscript. The Sangam anthologies came down to us on leaves like these, copied by hand until they were printed in the nineteenth century.",
  },
];
