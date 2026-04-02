import { contactContent } from '../../data/siteContent.js';

const legalEmail = contactContent.email || 'contact@tricoreevents.online';
const legalMailTo = `mailto:${legalEmail}`;
const refundSubject = 'Refund Request - [Event Name] - [Team Name]';

const termsSections = [
  {
    title: '1. Registration & Payment',
    paragraphs: [
      'All registrations must be completed through the official TriCore Events platform or authorized partners. The team captain or representative is responsible for ensuring that all submitted information is accurate and complete.',
      'Registration is confirmed only upon successful receipt of full payment. Entry fees vary depending on the sport and event category.',
      'All payments are processed through third-party payment gateways. TriCore does not store or process credit or debit card details, UPI credentials, or banking information on its servers.',
      'TriCore shall not be liable for failed, delayed, or duplicate transactions caused by payment gateway issues.'
    ]
  },
  {
    title: '2. Fees, Refunds & Cancellation Policy',
    subsections: [
      {
        title: 'Team-Initiated Cancellation',
        paragraphs: [
          'Entry fees are non-refundable in case of withdrawal after successful registration. However, requests may be considered in exceptional circumstances such as medical emergencies or unforeseen situations, subject to verification and approval at TriCore\'s sole discretion. Approved refunds may be subject to administrative deductions.'
        ]
      },
      {
        title: 'Event Cancellation by TriCore',
        paragraphs: [
          'If an event is cancelled entirely by TriCore and not rescheduled, participants are eligible for a full refund.',
          `To claim a refund, participants must submit a request via email to ${legalEmail}.`
        ],
        note: `Subject line: ${refundSubject}`,
        bullets: [
          'Team name and registration ID',
          'Account holder name',
          'Bank name and branch',
          'Account number',
          'IFSC code'
        ],
        footer:
          'Refunds will be processed within 15 working days. TriCore shall not be responsible for incorrect bank details provided by the participant.'
      },
      {
        title: 'Postponement / Rescheduling',
        paragraphs: [
          'If an event is postponed, registrations will remain valid for the new date. No refunds will be issued if a participant is unable to attend the rescheduled event.'
        ]
      },
      {
        title: 'No-Shows / Disqualification',
        paragraphs: [
          'No refunds will be provided in cases of absence, late arrival, or disqualification due to rule violations.'
        ]
      },
      {
        title: 'Force Majeure',
        paragraphs: [
          'TriCore shall not be held liable for delays or cancellations due to circumstances beyond its control, including but not limited to natural disasters, government restrictions, pandemics, or unforeseen disruptions. In such cases, refund decisions will be made at TriCore\'s discretion.'
        ]
      }
    ]
  },
  {
    title: '3. Eligibility & Team Composition',
    paragraphs: [
      'Participants must meet the minimum age requirement of 16 years unless specified otherwise. Participants under 18 must provide valid parental or guardian consent.',
      'TriCore reserves the right to verify identity, age, and eligibility at any stage. Submission of false or misleading information may result in disqualification without refund.',
      'Teams must comply with sport-specific rules, roster limits, and eligibility criteria.'
    ]
  },
  {
    title: '4. Code of Conduct & Sportsmanship',
    paragraphs: [
      'All participants are expected to maintain respectful and professional conduct toward fellow players, officials, and spectators.',
      'Any form of misconduct including violence, abuse, cheating, or unsportsmanlike behavior may result in immediate disqualification, removal from the event, and potential restriction from future participation without refund.'
    ]
  },
  {
    title: '5. Event Authority & Decisions',
    paragraphs: [
      'All decisions made by referees, umpires, and event officials are final and binding.',
      'TriCore reserves the right to modify event formats, schedules, fixtures, or rules as necessary to ensure smooth execution.',
      'TriCore also reserves the right to refuse or cancel any registration in the interest of fairness, safety, or operational requirements.'
    ]
  },
  {
    title: '6. Assumption of Risk & Liability Waiver',
    paragraphs: [
      'Participation in sports events involves inherent risks, including physical injury, accidents, or property loss.',
      'By participating, you voluntarily assume all associated risks. To the fullest extent permitted by law, TriCore Events, its organizers, staff, partners, sponsors, and venue providers shall not be held liable for any injury, loss, damage, or claims arising from participation, including those resulting from negligence.',
      'Participants are strongly advised to obtain personal health and accident insurance.'
    ]
  },
  {
    title: '7. Limitation of Liability & Indemnification',
    paragraphs: [
      'TriCore\'s total liability, if any, shall not exceed the entry fee paid by the participant or team.',
      'TriCore shall not be liable for indirect, incidental, or consequential damages.',
      'You agree to indemnify and hold TriCore harmless against any claims, damages, liabilities, or expenses arising from your participation or breach of these Terms.'
    ]
  },
  {
    title: '8. Intellectual Property & Media Consent',
    paragraphs: [
      'By registering, participants grant TriCore a perpetual, worldwide, royalty-free right to use photographs, videos, team names, and performance-related content for promotional, marketing, and archival purposes.',
      `Participants who wish to opt out must notify TriCore in writing at least 7 days prior to the event via ${legalEmail}.`
    ]
  },
  {
    title: '9. Governing Law & Dispute Resolution',
    paragraphs: [
      'These Terms shall be governed by the laws of India.',
      'Any disputes shall first be resolved through mutual discussion. If unresolved, disputes shall be referred to arbitration in Bengaluru, Karnataka, in accordance with the Arbitration and Conciliation Act, 1996.',
      'Courts in Bengaluru shall have exclusive jurisdiction.'
    ]
  },
  {
    title: '10. Amendments & Severability',
    paragraphs: [
      'TriCore reserves the right to update or modify these Terms at any time. Changes become effective upon publication.',
      'If any provision is found unenforceable, the remaining provisions shall remain valid and enforceable.'
    ]
  }
];

