import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Bits&Bytes - Teen Led Code Club | Lucknow'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom right, #3E1E68, #0a0a0a)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          color: 'white',
          position: 'relative',
        }}
      >
        {/* Background pattern */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(228, 90, 146, 0.2) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(62, 30, 104, 0.4) 0%, transparent 50%)',
          }}
        />
        
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            gap: '20px',
          }}
        >
          {/* Logo/Icon representation */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '120px',
              height: '120px',
              borderRadius: '30px',
              background: 'linear-gradient(135deg, #E45A92, #5D2F77)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              fontSize: '60px',
              fontWeight: 'bold',
              marginBottom: '20px',
            }}
          >
            B&B
          </div>

          <div
            style={{
              fontSize: '70px',
              fontWeight: 800,
              background: 'linear-gradient(to right, #fff, #E45A92)',
              backgroundClip: 'text',
              color: 'transparent',
              letterSpacing: '-2px',
              marginBottom: '10px',
            }}
          >
            Bits&Bytes
          </div>

          <div
            style={{
              fontSize: '32px',
              color: '#E45A92',
              fontWeight: 600,
              letterSpacing: '4px',
              textTransform: 'uppercase',
            }}
          >
            Lucknow's Teen Code Club
          </div>

          <div
            style={{
              display: 'flex',
              gap: '40px',
              marginTop: '40px',
              fontSize: '24px',
              color: '#FFACAC',
            }}
          >
            <span>Innovate</span>
            <span>•</span>
            <span>Collaborate</span>
            <span>•</span>
            <span>Hack</span>
          </div>
        </div>

        {/* Decorative elements */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            right: '40px',
            fontSize: '20px',
            color: 'rgba(255, 255, 255, 0.5)',
          }}
        >
          gobitsnbytes.org
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}

