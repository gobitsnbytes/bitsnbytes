import { Shield, Users, Rocket, Lightbulb, CodeXml } from "lucide-react";
import Image from "next/image";
import { GlassContainer } from "@/components/ui/glass-container";
import { cn } from "@/lib/utils";

export function Features() {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="relative">
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {/* Card 1: 1500+ Members (Replaces Customizable) */}
          <GlassContainer
            containerClassName="col-span-full lg:col-span-2"
            className="flex p-0 overflow-hidden"
            glowColor="pink"
            interactive
          >
            <div className="relative m-auto h-full w-full flex flex-col items-center justify-center p-8 md:p-12">
              <div className="relative flex h-24 w-56 items-center">
                <svg
                  className="text-(--brand-pink) absolute inset-0 size-full opacity-50"
                  viewBox="0 0 254 104"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M112.891 97.7022C140.366 97.0802 171.004 94.6715 201.087 87.5116C210.43 85.2881 219.615 82.6412 228.284 78.2473C232.198 76.3179 235.905 73.9942 239.348 71.3124C241.85 69.2557 243.954 66.7571 245.555 63.9408C249.34 57.3235 248.281 50.5341 242.498 45.6109C239.033 42.7237 235.228 40.2703 231.169 38.3054C219.443 32.7209 207.141 28.4382 194.482 25.534C184.013 23.1927 173.358 21.7755 162.64 21.2989C161.376 21.3512 160.113 21.181 158.908 20.796C158.034 20.399 156.857 19.1682 156.962 18.4535C157.115 17.8927 157.381 17.3689 157.743 16.9139C158.104 16.4588 158.555 16.0821 159.067 15.8066C160.14 15.4683 161.274 15.3733 162.389 15.5286C179.805 15.3566 196.626 18.8373 212.998 24.462C220.978 27.2494 228.798 30.4747 236.423 34.1232C240.476 36.1159 244.202 38.7131 247.474 41.8258C254.342 48.2578 255.745 56.9397 251.841 65.4892C249.793 69.8582 246.736 73.6777 242.921 76.6327C236.224 82.0192 228.522 85.4602 220.502 88.2924C205.017 93.7847 188.964 96.9081 172.738 99.2109C153.442 101.949 133.993 103.478 114.506 103.79C91.1468 104.161 67.9334 102.97 45.1169 97.5831C36.0094 95.5616 27.2626 92.1655 19.1771 87.5116C13.839 84.5746 9.1557 80.5802 5.41318 75.7725C-0.54238 67.7259 -1.13794 59.1763 3.25594 50.2827C5.82447 45.3918 9.29572 41.0315 13.4863 37.4319C24.2989 27.5721 37.0438 20.9681 50.5431 15.7272C68.1451 8.8849 86.4883 5.1395 105.175 2.83669C129.045 0.0992292 153.151 0.134761 177.013 2.94256C197.672 5.23215 218.04 9.01724 237.588 16.3889C240.089 17.3418 242.498 18.5197 244.933 19.6446C246.627 20.4387 247.725 21.6695 246.997 23.615C246.455 25.1105 244.814 25.5605 242.63 24.5811C230.322 18.9961 217.233 16.1904 204.117 13.4376C188.761 10.3438 173.2 8.36665 157.558 7.52174C129.914 5.70776 102.154 8.06792 75.2124 14.5228C60.6177 17.8788 46.5758 23.2977 33.5102 30.6161C26.6595 34.3329 20.4123 39.0673 14.9818 44.658C12.9433 46.8071 11.1336 49.1622 9.58207 51.6855C4.87056 59.5336 5.61172 67.2494 11.9246 73.7608C15.2064 77.0494 18.8775 79.925 22.8564 82.3236C31.6176 87.7101 41.3848 90.5291 51.3902 92.5804C70.6068 96.5773 90.0219 97.7419 112.891 97.7022Z"
                    fill="currentColor"
                  />
                </svg>
                <span className="mx-auto block w-fit text-5xl md:text-6xl font-black text-white tracking-tighter">
                  1500+
                </span>
              </div>
              <h2 className="mt-8 text-center text-2xl font-black text-white uppercase tracking-widest">
                Across India
              </h2>
            </div>
          </GlassContainer>

          {/* Card 2: Workshops */}
          <GlassContainer
            containerClassName="col-span-full sm:col-span-3 lg:col-span-2"
            className="overflow-hidden p-8 md:p-12"
            glowColor="purple"
            interactive
          >
            <div className="relative mx-auto flex aspect-square size-32 rounded-3xl border border-white/10 bg-white/5 transition-transform group-hover:scale-110 group-hover:rotate-3">
              <Lightbulb className="m-auto h-14 w-14 text-(--brand-pink)" />
            </div>
            <div className="relative z-10 mt-10 space-y-3 text-center">
              <h2 className="text-2xl font-black text-white px-2">Workshops</h2>
              <p className="text-base text-white/60 font-medium">
                Dev tools and AI, one weekend at a time.
              </p>
            </div>
          </GlassContainer>

          {/* Card 3: 130+ Projects */}
          <GlassContainer
            containerClassName="col-span-full sm:col-span-3 lg:col-span-2"
            className="overflow-hidden p-8 md:p-12"
            glowColor="pink"
            interactive
          >
            <div className="w-full">
              <svg
                className="w-full h-32"
                viewBox="0 0 386 123"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_0_106)">
                  <circle
                    className="text-(--brand-pink) opacity-20"
                    cx="193"
                    cy="40"
                    r="30"
                    fill="currentColor"
                  />
                  <CodeXml
                    className="text-(--brand-pink)"
                    x="178"
                    y="25"
                    width="30"
                    height="30"
                  />
                </g>
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M3 123C3 123 14.3298 94.153 35.1282 88.0957C55.9266 82.0384 65.9333 80.5508 65.9333 80.5508C65.9333 80.5508 80.699 80.5508 92.1777 80.5508C103.656 80.5508 100.887 63.5348 109.06 63.5348C117.233 63.5348 117.217 91.9728 124.78 91.9728C132.343 91.9728 142.264 78.03 153.831 80.5508C165.398 83.0716 186.825 91.9728 193.761 91.9728C200.697 91.9728 206.296 63.5348 214.07 63.5348C221.844 63.5348 238.653 93.7771 244.234 91.9728C249.814 90.1684 258.8 60 266.19 60C272.075 60 284.1 88.057 286.678 88.0957C294.762 88.2171 300.192 72.9284 305.423 72.9284C312.323 72.9284 323.377 65.2437 335.553 63.5348C347.729 61.8259 348.218 82.07 363.639 80.5508C367.875 80.1335 372.949 82.2017 376.437 87.1008C379.446 91.3274 381.054 97.4325 382.521 104.647C383.479 109.364 382.521 123 382.521 123"
                  fill="url(#paint0_linear_0_106)"
                />
                <path
                  className="text-(--brand-pink)"
                  d="M3 121.077C3 121.077 15.3041 93.6691 36.0195 87.756C56.7349 81.8429 66.6632 80.9723 66.6632 80.9723C66.6632 80.9723 80.0327 80.9723 91.4656 80.9723C102.898 80.9723 100.415 64.2824 108.556 64.2824C116.696 64.2824 117.693 92.1332 125.226 92.1332C132.759 92.1332 142.07 78.5115 153.591 80.9723C165.113 83.433 186.092 92.1332 193 92.1332C199.908 92.1332 205.274 64.2824 213.017 64.2824C220.76 64.2824 237.832 93.8946 243.39 92.1332C248.948 90.3718 257.923 60.5 265.284 60.5C271.145 60.5 283.204 87.7182 285.772 87.756C293.823 87.8746 299.2 73.0802 304.411 73.0802C311.283 73.0802 321.425 65.9506 333.552 64.2824C345.68 62.6141 346.91 82.4553 362.27 80.9723C377.629 79.4892 383 106.605 383 106.605"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_0_106"
                    x1="3"
                    y1="60"
                    x2="3"
                    y2="123"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop
                      className="text-(--brand-pink)/20"
                      stopColor="currentColor"
                    />
                    <stop
                      className="text-transparent"
                      offset="1"
                      stopColor="currentColor"
                      stopOpacity="0"
                    />
                  </linearGradient>
                  <clipPath id="clip0_0_106">
                    <rect
                      width="358"
                      height="60"
                      fill="white"
                      transform="translate(14 14)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <div className="relative z-10 mt-10 space-y-3 text-center">
              <h2 className="text-2xl font-black text-white px-2">
                2700+ Submissions
              </h2>
              <p className="text-base text-white/60 font-medium">
                Evaluated by the Bits&Bytes team in a 3-day sprint.
              </p>
            </div>
          </GlassContainer>

          {/* Card 4: Innovation */}
          <GlassContainer
            containerClassName="col-span-full lg:col-span-3"
            className="overflow-hidden p-8 md:p-12"
            glowColor="purple"
            interactive
          >
            <div className="grid sm:grid-cols-2 h-full">
              <div className="relative z-10 flex flex-col justify-between space-y-12 h-full">
                <div className="relative flex aspect-square size-14 rounded-2xl border border-white/10 bg-white/5 transition-transform group-hover:scale-110">
                  <Rocket className="m-auto size-7 text-(--brand-pink)" />
                </div>
                <div className="space-y-4">
                  <h2 className="text-3xl font-black text-white tracking-tight">
                    Innovation
                  </h2>
                  <p className="text-base text-white/60 font-medium leading-relaxed">
                    AI, distributed systems, creative code. The stuff we
                    actually work on.
                  </p>
                </div>
              </div>
              <div className="rounded-3xl relative -mb-12 -mr-12 mt-8 sm:mt-0 h-full min-h-[200px] border-l border-t border-white/10 bg-white/5 p-8 sm:ml-8 overflow-hidden">
                <div className="absolute left-6 top-4 flex gap-1.5">
                  <span className="block size-2.5 rounded-full border border-white/10 bg-red-500/50"></span>
                  <span className="block size-2.5 rounded-full border border-white/10 bg-yellow-500/50"></span>
                  <span className="block size-2.5 rounded-full border border-white/10 bg-green-500/50"></span>
                </div>
                <svg
                  className="w-full sm:w-[150%] mt-4 opacity-50 grayscale transition-transform transition-colors transition-opacity group-hover:grayscale-0 group-hover:opacity-100"
                  viewBox="0 0 366 231"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M0.148438 231V179.394L1.92188 180.322L2.94482 177.73L4.05663 183.933L6.77197 178.991L7.42505 184.284L9.42944 187.985L11.1128 191.306V155.455L13.6438 153.03V145.122L14.2197 142.829V150.454V154.842L15.5923 160.829L17.0793 172.215H19.2031V158.182L20.7441 153.03L22.426 148.111V142.407L24.7471 146.86V128.414L26.7725 129.918V120.916L28.1492 118.521L28.4653 127.438L29.1801 123.822L31.0426 120.525V130.26L32.3559 134.71L34.406 145.122V137.548L35.8982 130.26L37.1871 126.049L38.6578 134.71L40.659 138.977V130.26V126.049L43.7557 130.26V123.822L45.972 112.407L47.3391 103.407V92.4726L49.2133 98.4651V106.053L52.5797 89.7556L54.4559 82.7747L56.1181 87.9656L58.9383 89.7556V98.4651L60.7617 103.407L62.0545 123.822L63.8789 118.066L65.631 122.082L68.5479 114.229L70.299 109.729L71.8899 118.066L73.5785 123.822V130.26L74.9446 134.861L76.9243 127.87L78.352 134.71V138.977L80.0787 142.407V152.613L83.0415 142.407V130.26L86.791 123.822L89.0121 116.645V122.082L90.6059 127.87L92.3541 131.77L93.7104 123.822L95.4635 118.066L96.7553 122.082V137.548L99.7094 140.988V131.77L101.711 120.525L103.036 116.645V133.348L104.893 136.218L106.951 140.988L108.933 134.71L110.797 130.26L112.856 140.988V148.111L115.711 152.613L117.941 145.122L119.999 140.988V148.111L123.4 152.613L125.401 158.182L130.547 150.454V156.566L131.578 155.455L134.143 158.182L135.594 168.136L138.329 158.182L140.612 160.829L144.681 169.5L147.011 155.455L148.478 151.787L151.02 152.613L154.886 145.122L158 143.412L159.406 140.637L159.496 133.348L162.295 127.87V122.082L163.855 116.645V109.729L164.83 104.407L166.894 109.729L176.249 98.4651L178.254 106.169L180.77 98.4651V81.045L182.906 69.1641L184.8 56.8669L186.477 62.8428L187.848 79.7483L188.849 106.169L191.351 79.7483L193.485 75.645V98.4651L196.622 94.4523L198.623 87.4228V79.7483L200.717 75.645L202.276 81.045V89.3966L203.638 113.023L205.334 99.8037L207.164 94.4523L208.982 98.4651V102.176L211.267 107.64L212.788 81.045L214.437 66.0083L216.19 62.8428L217.941 56.8669V73.676V79.7483L220.28 75.645L222.516 66.0083V73.676H226.174V84.8662L228.566 98.4651L230.316 75.645L233.61 94.4523V104.25L236.882 102.176L239.543 113.023L241.057 98.4651L243.604 94.4523L244.975 106.169L245.975 87.4228L247.272 89.3966L250.732 84.8662L251.733 96.7549L254.644 94.4523L257.452 99.8037L259.853 91.3111L261.193 84.8662L264.162 75.645L265.808 87.4228L267.247 58.4895L269.757 66.0083L276.625 13.5146L273.33 58.4895L276.25 67.6563L282.377 20.1968L281.37 58.4895V66.0083L283.579 75.645L286.033 56.8669L287.436 73.676L290.628 77.6636L292.414 84.8662L294.214 61.3904L296.215 18.9623L300.826 0.947876L297.531 56.8669L299.973 62.8428L305.548 22.0598L299.755 114.956L301.907 105.378L304.192 112.688V94.9932L308.009 80.0829L310.003 94.9932L311.004 102.127L312.386 105.378L315.007 112.688L316.853 98.004L318.895 105.378L321.257 94.9932L324.349 100.81L325.032 80.0829L327.604 61.5733L329.308 82.3223L333.525 52.7986L334.097 52.145L334.735 55.6812L337.369 59.8108V73.676L340.743 87.9656L343.843 96.3728L348.594 82.7747L349.607 81.045L351 89.7556L352.611 96.3728L355.149 94.9932L356.688 102.176L359.396 108.784L360.684 111.757L365 95.7607V231H148.478H0.148438Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
            </div>
          </GlassContainer>

          {/* Card 5: Team & Mentorship */}
          <GlassContainer
            containerClassName="col-span-full lg:col-span-3"
            className="overflow-hidden p-8 md:p-12"
            glowColor="pink"
            interactive
          >
            <div className="grid sm:grid-cols-2 h-full">
              <div className="relative z-10 flex flex-col justify-between space-y-12 h-full">
                <div className="relative flex aspect-square size-14 rounded-2xl border border-white/10 bg-white/5 transition-transform group-hover:scale-110">
                  <Users className="m-auto size-7 text-(--brand-pink)" />
                </div>
                <div className="space-y-4">
                  <h2 className="text-3xl font-black text-white tracking-tight">
                    Team & Mentorship
                  </h2>
                  <p className="text-base text-white/60 font-medium leading-relaxed">
                    Working alongside teen developers and designers who know
                    what they're doing.
                  </p>
                </div>
              </div>
              <div className="before:bg-white/10 relative mt-10 sm:mt-0 before:absolute before:inset-0 before:mx-auto before:w-px sm:-my-12 sm:-mr-12">
                <div className="relative flex h-full flex-col justify-center space-y-8 py-12">
                  <div className="relative flex w-[calc(50%+1.5rem)] items-center justify-end gap-3 transition-transform hover:scale-105">
                    <span className="block h-fit rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-bold text-white shadow-sm backdrop-blur-md">
                      Yash Singh
                    </span>
                    <div className="ring-white/10 size-12 ring-2 rounded-2xl overflow-hidden border border-white/20">
                      <Image
                        className="size-full object-cover"
                        src="/team/yash.jpeg"
                        alt="Yash"
                        width={48}
                        height={48}
                      />
                    </div>
                  </div>
                  <div className="relative ml-[calc(50%-1.25rem)] flex items-center gap-3 transition-transform hover:scale-105">
                    <div className="ring-white/10 size-14 ring-2 rounded-2xl overflow-hidden border border-white/20">
                      <Image
                        className="size-full object-cover"
                        src="/team/akshat.jpg"
                        alt="Akshat"
                        width={56}
                        height={56}
                      />
                    </div>
                    <span className="block h-fit rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-bold text-white shadow-sm backdrop-blur-md">
                      Akshat Kushwaha
                    </span>
                  </div>
                  <div className="relative flex w-[calc(50%+1.5rem)] items-center justify-end gap-3 transition-transform hover:scale-105">
                    <span className="block h-fit rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-bold text-white shadow-sm backdrop-blur-md">
                      Aadrika Maurya
                    </span>
                    <div className="ring-white/10 size-12 ring-2 rounded-2xl overflow-hidden border border-white/20">
                      <Image
                        className="size-full object-cover"
                        src="/team/aadrika.png"
                        alt="Aadrika"
                        width={48}
                        height={48}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </GlassContainer>
        </div>
      </div>
    </div>
  );
}
