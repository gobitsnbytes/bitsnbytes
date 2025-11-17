"use client";

export const LumaSpin = () => {
  return (
    <div className="relative w-[65px] aspect-square">
      <span className="absolute rounded-[50px] animate-loaderAnim shadow-[inset_0_0_0_3px] shadow-[#3e1e68] dark:shadow-[#ffacac]" />
      <span className="absolute rounded-[50px] animate-loaderAnim animation-delay shadow-[inset_0_0_0_3px] shadow-[#3e1e68] dark:shadow-[#ffacac]" />
    </div>
  );
};

export default LumaSpin;


