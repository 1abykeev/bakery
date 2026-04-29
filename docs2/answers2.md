# Экинчи документ — Суроолорго жооптор (Кыргызча)

---

## 1. ДОЛБООР ЖӨНҮНДӨ ЖАЛПЫ МААЛЫМАТ

### 1. Долбооруңдун аты эмне?

Долбоордун аты — **NanBar** (НанБар). Башка аталышы жок, система бүтүндөй ушул бренд аты менен колдонулат.

---

### 2. Landing page'дин аты эмне? "Sweetflow" бекер же NanBar? Экөө эки башка нерсеби?

Landing page да **NanBar** деп аталат. "Sweetflow" долбоордо жок — бул долбоор башынан аягына чейин NanBar аты менен бирдиктүү. Жарандык бет (landing page) менен башкаруу панели (dashboard) — бир эле системанын эки бөлүгү.

---

### 3. Системанын кыскача аннотациясы

**NanBar** — кондитердик жана нан-булочна ишканаларына арналган веб-негизиндеги башкаруу системасы. Система ишкана ээсине кызматкерлерди, продукттарды, сатууларды жана чыгымдарды бир жерден башкарууга мүмкүнчүлүк берет. Ар бир ишкана ээси өз маалыматын гана көрөт — маалыматтар толугу менен изоляцияланган. Аналитика модулу аркылуу ишкананын киреше, чыгаша жана таза пайдасын реалдуу убакытта көзөмөлдөөгө болот.

---

### 4. Долбоордун актуалдуулугу

Кыргызстандагы кондитердик ишканалардын басымдуу көпчүлүгү дагы эле кагазга же Excel'ге негизделген эски ыкмалар менен иштейт. Мындай жол менен: сатуу тарыхы жоголот, кызматкерлердин иш убактысы так катталбайт, чыгымдар эсептелбейт, пайда анализи жасалбайт. NanBar бул маселени чечет: бардыгы бир системага бириктирилет, маалыматтар булутта сакталат, жана ишкана ээси каалаган жерден смартфон же компьютер аркылуу кире алат.

---

## 2. МААЛЫМАТ БАЗАСЫ СХЕМАСЫ

### 5. Бардык таблицалар жана алардын полдору

**CustomUser** (`accounts` app)
| Поле | Тип | Сыпаттама |
|---|---|---|
| id | AutoField | Негизги ачкыч |
| email | EmailField (unique) | Логин катары колдонулат |
| first_name | CharField(100) | Аты |
| last_name | CharField(100) | Фамилиясы |
| is_active | BooleanField (default=True) | Аккаунт активдүүбү |
| is_staff | BooleanField (default=False) | Admin кирүү укугу |
| date_joined | DateTimeField (auto) | Катталган убактысы |
| password | (inherited) | Шифрленген сырсөз |

---

**Staff** (`bakery` app)
| Поле | Тип | Сыпаттама |
|---|---|---|
| id | AutoField | Негизги ачкыч |
| owner | ForeignKey → CustomUser | Ишкана ээси |
| name | CharField(100) | Кызматкердин аты |
| phone | CharField(20) | Телефон номери |
| profession | CharField(100) | Кесиби / лавазымы |
| salary_hour | DecimalField(10,2) | Саатына эмгек акы (сом) |
| created_at | DateTimeField (auto) | Кошулган убактысы |

---

**Expense** (`bakery` app) — Чыгаша категориялары
| Поле | Тип | Сыпаттама |
|---|---|---|
| id | AutoField | Негизги ачкыч |
| owner | ForeignKey → CustomUser | Ишкана ээси |
| name | CharField(100) | Чыгашанын аты (мис. "Ун", "Кант") |
| created_at | DateTimeField (auto) | Кошулган убактысы |

*unique_together: ('owner', 'name')*

---

**Product** (`bakery` app)
| Поле | Тип | Сыпаттама |
|---|---|---|
| id | AutoField | Негизги ачкыч |
| owner | ForeignKey → CustomUser | Ишкана ээси |
| name | CharField(100) | Продукттун аты |
| price | DecimalField(10,2) | Сатуу баасы (сом) |
| stock | PositiveIntegerField (default=0) | Склад калдыгы |
| created_at | DateTimeField (auto) | Кошулган убактысы |

---

**ProductExpense** (`bakery` app) — Продуктка чыгаша байланышы
| Поле | Тип | Сыпаттама |
|---|---|---|
| id | AutoField | Негизги ачкыч |
| product | ForeignKey → Product | Кайсы продуктка |
| expense | ForeignKey → Expense | Кайсы чыгаша категориясы |
| cost | DecimalField(10,2) | Бир бирдикке наркы (сом) |

*unique_together: ('product', 'expense')*

---

