import { motion } from "framer-motion";
import TshirtIcon from "../../assets/tshirt.svg?react";
import JeansIcon from "../../assets/jeans.svg?react";
import SocksIcon from "../../assets/socks.svg?react";
import ShortsIcon from "../../assets/short_pant.svg?react";
import SkirtIcon from "../../assets/short.svg?react";
import ClipIcon from "../../assets/clip.svg?react";

export default function FloatingClothes({ theme }) {
  const isDark = theme === "dark";

  // Different cloth items with varying shapes and animations
  const clothes = [
    { x: 200, type: "tshirt", delay: 0,    clipDx: -72, clipDy: 40 },
    { x: 450, type: "pants",  delay: 0.4,  clipDx: -74, clipDy: 45 },
    { x: 700, type: "sock",   delay: 0.8,  clipDx: -83, clipDy: 50 },
    { x: 950, type: "shorts", delay: 0.12, clipDx: -73, clipDy: 55 },
    { x: 1200,type: "skirt",  delay: 0.16, clipDx: -84, clipDy: 56 },
  ];


  // Render different cloth shapes
  const renderCloth = (cloth) => {
    switch (cloth.type) {
      case "tshirt":
        return (
          <g transform={`translate(${cloth.x - 40}, 93)`}>
            <TshirtIcon
              width={80}
              height={70}
              style={{ opacity: 1 }}
            />
          </g>
        );
      
      case "pants":
        return (
          <g transform={`translate(${cloth.x - 55}, 123) rotate(-30)`}>
            <JeansIcon
              width={80}
              height={70}
              style={{ opacity: 1 }}
            />
          </g>
        );
      
      case "sock":
        return (
          <g transform={`translate(${cloth.x - 40}, 100)`}>
            <SocksIcon
              width={80}
              height={70}
              style={{ opacity: 1 }}
            />
          </g>
        );
      
      case "shorts":
        return (
          <g transform={`translate(${cloth.x - 40}, 100)`}>
            <ShortsIcon
              width={80}
              height={70}
              style={{ opacity: 1 }}
            />
          </g>
        );
      
      case "skirt":
        return (
          <g transform={`translate(${cloth.x - 61}, 130) rotate(-25)`}>
            <SkirtIcon
              width={80}
              height={70}
              style={{ opacity: 1 }}
            />
          </g>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="w-full overflow-hidden md:mt-20 mb-10">
      <motion.svg
        viewBox="0 0 1400 250"
        className="w-[220%] sm:w-[160%] md:w-full h-55 sm:h-60 md:h-65 -ml-[60%] sm:-ml-[30%] md:ml-0 block"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Main rope with wave animation */}
        <motion.path
          d="M40 100 Q 350 80, 700 100 T 1360 100"
          stroke={isDark ? "#d1d5db" : "#374151"}
          strokeWidth="2"
          fill="transparent"
          strokeLinecap="round"
          animate={{
            d: [
              "M40 100 Q 350 80, 700 100 T 1360 100",
              "M40 105 Q 350 90, 700 105 T 1360 105",
              "M40 100 Q 350 80, 700 100 T 1360 100",
            ],
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />

        {/* Rope texture/highlights */}
        <motion.path
          d="M40 98 Q 350 78, 700 98 T 1360 98"
          stroke={isDark ? "#e5e7eb" : "#6b7280"}
          strokeWidth="1.5"
          fill="transparent"
          strokeLinecap="round"
          opacity="0.6"
          animate={{
            d: [
              "M40 98 Q 350 78, 700 98 T 1360 98",
              "M40 103 Q 350 88, 700 103 T 1360 103",
              "M40 98 Q 350 78, 700 98 T 1360 98",
            ],
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />

        {/* Clothes hanging on the line */}
        {clothes.map((cloth, i) => (
          <motion.g
            key={i}
            initial={{ y: -20, opacity: 0 }}
            animate={{ 
              y: 0, 
              opacity: 1,
              rotate: [-3, 3, -3],
            }}
            transition={{ 
              y: { duration: 0.6, delay: cloth.delay },
              opacity: { duration: 0.6, delay: cloth.delay },
              rotate: { 
                duration: 3 + i * 0.5, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: cloth.delay,
              }
            }}
          >
            {/* Clothespin Clip */}
            <g transform={`translate(${cloth.x + cloth.clipDx}, ${cloth.clipDy})`}>
              <ClipIcon width={150} height={90} opacity={1}/>
            </g>


            {/* The cloth item */}
            <motion.g
              animate={{
                y: [0, 4, 0],
              }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: cloth.delay,
              }}
            >
              {renderCloth(cloth)}
              
              {/* Cloth shadow */}
              <ellipse
                cx={cloth.x}
                cy="210"
                rx="40"
                ry="11"
                fill="#000"
                opacity="0.15"
              />
            </motion.g>
          </motion.g>
        ))}

        {/* Wind particles */}
        {[...Array(7)].map((_, i) => (
          <motion.circle
            key={`wind-${i}`}
            cx={100 + i * 200}
            cy={60 + i * 15}
            r="2"
            fill={isDark ? "#6b7280" : "#d1d5db"}
            opacity="0.4"
            animate={{
              x: [0, 50, 0],
              opacity: [0.4, 0, 0.4],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          />
        ))}

        {/* Flying leaves */}
        {[
          { x: 150, y: 50, size: 1, color: "#f59e0b", duration: 8, delay: 0 },
          { x: 400, y: 80, size: 0.8, color: "#ef4444", duration: 10, delay: 1 },
          { x: 650, y: 40, size: 1.2, color: "#84cc16", duration: 9, delay: 2 },
          { x: 900, y: 70, size: 0.9, color: "#f97316", duration: 11, delay: 0.5 },
          { x: 1150, y: 55, size: 1.1, color: "#eab308", duration: 9.5, delay: 1.5 },
        ].map((leaf, i) => (
          <motion.g
            key={`leaf-${i}`}
            initial={{ x: leaf.x, y: leaf.y, opacity: 0 }}
            animate={{
              x: [leaf.x, leaf.x + 200, leaf.x + 400],
              y: [leaf.y, leaf.y + 60, leaf.y + 120],
              rotate: [0, 180, 360],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: leaf.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: leaf.delay,
            }}
          >
            {/* Leaf shape */}
            <path
              d={`M 0 0 Q ${5 * leaf.size} ${-8 * leaf.size}, ${10 * leaf.size} 0 Q ${5 * leaf.size} ${8 * leaf.size}, 0 0`}
              fill={leaf.color}
              opacity="0.7"
            />
            {/* Leaf vein */}
            <line
              x1="0"
              y1="0"
              x2={10 * leaf.size}
              y2="0"
              stroke={isDark ? "#78350f" : "#92400e"}
              strokeWidth="0.5"
              opacity="0.5"
            />
          </motion.g>
        ))}
      </motion.svg>
    </div>
  );
}