export default function WaveCurtain() {
  return (
    <div className="hidden md:block absolute top-0 left-0 w-full z-0 pointer-events-none" style={{ marginTop: '-1px' }}>
      {/* Pink curtain body */}
      <div className="bg-pink-400 h-16 md:h-24" />

      {/* Scalloped wave edge */}
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="w-full block"
        style={{ height: '60px' }}
      >
        <path
          d="M0,0 
             C50,80 100,80 150,0 
             C200,80 250,80 300,0 
             C350,80 400,80 450,0 
             C500,80 550,80 600,0 
             C650,80 700,80 750,0 
             C800,80 850,80 900,0 
             C950,80 1000,80 1050,0 
             C1100,80 1150,80 1200,0 
             L1200,0 L0,0 Z"
          fill="#f472b6"
        />
      </svg>

      {/* Black outline along the scallop for curtain feel */}
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="w-full block absolute bottom-0 left-0"
        style={{ height: '60px' }}
      >
        <path
          d="M0,0 
             C50,80 100,80 150,0 
             C200,80 250,80 300,0 
             C350,80 400,80 450,0 
             C500,80 550,80 600,0 
             C650,80 700,80 750,0 
             C800,80 850,80 900,0 
             C950,80 1000,80 1050,0 
             C1100,80 1150,80 1200,0"
          fill="none"
          stroke="black"
          strokeWidth="6"
        />
      </svg>
    </div>
  );
}
