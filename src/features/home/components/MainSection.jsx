import React from 'react'

const images = [
       "/images/coinflip.png",
       "/images/jackpot.png",
       "/images/plinko.png",
       "/images/pvpmines.png",
       "/images/upgrader.png",
       "/images/wheel.png",
]
const MainSection = () => {
       return (
              <>
                     <div className='h-full 2xl:w-[70%] xl:w-[68%] lg:w-[65%] px-2'>
                            <img src="/images/banner.png" alt="Banner" className='w-full md:h-auto h-[150px]' />
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                                   {images.map((image, index) => (
                                          <div key={index} className="flex justify-center items-center overflow-hidden">
                                                 <img
                                                        src={image}
                                                        alt={`Game ${index + 1}`}
                                                        className="w-full h-auto rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
                                                 />
                                          </div>
                                   ))}
                            </div>
                     </div>
              </>
       )
}

export default MainSection
