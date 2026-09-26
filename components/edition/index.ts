// Edition page system (Shopify Editions mechanics in bits&bytes™ brand). Every section-level piece
// carries data-surface (+ data-cinematic-section/title when it is a chapter) so the nav and the
// chapter index work without wiring. Client components except DuotoneImage and StickyStack.
export { EditionOpener, type EditionOpenerProps } from "./edition-opener";
export { ChapterHero, type ChapterHeroProps } from "./chapter-hero";
export { DuotoneImage, type DuotoneImageProps, type DuotoneTone } from "./duotone-image";
export { SerifStatement, type SerifStatementProps } from "./serif-statement";
export { IndentStatement, type IndentStatementProps } from "./indent-statement";
export { Odometer, type OdometerProps } from "./odometer";
export { FeedList, FeedRow, type FeedRowProps } from "./feed-list";
export { StickyStack, type StickyStackProps } from "./sticky-stack";
export { ChapterIndex, type ChapterIndexProps, type EditionChapter } from "./chapter-index";
export { EDITION_GUTTER, whenReady, type SurfaceTone } from "./shared";
