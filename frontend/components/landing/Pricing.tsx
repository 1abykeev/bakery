// frontend/src/components/landing/Pricing.tsx

import Link from "next/link";

const plans = [
  {
    name: "Старт",
    price: "0",
    period: "дайыма",
    description: "Жаңы баштагандар үчүн",
    features: [
      "Айына 50 жазылууга чейин",
      "1 кызматкер",
      "Негизги аналитика",
      "Онлайн-жазылуу",
    ],
    cta: "Бекер баштоо",
    href: "/register",
    highlighted: false,
  },
  {
    name: "Бизнес",
    price: "1 990",
    period: "айына",
    description: "Активдүү өсүп жаткан бизнес үчүн",
    features: [
      "Чексиз жазылуулар",
      "10 кызматкерге чейин",
      "Кеңейтилген аналитика",
      "SMS-эскертмелер",
      "Кардарлар базасы",
      "Артыкчылыктуу колдоо",
    ],
    cta: "14 күн сынап көрүү",
    href: "/register",
    highlighted: true,
  },
  {
    name: "Про",
    price: "4 990",
    period: "айына",
    description: "Тармак жана франшиза үчүн",
    features: [
      "Бизнестин баары",
      "Чексиз кызматкерлер",
      "Бир нече филиал",
      "API-мүмкүнчүлүк",
      "Жеке менеджер",
    ],
    cta: "Биз менен байланышуу",
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
            Түшүнүктүү баалар
          </h2>
          <p className="text-lg text-stone-500">Жашырын төлөмдөр жана сюрприздер жок</p>
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
                    {plan.price === "0" ? "Бекер" : `${plan.price} ₽`}
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