const privacySections = [
  {
    title: '1. Information We Collect',
    bullets: [
      'Personal details: name, date of birth, gender, contact number, email, address',
      'Emergency contact details',
      'Government ID where required',
      'Team and participation details',
      'Transaction details including amount and transaction ID',
      'Technical data including IP address, browser type, cookies, and usage data'
    ],
    footer:
      'We do not store sensitive financial information such as card details or UPI credentials.'
  },
  {
    title: '2. Use of Information',
    bullets: [
      'Process registrations and payments',
      'Manage event logistics and communication',
      'Verify eligibility and prevent fraud',
      'Improve services and platform performance',
      'Comply with legal obligations'
    ],
    footer:
      'Marketing communication will only be sent with your consent, and you may opt out at any time.'
  },
  {
    title: '3. Data Sharing',
    paragraphs: ['We do not sell or rent your personal data. Information may be shared only where necessary.'],
    bullets: [
      'Event venues and partners',
      'Payment processors',
      'Legal authorities where required',
      'Service providers supporting operations'
    ]
  },
  {
    title: '4. Data Security & Retention',
    paragraphs: [
      'We implement reasonable security measures to protect your data.',
      'Information is retained only as long as necessary for operational, legal, and compliance purposes, including financial recordkeeping requirements under Indian law.'
    ]
  },
  {
    title: '5. Your Rights',
    paragraphs: [
      `You may request access, correction, or deletion of your personal data by contacting ${legalEmail}.`,
      'We will respond within a reasonable timeframe. Certain data may be retained where legally required.'
    ]
  },
  {
    title: '6. Cookies & Tracking',
    paragraphs: [
      'Our website uses cookies to enhance user experience and analyze usage. You may control cookies through your browser settings.',
      'Continued use of the platform constitutes consent.'
    ]
  },
  {
    title: '7. Children\'s Privacy',
    paragraphs: [
      'Events are intended for participants aged 16 and above. For minors, parental or guardian consent is mandatory.',
      'We do not knowingly collect data from children under 13 without verified consent.'
    ]
  },
  {
    title: '8. Policy Updates',
    paragraphs: [
      'This Privacy Policy may be updated periodically. Changes will be reflected in the Last Updated date.'
    ]
  }
];

