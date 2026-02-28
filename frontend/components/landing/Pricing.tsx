// frontend/src/components/landing/Pricing.tsx

import Link from "next/link";

const plans = [
  {
    name: "Старт",
    price: "0",
    period: "навсегда",
    description: "Для тех, кто только начинает",
    features: [
      "До 50 записей в месяц",
      "1 сотрудник",
      "Базовая аналитика",
      "Онлайн-запись",
    ],
    cta: "Начать бесплатно",
    href: "/register",
    highlighted: false,
  },
  {
    name: "Бизнес",
    price: "1 990",
    period: "в месяц",
    description: "Для активно растущего бизнеса",
    features: [
      "Неограниченные записи",
      "До 10 сотрудников",
      "Расширенная аналитика",
      "SMS-напоминания",
      "База клиентов",
      "Приоритетная поддержка",
    ],
    cta: "Попробовать 14 дней",
    href: "/register",
    highlighted: true,
  },
  {
    name: "Про",
    price: "4 990",
    period: "в месяц",
    description: "Для сети и франшизы",
    features: [
      "Всё из Бизнеса",
      "Неограниченно сотрудников",
      "Несколько филиалов",
      "API-доступ",
      "Выделенный менеджер",
    ],
    cta: "Связаться с нами",
    href: "/register",
    highlighted: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-stone-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-stone-800 mb-4">
            Понятные цены
          </h2>
          <p className="text-lg text-stone-500">Без скрытых платежей и сюрпризов</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-8 flex flex-col ${
                plan.highlighted
                  ? "bg-amber-500 text-white shadow-xl shadow-amber-200 scale-105"
                  : "bg-white border border-stone-200"
              }`}
            >
              <div className="mb-6">
                <h3
                  className={`text-lg font-bold mb-1 ${
                    plan.highlighted ? "text-white" : "text-stone-800"
                  }`}
                >
                  {plan.name}
                </h3>
                <p
                  className={`text-sm mb-4 ${
                    plan.highlighted ? "text-amber-100" : "text-stone-500"
                  }`}
                >
                  {plan.description}
                </p>
                <div className="flex items-end gap-1">
                  <span
                    className={`text-4xl font-bold ${
                      plan.highlighted ? "text-white" : "text-stone-800"
                    }`}
                  >
                    {plan.price === "0" ? "Бесплатно" : `${plan.price} ₽`}
                  </span>
                  {plan.price !== "0" && (
                    <span
                      className={`text-sm mb-1 ${
                        plan.highlighted ? "text-amber-100" : "text-stone-400"
                      }`}
                    >
                      /{plan.period}
                    </span>
                  )}
                </div>
              </div>

              <ul className="space-y-3 flex-1 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <span
                      className={`text-lg leading-none ${
                        plan.highlighted ? "text-amber-100" : "text-amber-500"
                      }`}
                    >
                      ✓
                    </span>
                    <span
                      className={plan.highlighted ? "text-amber-50" : "text-stone-600"}
                    >
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`text-center font-semibold py-3 px-6 rounded-xl transition ${
                  plan.highlighted
                    ? "bg-white text-amber-600 hover:bg-amber-50"
                    : "bg-amber-500 text-white hover:bg-amber-600"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}