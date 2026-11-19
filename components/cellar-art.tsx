import type { BottleShape, WineStyle } from '../content/menu.ts';

const WINE_FILL_CLASS: Record<WineStyle, string> = {
  sparkling: 'fill-white-wine',
  white: 'fill-white-wine',
  rose: 'fill-rose-wine',
  amber: 'fill-amber-wine',
  red: 'fill-red-wine',
};

const WINE_STROKE_CLASS: Record<WineStyle, string> = {
  sparkling: 'stroke-white-wine',
  white: 'stroke-white-wine',
  rose: 'stroke-rose-wine',
  amber: 'stroke-amber-wine',
  red: 'stroke-red-wine',
};

/** Small octagonal cellar crest (candle flame, cork & bramble sprig) for the header and colophon. */
export function WineryCrest({ className = '' }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 40 40"
      fill="none"
      className={`decorative-art h-8 w-8 shrink-0 select-none ${className}`}
    >
      <polygon
        points="12,2 28,2 38,12 38,28 28,38 12,38 2,28 2,12"
        className="fill-surface stroke-rule"
        strokeWidth="1.5"
      />
      <polygon
        points="13.5,4.5 26.5,4.5 35.5,13.5 35.5,26.5 26.5,35.5 13.5,35.5 4.5,26.5 4.5,13.5"
        className="stroke-accent-text"
        strokeOpacity="0.45"
        strokeWidth="1"
      />
      {/* Warm candle halo & flame */}
      <circle cx="20" cy="11.5" r="5.5" className="fill-candle" fillOpacity="0.24" />
      <path
        d="M20 6.5C21.8 9.2 22.7 11.1 22.7 12.8C22.7 14.3 21.5 15.5 20 15.5C18.5 15.5 17.3 14.3 17.3 12.8C17.3 11.1 18.2 9.2 20 6.5Z"
        className="fill-candle"
      />
      {/* Wick & cork */}
      <line x1="20" y1="15.5" x2="20" y2="18" className="stroke-ink" strokeWidth="1.4" strokeLinecap="round" />
      <rect x="14.5" y="18" width="11" height="14" rx="2" className="fill-label stroke-bottle-stroke" strokeWidth="1.4" />
      <path d="M15 27.5H25V30.5C25 31.3 24.3 32 23.5 32H16.5C15.7 32 15 31.3 15 30.5V27.5Z" className="fill-accent" />
      {/* Bramble leaves flanking the cork */}
      <path d="M14 24C10.5 23.5 8.5 21 8.5 18.5C11 18.5 13.2 20.5 14 24Z" className="fill-bottle" />
      <path d="M26 24C29.5 23.5 31.5 21 31.5 18.5C29 18.5 26.8 20.5 26 24Z" className="fill-bottle" />
    </svg>
  );
}

/** Brass grommet and twine loop at the top of a hanging cream bottle label. */
export function LabelEyelet({ className = '' }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 64 22"
      fill="none"
      className={`decorative-art h-4 w-12 select-none ${className}`}
    >
      <path d="M14 11H24M40 11H50" className="stroke-label-rule" strokeWidth="1.25" />
      <path d="M32 0V8" className="stroke-label-ink" strokeOpacity="0.65" strokeWidth="1.75" strokeLinecap="round" />
      <circle cx="32" cy="11" r="5" className="fill-bg stroke-candle" strokeWidth="2" />
      <circle cx="32" cy="11" r="2.2" className="fill-label-ink" fillOpacity="0.3" />
    </svg>
  );
}

/**
 * Reusable decorative bottle silhouette (`slender`, `shouldered`, `sparkling`) + poured tasting glass vignette,
 * driven by menu content (`wine.bottleShape` and `wine.style`).
 * Token-coloured glass (`--bottle`), contrasting outline (`--bottle-stroke`), wine-colour capsule and liquid level,
 * and an empty cream label blank (`--label`). Real text is rendered in HTML, never inside SVG.
 */
