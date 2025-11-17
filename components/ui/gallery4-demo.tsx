import { Gallery4, type Gallery4Props } from "@/components/ui/gallery4";

const demoData: Gallery4Props = {
  title: "Projects",
  description:
    "Some of the tools and frameworks that inspire how we build Bits&Bytes experiences.",
  items: undefined as unknown as any, // use Gallery4 defaults when omitted
};

function Gallery4Demo() {
  return <Gallery4 {...demoData} items={demoData.items as any} />;
}

export { Gallery4Demo };


