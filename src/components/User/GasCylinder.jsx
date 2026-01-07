
const GasCylinderValve = ({ size = 48, color = "#d32f2f" }) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <rect x="20" y="6" width="24" height="8" rx="2" fill={color} />
    <rect x="28" y="10" width="8" height="6" rx="1" fill="#555" />
    <rect x="14" y="16" width="36" height="42" rx="16" fill={color} />
  </svg>
);

export default GasCylinderValve;
