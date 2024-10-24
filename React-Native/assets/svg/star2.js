import React from 'react';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

export default function SvgStar2(props) {
  return (
    <Svg
      width="100"
      height="100"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M60 0H40V26L22 7.5L7.5 22L26 40H0V60H26L7.5 78.5L21.5 93L40 74V100H60V74L78.5 92.5L92.5 78.5L74.5 60H100V40H74.5L92.5 22L78 7.5L60 26V0Z"
        fill="url(#paint0_linear_170_539)"
      />
      <Defs>
        <LinearGradient
          id="paint0_linear_170_539"
          x1="32"
          y1="-18"
          x2="61.5206"
          y2="92.2573"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#8B97ED" />
          <Stop offset="1" stopColor="#A5C5F0" />
        </LinearGradient>
      </Defs>
    </Svg>
  );
}