export function BottleSilhouette({
  shape,
  style,
  tall = false,
  className = '',
}: {
  shape: BottleShape;
  style: WineStyle;
  /** Middle bottle on the open shelf sits slightly taller. */
  tall?: boolean;
  className?: string;
}) {
  const wineFill = WINE_FILL_CLASS[style];
  const wineStroke = WINE_STROKE_CLASS[style];

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 210 270"
      fill="none"
      className={`decorative-art select-none ${tall ? 'h-36 md:h-40' : 'h-30 md:h-34'} w-auto ${className}`}
    >
      {/* Subtle arched cellar rack niche behind bottle */}
      <path
        d="M28 264V92C28 48 60 18 102 18C144 18 176 48 176 92V264"
        className="stroke-rule"
        strokeOpacity="0.35"
        strokeWidth="1.25"
        strokeDasharray="4 4"
      />
      {/* Warm ambient glow behind bottle */}
      <ellipse cx="98" cy="166" rx="58" ry="72" className={wineFill} fillOpacity="0.1" />

      {/* Hanging neck tag cord */}
      <ellipse
        cx="84"
        cy={shape === 'sparkling' ? '74' : '70'}
        rx="15"
        ry="4.5"
        className="stroke-candle"
        strokeWidth="1.6"
        strokeDasharray="3 2"
      />

      {shape === 'slender' && (
        <>
          {/* Alsace / Loire flute-shoulder slender bottle */}
          <path
            d="M72 14H96V25H94V60C94 88 118 112 118 146V254C118 260 113 264 106 264H62C55 264 50 260 50 254V146C50 112 74 88 74 60V25H72V14Z"
            className="fill-bottle stroke-bottle-stroke"
            strokeWidth="2.4"
          />
          {/* Wax / foil capsule with embossed rings */}
          <path d="M72 14H96V44H72V14Z" className={wineFill} />
          <line x1="72" y1="24" x2="96" y2="24" className="stroke-bottle-stroke" strokeOpacity="0.5" strokeWidth="1.5" />
          <line x1="72" y1="44" x2="96" y2="44" className="stroke-candle" strokeWidth="2" />
          {/* Wine liquid glow inside lower bottle */}
          <path
            d="M55 130C55 114 66 102 84 102C102 102 113 114 113 130V251C113 255 110 258 105 258H63C58 258 55 255 55 251V130Z"
            className={wineFill}
            fillOpacity="0.52"
          />
          {/* Bottle base punt arch */}
          <path d="M66 258C72 246 96 246 102 258" className="stroke-bottle-stroke" strokeOpacity="0.55" strokeWidth="2" />
          {/* Empty cream neck band */}
          <path d="M66 112H102L105 126H63L66 112Z" className="fill-label stroke-label-rule" strokeWidth="1.3" />
          {/* Empty cream body label blank with ornate inset */}
          <rect x="59" y="138" width="50" height="86" rx="2" className="fill-label stroke-label-rule" strokeWidth="1.5" />
          <rect x="63" y="142" width="42" height="78" rx="1" className="stroke-label-rule" strokeOpacity="0.6" strokeWidth="1" />
          <circle cx="84" cy="156" r="5" className={wineFill} fillOpacity="0.85" />
          <line x1="68" y1="170" x2="100" y2="170" className={wineStroke} strokeWidth="2" />
          <line x1="71" y1="180" x2="97" y2="180" className="stroke-label-rule" strokeWidth="1.5" />
          <line x1="74" y1="188" x2="94" y2="188" className="stroke-label-rule" strokeWidth="1.25" />
          <line x1="68" y1="210" x2="100" y2="210" className="stroke-label-rule" strokeWidth="1.25" />
          {/* Specular glass highlights */}
          <path d="M58 138V244" className="stroke-label" strokeOpacity="0.34" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M77 48V94" className="stroke-label" strokeOpacity="0.28" strokeWidth="1.75" strokeLinecap="round" />
        </>
      )}

      {shape === 'shouldered' && (
        <>
          {/* Bordeaux / high-shoulder cellar bottle */}
          <path
            d="M71 14H97V25H95V62C95 76 120 82 120 106V254C120 260 115 264 108 264H60C53 264 48 260 48 254V106C48 82 73 76 73 62V25H71V14Z"
            className="fill-bottle stroke-bottle-stroke"
            strokeWidth="2.4"
          />
          {/* Wax-dipped capsule */}
          <path
            d="M71 14H97V45C94 45 93 50 90 50C87 50 86 44 83 44C80 44 79 48 76 48C73 48 72 44 71 44V14Z"
            className={wineFill}
          />
          {/* Wine liquid panel */}
          <path
            d="M54 108C54 94 65 86 84 86C103 86 114 94 114 108V251C114 255 111 258 106 258H62C57 258 54 255 54 251V108Z"
            className={wineFill}
            fillOpacity="0.54"
          />
          {/* Base punt */}
          <path d="M65 258C72 244 96 244 103 258" className="stroke-bottle-stroke" strokeOpacity="0.55" strokeWidth="2" />
          {/* Embossed glass crest on shoulder */}
          <circle cx="84" cy="106" r="7" className="fill-bottle stroke-candle" strokeOpacity="0.7" strokeWidth="1.3" />
          {/* Empty cream body label blank with clipped top corners */}
          <path
            d="M62 124H106L111 129V220H57V129L62 124Z"
            className="fill-label stroke-label-rule"
            strokeWidth="1.5"
          />
          <path
            d="M64 128H104L107 131V216H61V131L64 128Z"
            className="stroke-label-rule"
            strokeOpacity="0.6"
            strokeWidth="1"
          />
          <line x1="67" y1="142" x2="101" y2="142" className={wineStroke} strokeWidth="2.2" />
          <circle cx="84" cy="158" r="4.5" className={wineFill} fillOpacity="0.85" />
          <line x1="69" y1="173" x2="99" y2="173" className="stroke-label-rule" strokeWidth="1.5" />
          <line x1="72" y1="182" x2="96" y2="182" className="stroke-label-rule" strokeWidth="1.25" />
          <line x1="67" y1="204" x2="101" y2="204" className="stroke-label-rule" strokeWidth="1.25" />
          {/* Glass shoulder & body highlights */}
          <path d="M56 108V244" className="stroke-label" strokeOpacity="0.34" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M56 102C58 90 66 84 74 78" className="stroke-label" strokeOpacity="0.3" strokeWidth="2" strokeLinecap="round" />
        </>
      )}

      {shape === 'sparkling' && (
        <>
          {/* Sloped-shoulder sparkling bottle with muselet hood */}
          <path
            d="M69 16C69 12 74 10 84 10C94 10 99 12 99 16L97 28H95V62C95 90 122 114 122 148V252C122 259 116 264 108 264H60C52 264 46 259 46 252V148C46 114 73 90 73 62V28H71L69 16Z"
            className="fill-bottle stroke-bottle-stroke"
            strokeWidth="2.4"
          />
          {/* Foil hood & wire cage */}
          <path d="M69 16C69 12 74 10 84 10C94 10 99 12 99 16L96 58H72L69 16Z" className={wineFill} />
          <path d="M72 28H96M84 12V36" className="stroke-bottle-stroke" strokeOpacity="0.45" strokeWidth="1.3" />
          {/* Wine liquid glow */}
          <path
            d="M52 146C52 120 68 102 84 102C100 102 116 120 116 146V250C116 255 112 258 106 258H62C56 258 52 255 52 250V146Z"
            className={wineFill}
            fillOpacity="0.52"
          />
          {/* Neck cravat */}
          <path d="M68 92H100L105 108H63L68 92Z" className="fill-label stroke-label-rule" strokeWidth="1.3" />
          {/* Empty cream body label blank */}
          <path
            d="M62 142H106L112 148V224H56V148L62 142Z"
            className="fill-label stroke-label-rule"
            strokeWidth="1.5"
          />
          <line x1="66" y1="156" x2="102" y2="156" className={wineStroke} strokeWidth="2.2" />
          <circle cx="84" cy="172" r="4.5" className={wineFill} fillOpacity="0.85" />
          <line x1="68" y1="188" x2="100" y2="188" className="stroke-label-rule" strokeWidth="1.5" />
          <line x1="66" y1="210" x2="102" y2="210" className="stroke-label-rule" strokeWidth="1.25" />
          {/* Rising effervescence bubbles */}
          <circle cx="76" cy="236" r="2.2" className="fill-label" fillOpacity="0.65" />
          <circle cx="88" cy="244" r="1.8" className="fill-label" fillOpacity="0.65" />
          <circle cx="82" cy="252" r="1.5" className="fill-label" fillOpacity="0.55" />
          {/* Specular glass highlight */}
          <path d="M55 148V244" className="stroke-label" strokeOpacity="0.34" strokeWidth="2.5" strokeLinecap="round" />
        </>
      )}

      {/* Companion stemmed wine glass poured with the matching wine colour */}
      <g>
        {/* Swirling wine aroma / bouquet ribbons rising from the glass bowl */}
        <path
          d="M153 138C149 128 157 120 153 110C149 101 156 93 154 84"
          className={wineStroke}
          strokeOpacity="0.55"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M165 136C169 124 161 115 166 103C170 94 165 86 168 78"
          className={wineStroke}
          strokeOpacity="0.4"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeDasharray="3 3"
        />
        <circle cx="154" cy="78" r="1.8" className={wineFill} fillOpacity="0.55" />
        <circle cx="168" cy="72" r="1.4" className={wineFill} fillOpacity="0.45" />

        {/* Small cluster of grapes resting at the bottle base on the shelf */}
        <path d="M28 246C32 241 38 240 42 243" className="stroke-bottle-stroke" strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="31" cy="252" r="4.5" className="fill-red-wine stroke-bottle-stroke" strokeWidth="1.2" />
        <circle cx="39" cy="251" r="4.5" className="fill-red-wine stroke-bottle-stroke" strokeWidth="1.2" />
        <circle cx="35" cy="258" r="4.5" className="fill-red-wine stroke-bottle-stroke" strokeWidth="1.2" />
        <circle cx="43" cy="258" r="4.2" className="fill-red-wine stroke-bottle-stroke" strokeWidth="1.2" />
        <circle cx="29.5" cy="250.5" r="1.1" className="fill-label" fillOpacity="0.55" />
        <circle cx="37.5" cy="249.5" r="1.1" className="fill-label" fillOpacity="0.55" />

        {/* Glass bowl */}
        <path
          d="M140 144H182L185 172C185 190 174 202 161 202C148 202 137 190 137 172L140 144Z"
          className="fill-surface/35 stroke-bottle-stroke"
          strokeWidth="2"
        />
        {/* Poured wine inside glass */}
        <path
          d="M140 168H182C181 186 172 198 161 198C150 198 141 186 140 168Z"
          className={wineFill}
          fillOpacity="0.88"
        />
        {/* Wine meniscus surface */}
        <ellipse cx="161" cy="168" rx="21" ry="3.5" className={wineFill} />
        <ellipse cx="161" cy="168" rx="21" ry="3.5" className="stroke-label" strokeOpacity="0.55" strokeWidth="1" />
        {/* Bowl specular highlight */}
        <path d="M144 152L143 176" className="stroke-label" strokeOpacity="0.55" strokeWidth="2" strokeLinecap="round" />
        {/* Stem & foot */}
        <line x1="161" y1="202" x2="161" y2="258" className="stroke-bottle-stroke" strokeWidth="2.2" />
        <ellipse cx="161" cy="260" rx="19" ry="4" className="fill-surface/50 stroke-bottle-stroke" strokeWidth="1.8" />
      </g>
    </svg>
  );
}

