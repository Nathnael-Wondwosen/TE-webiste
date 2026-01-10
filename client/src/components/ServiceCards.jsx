import img1 from '../assets/1.png';
import img2 from '../assets/2.png';
import img3 from '../assets/3.png';
import img5 from '../assets/5.png';
import img7 from '../assets/7.png';
import img8 from '../assets/8.png';
import img9 from '../assets/9.png';
import img10 from '../assets/10.png';
import img11 from '../assets/11.png';

const cards = [
  {
    title: 'Adverts & Promotions',
    description: 'Highlight your listings on TradeEthiopia channels.',
    gradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.92), rgba(217, 119, 6, 0.85), rgba(180, 83, 9, 0.78))',
    badge: 'AD',
    image: img1,
  },
  {
    title: 'Import-Export Opportunities',
    description: 'Find responsive buyers and suppliers.',
    gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.92), rgba(5, 150, 105, 0.85), rgba(6, 95, 70, 0.78))',
    badge: 'IE',
    image: img2,
  },
  {
    title: 'Shipping & Logistics Agents',
    description: 'Partner with vetted logistics teams.',
    gradient: 'linear-gradient(135deg, rgba(56, 189, 248, 0.92), rgba(2, 132, 199, 0.85), rgba(7, 89, 133, 0.78))',
    badge: 'SL',
    image: img3,
  },
  {
    title: 'Local B2B Marketplace',
    description: 'Connect with Ethiopian manufacturers.',
    gradient: 'linear-gradient(135deg, rgba(163, 230, 53, 0.9), rgba(101, 163, 13, 0.85), rgba(63, 98, 18, 0.78))',
    badge: 'LB',
    image: img5,
  },
  {
    title: 'International B2B Marketplace',
    description: 'Expand across borders with verified partners.',
    gradient: 'linear-gradient(135deg, rgba(251, 146, 60, 0.92), rgba(234, 88, 12, 0.85), rgba(194, 65, 12, 0.78))',
    badge: 'IB',
    image: img7,
  },
  {
    title: 'Verified Brokers & Agents',
    description: 'Find trusted brokers for every trade lane.',
    gradient: 'linear-gradient(135deg, rgba(4, 120, 87, 0.92), rgba(5, 150, 105, 0.85), rgba(6, 78, 59, 0.78))',
    badge: 'VB',
    image: img8,
  },
  {
    title: 'Banks & Financial Institutions',
    description: 'Access trade finance and letters of credit.',
    gradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.92), rgba(37, 99, 235, 0.85), rgba(30, 64, 175, 0.78))',
    badge: 'BF',
    image: img9,
  },
  {
    title: 'Insurance Companies',
    description: 'Protect shipments with reliable insurers.',
    gradient: 'linear-gradient(135deg, rgba(20, 184, 166, 0.92), rgba(13, 148, 136, 0.85), rgba(15, 118, 110, 0.78))',
    badge: 'IC',
    image: img10,
  },
  {
    title: 'Ports & Customs Directory',
    description: 'Navigate regulations with specialist directors.',
    gradient: 'linear-gradient(135deg, rgba(248, 113, 113, 0.92), rgba(239, 68, 68, 0.85), rgba(185, 28, 28, 0.78))',
    badge: 'PC',
    image: img11,
  },
];

function ServiceCards() {
  return (
    <section className="rounded-3xl bg-gradient-to-br from-[#0f3d2e] via-[#134a36] to-[#0b2f23] p-4 shadow-xl border border-emerald-900/40">
      <div className="overflow-x-auto pb-3 -mx-4 px-4">
        <div className="flex gap-3 min-w-max md:min-w-0 md:grid md:grid-cols-3 md:gap-3 md:w-full">
          {cards.map((card) => (
            <article
              key={card.title}
              className="flex-shrink-0 w-56 rounded-2xl shadow-lg border border-white/10 p-3 text-white bg-cover bg-center min-h-[120px] md:w-auto md:min-h-[140px]"
              style={{
                backgroundImage: `${card.gradient}, url(${card.image})`,
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[0.6rem] uppercase tracking-[0.2em] text-white/80">
                  Service
                </span>
                <span className="h-6 w-6 rounded-full bg-white/90 text-[0.6rem] font-semibold flex items-center justify-center text-[#0f3d2e]">
                  {card.badge}
                </span>
              </div>
              <h3 className="font-semibold text-xs md:text-sm mt-1 md:mt-2">{card.title}</h3>
              <p className="text-[0.6rem] md:text-xs text-white/90 mt-0.5 md:mt-1">{card.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ServiceCards;
