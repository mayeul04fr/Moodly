import Svg, { Path, Defs, Stop, LinearGradient } from 'react-native-svg'; // Ajoute { Path }

export default function SvgLeaf({
  width = 27,
  height = 26,
  fillColor = '#383542',
}) {
  return (
    <Svg
      width="100"
      height="100"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M0 0H50C77.6142 0 100 22.3858 100 50V100H50C22.3858 100 0 77.6142 0 50V0Z"
        fill="url(#paint0_linear_184_526)"
      />
      <Defs>
        <LinearGradient
          id="paint0_linear_184_526"
          x1="0"
          y1="0"
          x2="100"
          y2="100"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#A1A8EF" />
          <Stop offset="1" stopColor="#C2F2BD" />
        </LinearGradient>
      </Defs>
    </Svg>
  );
}
