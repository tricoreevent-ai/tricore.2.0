const artCopy = {
  admin: {
    eyebrow: 'Control room',
    title: 'Live operations view',
    description: 'Events, alerts, payments, and schedules stay connected from one console.'
  },
  community: {
    eyebrow: 'People first',
    title: 'Partners, players, and communities',
    description: 'Connected teams with clear roles and shared momentum.'
  },
  contact: {
    eyebrow: 'Fast follow-up',
    title: 'Message routed to the right team',
    description: 'Inquiries move from first note to event planning without friction.'
  },
  corporate: {
    eyebrow: 'Corporate flow',
    title: 'Brief, venue, agenda, and execution',
    description: 'Structured event planning for polished workplace experiences.'
  },
  legal: {
    eyebrow: 'Trust layer',
    title: 'Rules, privacy, and payment clarity',
    description: 'Every participant gets a clear view of the terms before they proceed.'
  },
  newsletter: {
    eyebrow: 'Updates desk',
    title: 'Stories, recaps, and announcements',
    description: 'Published notes keep the TriCore community in sync.'
  },
  notFound: {
    eyebrow: 'Route finder',
    title: 'A better path is close',
    description: 'Quick links help visitors get back to active TriCore pages.'
  },
  payment: {
    eyebrow: 'Payment proof',
    title: 'Scan, upload, and verify',
    description: 'Clear payment steps keep registration confirmation moving.'
  },
  sponsor: {
    eyebrow: 'Brand presence',
    title: 'Sponsor visibility across the event',
    description: 'Venue, digital, and match-day moments work together for stronger recall.'
  },
  sports: {
    eyebrow: 'Tournament engine',
    title: 'Fixtures, teams, and match days',
    description: 'A sporting workflow built for smooth registrations and confident play.'
  },
  user: {
    eyebrow: 'Player desk',
    title: 'Registrations and payouts in one place',
    description: 'Participants can track events, payments, matches, and refund details.'
  }
};

const toneClasses = {
  admin: 'border-[rgba(212,175,55,0.2)] bg-[rgba(255,255,255,0.04)] text-white',
  brand: 'border-white/20 bg-white/10 text-white',
  light: 'border-slate-200 bg-white text-slate-950 shadow-soft',
  public: 'border-[rgba(212,175,55,0.16)] bg-[rgba(255,255,255,0.04)] text-white'
};

const mutedTextClasses = {
  admin: 'text-[#a0a0a0]',
  brand: 'text-white/75',
  light: 'text-slate-500',
  public: 'text-[#a0a0a0]'
};

const eyebrowClasses = {
  admin: 'text-[#d4af37]',
  brand: 'text-white/80',
  light: 'text-brand-orange',
  public: 'text-[#d4af37]'
};

function AdminArt() {
  return (
    <>
      <rect fill="#141414" height="114" rx="6" width="168" x="16" y="22" />
      <rect fill="#d4af37" height="24" rx="4" width="48" x="32" y="38" />
      <rect fill="#22c55e" height="10" rx="5" width="52" x="94" y="45" />
      <rect fill="#38bdf8" height="10" rx="5" width="38" x="94" y="67" />
      <rect fill="#f97316" height="10" rx="5" width="62" x="94" y="89" />
      <path d="M36 103h24l16-24 20 19 18-30 28 35h22" fill="none" stroke="#f8fafc" strokeWidth="7" />
      <circle cx="150" cy="103" fill="#d4af37" r="10" />
    </>
  );
}

function CommunityArt() {
  return (
    <>
      <circle cx="100" cy="78" fill="#d4af37" r="24" />
      <circle cx="55" cy="118" fill="#38bdf8" r="18" />
      <circle cx="145" cy="118" fill="#22c55e" r="18" />
      <circle cx="100" cy="146" fill="#f97316" r="16" />
      <path d="M84 92 68 107M116 92l16 15M86 135l-16-9M114 135l16-9" stroke="#f8fafc" strokeLinecap="round" strokeWidth="7" />
      <path d="M35 153c15-24 115-24 130 0" fill="none" stroke="#d4af37" strokeLinecap="round" strokeWidth="9" />
    </>
  );
}

