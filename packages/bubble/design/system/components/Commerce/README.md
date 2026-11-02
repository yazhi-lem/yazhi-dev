# Commerce

Kadai's shop blocks: `ProductCard` rows and Annachi's `PaymentIntentCard`.

**ProductCard** — `product` (`id`, `name`, `taName`, `unit`, `price`, `stock` in·low·out), `onAdd`. Prices are rupees in en-IN grouping; a zero price shows "₹ —". Out of stock disables Add.

**PaymentIntentCard** — `lines` (`CartLine`: `product`, `qty`), `onRemove(id)`. v1 records a payment **intent** only: the merchant collects payment their usual way; no money moves through Yazhi. Keep that note.

Kadai's accent is `gold`. Source: `packages/bubble/src/modules/Commerce.tsx`.
