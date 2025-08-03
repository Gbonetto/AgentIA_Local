// src/icons/ArchiveIcon.jsx
export default function ArchiveIcon(props) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Contour du tiroir d’archive */}
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M3 7h18M5 7v12a2 2 0 002 2h10a2 2 0 002-2V7"
      />
      {/* Flèche d’archivage */}
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 9l3-3 3 3m-3-3v12"
      />
    </svg>
  );
}