const summaryPoints = [
  {
    title: 'Binding Agreement',
    description:
      'By registering for any TriCore event and making payment, you confirm that you have read, understood, and agreed to these terms.'
  },
  {
    title: 'Refund Requests',
    description:
      `All refund communication should be sent through ${legalEmail}, including the subject "${refundSubject}".`
  },
  {
    title: 'Jurisdiction',
    description:
      'Unresolved disputes move to arbitration in Bengaluru, Karnataka, and Bengaluru courts have exclusive jurisdiction.'
  }
];

const refundSummary = [
  'Event cancellation by TriCore: Full refund.',
  `To claim a refund, contact ${legalEmail} with your account holder name, bank name, account number, and IFSC code.`,
  'Team-initiated withdrawal: Generally non-refundable, but exceptional requests may be reviewed at TriCore\'s sole discretion.',
  'Postponed events: Registration automatically transfers to the new date.',
  'No-shows or disqualifications: No refund.'
];

const legalContacts = [
  { label: 'Legal Department', value: legalEmail, href: legalMailTo },
  { label: 'Grievance Officer', value: 'Mr. Dinesh' },
  { label: 'Phone Number', value: '8197711814', href: 'tel:+918197711814' },
  { label: 'Address', value: 'Bengaluru, Karnataka, India' },
  { label: 'Response Time', value: 'Within 7 business days' }
];

