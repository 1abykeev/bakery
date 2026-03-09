// frontend/src/components/landing/Features.tsx

const features = [
  {
    icon: "📅",
    title: "Онлайн-жазылуу",
    description:
      "Кардарлардан жазылууларды 24/7 чалуусуз жана эскертүүсүз кабыл алыңыз. Автоматтык билдирмелер баарын өз мойнуна алат.",
  },
  {
    icon: "💼",
    title: "Кызматкерлерди башкаруу",
    description:
      "Кызматкерлердин иш графиги, сменасы жана тапшырмалары бир ыңгайлуу интерфейсте. Таблицалар жана мессенджерлер жок.",
  },
  {
    icon: "📊",
    title: "Аналитика жана киреше",
    description:
      "Кирешелерди, жүктөмдү жана популярдуу кызматтарды реалдуу убакытта түздөн-түз телефондон байкаңыз.",
  },
  {
    icon: "👥",
    title: "Кардарлар базасы",
    description:
      "Ар бир кардардын баруу тарыхын, артыкчылыктарын жана байланыш маалыматтарын сактаңыз. Аларды кайра-кайра кайтарыңыз.",
  },
  {
    icon: "🔔",
    title: "Эскертмелер",
    description:
      "Автоматтык SMS жана push-билдирмелер өткөрүп жиберилген визиттердин санын минималдуу деңгээлге чейин азайтат.",
  },
  {
    icon: "📱",
    title: "Каалаган жерден иштейт",
    description:
      "Телефондон, планшеттен жана компьютерден толук кирүү мүмкүнчүлүгү. Бизнесиңизди каалаган жерден башкарыңыз.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-stone-800 mb-4">
            Иш үчүн керектүүнүн баары
          </h2>
          <p className="text-lg text-stone-500 max-w-xl mx-auto">
            Күн сайын чындап колдонулган куралдар
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-amber-50/60 hover:bg-amber-50 border border-amber-100 rounded-2xl p-6 transition group"
            >
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-lg font-bold text-stone-800 mb-2">{f.title}</h3>
              <p className="text-stone-500 text-sm leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}