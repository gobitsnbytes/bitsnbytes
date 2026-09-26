import { CubeMark } from "@/components/chrome/wordmark";
import { ConsoleWindow } from "@/components/contact/console-window";
import { ContactForm, CopyEmailButton } from "@/components/contact/contact-form";
import {
  FigWindow,
  HelpGrid,
  HollowWord,
  LAB_HOVER,
  LAB_STICKY,
  LAB_TEXT,
  LabCell,
  LabFooterRows,
  LabGlobe,
  LabGrid,
  LabHero,
  LabLink,
  LabTitle,
  PixelGlyph,
  TableHeader,
  type HelpTopic,
} from "@/components/lab";
import { cn } from "@/lib/utils";

const EMAIL = "hello@gobitsnbytes.org";

const socials = [
  { label: "GitHub", href: "https://github.com/gobitsnbytes" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/gobitsbytes" },
  { label: "Instagram", href: "https://www.instagram.com/gobitsnbytes" },
];

const channels: HelpTopic[] = [
  {
    title: "Email Address",
    body: (
      <LabLink href={`mailto:${EMAIL}`} className={cn("break-all underline decoration-1 underline-offset-4", LAB_HOVER)}>
        {EMAIL}
      </LabLink>
    ),
    examples: [{ label: "Send Email", href: `mailto:${EMAIL}` }],
    cta: <CopyEmailButton />,
  },
  {
    title: "Location",
    body: (
      <p>
        <b>Pan-India</b>
        <br />
        Forks in cities across India
      </p>
    ),
    examples: [],
  },
  {
    title: "Status",
    body: (
      <p>
        <b>Teen-led since 2025</b>
        <br />
        Independent student community
      </p>
    ),
    examples: [],
  },
  {
    title: "Follow the Builds",
    body: <p>See what we&apos;re shipping</p>,
    examples: socials,
  },
];

const SECTION = "gap-y-10 pt-24 min-[760px]:pt-[136px]";

export default function Contact() {
  return (
    <>
      <section
        data-cinematic-section=""
        data-cinematic-title="Let's build something together"
        data-surface="paper"
      >
        <LabHero
          lines={["Let's build ", "something ", "together"]}
          glyph={<PixelGlyph text="CONTACT" decorative />}
          aside={<LabGlobe />}
          subtitle={<p>Run a hackathon with us, sponsor one, or bring one to your school, anywhere in India.</p>}
        >
          <p aria-hidden className="font-mono text-[11px] uppercase leading-none">
            20.5937° N, 78.9629° E
          </p>
        </LabHero>
      </section>

      {/* the form inside console chrome beside the seeded Fig. 1 */}
      <LabGrid
        as="section"
        id="send-message"
        data-cinematic-section=""
        data-cinematic-title="Send Message"
        data-surface="paper"
        className={SECTION}
      >
        <TableHeader label="Contact" className="col-span-full" />
        <div className="col-span-full max-lg:hidden lg:col-[1/7]">
          <FigWindow seed="Send Message" fig={1} className={LAB_STICKY} />
        </div>
        <div className="col-span-full lg:col-[8/25]">
          <ConsoleWindow title="Reach the bits&bytes™ crew" bodyClassName="p-5 md:p-8">
            <ContactForm />
          </ConsoleWindow>
        </div>
      </LabGrid>

      <LabGrid
        as="section"
        id="who-we-are"
        data-cinematic-section=""
        data-cinematic-title="bits&bytes™"
        data-surface="paper"
        className={SECTION}
      >
        <TableHeader as="h2" label="bits&bytes™" className="col-span-full" />
        <LabCell span="1/20">
          <p className={LAB_TEXT.lg}>
            bits&amp;bytes™ is an independent, teen-led builder network. We help teenagers across India turn ideas into
            things people can use, and we hold what we ship to real engineering standards.
          </p>
        </LabCell>
      </LabGrid>

      {/* stripe.dev "Get help": 2×2 topics with dotted example rules */}
      <LabGrid
        as="section"
        id="direct-channels"
        data-cinematic-section=""
        data-cinematic-title="Direct Channels"
        data-surface="paper"
        aria-labelledby="direct-channels-title"
        className={cn(SECTION, "gap-y-14")}
      >
        <LabCell>
          <LabTitle id="direct-channels-title" count={channels.length}>
            Direct Channels
          </LabTitle>
        </LabCell>
        <HelpGrid topics={channels} />
      </LabGrid>

      {/* legal registry as the stripe.dev footer rows, then the outlined closing word */}
      <section
        id="corporate-entity"
        data-cinematic-section=""
        data-cinematic-title="Corporate Entity & Grievances"
        data-surface="paper"
        aria-labelledby="corporate-entity-title"
        className="pt-24 min-[760px]:pt-[160px]"
      >
        <LabGrid>
          <LabFooterRows>
            <>
              <LabCell span="1/13" className="grid content-start gap-4">
                <TableHeader label="Corporate Entity & Grievances" />
                <h2 id="corporate-entity-title" className={LAB_TEXT.lg}>
                  GOBITSNBYTES FOUNDATION
                </h2>
                <p className="font-mono text-[12px] uppercase leading-[1.4]">Section 8 Non-Profit Company · UP, India</p>
              </LabCell>
              <LabCell span="17/-1" className="flex items-center gap-4 min-[760px]:justify-self-end">
                <CubeMark className="size-16 shrink-0 min-[760px]:size-20" />
                <div>
                  <p className={cn(LAB_TEXT.post, "font-normal")}>bits&amp;bytes™</p>
                  <p className="mt-2 font-mono text-[11px] uppercase leading-none">CIN: U85500UP2026NPL248652</p>
                </div>
              </LabCell>
            </>
            <>
              <LabCell span="1/13">
                <p className={LAB_TEXT.sm}>Regd. Office: 265/1 Patrakar Colony, Ashok Nagar, Prayagraj - 211001</p>
              </LabCell>
              <LabCell span="17/-1" className="min-[760px]:text-right">
                <p className={LAB_TEXT.sm}>
                  <strong className="font-mono text-[12px] font-normal uppercase">Grievances:</strong>{" "}
                  <LabLink
                    href="mailto:grievance@gobitsnbytes.org"
                    className={cn("break-all underline decoration-1 underline-offset-4", LAB_HOVER)}
                  >
                    grievance@gobitsnbytes.org
                  </LabLink>
                </p>
              </LabCell>
            </>
            <LabCell>
              <p className="font-mono text-[12px] uppercase leading-[1.4]">
                Statutory acknowledgment within 24 hours · Resolution within 15 days
              </p>
            </LabCell>
          </LabFooterRows>
        </LabGrid>
        <HollowWord text="Together" />
      </section>
    </>
  );
}