/**
 * Hanging grapevine bough with burgundy grape clusters, vine leaves, curling tendrils and red-wine aroma swirls
 * for the hero background and cellar alcove corners.
 */
export function GrapevineAromaBackdrop({
  flip = false,
  className = '',
}: {
  flip?: boolean;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 360 220"
      fill="none"
      className={`decorative-art pointer-events-none select-none ${flip ? '-scale-x-100' : ''} ${className}`}
    >
      {/* Swirling red-wine aroma ribbons drifting across the background */}
      <path
        d="M18 188C68 158 92 184 148 148C204 112 224 138 286 96C318 74 338 52 352 28"
        className="stroke-red-wine"
        strokeOpacity="0.22"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M42 204C94 176 126 196 182 160C234 126 262 142 324 98"
        className="stroke-candle"
        strokeOpacity="0.2"
        strokeWidth="1.5"
        strokeDasharray="4 5"
        strokeLinecap="round"
      />

      {/* Main woody vine branch */}
      <path
        d="M0 18C58 22 112 38 164 26C212 15 258 28 308 14"
        className="stroke-bottle-stroke"
        strokeOpacity="0.55"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Curling vine tendrils */}
      <path
        d="M196 22C206 36 222 38 226 28C229 20 220 16 215 23C211 29 218 42 232 42"
        className="stroke-rule"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M52 22C44 38 30 42 25 32C21 24 30 19 35 26"
        className="stroke-rule"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Vine leaf 1 (left) */}
      <path
        d="M72 24C58 30 50 46 56 60C68 58 78 48 82 36C88 46 100 52 112 46C108 32 92 22 72 24Z"
        className="fill-bottle stroke-bottle-stroke"
        fillOpacity="0.55"
        strokeOpacity="0.6"
        strokeWidth="1.5"
      />
      <path d="M72 24L66 50M72 24L98 40" className="stroke-label" strokeOpacity="0.35" strokeWidth="1.2" />

      {/* Vine leaf 2 (right of main cluster) */}
      <path
        d="M158 26C148 36 146 52 154 64C166 58 172 46 174 34C182 42 194 44 204 36C196 24 178 20 158 26Z"
        className="fill-bottle stroke-bottle-stroke"
        fillOpacity="0.5"
        strokeOpacity="0.6"
        strokeWidth="1.5"
      />

      {/* Primary hanging burgundy grape cluster */}
      <g>
        <line x1="118" y1="28" x2="118" y2="44" className="stroke-bottle-stroke" strokeWidth="2" />
        {[
          // Row 1 (top shoulder of bunch)
          { cx: 102, cy: 50, r: 7.5 },
          { cx: 114, cy: 48, r: 8 },
          { cx: 126, cy: 49, r: 8 },
          { cx: 137, cy: 53, r: 7.2 },
          // Row 2
          { cx: 98, cy: 62, r: 7.8 },
          { cx: 110, cy: 61, r: 8.2 },
          { cx: 122, cy: 61, r: 8.2 },
          { cx: 133, cy: 64, r: 7.6 },
          // Row 3
          { cx: 103, cy: 74, r: 7.8 },
          { cx: 115, cy: 74, r: 8.2 },
          { cx: 127, cy: 75, r: 7.8 },
          // Row 4
          { cx: 109, cy: 87, r: 7.6 },
          { cx: 121, cy: 87, r: 7.6 },
          // Row 5 (tip of grape cluster)
          { cx: 115, cy: 99, r: 7.2 },
        ].map((berry, idx) => (
          <g key={idx}>
            <circle
              cx={berry.cx}
              cy={berry.cy}
              r={berry.r}
              className="fill-red-wine stroke-bottle-stroke"
              fillOpacity="0.82"
              strokeOpacity="0.7"
              strokeWidth="1.35"
            />
            <circle
              cx={berry.cx - 2.2}
              cy={berry.cy - 2.2}
              r={berry.r * 0.28}
              className="fill-label"
              fillOpacity="0.5"
            />
          </g>
        ))}
      </g>

      {/* Secondary smaller grape cluster near the right */}
      <g opacity="0.78">
        <line x1="256" y1="22" x2="256" y2="34" className="stroke-bottle-stroke" strokeWidth="1.75" />
        {[
          { cx: 247, cy: 40, r: 6.2 },
          { cx: 257, cy: 39, r: 6.5 },
          { cx: 266, cy: 41, r: 6 },
          { cx: 251, cy: 50, r: 6.4 },
          { cx: 261, cy: 50, r: 6.4 },
          { cx: 256, cy: 60, r: 6 },
        ].map((berry, idx) => (
          <g key={idx}>
            <circle
              cx={berry.cx}
              cy={berry.cy}
              r={berry.r}
              className="fill-red-wine stroke-bottle-stroke"
              fillOpacity="0.75"
              strokeOpacity="0.65"
              strokeWidth="1.2"
            />
            <circle
              cx={berry.cx - 1.8}
              cy={berry.cy - 1.8}
              r={1.6}
              className="fill-label"
              fillOpacity="0.45"
            />
          </g>
        ))}
      </g>
    </svg>
  );
}