**WorkLog** (`bakery` app) — Кызматкер иш убактысы
| Поле | Тип | Сыпаттама |
|---|---|---|
| id | AutoField | Негизги ачкыч |
| staff | ForeignKey → Staff | Кайсы кызматкер |
| date | DateField | Иштеген күнү |
| start_time | TimeField | Баштоо убактысы |
| end_time | TimeField | Аяктоо убактысы |
| created_at | DateTimeField (auto) | Жазылган убактысы |
| hours_worked | @property | Эсептелген саат (аракет) |

---

**Sale** (`bakery` app) — Сатуу
| Поле | Тип | Сыпаттама |
|---|---|---|
| id | AutoField | Негизги ачкыч |
| product | ForeignKey → Product | Кайсы продукт |
| quantity | PositiveIntegerField | Канча данасы сатылды |
| total_price | DecimalField(10,2) | Жалпы сатуу суммасы |
| client_name | CharField(100, blank) | Кардардын аты (кошумча) |
| client_phone | CharField(20, blank) | Кардардын телефону (кошумча) |
| sold_at | DateField | Сатылган күнү |
| created_at | DateTimeField (auto) | Жазылган убактысы |

---

**SaleExpenseSnapshot** (`bakery` app) — Сатуу учурундагы чыгаша тарыхы
| Поле | Тип | Сыпаттама |
|---|---|---|
| id | AutoField | Негизги ачкыч |
| sale | ForeignKey → Sale | Кайсы сатуу |
| expense_name | CharField(100) | Чыгашанын аты (тоңдурулган) |
| cost | DecimalField(10,2) | Бир бирдиктин наркы (тоңдурулган) |

---

### 6. ForeignKey байланыштары жана related_name'дер

```
Staff.owner          → CustomUser   (related_name='staff')
Expense.owner        → CustomUser   (related_name='expenses')
Product.owner        → CustomUser   (related_name='products')
ProductExpense.product → Product    (related_name='expenses')
ProductExpense.expense → Expense    (related_name='products')
WorkLog.staff        → Staff        (related_name='work_logs')
Sale.product         → Product      (related_name='sales')
SaleExpenseSnapshot.sale → Sale     (related_name='expense_snapshots')
```

---

### 7. Multi-tenancy кантип ишке ашырылган?

Ар бир ViewSet'тин `get_queryset()` методу override кылынган. Маалымат базасынан маалымат алуудан мурун `request.user` аркылуу чыпкалоо (filtering) жасалат. Мисалдар:

```python
# products/views.py
class ProductViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        return Product.objects.filter(
            owner=self.request.user
        ).prefetch_related('expenses__expense').order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

# staff/views.py
class StaffViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        return Staff.objects.filter(owner=self.request.user).order_by('-created_at')

# work_hours/views.py
class WorkLogViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        qs = WorkLog.objects.filter(
            staff__owner=self.request.user
        ).select_related('staff').order_by('-date', '-created_at')
        staff_id = self.request.query_params.get('staff')
        if staff_id:
            qs = qs.filter(staff_id=staff_id)
        return qs

# sales/views.py
class SaleViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        return Sale.objects.filter(
            product__owner=self.request.user
        ).select_related('product').prefetch_related('expense_snapshots').order_by('-sold_at', '-created_at')
```

Бул ыкма менен бир колдонуучу эч качан башка ишкана ээсинин маалыматтарына кире албайт.

---

### 8. SaleExpenseSnapshot эмне үчүн керек?

**Маселе:** Продукттун чыгаша наркы убакыт өтүп өзгөрүшү мүмкүн. Мисалы, пончиктин бир данасынын ун наркы январь айында 5 сом болсо, февралда 8 сомго чыгышы мүмкүн.

**Мисал:** Январь айында 100 пончик сатылган. Ал кезде ун наркы 5 сом/дана болгон. Эгер snapshot сакталбаса жана февралда наркты 8 сом деп өзгөртсөк, январь айынын аналитикасы да 8 сом деп эсептелет — бул туура эмес.

**Чечим:** Сатуу катталган учурда ошол учурдагы бардык чыгашалардын наркы `SaleExpenseSnapshot` таблицасына тоңдурулуп жазылат. Натыйжада: чыгаша наркы кийин канча өзгөрсө да, өткөн сатуулардын аналитикасы дайыма так бойдон калат.

---

### 9. WorkLog модели: убакыт полдору жана эмгек акы формуласы

WorkLog моделинде `date` + `start_time` + `end_time` форматы колдонулат (`DateField` + `TimeField` × 2). DateTimeField эмес.

**Иштеген саатты эсептөө (property):**
```python
@property
def hours_worked(self):
    from datetime import datetime, date
    start = datetime.combine(date.today(), self.start_time)
    end = datetime.combine(date.today(), self.end_time)
    return round((end - start).seconds / 3600, 2)
```

