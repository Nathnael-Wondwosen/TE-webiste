const categories = [
  { name: 'Coffee', icon: '☕' },
  { name: 'Leather', icon: '👜' },
  { name: 'Spices', icon: '🌶️' },
  { name: 'Gemstones', icon: '💎' },
  { name: 'Honey', icon: '🍯' },
  { name: 'Ceramics', icon: '🏺' },
  { name: 'Textiles', icon: '🧵' },
  { name: 'Livestock & Dairy', icon: '🐄' },
  { name: 'Agro-processing', icon: '🌾' },
  { name: 'Handicrafts', icon: '工艺品' },
  { name: 'Green Energy Products', icon: '🔋' },
];

function SidebarCategories({ onSelect, selectedCategory }) {
  return (
    <aside className="rounded-2xl p-4 border border-slate-200 shadow-lg bg-gradient-to-b from-white via-slate-50 to-slate-100">
      <h3 className="font-semibold text-lg mb-4 text-[#0f3d2e]">
        Business Directory
      </h3>
      <div className="flex flex-col gap-3">
        {categories.map((categoryObj) => (
          <button
            key={categoryObj.name}
            onClick={() => onSelect?.(categoryObj.name)}
            className={`flex items-center justify-between gap-3 px-3 py-2 rounded-xl text-sm font-medium ${
              selectedCategory === categoryObj.name
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-slate-100 text-slate-700 hover:bg-emerald-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{categoryObj.icon}</span>
              <span>{categoryObj.name}</span>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
}

export default SidebarCategories;