/** Small taper candle in a brass chamberstick holder for the shelf edge. */
export function ShelfCandle({ className = '' }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 84 150"
      fill="none"
      className={`decorative-art select-none ${className}`}
    >
      {/* Multi-ring warm candle halo */}
      <circle cx="42" cy="30" r="26" className="candle-flame-halo fill-candle" fillOpacity="0.18" />
      <circle cx="42" cy="30" r="16" className="candle-flame-halo fill-candle" fillOpacity="0.32" />
      <circle cx="42" cy="30" r="9" className="candle-flame-halo fill-candle" fillOpacity="0.48" />
      {/* Outer & inner flame */}
      <path
        d="M42 12C46.5 19.5 49 24.8 49 29.8C49 34.2 45.9 37.5 42 37.5C38.1 37.5 35 34.2 35 29.8C35 24.8 37.5 19.5 42 12Z"
        className="fill-candle"
      />
      <path
        d="M42 19.5C44.2 23.4 45.2 26.2 45.2 28.8C45.2 31 43.8 32.6 42 32.6C40.2 32.6 38.8 31 38.8 28.8C38.8 26.2 39.8 23.4 42 19.5Z"
        className="fill-surface"
      />
      {/* Wick */}
      <line x1="42" y1="37" x2="42" y2="44" className="stroke-bottle-stroke" strokeWidth="2" />
      {/* Taper wax column */}
      <rect x="33" y="44" width="18" height="78" rx="2.5" className="fill-label stroke-label-rule" strokeWidth="1.75" />
      {/* Wax drips */}
      <path
        d="M36 45V64C36 66 37.5 67.5 39 67.5C40.5 67.5 41.5 66 41.5 64V53M45 45V58C45 59.5 46 60.5 47 60.5"
        className="stroke-label-rule"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Chamberstick brass nozzle, stem & saucer */}
      <rect x="28" y="122" width="28" height="11" rx="2.5" className="fill-candle stroke-bottle-stroke" strokeWidth="1.75" />
      <path
        d="M14 133H70C67 141 58 145 42 145C26 145 17 141 14 133Z"
        className="fill-bottle stroke-bottle-stroke"
        strokeWidth="1.8"
      />
      {/* Ring handle */}
      <path
        d="M66 133C73 133 77 128 77 122C77 116 73 112 67 112C63 112 60 115 60 119"
        className="stroke-candle"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Miniature clipped tasting-card outline beside programme headings. */