**Эмгек акы формуласы:**
```
Эмгек акы = hours_worked × staff.salary_hour
```

Мисал: кызматкер 08:00 — 17:00 иштесе → 9 саат × 150 сом/саат = **1 350 сом**.

---

### 10. Sale моделинде product_name барбы?

Жок. `Sale` моделинде `product` — `ForeignKey` (Product моделине байланышкан). Продукттун аты `product.name` аркылуу окулат. Бирок `SaleExpenseSnapshot`'та чыгашанын аты `expense_name` CharField катары тоңдурулуп сакталат.

**Сатуу учурунда SaleExpenseSnapshot кантип жаратылат:**
```python
product_expenses = product.expenses.select_related('expense').all()
snapshots = [
    SaleExpenseSnapshot(
        sale=sale,
        expense_name=pe.expense.name,  # тоңдурулган ат
        cost=pe.cost,                   # тоңдурулган нарк
    )
    for pe in product_expenses
]
SaleExpenseSnapshot.objects.bulk_create(snapshots)
```

Бул операция сатуу жаратылган учурда дароо аткарылат.

---

## 3. АРХИТЕКТУРА ЖАНА API

### 11. Django app структурасы

```
backend/
├── config/
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── accounts/          ← CustomUser модели, аутентификация
│   ├── models.py
│   ├── views.py
│   ├── serializers.py
│   ├── urls.py
│   └── admin.py
├── bakery/            ← Негизги домен моделдери
│   ├── models.py      (Staff, Expense, Product, ProductExpense, WorkLog, Sale, SaleExpenseSnapshot)
│   └── admin.py
├── staff/             ← Кызматкерлерди башкаруу API
│   ├── views.py
│   ├── serializers.py
│   └── urls.py
├── products/          ← Продукттарды жана чыгашаларды башкаруу API
│   ├── views.py
│   ├── serializers.py
│   └── urls.py
├── sales/             ← Сатуу API
│   ├── views.py
│   ├── serializers.py
│   └── urls.py
├── work_hours/        ← Иш убактысын каттоо API
│   ├── views.py
│   ├── serializers.py
│   └── urls.py
├── analytics/         ← Аналитика жана KPI API
│   ├── views.py
│   └── urls.py
├── manage.py
└── requirements.txt
```

---

### 12. Next.js route структурасы

```
frontend/
└── app/
    ├── layout.tsx                   ← Тамыр layout (шрифттер, провайдерлер)
    ├── page.tsx                     ← Landing page
    ├── globals.css
    ├── (auth)/                      ← Auth route group (sidebar жок)
    │   ├── layout.tsx
    │   ├── login/page.tsx
    │   ├── register/page.tsx
    │   └── forgot-password/page.tsx
    └── dashboard/                   ← Корголгон dashboard
        ├── layout.tsx               ← Sidebar менен layout
        ├── page.tsx                 ← Башкы бет (overview)
        ├── staff/page.tsx           ← Кызматкерлер
        ├── products/page.tsx        ← Продукттар
        ├── sales/page.tsx           ← Сатуу
        ├── work-hours/page.tsx      ← Иш убактысы
        ├── clients/page.tsx         ← Кардарлар
        └── analytics/page.tsx       ← Аналитика
```

---

### 13. Бардык API эндпоинттер

**Аутентификация:**
| Метод | URL | Максаты |
|---|---|---|
| POST | `/api/auth/register/` | Жаңы аккаунт жаратуу |
| POST | `/api/auth/login/` | Системага кирүү (JWT алуу) |
| GET | `/api/auth/me/` | Учурдагы колдонуучу маалыматы |
| POST | `/api/auth/token/refresh/` | Access токенди жаңыртуу |
| POST | `/api/auth/forgot-password/` | Сырсөздү калыбына келтирүү (email жөнөтүү) |
| POST | `/api/auth/verify-reset-code/` | 6 орундуу кодду текшерүү |
| POST | `/api/auth/reset-password/` | Жаңы сырсөз коюу |

**Кызматкерлер:**
| Метод | URL | Максаты |
|---|---|---|
| GET | `/api/staff/` | Кызматкерлер тизмеси |
| POST | `/api/staff/` | Жаңы кызматкер кошуу |
| DELETE | `/api/staff/{id}/` | Кызматкерди жок кылуу |

