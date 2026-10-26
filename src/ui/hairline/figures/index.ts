import type { ThinaiKey } from "@/lib/content";
import type { HairlineFigureDef } from "../types";
import cairn from "./cairn.js";
import grove from "./grove.js";
import peaks from "./peaks.js";
import paddy from "./paddy.js";
import tide from "./tide.js";

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
