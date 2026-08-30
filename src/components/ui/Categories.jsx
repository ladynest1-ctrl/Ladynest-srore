const categories = ["Crossbody", "Women", "Office", "3 Piece bags", "Wallets"];

export default function Categories() {
  return (
    <div className="flex gap-4 flex-wrap mb-8">
      {categories.map((cat) => (
        <button
          key={cat}
          className="border border-yellow-600 px-4 py-2 text-sm hover:bg-yellow-600 hover:text-black"
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