**Продукттар жана чыгашалар:**
| Метод | URL | Максаты |
|---|---|---|
| GET | `/api/products/` | Продукттар тизмеси |
| POST | `/api/products/` | Жаңы продукт кошуу |
| DELETE | `/api/products/{id}/` | Продуктту жок кылуу |
| GET | `/api/products/expenses/` | Чыгаша категориялар тизмеси |
| POST | `/api/products/expenses/` | Жаңы чыгаша категориясы кошуу |
| DELETE | `/api/products/expenses/{id}/` | Чыгаша категориясын жок кылуу |
| POST | `/api/products/{id}/add_expense/` | Продуктка чыгаша байлоо |
| DELETE | `/api/products/{id}/remove_expense/{pe_id}/` | Продукттан чыгашаны алып салуу |
| PATCH | `/api/products/{id}/update_stock/` | Склад калдыгын жаңыртуу |

**Сатуу:**
| Метод | URL | Максаты |
|---|---|---|
| GET | `/api/sales/` | Сатуулар тизмеси |
| POST | `/api/sales/` | Жаңы сатуу каттоо |
| DELETE | `/api/sales/{id}/` | Сатуу жазуусун жок кылуу |
| GET | `/api/sales/clients/` | Кардарлар тизмеси |

**Иш убактысы:**
| Метод | URL | Максаты |
|---|---|---|
| GET | `/api/work-hours/` | Иш убактысы жазуулары |
| POST | `/api/work-hours/` | Жаңы смена каттоо |
| DELETE | `/api/work-hours/{id}/` | Жазууну жок кылуу |

*Query параметри: `?staff={id}` — белгилүү кызматкерди чыпкалоо*

**Аналитика:**
| Метод | URL | Максаты |
|---|---|---|
| GET | `/api/analytics/` | KPI, диаграммалар, статистика |

*Query параметрлери: `?date_from=YYYY-MM-DD&date_to=YYYY-MM-DD`*

---

### 14. Django тарапта кастом уруксат (custom permission) барбы?

`IsOwner` же башка кастом permission класс жок. Маалымат изоляциясы `get_queryset()` override аркылуу аткарылат. Эндпоинттер `IsAuthenticated` же `AllowAny` стандарт DRF класстарын колдонот:

- Auth эндпоинттери (login, register, forgot-password): `AllowAny`
- Башкалардын баары: `IsAuthenticated`

Бул ыкма жөнөкөй жана натыйжалуу — авторизацияланган колдонуучу башка ишкананын маалыматтарына кире албайт, анткени queryset дайыма `filter(owner=request.user)` менен чыпкаланат.

---

### 15. Фронтэнддеги Axios инстанс конфигурациясы