function ContactArt() {
  return (
    <>
      <rect fill="#141414" height="98" rx="8" width="138" x="31" y="38" />
      <path d="m42 54 58 42 58-42" fill="none" stroke="#d4af37" strokeLinecap="round" strokeLinejoin="round" strokeWidth="8" />
      <circle cx="59" cy="138" fill="#22c55e" r="16" />
      <path d="M52 136c8 10 18 10 25-1" fill="none" stroke="#f8fafc" strokeLinecap="round" strokeWidth="5" />
      <rect fill="#38bdf8" height="12" rx="6" width="50" x="92" y="118" />
      <rect fill="#f97316" height="12" rx="6" width="34" x="92" y="142" />
    </>
  );
}

function CorporateArt() {
  return (
    <>
      <rect fill="#141414" height="96" rx="7" width="132" x="34" y="34" />
      <rect fill="#d4af37" height="14" rx="3" width="58" x="50" y="52" />
      <path d="M52 108h18V82h18v26h18V76h18v32h18" fill="none" stroke="#38bdf8" strokeWidth="8" />
      <circle cx="55" cy="151" fill="#22c55e" r="13" />
      <circle cx="100" cy="151" fill="#d4af37" r="13" />
      <circle cx="145" cy="151" fill="#f97316" r="13" />
      <path d="M52 151h96" stroke="#f8fafc" strokeLinecap="round" strokeWidth="6" />
    </>
  );
}

function LegalArt() {
  return (
    <>
      <path d="M100 25 158 46v40c0 40-24 68-58 86-34-18-58-46-58-86V46z" fill="#141414" stroke="#d4af37" strokeWidth="8" />
      <path d="M74 92h52M74 116h38" stroke="#f8fafc" strokeLinecap="round" strokeWidth="8" />
      <path d="m75 65 18 18 35-34" fill="none" stroke="#22c55e" strokeLinecap="round" strokeLinejoin="round" strokeWidth="9" />
      <circle cx="142" cy="132" fill="#38bdf8" r="14" />
    </>
  );
}

function NewsletterArt() {
  return (
    <>
      <rect fill="#141414" height="126" rx="8" width="116" x="42" y="28" />
      <rect fill="#d4af37" height="16" rx="4" width="74" x="62" y="49" />
      <rect fill="#38bdf8" height="32" rx="5" width="40" x="62" y="82" />
      <path d="M114 86h26M114 103h22M62 132h76" stroke="#f8fafc" strokeLinecap="round" strokeWidth="7" />
      <path d="M151 45c14 10 20 24 18 42" fill="none" stroke="#22c55e" strokeLinecap="round" strokeWidth="7" />
    </>
  );
}

function NotFoundArt() {
  return (
    <>
      <path d="M52 156h96" stroke="#d4af37" strokeLinecap="round" strokeWidth="9" />
      <path d="M100 45v112" stroke="#f8fafc" strokeLinecap="round" strokeWidth="8" />
      <path d="M63 54h77l18 18-18 18H63z" fill="#141414" stroke="#38bdf8" strokeLinejoin="round" strokeWidth="7" />
      <path d="M137 101H60l-18 18 18 18h77z" fill="#141414" stroke="#f97316" strokeLinejoin="round" strokeWidth="7" />
      <circle cx="100" cy="45" fill="#d4af37" r="14" />
    </>
  );
}

function PaymentArt() {
  return (
    <>
      <rect fill="#141414" height="118" rx="8" width="92" x="54" y="30" />
      <rect fill="#d4af37" height="34" rx="5" width="34" x="73" y="51" />
      <path d="M121 51h10M121 67h10M73 101h58M73 121h40" stroke="#f8fafc" strokeLinecap="round" strokeWidth="7" />
      <circle cx="143" cy="136" fill="#22c55e" r="18" />
      <path d="m134 136 7 7 14-17" fill="none" stroke="#f8fafc" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5" />
    </>
  );
}

