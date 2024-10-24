import Svg, { Path, Rect } from 'react-native-svg'; // Ajoute { Path }

export default function SvgCheck({
  width = 46,
  height = 46,
  fillColor = '#0F172A',
}) {
  return (
    <Svg
      width="27"
      height="26"
      viewBox="0 0 27 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Rect x="2.2627" y="2" width="22" height="22" rx="11" fill="#00C472" />
      <Path
        d="M18.3907 9.47168L11.3324 16.53L8.12402 13.3217"
        stroke="white"
        stroke-width="1.65"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
}