```typescript
// lib/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: ар бир суроого access token кошуу
api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined"
    ? localStorage.getItem("access_token")
    : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: 401 катасында токенди жаңыртуу
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) {
        clearTokens();
        window.location.href = "/login";
        return Promise.reject(error);
      }
      try {
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/token/refresh/`,
          { refresh: refreshToken }
        );
        localStorage.setItem("access_token", data.access);
        original.headers.Authorization = `Bearer ${data.access}`;
        return api(original);
      } catch {
        clearTokens();
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
```

**Логика:** Сурово 401 кодду кайтарса, система refresh токен аркылуу жаңы access токен алат. Эгер refresh токен да жараксыз болсо, колдонуучу login барагына багытталат.

---

### 16. CORS конфигурациясы

`django-cors-headers` пакети колдонулат. `settings.py`'да:

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
CORS_ALLOW_CREDENTIALS = True
```

`CORS_ALLOW_ALL_ORIGINS` эмес — белгилүү Origins гана уруксат берилет. `CORS_ALLOW_CREDENTIALS = True` — cookie жана Authorization header жөнөтүүгө мүмкүнчүлүк берет.

---

### 17. Django settings.py маанилүү конфигурациялар

**INSTALLED_APPS:**
```python
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django_extensions",
    "rest_framework",
    "rest_framework_simplejwt",
    "corsheaders",
    "accounts",
    "bakery",
    "staff",
    "products",
    "sales",
    "work_hours",
    "analytics",
]
```

**REST_FRAMEWORK:**
```python
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.AllowAny",
    ),
}
```

**SIMPLE_JWT:**
```python
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(hours=1),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": False,
    "AUTH_HEADER_TYPES": ("Bearer",),
}
```

**Маанилүү жерлер:**
- Access токен 1 саатка гана жараксыз болот
- Refresh токен 7 күнгө берилет
- Refresh токен колдонгон сайын жаңысы берилет (`ROTATE_REFRESH_TOKENS=True`)

---

## 4. ФРОНТЭНД ЖАНА UI

### 18. Dashboard sidebar навигация пункттары (кыргызча)

```
📊 Башкы бет        /dashboard
👥 Кызматкерлер     /dashboard/staff
🧁 Продукттар       /dashboard/products
⏰ Иш убактысы      /dashboard/work-hours
💰 Сатуу            /dashboard/sales
🧑 Кардарлар        /dashboard/clients
📈 Аналитика        /dashboard/analytics
```

Активдүү пункт amber/сары түс менен белгиленет. Сайдбардын ылдый жагында "Чыгуу" баскычы бар.

---

### 19. Продукт жана кызматкер кошуу формаларынын Zod schema'сы

**Продукт формасы:**
```typescript
const schema = z.object({
  name: z.string().min(1, "Продукттун атын киргизиңиз"),
  price: z.string().min(1, "Баасын киргизиңиз"),
});
```
Полдор: `name` (текст), `price` (сан, сом менен)

**Кызматкер формасы:**
```typescript
const schema = z.object({
  name: z.string().min(1, "Кызматкердин атын киргизиңиз"),
  phone: z.string().min(1, "Телефон номерин киргизиңиз"),
  profession: z.string().min(1, "Кесибин киргизиңиз"),
  salary_hour: z.string().min(1, "Саатына эмгек акысын киргизиңиз"),
});
```
Полдор: `name`, `phone`, `profession`, `salary_hour`

**Аутентификация схемалары (lib/schemas.ts):**
```typescript
// Кирүү
export const loginSchema = z.object({
  email: z.string().email("Туура email киргизиңиз"),
  password: z.string().min(1, "Сырсөздү киргизиңиз"),
});

// Катталуу
export const registerSchema = z.object({
  first_name: z.string().min(1, "Атыңызды киргизиңиз"),
  last_name: z.string().min(1, "Фамилияңызды киргизиңиз"),
  email: z.string().email("Туура email киргизиңиз"),
  password: z.string().min(8, "Кеминде 8 символ"),
  confirm_password: z.string().min(1, "Сырсөздү ырастаңыз"),
}).refine((data) => data.password === data.confirm_password, {
  message: "Сырсөздөр дал келбейт",
  path: ["confirm_password"],
});

// Сырсөз калыбына келтирүү — код текшерүү
export const forgotPasswordCodeSchema = z.object({
  code: z.string()
    .length(6, "Код 6 орундан турушу керек")
    .regex(/^\d+$/, "Сандар гана"),
});
```

---

### 20. Дата/убакыт тандоо пакети

**Пакет:** `react-datepicker`

**Колдонуу мисалы (сатуу формасында):**
```typescript
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

<DatePicker
  selected={soldAt}
  onChange={(date) => setSoldAt(date)}
  maxDate={new Date()}        // Болочок дата тандоого болбойт
  dateFormat="yyyy-MM-dd"
  placeholderText="Датаны тандаңыз"
/>
```

Аналитика барагында дата диапазонун тандоо үчүн да `react-datepicker` колдонулат.

---

### 21. Аналитика барагындагы маалыматтар жана диаграммалар

**Диаграмма китепканасы:** `Recharts` (BarChart, PieChart/Donut)

**KPI карточкалары (4 колонка):**
1. **Жалпы киреше** — бардык сатуулардын суммасы
2. **Өндүрүш наркы** — expense snapshot'тардан эсептелген
3. **Эмгек акы** — иш убактысы × саатына эмгек акы
4. **Таза пайда** — Киреше − Өндүрүш наркы − Эмгек акы

**Кошумча статистика:**
- Жалпы транзакция саны
- Уникалдуу кардарлар саны

**Диаграммалар:**
1. **Күнүмдүк киреше** (Bar chart) — X огунда күн, Y огунда сом
2. **Эң көп сатылган продукттар** (Тизме) — Атрибуттары: продукт аты, саны, кирешеси
3. **Киреше бөлүштүрүлүшү** (Donut/Pie chart) — Өндүрүш наркы, эмгек акы жана таза пайданын пайыздары
4. **Ингредиент чыгымдары** (Bar chart) — Чыгаша категориялары боюнча топтоштурулган
5. **Кызматкерлердин эмгек акысы** (Таблица) — Аты, саатына акысы, иштеген саат, жалпы эмгек акы

**Дата диапазону:**
- Алдын ала баскычтар: "Бүгүн", "Жума", "Ай", "Баары"
- Колдонуучу тарабынан тандалган диапазон

---

### 22. Landing page бөлүмдөрү

1. **Navbar** — Логотип, навигация шилтемелери, "Кирүү" жана "Катталуу" баскычтары
2. **Hero** — Башкы аталыш (градиент текст менен), кыскача сыпаттама, CTA баскычтары ("Баштоо", "Толук маалымат")
3. **Features** — 6 функция картасы (grid макет):
   - Онлайн-жазылуу
   - Кызматкерлерди башкаруу
   - Аналитика жана киреше
   - Кардарлар базасы
   - Эскертмелер
   - Каалаган жерден кирүү мүмкүнчүлүгү
4. **Pricing** — Баа планы бөлүмү
5. **Testimonials** — Колдонуучулардын пикирлери
6. **Footer** — Байланыш маалымат жана шилтемелер

---

### 23. Продукт формасынын полдору

**ProductAddModal.tsx** формасында:

| Поле | Тип | Талаптар |
|---|---|---|
| name | Текст input | Милдеттүү, мисал: "Пончик, Торт, Нан" |
| price | Сан input | Милдеттүү, min=0, step=0.01, суффикс "сом" |

Форма жөнөкөй — 2 поле гана. Продуктка чыгашаларды байлоо өзүнчө `AddExpenseToProductModal` аркылуу аткарылат.

---

### 24. Сатуу катталганда кандай форма чыгат?

**SellModal.tsx** формасында:

| Поле | Тип | Талаптар |
|---|---|---|
| quantity | Сан input | Милдеттүү, min=1, max=product.stock |
| sold_at | DatePicker | Милдеттүү, max=бүгүн |
| client_name | Текст input | Кошумча (optional) |
| client_phone | Текст input | Кошумча, мисал "+996 700 000 000" |

**Live Preview:** Форманы толтурган сайын:
- Учурдагы склад калдыгы
- Бир данасынын баасы
- Жалпы сатуу суммасы (price × quantity)
- Болжолдуу пайда (price − чыгашалар наркы) × quantity

Кардардын аты жана телефону милдеттүү эмес — кардарсыз сатуу да катталат.

---

## 5. МОДУЛДАРДЫН ИШ ЛОГИКАСЫ

### 25. Кызматкер сменасын каттоо процесси (кадам-кадам)

**1-кадам — Колдонуучу:**
- Dashboard → "Иш убактысы" барагына өтөт
- "Смена кошуу" баскычын басат
- Формада: кызматкерди тандайт, күндү, башталуу жана бүтүүчү убакытты киргизет

**2-кадам — Фронтэнд:**
```typescript
// WorkHoursModal.tsx → api.ts аркылуу
await api.post("/work-hours/", {
  staff: staffId,
  date: "2024-01-15",
  start_time: "08:00",
  end_time: "17:00",
});
```

**3-кадам — Бэкэнд (Django):**
- `WorkLogViewSet.create()` иштейт
- `perform_create()`: `staff__owner=request.user` аркылуу кызматкердин ишкана ээсине тиешелүүлүгү текшерилет
- WorkLog объекти маалымат базасына жазылат

**4-кадам — Маалымат базасы:**
```
WorkLog жазуусу:
  - staff_id: 5
  - date: 2024-01-15
  - start_time: 08:00:00
  - end_time: 17:00:00
  → hours_worked (property): (17-8) = 9.0 саат
```

---

### 26. Сатуу катталганда (Sale create) бэкэнддеги процесс

```python
# sales/views.py — SaleViewSet.create()

def create(self, request, *args, **kwargs):
    # 1. Сериализатор текшерүү
    serializer = self.get_serializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    product = serializer.validated_data['product']
    quantity = serializer.validated_data['quantity']

    # 2. Склад текшерүү
    if product.stock < quantity:
        return Response(
            {'detail': f'Складта жетишсиз. Учурда {product.stock} дана бар.'},
            status=400
        )

    # 3. Жалпы сумманы эсептөө жана Sale жаратуу
    total_price = product.price * quantity
    sale = Sale.objects.create(
        product=product,
        quantity=quantity,
        total_price=total_price,
        client_name=serializer.validated_data.get('client_name', ''),
        client_phone=serializer.validated_data.get('client_phone', ''),
        sold_at=serializer.validated_data['sold_at'],
    )

    # 4. SaleExpenseSnapshot'тарды жаратуу (чыгашаларды тоңдуруу)
    product_expenses = product.expenses.select_related('expense').all()
    snapshots = [
        SaleExpenseSnapshot(
            sale=sale,
            expense_name=pe.expense.name,
            cost=pe.cost,
        )
        for pe in product_expenses
    ]
    SaleExpenseSnapshot.objects.bulk_create(snapshots)

    # 5. Склад азайтуу
    product.stock -= quantity
    product.save()

    return Response(SaleSerializer(sale).data, status=201)
```

**Кадамдар:**
1. Суроо валидациясы
2. Склад жетиштүүлүгүн текшерүү
3. Сатуу жаратуу
4. Чыгашаларды тоңдурган snapshot'тарды bulk жаратуу
5. Складтан азайтуу

---

### 27. Эмгек акы эсептөө

**Ай ичиндеги жалпы сааттарды жыйноо:**
```python
# analytics/views.py
worklogs_qs = WorkLog.objects.filter(
    staff__owner=request.user,
    date__range=(date_from, date_to)
).select_related('staff')

salary_cost = sum(
    log.hours_worked * float(log.staff.salary_hour)
    for log in worklogs_qs
)
```

**Кызматкер боюнча бөлүштүрүү:**
```python
staff_map = {}
for log in worklogs_qs:
    sid = log.staff_id
    if sid not in staff_map:
        staff_map[sid] = {
            'name': log.staff.name,
            'salary_hour': float(log.staff.salary_hour),
            'hours': 0.0,
            'salary': 0.0,
        }
    staff_map[sid]['hours'] += log.hours_worked
    staff_map[sid]['salary'] += log.hours_worked * float(log.staff.salary_hour)
```

**API эндпоинт:** `GET /api/analytics/?date_from=2024-01-01&date_to=2024-01-31`

Жооп ичинде `staff_salary_breakdown` тизме катары кайтарылат.

---

### 28. Продукт нарктары өзгөргөндө эмне болот?

**Ишке ашыруу:** `PATCH /api/products/{id}/update_stock/` же продукт update'те `price` жаңыртылат.

**Эски сатуулар бузулабы?** — **Жок.** Анткени `SaleExpenseSnapshot` таблицасы ар бир сатуу учурунда чыгаша нарктарын тоңдурат. Продукттун `price` же `ProductExpense.cost` өзгөрсө:
- Жаңы сатуулар жаңы нарк менен аналитикада чагылдырылат
- Эски сатуулардын snapshot'тары өзгөрбөйт — алардын аналитикасы так бойдон калат

Бул — **тарыхый так аналитика** принциби.

---

### 29. Аналитика маалыматтары кантип эсептелет?

**Django ORM aggregates колдонуу:**
```python
from django.db.models import Sum

# Жалпы киреше
revenue = Sale.objects.filter(
    product__owner=request.user,
    sold_at__range=(date_from, date_to)
).aggregate(total=Sum('total_price'))['total'] or 0

# Күнүмдүк киреше (annotate)
daily_revenue = sales_qs.values('sold_at').annotate(
    revenue=Sum('total_price')
).order_by('sold_at')

# Эң популяр продукттар (annotate + order)
top_products = sales_qs.values('product__name').annotate(
    units_sold=Sum('quantity'),
    revenue=Sum('total_price'),
).order_by('-units_sold')[:10]

# Уникалдуу кардарлар
unique_clients = sales_qs.exclude(
    client_name='', client_phone=''
).values('client_phone', 'client_name').distinct().count()
```

Өндүрүш наркы жана эмгек акы эсептөөлөрү Python loop аркылуу жасалат (prefetch_related оптимизациясы менен).

---

## 6. ӨЗГӨЧӨЛҮКТӨР ЖАНА КЫЙЫНЧЫЛЫКТАР

### 30. Эң кыйын техникалык маселе

**Маселе:** SaleExpenseSnapshot архитектурасын туура долбоорлоо — тарыхый маалыматтарды бузбай сактоо. Эгер snapshot механизми жок болсо, продукт нарктарын өзгөртүү мурунку аналитиканы бузат.

**Чечим:** Сатуу жаратылган ордо `bulk_create` аркылуу бардык чыгаша нарктары "тоңдурулат". Бул маалымат базасына N кошумча жазуу кошот, бирок аналитиканын туруктуулугун камсыздайт.

Дагы бир кыйынчылык — multi-tenancy: ар бир queryset'ти `owner=request.user` менен чыпкалоону унутпоо. Буга кошумча, тереңдеги байланыштар (WorkLog → Staff → owner) аркылуу чыпкалоо да туура ишке ашырылышы керек болду.

---

### 31. Маалымат изоляциясы тестирленгенби?

Ооба. Тестирлөө ыкмасы:
1. Эки башка аккаунт жаратылат
2. Ар биринде башка-башка продукттар, кызматкерлер, сатуулар кошулат
3. Бирүүчү аккаунт менен кирип, башкасынын маалыматтарына API аркылуу кирүүгө аракет жасалат — 404 же бош тизме кайтарылат

**SaleExpenseSnapshot текшерүү:**
1. Продукт жаратылат, чыгашасы 10 сом деп коюлат
2. Сатуу катталат → snapshot 10 сом деп сакталат
3. Чыгаша наркы 20 сомго өзгөртүлөт
4. Аналитика текшерилет → эски сатуу дагы эле 10 сом менен эсептелет ✓

---

### 32. Толук ишке ашырылбаган же болочокто кошулуучу функциялар

- **Эскертмелер системасы** — Landing page'де жарнамаланат, бирок азырынча ишке ашырылган эмес
- **Email/SMS аркылуу билдирмелер** — кардарларга же ишкана ээсине
- **Мобилдик колдонмо** — азырынча веб-гана
- **Продукт сүрөтү** — продуктка сүрөт кошуу функциясы жок
- **Инвентаризация отчету** — склад калдыктары боюнча толук отчет
- **Кызматкерлерге жеке кабинет** — азыр ишкана ээси гана кирет

---

### 33. Django admin панели

Бардык моделдер admin панелинде катталган:

**accounts/admin.py:**
- `CustomUserAdmin` — list_display: email, first_name, last_name, is_staff, is_active

**bakery/admin.py:**
- `StaffAdmin` — list_display: id, name, phone, profession, salary_hour, owner, created_at
- `ExpenseAdmin` — list_display: id, name, owner, created_at
- `ProductAdmin` — list_display: id, name, price, stock, owner, created_at
- `ProductExpenseAdmin` — list_display: id, product, expense, cost
- `WorkLogAdmin` — list_display: id, staff, date, start_time, end_time, hours_worked
- `SaleAdmin` — list_display: id, product, quantity, total_price, client_name, sold_at
- `SaleExpenseSnapshotAdmin` — list_display: id, sale, expense_name, cost

Admin URL: `http://localhost:8000/admin/`

---

### 34. Environment variables

**Backend `.env` файлындагы өзгөрмөлөр (маанисиз, аттары гана):**
```
SECRET_KEY
DEBUG
ALLOWED_HOSTS
DATABASE_NAME
DATABASE_USER
DATABASE_PASSWORD
DATABASE_HOST
DATABASE_PORT
DJANGO_SUPERUSER_EMAIL
DJANGO_SUPERUSER_PASSWORD
DJANGO_SUPERUSER_NAME
```

**Frontend `.env.local` файлы:**
```
NEXT_PUBLIC_API_URL
```

---

### 35. Долбоорду жергиликтүү иштетүү кадамдары

**Талаптар:**
- Python 3.13+
- Node.js 22+
- PostgreSQL 15+

---

**Backend setup:**
```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

# .env файл жаратуу
cp .env.example .env
# .env ичинде маалымат базасы маалыматтарын толтуруу

python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Backend: `http://localhost:8000`

---

**Frontend setup:**
```bash
cd frontend
npm install

# .env.local файл жаратуу
echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api" > .env.local

npm run dev
```

Frontend: `http://localhost:3000`

---

**Docker аркылуу (бир буйрук менен):**
```bash
git clone <repo_url>
cd bakery
cp .env.example .env
docker compose up --build
```

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`
- Admin: `http://localhost:8000/admin`

---

## 7. СКРИНШОТТОР ҮЧҮН МААЛЫМАТ

### 36. Landing page'де эмне көрүнөт?

Landing page — NanBar системасын тааныштыруу барагы. Башкы (Hero) бөлүмдө ири аталыш жана CTA баскычтары бар. Андан кийин Features бөлүмү 6 функция картасы менен, Pricing бөлүмү баа планы менен, Testimonials бөлүмү колдонуучулардын пикири менен, Footer байланыш жана шилтемелер менен аяктайт. Сайт кыргыз тилинде.

*(Скриншот тиркөөнү сиз өзүңүз аткарыңыз)*

---

### 37. Dashboard башкы бетинде эмне көрүнөт?

Dashboard башкы бетинде KPI карточкалар бар:
- Жалпы кызматкерлер саны
- Жалпы продукттар саны
- Жалпы сатуулар саны (бул айда)
- Жалпы киреше (бул айда)

Sidebar'да навигация пункттары тизмеленген (Башкы бет, Кызматкерлер, Продукттар, Иш убактысы, Сатуу, Кардарлар, Аналитика).

*(Скриншот тиркөөнү сиз өзүңүз аткарыңыз)*

---

### 38. Кызматкерлер баракчасы

**Таблица колонкалары:**
| № | Аты | Кесиби | Телефону | Саатына акы | Иш-аракет |
|---|---|---|---|---|---|

Ар бир сапта "Жок кылуу" баскычы бар. Жогору жагында "Кызматкер кошуу" баскычы менен кызматкер кошуу модал терезеси ачылат.

---

### 39. Продукттар баракчасы

**Таблица / карточкалар колонкалары:**
| Продуктун аты | Баасы | Склад калдыгы | Чыгашалары | Иш-аракет |
|---|---|---|---|---|

Ар бир продукт боюнча: чыгашаларды кошуу/алып салуу, склад жаңыртуу, жок кылуу.

---

### 40. Сатуу баракчасы

**Таблица колонкалары:**
| Дата | Продукт | Саны | Жалпы сумма | Кардар аты | Кардар телефону | Иш-аракет |
|---|---|---|---|---|---|---|

Жогору жагында "Сатуу каттоо" баскычы. Ар бир жазуунун жанында "Жок кылуу" баскычы бар.

---

*Документ NanBar долбоорунун коду негизинде автоматтык түрдө түзүлгөн. Бардык техникалык деталдар Django жана Next.js булак кодунан алынган.*