export function TastingCardMark({ className = '' }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 44 52"
      fill="none"
      className={`decorative-art h-10 w-8 shrink-0 select-none ${className}`}
    >
      <path d="M8 3H36L41 8V49H3V8L8 3Z" className="fill-label stroke-rule" strokeWidth="1.75" />
      <circle cx="22" cy="10" r="2.5" className="fill-bg stroke-candle" strokeWidth="1.5" />
      <line x1="10" y1="20" x2="34" y2="20" className="stroke-red-wine" strokeWidth="2" />
      <line x1="10" y1="27" x2="30" y2="27" className="stroke-label-rule" strokeWidth="1.5" />
      <line x1="10" y1="33" x2="27" y2="33" className="stroke-label-rule" strokeWidth="1.5" />
      <circle cx="12" cy="41" r="2.5" className="fill-white-wine stroke-bottle-stroke" strokeWidth="1" />
      <circle cx="19" cy="41" r="2.5" className="fill-rose-wine stroke-bottle-stroke" strokeWidth="1" />
      <circle cx="26" cy="41" r="2.5" className="fill-amber-wine stroke-bottle-stroke" strokeWidth="1" />
      <circle cx="33" cy="41" r="2.5" className="fill-red-wine stroke-bottle-stroke" strokeWidth="1" />
    </svg>
  );
}

