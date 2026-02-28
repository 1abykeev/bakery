// frontend/src/components/landing/Features.tsx

const features = [
  {
    icon: "📅",
    title: "Онлайн-запись",
    description:
      "Принимайте записи от клиентов 24/7 без звонков и напоминаний. Автоматические уведомления берут всё на себя.",
  },
  {
    icon: "💼",
    title: "Управление персоналом",
    description:
      "Расписание, смены и задачи сотрудников в одном удобном интерфейсе. Никаких таблиц и мессенджеров.",
  },
  {
    icon: "📊",
    title: "Аналитика и выручка",
    description:
      "Следите за доходами, загруженностью и популярными услугами в реальном времени прямо с телефона.",
  },
  {
    icon: "👥",
    title: "База клиентов",
    description:
      "Храните историю посещений, предпочтения и контакты каждого клиента. Возвращайте их снова и снова.",
  },
  {
    icon: "🔔",
    title: "Напоминания",
    description:
      "Автоматические SMS и push-уведомления снижают количество пропущенных визитов до минимума.",
  },
  {
    icon: "📱",
    title: "Работает везде",
    description:
      "Полноценный доступ с телефона, планшета и компьютера. Управляйте бизнесом из любой точки.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-stone-800 mb-4">
            Всё, что нужно для работы
          </h2>
          <p className="text-lg text-stone-500 max-w-xl mx-auto">
            Инструменты, которые реально используются каждый день
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