function BulletList({ items = [] }) {
  if (!items.length) {
    return null;
  }

  return (
    <ul className="mt-4 space-y-2.5">
      {items.map((item) => (
        <li className="flex gap-3" key={item}>
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d4af37]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function LegalSection({ title, paragraphs = [], bullets = [], subsections = [], note = '', footer = '' }) {
  return (
    <article className="public-panel p-5 sm:p-6">
      <h3 className="text-lg font-extrabold text-white">{title}</h3>
      <div className="mt-4 space-y-4 text-sm leading-7 text-[#a0a0a0]">
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <BulletList items={bullets} />
        {note ? (
          <div className="rounded-[1.1rem] border border-[rgba(212,175,55,0.16)] bg-[rgba(212,175,55,0.08)] px-4 py-3 text-[#f3e1a3]">
            {note}
          </div>
        ) : null}
        {footer ? <p>{footer}</p> : null}
      </div>

      {subsections.length ? (
        <div className="mt-5 space-y-4 border-t border-white/8 pt-5">
          {subsections.map((section) => (
            <div className="rounded-[1.1rem] border border-white/8 bg-[rgba(255,255,255,0.02)] px-4 py-4" key={section.title}>
              <h4 className="text-sm font-extrabold uppercase tracking-[0.14em] text-[#d4af37]">
                {section.title}
              </h4>
              <div className="mt-3 space-y-3 text-sm leading-7 text-[#a0a0a0]">
                {section.paragraphs?.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                <BulletList items={section.bullets} />
                {section.note ? (
                  <div className="rounded-[1rem] border border-[rgba(212,175,55,0.16)] bg-[rgba(212,175,55,0.08)] px-4 py-3 text-[#f3e1a3]">
                    {section.note}
                  </div>
                ) : null}
                {section.footer ? <p>{section.footer}</p> : null}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </article>
  );
}

export default function LegalPage() {
  return (
    <div className="pb-20 pt-12 sm:pt-16">
      <section className="border-b border-[rgba(212,175,55,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0))]">
        <div className="container-shell py-14 sm:py-16">
          <div className="max-w-5xl">
            <p className="public-label">TriCore Events Legal Hub</p>
            <h1 className="public-title-page mt-5">Terms & Conditions and Privacy Policy</h1>
            <div className="public-accent-line mt-6" />
            <p className="public-copy mt-6">
              Effective Date: April 2, 2026 | Last Updated: April 2, 2026
            </p>
            <p className="public-copy mt-5 max-w-4xl">
              This document constitutes a legally binding agreement between TriCore Events,
              also referred to as TriCore, we, our, or us, and all participants, team
              representatives, and users. By registering for any event and making payment, you
              acknowledge that you have read, understood, and agreed to all terms outlined below.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {summaryPoints.map((item) => (
              <div className="public-panel-ghost px-5 py-5" key={item.title}>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d4af37]">
                  {item.title}
                </p>
                <p className="mt-3 text-sm leading-7 text-[#a0a0a0]">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-shell mt-10">
        <div className="mb-6">
          <p className="public-label">Terms & Conditions of Participation</p>
          <h2 className="public-title-section mt-4">Participation rules, payments, authority, and conduct</h2>
        </div>
        <div className="space-y-4">
          {termsSections.map((section) => (
            <LegalSection
              bullets={section.bullets}
              footer={section.footer}
              key={section.title}
              note={section.note}
              paragraphs={section.paragraphs}
              subsections={section.subsections}
              title={section.title}
            />
          ))}
        </div>
      </section>

      <section className="container-shell mt-12">
        <div className="mb-6">
          <p className="public-label">Privacy Policy</p>
          <h2 className="public-title-section mt-4">How your information is collected, used, and protected</h2>
        </div>
        <div className="space-y-4">
          {privacySections.map((section) => (
            <LegalSection
              bullets={section.bullets}
              footer={section.footer}
              key={section.title}
              paragraphs={section.paragraphs}
              title={section.title}
            />
          ))}
        </div>
      </section>

      <section className="container-shell mt-12 space-y-4">
        <article className="public-panel p-5 sm:p-6">
          <p className="public-label">Refund & Cancellation Summary</p>
          <h2 className="public-title-section mt-4">Main refund points</h2>
          <div className="mt-5 text-sm leading-7 text-[#a0a0a0]">
            <BulletList items={refundSummary} />
            <div className="mt-5 rounded-[1.1rem] border border-[rgba(212,175,55,0.16)] bg-[rgba(212,175,55,0.08)] px-4 py-3 text-[#f3e1a3]">
              By registering for any TriCore event, you confirm that you have read,
              understood, and agreed to the refund policy, liability waivers, and data
              practices described on this page.
            </div>
          </div>
        </article>

        <article className="public-panel-soft p-5 sm:p-6">
          <p className="public-label">Legal Contact & Grievance</p>
          <h2 className="public-title-section mt-4">Official communication channel</h2>
          <div className="mt-5 space-y-4 text-sm leading-7 text-[#a0a0a0]">
            {legalContacts.map((item) => (
              <div className="border-b border-white/8 pb-4 last:border-b-0 last:pb-0" key={item.label}>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d4af37]">
                  {item.label}
                </p>
                {item.href ? (
                  <a className="mt-2 block text-base font-extrabold text-white hover:text-[#d4af37]" href={item.href}>
                    {item.value}
                  </a>
                ) : (
                  <p className="mt-2 text-base font-extrabold text-white">{item.value}</p>
                )}
              </div>
            ))}
            <p>
              For refund requests, email{' '}
              <a className="font-semibold text-white hover:text-[#d4af37]" href={legalMailTo}>
                {legalEmail}
              </a>{' '}
              using the subject "{refundSubject}" and include your registration details plus the
              bank information listed above.
            </p>
          </div>
        </article>

        <article className="public-panel p-5 sm:p-6">
          <p className="public-label">Disclaimer</p>
          <p className="public-copy mt-5 max-w-5xl">
            By registering for any TriCore event, you confirm that you have read, understood,
            and agreed to all terms, including refund policies, liability waivers, and data
            practices. These terms are enforceable and binding.
          </p>
        </article>
      </section>
    </div>
  );
}