/** Illustrated four-glass tasting flight paddle for the featured Tasting Evenings card. */
export function TastingFlightArt({ className = '' }: { className?: string }) {
  const pours = [
    { cx: 48, fill: 'fill-white-wine' },
    { cx: 112, fill: 'fill-rose-wine' },
    { cx: 176, fill: 'fill-amber-wine' },
    { cx: 240, fill: 'fill-red-wine' },
  ];

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 288 124"
      fill="none"
      className={`decorative-art h-24 w-full max-w-xs select-none ${className}`}
    >
      {/* Wooden flight paddle */}
      <rect x="10" y="104" width="268" height="10" rx="3" className="fill-rack-wood stroke-bottle-stroke" strokeWidth="1.5" />
      {pours.map((pour, idx) => (
        <g key={idx}>
          {/* Glass bowl */}
          <path
            d={`M${pour.cx - 18} 18H${pour.cx + 18}L${pour.cx + 21} 44C${pour.cx + 21} 58 ${pour.cx + 12} 68 ${pour.cx} 68C${pour.cx - 12} 68 ${pour.cx - 21} 58 ${pour.cx - 21} 44L${pour.cx - 18} 18Z`}
            className="fill-surface/40 stroke-bottle-stroke"
            strokeWidth="1.75"
          />
          {/* Poured wine */}
          <path
            d={`M${pour.cx - 19} 40H${pour.cx + 19}C${pour.cx + 18} 54 ${pour.cx + 10} 64 ${pour.cx} 64C${pour.cx - 10} 64 ${pour.cx - 18} 54 ${pour.cx - 19} 40Z`}
            className={pour.fill}
            fillOpacity="0.9"
          />
          <ellipse cx={pour.cx} cy="40" rx="19" ry="3" className={pour.fill} />
          {/* Stem & base */}
          <line x1={pour.cx} y1="68" x2={pour.cx} y2="102" className="stroke-bottle-stroke" strokeWidth="1.8" />
          <ellipse cx={pour.cx} cy="103" rx="14" ry="3" className="fill-label stroke-bottle-stroke" strokeWidth="1.4" />
        </g>
      ))}
    </svg>
  );
}

