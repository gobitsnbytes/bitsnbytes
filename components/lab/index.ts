// stripe.dev 1:1 kit ("lab notebook") for /cloud /join /contact /faq /press /qna.
// Pages built on it render their own heroes (LabHero), so no EditionOpener / chapter index /
// EDITION_GUTTER. Wrap chapters in <section data-cinematic-section data-cinematic-title data-surface>
// (LabGrid takes as="section" and passes data-* through).
// Client: PixelGlyph, FigWindow, LabGlobe, LabFeed/LabFeedRow/LabFilters, RouterFigure, HollowWord.
// Server-safe: the rest (LabFeature / LabHero render client children).
export { LAB_COLS, LAB_STICKY, LAB_TEXT, LAB_HOVER, LAB_MARKER, labDate } from "./tokens";
export {
  LabGrid,
  LabCell,
  RegMarks,
  TableHeader,
  LabTitle,
  LabTag,
  LabLink,
  LabStyles,
  type LabGridProps,
  type LabCellProps,
  type RegMarksProps,
  type TableHeaderProps,
  type LabTitleProps,
  type LabTagProps,
  type LabLinkProps,
} from "./grid";
export { PixelGlyph, type PixelGlyphProps } from "./pixel-glyph";
export { FigWindow, LabGlobe, useCanvasLoop, type FigWindowProps, type LabGlobeProps } from "./fig-window";
export { artConfig, drawArt, djb2, mulberry32, ART_PRESETS, type ArtPreset, type ArtParams } from "./art";
export {
  LabFeed,
  LabFeedRow,
  LabFilters,
  type LabFeedProps,
  type LabFeedRowProps,
  type LabFiltersProps,
  type LabFilterGroup,
  type LabFilterOption,
  type LabFilterValue,
} from "./feed";
export { RouterFigure, type RouterFigureProps, type RouterItem, type RouterLink } from "./router-figure";
export { HollowWord, type HollowWordProps } from "./hollow-word";
export {
  LabHero,
  LabFeature,
  StatTicker,
  HelpGrid,
  LabFooterRows,
  type LabHeroProps,
  type LabFeatureProps,
  type StatTickerProps,
  type StatTickerItem,
  type HelpGridProps,
  type HelpTopic,
  type LabFooterRowsProps,
} from "./sections";
