import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'bits&bytes™ - 1400+ Teen Builders | High-Impact Execution'
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
          background: 'linear-gradient(135deg, #120f0a 0%, #1e0509 45%, #3c0a12 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'stretch',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          color: '#f7f1ec',
          position: 'relative',
          padding: '52px',
        }}
      >
        {/* Glow Effects */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              'radial-gradient(circle at 10% 10%, rgba(151, 25, 44, 0.35) 0%, transparent 65%), radial-gradient(circle at 90% 90%, rgba(252, 146, 13, 0.22) 0%, transparent 60%), radial-gradient(circle at 50% 50%, rgba(201, 66, 24, 0.08) 0%, transparent 50%)',
          }}
        />

        {/* Decorative Inner Frame */}
        <div
          style={{
            position: 'absolute',
            inset: '28px',
            borderRadius: '24px',
            border: '1px solid rgba(151, 25, 44, 0.25)',
          }}
        />

        {/* Floating Stars for Accent */}
        <div
          style={{
            position: 'absolute',
            top: '48px',
            right: '48px',
            display: 'flex',
          }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0L14.8 9.2L24 12L14.8 14.8L12 24L9.2 14.8L0 12L9.2 9.2L12 0Z" fill="#fda83d" opacity="0.8" />
          </svg>
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: '220px',
            left: '80%',
            display: 'flex',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0L14.8 9.2L24 12L14.8 14.8L12 24L9.2 14.8L0 12L9.2 9.2L12 0Z" fill="#97192c" opacity="0.6" />
          </svg>
        </div>

        {/* Main Content Layout */}
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
          {/* Header */}
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
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
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
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#fda83d', letterSpacing: '2.5px', textTransform: 'uppercase' }}>
                India&apos;s Teen-Led Builders Network
              </div>
              <div style={{ fontSize: '42px', fontWeight: 900, lineHeight: 1.05, color: '#f7f1ec' }}>
                bits&amp;bytes™
              </div>
            </div>
          </div>

          {/* Headline and Tagline */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            <div
              style={{
                fontSize: '54px',
                fontWeight: 900,
                lineHeight: 1.1,
                maxWidth: '1020px',
                letterSpacing: '-1px',
                color: '#ffffff',
              }}
            >
              Building India&apos;s next generation of founders, engineers, and problem solvers.
            </div>

            <div
              style={{
                fontSize: '24px',
                color: '#a09f9d',
                maxWidth: '1020px',
                lineHeight: 1.3,
                fontWeight: 500,
              }}
            >
              High-agency community. Real products. Real velocity. Real outcomes.
            </div>
          </div>

          {/* Stats Dashboard Grid */}
          <div
            style={{
              display: 'flex',
              gap: '16px',
              alignItems: 'stretch',
            }}
          >
            {[
              { label: 'Community Size', value: '1400+', note: 'Teen builders active' },
              { label: 'Local Hubs', value: '5+ Forks', note: 'gobitsnbytes.org/fork' },
              { label: 'Nationwide', value: '4+ Events', note: 'Hackathons & workshops' },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  flex: 1,
                  borderRadius: '16px',
                  padding: '16px 20px',
                  background: 'rgba(30, 5, 9, 0.45)',
                  border: '1px solid rgba(151, 25, 44, 0.22)',
                }}
              >
                <div style={{ fontSize: '15px', color: '#a09f9d', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '1px' }}>
                  {item.label}
                </div>
                <div style={{ fontSize: '42px', fontWeight: 900, lineHeight: 1, color: '#ffffff' }}>
                  {item.value}
                </div>
                <div style={{ fontSize: '15px', color: '#d0cfce', marginTop: '4px', fontWeight: 500 }}>
                  {item.note}
                </div>
              </div>
            ))}
          </div>

          {/* Footer Legal/Notice */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '18px',
              color: '#a09f9d',
              marginTop: '6px',
              fontWeight: 500,
            }}
          >
            <div>Impact Highlight: 1400+ members, 5+ forks, 4+ events. Mean team age: 16.5 years.</div>
            <div style={{ color: '#ffffff', fontWeight: 700 }}>gobitsnbytes.org</div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