/** Simple plate and olive branch outline beside the small-plates introduction. */
export function SmallPlateMark({ className = '' }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 56 44"
      fill="none"
      className={`decorative-art h-9 w-11 shrink-0 select-none ${className}`}
    >
      <ellipse cx="28" cy="27" rx="24" ry="12" className="fill-surface stroke-rule" strokeWidth="1.75" />
      <ellipse cx="28" cy="27" rx="16" ry="7.5" className="stroke-label-rule" strokeWidth="1.25" />
      <path d="M16 18C24 14 33 14 41 18" className="stroke-bottle-stroke" strokeWidth="1.5" strokeLinecap="round" />
      <ellipse cx="22" cy="25" rx="4.2" ry="3.2" transform="rotate(-15 22 25)" className="fill-bottle stroke-bottle-stroke" strokeWidth="1.25" />
      <ellipse cx="31" cy="27" rx="4.2" ry="3.2" transform="rotate(12 31 27)" className="fill-red-wine stroke-bottle-stroke" strokeWidth="1.25" />
      <ellipse cx="36" cy="22" rx="3.8" ry="2.8" transform="rotate(-8 36 22)" className="fill-bottle stroke-bottle-stroke" strokeWidth="1.25" />
    </svg>
  );
}

/** Cellar table grazing board vignette (ceramic dish of olives, cheese wedge & olive branch) for the Small Plates section. */
export function CellarTableSpreadArt({ className = '' }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 320 140"
      fill="none"
      className={`decorative-art h-28 w-full max-w-sm select-none ${className}`}
    >
      {/* Wooden grazing board */}
      <rect x="16" y="88" width="260" height="14" rx="4" className="fill-rack-wood stroke-bottle-stroke" strokeWidth="1.8" />
      <path d="M276 91H298C302 91 304 93 304 95C304 97 302 99 298 99H276" className="fill-rack-wood stroke-bottle-stroke" strokeWidth="1.8" />
      {/* Aged mountain cheese wedge */}
      <path d="M42 88L98 48L128 66V88H42Z" className="fill-label stroke-bottle-stroke" strokeWidth="1.8" />
      <path d="M98 48L128 66L42 88" className="fill-white-wine" fillOpacity="0.45" />
      <circle cx="82" cy="76" r="3" className="fill-amber-wine" fillOpacity="0.6" />
      <circle cx="104" cy="74" r="2.2" className="fill-amber-wine" fillOpacity="0.6" />
      {/* Ceramic bowl of marinated olives */}
      <path d="M148 64H236C232 82 216 88 192 88C168 88 152 82 148 64Z" className="fill-surface stroke-bottle-stroke" strokeWidth="1.8" />
      <ellipse cx="192" cy="64" rx="44" ry="8" className="fill-label stroke-bottle-stroke" strokeWidth="1.6" />
      <ellipse cx="176" cy="61" rx="7" ry="5" transform="rotate(-14 176 61)" className="fill-bottle stroke-bottle-stroke" strokeWidth="1.4" />
      <ellipse cx="192" cy="59" rx="7.5" ry="5.2" transform="rotate(8 192 59)" className="fill-red-wine stroke-bottle-stroke" strokeWidth="1.4" />
      <ellipse cx="208" cy="62" rx="7" ry="5" transform="rotate(-10 208 62)" className="fill-bottle stroke-bottle-stroke" strokeWidth="1.4" />
      <ellipse cx="185" cy="64" rx="6.5" ry="4.5" className="fill-amber-wine stroke-bottle-stroke" strokeWidth="1.3" />
      {/* Botanical olive & bramble branch above */}
      <path d="M44 26C110 14 190 18 264 34" className="stroke-rule" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M108 19C102 11 92 9 84 13C90 21 100 22 108 19Z" className="fill-bottle" fillOpacity="0.75" />
      <path d="M158 20C164 12 174 10 182 14C176 22 166 23 158 20Z" className="fill-bottle" fillOpacity="0.75" />
      <path d="M216 26C222 18 232 17 240 21C234 29 224 29 216 26Z" className="fill-bottle" fillOpacity="0.75" />
    </svg>
  );
}

