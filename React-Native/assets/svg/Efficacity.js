import Svg, { Path, Defs, Stop, LinearGradient } from 'react-native-svg'; // Ajoute { Path }

export default function SvgEfficacity({
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
        d="M100 50.5L50 0L0 50.5H49L0 100H100L51 50.5H100Z"
        fill="url(#paint0_linear_184_533)"
      />
      <Defs>
        <LinearGradient
          id="paint0_linear_184_533"
          x1="50"
          y1="0"
          x2="50"
          y2="100"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#ADB3F2" />
          <Stop offset="1" stopColor="#F5C6E7" />
        </LinearGradient>
      </Defs>
    </Svg>
  );
}