function SponsorArt() {
  return (
    <>
      <path d="M47 108h22l72-36v72l-72-36H47z" fill="#141414" stroke="#d4af37" strokeLinejoin="round" strokeWidth="8" />
      <path d="M67 110 79 158" stroke="#f8fafc" strokeLinecap="round" strokeWidth="8" />
      <path d="M151 75c18 13 18 52 0 65M162 58c32 24 32 75 0 98" fill="none" stroke="#38bdf8" strokeLinecap="round" strokeWidth="7" />
      <circle cx="50" cy="77" fill="#22c55e" r="13" />
      <circle cx="132" cy="50" fill="#f97316" r="11" />
    </>
  );
}

function SportsArt() {
  return (
    <>
      <path d="M50 137h100" stroke="#d4af37" strokeLinecap="round" strokeWidth="9" />
      <path d="M71 43h58v26c0 30-17 52-29 60-12-8-29-30-29-60z" fill="#141414" stroke="#d4af37" strokeLinejoin="round" strokeWidth="8" />
      <path d="M72 61H48c0 24 9 39 28 43M128 61h24c0 24-9 39-28 43" fill="none" stroke="#38bdf8" strokeLinecap="round" strokeLinejoin="round" strokeWidth="8" />
      <path d="M100 128v20" stroke="#f8fafc" strokeLinecap="round" strokeWidth="8" />
      <path d="M85 78h30M85 96h30" stroke="#22c55e" strokeLinecap="round" strokeWidth="7" />
      <circle cx="148" cy="143" fill="#f97316" r="12" />
    </>
  );
}

function UserArt() {
  return (
    <>
      <circle cx="76" cy="64" fill="#d4af37" r="24" />
      <path d="M38 140c9-34 67-34 76 0" fill="#141414" stroke="#38bdf8" strokeLinecap="round" strokeWidth="8" />
      <rect fill="#141414" height="82" rx="8" width="72" x="105" y="62" />
      <path d="M121 86h40M121 108h28M121 130h40" stroke="#f8fafc" strokeLinecap="round" strokeWidth="7" />
      <circle cx="161" cy="62" fill="#22c55e" r="13" />
      <path d="m155 62 4 5 9-11" fill="none" stroke="#f8fafc" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
    </>
  );
}

const artDrawings = {
  admin: AdminArt,
  community: CommunityArt,
  contact: ContactArt,
  corporate: CorporateArt,
  legal: LegalArt,
  newsletter: NewsletterArt,
  notFound: NotFoundArt,
  payment: PaymentArt,
  sponsor: SponsorArt,
  sports: SportsArt,
  user: UserArt
};

export default function PageVectorArt({
  className = '',
  compact = false,
  description,
  eyebrow,
  showCaption = false,
  title,
  tone = 'public',
  variant = 'sports'
}) {
  const copy = artCopy[variant] || artCopy.sports;
  const Drawing = artDrawings[variant] || artDrawings.sports;
  const resolvedTone = toneClasses[tone] ? tone : 'public';

  return (
    <figure
      aria-label={title || copy.title}
      className={[
        'overflow-hidden rounded-lg border',
        compact ? 'p-3' : 'p-4',
        toneClasses[resolvedTone],
        compact ? 'max-w-[15rem]' : 'w-full max-w-xs',
        className
      ]
        .filter(Boolean)
        .join(' ')}
      role="img"
    >
      <svg
        aria-hidden="true"
        className="mx-auto h-auto w-full max-w-[12rem]"
        fill="none"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect fill="currentColor" height="200" opacity="0.03" rx="8" width="200" />
        <circle cx="36" cy="38" fill="#d4af37" opacity="0.18" r="26" />
        <circle cx="164" cy="162" fill="#38bdf8" opacity="0.16" r="30" />
        <Drawing />
      </svg>
      {showCaption ? (
        <figcaption className={compact ? 'mt-4' : 'mt-5'}>
          <p
            className={`text-[10px] font-bold uppercase tracking-[0.18em] ${eyebrowClasses[resolvedTone]}`}
          >
            {eyebrow || copy.eyebrow}
          </p>
          <p className="mt-2 text-lg font-extrabold leading-6">{title || copy.title}</p>
          <p className={`mt-2 text-sm leading-6 ${mutedTextClasses[resolvedTone]}`}>
            {description || copy.description}
          </p>
        </figcaption>
      ) : null}
    </figure>
  );
}