/** Ornate candle & bramble botanical mark punctuating the story section. */
export function StoryCandleMark({ className = '' }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 220 44"
      fill="none"
      className={`decorative-art h-9 w-48 select-none ${className}`}
    >
      <line x1="6" y1="26" x2="82" y2="26" className="stroke-rule" strokeWidth="1.4" />
      <path d="M62 26C56 18 46 16 38 20C44 27 54 28 62 26Z" className="fill-bottle" fillOpacity="0.7" />
      <circle cx="76" cy="26" r="2.5" className="fill-red-wine" />
      <circle cx="110" cy="15" r="10" className="candle-flame-halo fill-candle" fillOpacity="0.24" />
      <path
        d="M110 5C112.8 9.8 114.2 13 114.2 15.8C114.2 18.2 112.3 20 110 20C107.7 20 105.8 18.2 105.8 15.8C105.8 13 107.2 9.8 110 5Z"
        className="fill-candle"
      />
      <line x1="110" y1="20.5" x2="110" y2="36" className="stroke-rule" strokeWidth="2.4" strokeLinecap="round" />
      <line x1="100" y1="36" x2="120" y2="36" className="stroke-rule" strokeWidth="2" strokeLinecap="round" />
      <circle cx="144" cy="26" r="2.5" className="fill-red-wine" />
      <path d="M158 26C164 18 174 16 182 20C176 27 166 28 158 26Z" className="fill-bottle" fillOpacity="0.7" />
      <line x1="138" y1="26" x2="214" y2="26" className="stroke-rule" strokeWidth="1.4" />
    </svg>
  );
}
