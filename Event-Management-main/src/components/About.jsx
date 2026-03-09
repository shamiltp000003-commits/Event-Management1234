import React from 'react'
import Aboutimg from "../assets/abutimg1.jpg"
import { IoCheckmarkCircleOutline, IoFlashOutline, IoHeartOutline, IoPersonOutline } from 'react-icons/io5'

const About = () => {
  return (
    <div className='w-full min-h-screen bg-gray-50/50 pt-28 pb-20 px-5 sm:px-8 md:px-12 lg:px-20'>
      <div className='max-w-7xl mx-auto'>
        
        {/* Header Section */}
        <div className='text-center mb-16 space-y-4'>
          <h2 className='text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight'>
            About <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600'>Us</span>
          </h2>
          <p className='text-lg text-gray-500 max-w-2xl mx-auto'>
            Discover the passion and dedication behind WedCraft. We bring your event dreams to life with meticulous planning and creative brilliance.
          </p>
        </div>

        {/* Main Content Area */}
        <div className='flex flex-col lg:flex-row items-center gap-12 lg:gap-20 mb-28'>
          
          {/* Image Container with Decorative Elements */}
          <div className='w-full lg:w-1/2 relative group'>
            {/* Background Glow effect */}
            <div className='absolute -inset-4 bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-[2.5rem] blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500'></div>
            <img 
              className='relative w-full h-[400px] md:h-[500px] object-cover rounded-[2rem] shadow-2xl z-10' 
              src={Aboutimg} 
              alt="About WedCraft" 
            />
            {/* Overlay Badge */}
            <div className='absolute bottom-6 right-6 sm:-right-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl z-20 flex items-center gap-4 hover:scale-105 transition-transform'>
              <div className='w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold'>
                10+
              </div>
              <div>
                <p className='text-sm font-bold text-gray-800 leading-tight'>Years of</p>
                <p className='text-xs text-gray-500'>Experience</p>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className='w-full lg:w-1/2 flex flex-col justify-center gap-8'>
            <div className='space-y-6 text-gray-600 leading-relaxed text-base md:text-lg'>
              <p>
                At WedCraft, we believe that every event tells a unique story. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptatum, ut deserunt quam sint et impedit asperiores possimus est.
              </p>
              <p>
                Neque praesentium magnam non tenetur at perspiciatis voluptates porro natus fugit animi. Our dedicated team works tirelessly to ensure that your vision translates flawlessly into reality.
              </p>
            </div>

            {/* Vision Highlight */}
            <div className='bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100 flex gap-5 sm:gap-6 items-start hover:shadow-xl transition-shadow'>
               <div className='w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 text-2xl sm:text-3xl'>
                  <IoFlashOutline />
               </div>
               <div>
                  <h3 className='text-xl font-bold text-gray-900 mb-2'>Our Vision</h3>
                  <p className='text-gray-600 text-sm md:text-base'>
                    To be the leading innovator in event management, delivering unforgettable experiences through creativity, precision, and a deep understanding of our clients' desires.
                  </p>
               </div>
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className='text-center mb-12 space-y-4'>
          <h2 className='text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight'>
            Why <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500'>Choose Us</span>
          </h2>
          <p className='text-gray-500 max-w-xl mx-auto'>
            We stand out by delivering excellence at every step. Here's what makes us your perfect partner.
          </p>
        </div>

        {/* Value Proposition Cards */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8'>
          
          {/* Card 1 */}
          <div className='group bg-white border border-gray-100 hover:border-blue-100 shadow-sm hover:shadow-2xl rounded-3xl p-8 lg:p-10 transition-all duration-300 hover:-translate-y-2 flex flex-col gap-4 sm:gap-5 text-left'>
              <div className='w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl sm:text-3xl group-hover:scale-110 transition-transform duration-300'>
                 <IoCheckmarkCircleOutline />
              </div>
              <h3 className='text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors'>Efficiency</h3>
              <p className='text-gray-600 leading-relaxed text-sm md:text-base'>
                We handle every detail with precision. Voluptatum, ut deserunt quam sint et impedit non tenetur at perspiciatis.
              </p>
          </div>

          {/* Card 2 */}
          <div className='group bg-white border border-gray-100 hover:border-indigo-100 shadow-sm hover:shadow-2xl rounded-3xl p-8 lg:p-10 transition-all duration-300 hover:-translate-y-2 flex flex-col gap-4 sm:gap-5 text-left'>
              <div className='w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl sm:text-3xl group-hover:scale-110 transition-transform duration-300'>
                 <IoHeartOutline />
              </div>
              <h3 className='text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors'>Convenience</h3>
              <p className='text-gray-600 leading-relaxed text-sm md:text-base'>
                Stress-free planning from start to finish. Voluptatum, ut deserunt quam sint et impedit non tenetur at perspiciatis.
              </p>
          </div>

          {/* Card 3 */}
          <div className='group bg-white border border-gray-100 hover:border-cyan-100 shadow-sm hover:shadow-2xl rounded-3xl p-8 lg:p-10 transition-all duration-300 hover:-translate-y-2 flex flex-col gap-4 sm:gap-5 text-left'>
              <div className='w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center text-2xl sm:text-3xl group-hover:scale-110 transition-transform duration-300'>
                 <IoPersonOutline />
              </div>
              <h3 className='text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-cyan-600 transition-colors'>Personalization</h3>
              <p className='text-gray-600 leading-relaxed text-sm md:text-base'>
                Tailored perfectly to your unique style. Voluptatum, ut deserunt quam sint et impedit non tenetur at perspiciatis.
              </p>
          </div>

        </div>

      </div>
    </div>
  )
}

export default About