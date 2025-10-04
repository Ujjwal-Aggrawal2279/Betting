import { Link } from "react-router-dom"

const GameCard = ({ matchId, format, teamA, teamB, logoA, logoB, title, venue }) => {
       return (
              <Link to={`/games/${title}`} state={{ matchId }}>
                     <div className="relative flex items-center justify-between bg-[#1a1c2b]/70 
                    backdrop-blur-md border border-[#3b3f5c] rounded-2xl shadow-lg 
                    p-4 h-56 hover:scale-[1.02] transition-transform cursor-pointer md:flex-row flex-col gap-4">

                            {/* Format Badge */}
                            <span className="absolute top-4 left-4 px-3 py-1 text-xs md:text-sm font-bold 
                       bg-gradient-to-r from-[#4f5fff] to-[#6c8cff] text-white rounded-full 
                       shadow-md z-10">
                                   {format}
                            </span>

                            {/* Teams & Logos */}
                            <div className="flex items-center gap-6 flex-1 justify-center">
                                   {/* Team A */}
                                   <div className="flex flex-col items-center">
                                          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#2c2f44] flex items-center justify-center shadow-md">
                                                 <img src={logoA} alt={teamA} className="w-12 h-12 md:w-14 md:h-14 object-contain rounded-full" />
                                          </div>
                                          <span className="text-white font-medium mt-2">{teamA}</span>
                                   </div>

                                   {/* VS Separator */}
                                   <div className="flex flex-col items-center">
                                          <span className="text-gray-400 font-bold text-xl md:text-2xl">vs</span>
                                          <div className="w-[2px] h-16 bg-gray-600/40 mt-1 rounded"></div>
                                   </div>

                                   {/* Team B */}
                                   <div className="flex flex-col items-center">
                                          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#2c2f44] flex items-center justify-center shadow-md">
                                                 <img src={logoB} alt={teamB} className="w-12 h-12 md:w-14 md:h-14 object-contain rounded-full" />
                                          </div>
                                          <span className="text-white font-medium mt-2">{teamB}</span>
                                   </div>
                            </div>

                            {/* Match Info + Dates */}
                            <div className="flex flex-col items-center md:items-end text-center md:text-right gap-1">
                                   <h3 className="text-white font-semibold text-sm md:text-base truncate lg:max-w-[150px]">{title}</h3>
                                   <p className="text-gray-400 text-xs md:text-sm truncate lg:max-w-[150px]">{venue}</p>
                            </div>
                     </div>
              </Link>
       )
}

export default GameCard
