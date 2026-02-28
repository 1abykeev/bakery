// frontend/src/components/landing/Testimonials.tsx

const testimonials = [
  {
    name: "Анна Смирнова",
    role: "Владелица салона красоты, Москва",
    avatar: "АС",
    text: "Раньше я вела записи в блокноте и теряла клиентов. Теперь всё автоматически — клиенты сами записываются, я просто работаю.",
  },
  {
    name: "Дмитрий Козлов",
    role: "Барбер, Санкт-Петербург",
    avatar: "ДК",
    text: "Простой интерфейс, всё интуитивно понятно. Настроил за 20 минут и сразу начал принимать онлайн-записи. Рекомендую всем мастерам.",
  },
  {
    name: "Елена Петрова",
    role: "Владелица кондитерской, Казань",
    avatar: "ЕП",
    text: "Наконец-то нормальная система для пекарни. Заказы, сотрудники, аналитика — всё в одном месте. Экономлю минимум 2 часа в день.",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-stone-800 mb-4">
            Что говорят клиенты
          </h2>
          <p className="text-lg text-stone-500">Реальные истории реальных предпринимателей</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-amber-50 border border-amber-100 rounded-2xl p-6"
            >
              <p className="text-stone-700 leading-relaxed mb-6 text-sm">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-200 text-amber-700 font-bold flex items-center justify-center text-sm flex-shrink-0">
                  {t.avatar}
                </div>
                <div>
                  <p className="font-semibold text-stone-800 text-sm">{t.name}</p>
                  <p className="text-stone-400 text-xs">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}