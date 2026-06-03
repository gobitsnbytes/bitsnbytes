import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'bits&bytes™ - 1500+ Teen Builders | High-Impact Execution'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
  const logoSvg = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg width="210mm" height="297mm" viewBox="0 0 210 297" version="1.1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg">
  <defs>
    <mask id="cube-cutout">
      <path style="fill:#ffffff;stroke-width:0.264583" d="m 101.27586,64.293104 56.89655,32.810343 V 161.5862 L 101.46552,194.01724 44.568964,161.5862 44.75862,96.534482 Z" />
      <path style="fill:#000000;stroke-width:0.264583" d="m 49.025862,107.06034 v 51.58621 l 46.086207,25.69828 v -20.29311 l -7.681037,-4.36207 0.189656,11 L 56.61207,154 56.51724,142.52586 87.620688,159.68965 87.431032,149.5431 56.61207,133.0431 v -12.51724 l 31.008618,16.87931 -0.189656,12.42241 7.586208,4.07759 0.09483,-21.81034 z" />
      <path style="fill:#000000;stroke-width:0.264583" d="m 104.78448,133.61207 45.61207,-25.41379 0.47414,21.05172 -8.06035,4.26724 v -11.56897 l -30.62931,16.87931 v 11.75863 L 143,133.23276 l -0.0948,10.05172 -30.81896,16.78448 c 0,0 0.18965,13.18104 -0.0948,13.18104 -0.28449,0 -0.28449,0 -0.28449,0 l 30.9138,-17.06897 v -12.70689 l 7.68103,-4.26725 0.18966,19.9138 -45.61207,26.83621 z" />
      <path style="fill:#000000;stroke-width:0.264583" d="m 136.38627,98.970564 c 6.97353,-4.023193 6.97353,-4.023193 6.97353,-4.023193 L 101.38448,70.405889 61.823075,93.606307 69.869465,98.03182 101.65269,80.195662 Z" />
      <path style="fill:#000000;stroke-width:0.264583" d="m 104.33482,95.617905 6.30301,2.145702 -6.1689,2.950343 -2.54802,5.76658 -2.548026,-5.76658 -6.571215,-2.950343 6.437109,-2.548023 2.413912,-5.498364 z" />
    </mask>
  </defs>
  <g>
    <path style="fill:#ffffff;stroke-width:0.264583" mask="url(#cube-cutout)" d="m 101.27586,64.293104 56.89655,32.810343 V 161.5862 L 101.46552,194.01724 44.568964,161.5862 44.75862,96.534482 Z" />
  </g>
</svg>`
  const logoDataUri = `data:image/svg+xml;utf8,${encodeURIComponent(logoSvg)}`

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0b1220 0%, #16223a 50%, #28184a 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'stretch',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          color: 'white',
          position: 'relative',
          padding: '52px',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              'radial-gradient(circle at 18% 20%, rgba(63, 225, 255, 0.22) 0%, transparent 36%), radial-gradient(circle at 82% 10%, rgba(255, 120, 180, 0.2) 0%, transparent 42%), radial-gradient(circle at 50% 90%, rgba(131, 102, 255, 0.22) 0%, transparent 40%)',
          }}
        />

        <div
          style={{
            position: 'absolute',
            inset: '28px',
            borderRadius: '28px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '100%',
            height: '100%',
            zIndex: 10,
            padding: '22px 20px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              fontSize: '24px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #2fe2ff, #7f67ff 60%, #ff6dad)',
                color: '#0c1020',
                padding: '8px',
              }}
            >
              <img
                src={logoDataUri}
                width={48}
                height={48}
                alt="bits&bytes™"
                style={{ objectFit: 'contain' }}
              />
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ fontSize: '20px', color: '#c6d6ff', letterSpacing: '2px' }}>
                INDIA'S TEEN-LED BUILDERS CLUB
              </div>
              <div style={{ fontSize: '46px', fontWeight: 850, lineHeight: 1.05 }}>
                bits&bytes™
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
            }}
          >
            <div
              style={{
                fontSize: '56px',
                fontWeight: 900,
                lineHeight: 1.08,
                maxWidth: '1020px',
                letterSpacing: '-1px',
              }}
            >
              Building India&apos;s next generation of founders, engineers, and problem solvers.
            </div>

            <div
              style={{
                fontSize: '26px',
                color: '#d7e4ff',
                maxWidth: '1020px',
                lineHeight: 1.3,
              }}
            >
              High-agency community. Real products. Real velocity. Real outcomes.
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '14px',
              alignItems: 'stretch',
            }}
          >
            {[
              { label: 'Community Size', value: '1500+', note: 'Teen builders across India' },
              { label: 'Submission Ops', value: '2700+', note: 'Participant submissions evaluated' },
              { label: 'Execution Speed', value: '900/day', note: 'Reviewed in a 3-day sprint' },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  flex: 1,
                  borderRadius: '16px',
                  padding: '16px 18px',
                  background: 'rgba(14, 20, 38, 0.62)',
                  border: '1px solid rgba(188, 214, 255, 0.28)',
                }}
              >
                <div style={{ fontSize: '17px', color: '#a7bfec', marginBottom: '6px', textTransform: 'uppercase' }}>
                  {item.label}
                </div>
                <div style={{ fontSize: '44px', fontWeight: 900, lineHeight: 1 }}>
                  {item.value}
                </div>
                <div style={{ fontSize: '17px', color: '#d7e4ff', marginTop: '6px' }}>
                  {item.note}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '21px',
              color: '#bfd4ff',
              marginTop: '6px',
            }}
          >
            <div>Impact Highlight: 2700+ submissions evaluated in 72 hours by the bits&bytes™ team.</div>
            <div style={{ color: '#ffffff' }}>gobitsnbytes.org</div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}

