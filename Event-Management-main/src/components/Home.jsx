import React, { useEffect, useState } from "react";
import Bannerimg from "../assets/bannerimg2.jpg";
import Mainbg from "../assets/mainbg2.jpg";
import Mainbg2 from "../assets/mainbg3.jpg";
import Mainbg3 from "../assets/mainbg4.jpg";
import { IoMdArrowRoundForward } from "react-icons/io";
import RotatingText from "./RotatingText";
import CategorySection from "./CategorySection";
import Testimonials from "./Testimonials";
import NewsLetter from "./NewsLetter";
import Navbar from "./Navbar";

const Home = () => {
  const backgrounds = [Mainbg, Mainbg2, Mainbg3]; // background images array
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % backgrounds.length);
    }, 3000); // 2 seconds

    return () => clearInterval(interval);
  }, []);
  return (
    <>
      {/* ------------ HERO SECTION ------------ */}
      <section
        className="relative w-full min-h-[100dvh] flex items-center justify-center md:justify-start bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out"
        style={{
          backgroundImage: `url(${backgrounds[currentIndex]})`,
        }}
      >
        {/* Premium Gradient Overlay for Better Text Contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80 z-10 pointer-events-none"></div>

        {/* ------------ MAIN CONTAINER ------------ */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-5 sm:px-8 md:px-12 lg:px-16 pt-20 pb-16 flex flex-col items-center md:items-start text-center md:text-left">
          
          <div className="w-full max-w-3xl flex flex-col items-center md:items-start space-y-6 sm:space-y-8">
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-white font-extrabold leading-[1.1] tracking-tight drop-shadow-2xl">
              Making Your Events <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 drop-shadow-lg">
                Memorable
              </span>
            </h1>

            <p className="text-gray-200 text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed md:leading-relaxed font-medium max-w-xl drop-shadow-md">
              Creating unforgettable events with flawless planning and
              execution. Experience the magic of perfectly curated moments.
            </p>

            {/* CTA & Rotating Text Container */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center w-full sm:w-auto gap-4 sm:gap-6 pt-4 sm:pt-6">
              
              <div className="flex-1 sm:flex-none flex justify-center md:justify-start">
                <RotatingText
                  texts={["Wedding", "Auditorium", "Catering", "Photography"]}
                  mainClassName="w-full sm:w-auto px-6 py-3.5 sm:px-8 sm:py-4 bg-blue-600/90 hover:bg-blue-500 backdrop-blur-md text-white font-semibold text-lg sm:text-xl md:text-2xl rounded-2xl sm:rounded-full shadow-xl shadow-blue-500/20 border border-blue-400/30 min-w-[200px] sm:min-w-[220px] text-center transition-all duration-300"
                  staggerFrom={"last"}
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "-120%" }}
                  staggerDuration={0.025}
                  splitLevelClassName="overflow-hidden pb-1"
                  transition={{ type: "spring", damping: 30, stiffness: 400 }}
                  rotationInterval={2500}
                />
              </div>

              <a
                className="group flex-1 sm:flex-none flex flex-row items-center justify-center gap-3 
                  bg-white/10 hover:bg-white backdrop-blur-md border border-white/30 
                  px-6 py-3.5 sm:px-8 sm:py-4
                  rounded-2xl sm:rounded-full text-white hover:text-blue-700 font-semibold 
                  text-lg sm:text-xl md:text-2xl shadow-xl
                  transition-all duration-300"
                href="#sepeciality"
              >
                <span>Book Now</span>
                <IoMdArrowRoundForward className="group-hover:translate-x-1.5 transition-transform duration-300" />
              </a>
              
            </div>
            
          </div>
        </div>
      </section>

      {/* ------------ OTHER SECTIONS ------------ */}
      <CategorySection />
      <Testimonials />
      <NewsLetter />
    </>
  );
};

export default Home;
