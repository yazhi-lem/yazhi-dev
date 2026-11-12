# SettingsControls

The parts of every Settings page: groups of rows, switches that say On or Off in words, a text-size stepper and a theme picker.

## Parts

- `yz-settings`: the column, up to 46rem wide. It ends with a `yz-pair`: red "Discard", green "Save".
- `yz-group` with a `yz-group__h`: a white card per topic.
- `yz-row`: a label (`yz-row__label`, Tamil · English) with help text (`yz-row__help`) on the left and the control on the right. Rows are separated by 2px `tn-line`.
- `yz-switch` (`role="switch"`, `aria-checked`): the track turns `tn-go` when on, and the word beside it says "ஆம் · On" or "இல்லை · Off". A locked safeguard gets `aria-disabled="true"` plus a `yz-lock` line explaining why ("Always on. Nyaya never gives legal advice.").
- `yz-stepper`: A− / size name / A+. It sets the root font size to 100%, 112.5%, 125% or 137.5%.
- `yz-swatches` with `yz-swatch` radios: a dot plus both names for each of the seven themes. The selected one gets a 3px ink ring.
- `yz-seg` with `role="radiogroup"` for short either/or choices: exam tier, jurisdiction, language.

## Every app's Settings carries

Seeing and reading: text size, look, reduce motion, strong focus ring. Then its own groups, with safeguards shown as locked switches so people can see they exist.
