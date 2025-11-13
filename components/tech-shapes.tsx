export default function TechShapes() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Shape 1 */}
          <div className="group cursor-pointer">
            <div className="relative h-64 bg-[#5d2f77] rounded-3xl p-8 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="absolute inset-0 opacity-10">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <path d="M50 10 L90 90 L10 90 Z" fill="white" opacity="0.3" />
                </svg>
              </div>
              <div className="relative z-10">
                <div className="text-white font-display text-2xl font-bold mb-2">Learn</div>
                <p className="text-white/80">Master web dev, mobile, and cutting-edge tech</p>
              </div>
            </div>
          </div>

          {/* Shape 2 */}
          <div className="group cursor-pointer">
            <div className="relative h-64 bg-[#ffacac] rounded-3xl p-8 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="absolute inset-0 opacity-10">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <rect x="20" y="20" width="60" height="60" fill="white" opacity="0.3" />
                  <rect x="40" y="40" width="20" height="20" fill="white" opacity="0.5" />
                </svg>
              </div>
              <div className="relative z-10">
                <div className="text-[#3e1e68] font-display text-2xl font-bold mb-2">Collaborate</div>
                <p className="text-[#3e1e68]/80">Build amazing projects with passionate peers</p>
              </div>
            </div>
          </div>

          {/* Shape 3 */}
          <div className="group cursor-pointer">
            <div className="relative h-64 bg-[#e45a92] rounded-3xl p-8 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="absolute inset-0 opacity-10">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="50" r="30" fill="white" opacity="0.3" />
                  <circle cx="50" cy="50" r="15" fill="white" opacity="0.5" />
                </svg>
              </div>
              <div className="relative z-10">
                <div className="text-white font-display text-2xl font-bold mb-2">Hack</div>
                <p className="text-white/80">Turn creativity into impactful solutions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
