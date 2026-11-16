'use strict';

/* =========================================================
   PyPath — скрипты
   1. Утилиты        2. Данные (уроки, тесты, примеры…)
   3. Подсветка кода 4. Интерфейс (тема, меню, анимации)
   5. Уроки          6. Песочница (настоящий Python)
   7. Викторина      8. Шпаргалка и идеи   9. Запуск
   ========================================================= */

/* ---------- 1. Утилиты ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const store = {
  get(key, fallback) {
    try {
      const v = localStorage.getItem('pypath:' + key);
      return v === null ? fallback : JSON.parse(v);
    } catch (e) {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem('pypath:' + key, JSON.stringify(value));
    } catch (e) {
      /* хранилище недоступно — не страшно */
    }
  },
};

let toastTimer;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (e) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (err) { /* ничего */ }
    ta.remove();
  }
  toast('Скопировано ✓');
}

function confetti() {
  if (reduceMotion) return;
  const c = $('#confetti');
  const ctx = c.getContext('2d');
  c.width = window.innerWidth;
  c.height = window.innerHeight;
  c.style.display = 'block';
  const colors = ['#ffd43b', '#4b8bbe', '#4ade80', '#f472b6', '#ffffff'];
  const parts = Array.from({ length: 140 }, () => ({
    x: Math.random() * c.width,
    y: -20 - Math.random() * c.height * 0.5,
    w: 6 + Math.random() * 6,
    h: 8 + Math.random() * 8,
    vx: (Math.random() - 0.5) * 3,
    vy: 2 + Math.random() * 4,
    rot: Math.random() * 6,
    vr: (Math.random() - 0.5) * 0.3,
    col: colors[Math.floor(Math.random() * colors.length)],
  }));
  let frames = 0;
  (function tick() {
    ctx.clearRect(0, 0, c.width, c.height);
    parts.forEach((p) => {
      p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.col;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });
    frames++;
    if (frames < 220) requestAnimationFrame(tick);
    else { ctx.clearRect(0, 0, c.width, c.height); c.style.display = 'none'; }
  })();
}

/* ---------- 2. Данные ---------- */
const HERO_CODE = `def greet(name):
    return f"Привет, {name}! 🐍"

for who in ["мир", "конкурс", "Python"]:
    print(greet(who))`;

const HERO_OUT = ['Привет, мир! 🐍', 'Привет, конкурс! 🐍', 'Привет, Python! 🐍'];

const WHY = [
  { icon: '🌐', title: 'Сайты и сервисы', text: 'Python работает «за кулисами» многих сайтов: принимает запросы, хранит данные и отвечает пользователям.', tags: ['Django', 'Flask'] },
  { icon: '🤖', title: 'ИИ и нейросети', text: 'Главный язык машинного обучения: на нём создают модели, которые распознают фото и пишут тексты.', tags: ['PyTorch', 'TensorFlow'] },
  { icon: '📊', title: 'Наука и данные', text: 'Учёные и аналитики обрабатывают таблицы, строят графики и находят закономерности в данных.', tags: ['pandas', 'Matplotlib', 'NumPy'] },
  { icon: '🎮', title: 'Игры', text: 'На Python можно сделать свою первую игру — от «Змейки» до платформера.', tags: ['Pygame'] },
  { icon: '💬', title: 'Боты и автоматизация', text: 'Бот для Telegram, который напоминает о домашке, или скрипт, который сам переименует сотни файлов.', tags: ['aiogram', 'requests'] },
  { icon: '🌱', title: 'Первый язык для новичка', text: 'Простой синтаксис, почти как английский текст: меньше лишних символов — больше мыслей.', tags: ['читаемый', 'понятный'] },
];

const FACTS = [
  'Python создал Гвидо ван Россум. Первая версия языка вышла в 1991 году.',
  'Язык назван не в честь змеи, а в честь британского комик-шоу «Монти Пайтон».',
  'В Python отступы — часть синтаксиса: они показывают, какие строки относятся к блоку.',
  'Если написать import this, Python выведет «Дзен Python» — набор принципов языка. Это пасхалка.',
  'Команда import antigravity открывает в браузере комикс xkcd про полёты на Python.',
  'Python входит в число самых популярных языков программирования в мире.',
];

const ZEN = [
  'Красивое лучше, чем уродливое.',
  'Явное лучше, чем неявное.',
  'Простое лучше, чем сложное.',
  'Читаемость имеет значение.',
  'Ошибки никогда не должны замалчиваться.',
  'Сейчас лучше, чем никогда.',
  'Если реализацию сложно объяснить — идея плоха.',
];

const LESSONS = [
  {
    id: 'hello', icon: '👋', title: 'Первая программа', time: '5 минут',
    intro: 'Любое путешествие начинается с первого шага. В Python это команда, которая что-то показывает на экране.',
    points: [
      '<code>print()</code> выводит текст или число на экран.',
      'Текст пишут в кавычках, числа — без кавычек (их можно складывать и умножать).',
      'Всё после <code>#</code> — комментарий: Python его пропускает, он нужен людям.',
    ],
    code: `# Это комментарий — Python его игнорирует
print("Привет, мир!")
print("Меня зовут Python")
print(2 + 3)`,
    task: 'Выведи на экран два предложения: своё имя и свой возраст.',
    hint: 'Используй две команды print(), по одной на каждую строку.',
  },
  {
    id: 'vars', icon: '📦', title: 'Переменные и типы', time: '7 минут',
    intro: 'Переменная — это коробка с названием, в которой хранится значение. Так программа «запоминает» данные.',
    points: [
      'Создаём переменную знаком <code>=</code>: <code>age = 14</code>.',
      'Основные типы: <code>int</code> (целое), <code>float</code> (дробное), <code>str</code> (текст), <code>bool</code> (да/нет).',
      'f-строка <code>f"...{имя}..."</code> подставляет значения переменных прямо в текст.',
    ],
    code: `name = "Аня"
age = 14
height = 1.62
is_student = True

print(f"{name}, {age} лет")
print(type(height))
print(age + 1)`,
    task: 'Создай переменные с названием любимого предмета и оценкой по нему, затем выведи фразу с помощью f-строки.',
    hint: 'subject = "информатика", mark = 5, затем print(f"{subject}: {mark}").',
  },
  {
    id: 'if', icon: '🔀', title: 'Условия', time: '8 минут',
    intro: 'Программа умеет принимать решения: если выполняется одно условие — делает одно, иначе — другое.',
    points: [
      '<code>if</code> — «если», <code>elif</code> — «а если», <code>else</code> — «иначе».',
      'После условия ставится двоеточие, а внутри блока — отступ в 4 пробела.',
      'Сравнивать можно так: <code>==</code>, <code>!=</code>, <code>&lt;</code>, <code>&gt;</code>, <code>&lt;=</code>, <code>&gt;=</code>.',
    ],
    code: `temperature = 5

if temperature < 0:
    print("Мороз! Надень шапку ❄")
elif temperature < 15:
    print("Прохладно, нужна куртка")
else:
    print("Тепло, можно в футболке ☀")`,
    task: 'Задай число и выведи «чётное» или «нечётное».',
    hint: 'Остаток от деления на 2 даёт оператор %: если number % 2 == 0, число чётное.',
  },
  {
    id: 'loops', icon: '🔁', title: 'Циклы', time: '8 минут',
    intro: 'Цикл повторяет действия, чтобы тебе не пришлось копировать одну и ту же строку сто раз.',
    points: [
      '<code>for</code> повторяет действие для каждого значения: <code>range(1, 6)</code> даёт числа от 1 до 5.',
      '<code>while</code> повторяет, пока условие истинно. Следи, чтобы оно когда-нибудь стало ложным!',
      'Последнее число в <code>range</code> не включается.',
    ],
    code: `for i in range(1, 6):
    print(i, "в квадрате =", i * i)

count = 3
while count > 0:
    print("Осталось", count)
    count -= 1
print("Старт! 🚀")`,
    task: 'Выведи таблицу умножения на 7: от 7 × 1 до 7 × 10.',
    hint: 'for i in range(1, 11): print("7 ×", i, "=", 7 * i).',
  },
  {
    id: 'lists', icon: '🗂️', title: 'Списки и словари', time: '10 минут',
    intro: 'Когда данных много, их складывают в коллекции. Список хранит значения по порядку, словарь — по ключам.',
    points: [
      'Список: <code>[1, 2, 3]</code>. Нумерация начинается с нуля: первый элемент — <code>fruits[0]</code>.',
      '<code>append()</code> добавляет элемент, <code>len()</code> считает длину.',
      'Словарь: <code>{"Аня": 5}</code>. Значение достают по ключу: <code>scores["Аня"]</code>.',
    ],
    code: `fruits = ["яблоко", "банан", "киви"]
fruits.append("манго")
print(fruits[0], len(fruits))

for fruit in fruits:
    print("Люблю", fruit)

scores = {"Аня": 5, "Борис": 4}
scores["Вика"] = 5
print(scores["Аня"])`,
    task: 'Составь список из пяти любимых игр и выведи каждую с номером: 1, 2, 3…',
    hint: 'Используй enumerate(games, 1) в цикле for: for i, game in enumerate(games, 1).',
  },
  {
    id: 'funcs', icon: '🧩', title: 'Функции', time: '10 минут',
    intro: 'Функция — это мини-программа с именем. Один раз написал — используешь сколько угодно раз.',
    points: [
      'Функцию создаёт слово <code>def</code>, а <code>return</code> возвращает результат.',
      'У параметров могут быть значения по умолчанию: <code>times=1</code>.',
      'Хорошая функция делает одну понятную вещь и называется по смыслу.',
    ],
    code: `def greet(name, times=1):
    for _ in range(times):
        print(f"Привет, {name}!")

def square(x):
    return x * x

greet("Python", 2)
print(square(9))`,
    task: 'Напиши функцию bigger(a, b), которая возвращает большее из двух чисел.',
    hint: 'Внутри функции: if a > b: return a, иначе return b.',
  },
];

const EXAMPLES = [
  {
    id: 'hello', title: 'Привет, имя!',
    code: `name = input("Как тебя зовут? ")
print(f"Привет, {name}! Добро пожаловать в Python 🐍")`,
    stdin: 'Аня',
  },
  {
    id: 'calc', title: 'Мини-калькулятор',
    code: `a = float(input("Первое число: "))
b = float(input("Второе число: "))
print("Сумма:", a + b)
print("Произведение:", a * b)
if b != 0:
    print("Деление:", round(a / b, 2))`,
    stdin: '12\n5',
  },
  {
    id: 'table', title: 'Таблица умножения',
    code: `n = 7
for i in range(1, 11):
    print(f"{n} × {i} = {n * i}")`,
    stdin: '',
  },
  {
    id: 'fib', title: 'Числа Фибоначчи',
    code: `a, b = 0, 1
for _ in range(10):
    print(a, end=" ")
    a, b = b, a + b
print()`,
    stdin: '',
  },
  {
    id: 'password', title: 'Генератор пароля',
    code: `import random
import string

alphabet = string.ascii_letters + string.digits + "!@#$%"
length = 12
password = "".join(random.choice(alphabet) for _ in range(length))
print("Твой пароль:", password)`,
    stdin: '',
  },
  {
    id: 'words', title: 'Подсчёт слов',
    code: `text = "python это просто python это интересно"
counts = {}
for word in text.split():
    counts[word] = counts.get(word, 0) + 1

for word, n in sorted(counts.items(), key=lambda p: -p[1]):
    print(word, "→", n)`,
    stdin: '',
  },
  {
    id: 'error', title: 'Ошибка — это нормально',
    code: `# Здесь пропущена закрывающая скобка. Запусти и прочитай подсказку!
print("Привет, мир!"`,
    stdin: '',
  },
];

const QUIZ = [
  { q: 'Кто создал язык Python?', opts: ['Гвидо ван Россум', 'Билл Гейтс', 'Линус Торвальдс', 'Илон Маск'], a: 0,
    why: 'Гвидо ван Россум начал работу над Python в конце 1980-х, а первая версия вышла в 1991 году.' },
  { q: 'В честь чего назван Python?', opts: ['В честь змеи питона', 'В честь британской комик-группы «Монти Пайтон»', 'В честь греческого бога', 'В честь города в США'], a: 1,
    why: 'Создатель любил комик-шоу «Летающий цирк Монти Пайтона». Змея на логотипе появилась позже.' },
  { q: 'Что выведет код?', code: 'print(2 + 3 * 4)', opts: ['20', '14', '24', '9'], a: 1,
    why: 'Умножение выполняется раньше сложения: 3 * 4 = 12, затем 2 + 12 = 14.' },
  { q: 'Что выведет код?', code: 'print(type(3.14))', opts: ["<class 'int'>", "<class 'str'>", "<class 'float'>", "<class 'bool'>"], a: 2,
    why: '3.14 — дробное число, а дробные числа в Python имеют тип float.' },
  { q: 'Что выведет код?', code: 'print("Py" * 3)', opts: ['Py3', 'PyPyPy', 'Py Py Py', 'Ошибка'], a: 1,
    why: 'Строку можно умножить на число — она повторится: "Py" * 3 даёт "PyPyPy".' },
  { q: 'Что выведет код?', code: 'print(len([10, 20, 30]))', opts: ['2', '30', '3', '60'], a: 2,
    why: 'len() считает элементы списка. В списке три числа, значит ответ 3.' },
  { q: 'Каким символом начинается комментарий в Python?', opts: ['//', '#', '--', '/*'], a: 1,
    why: 'Всё, что идёт после #, Python пропускает.' },
  { q: 'Что выведет цикл?', code: 'for i in range(3):\n    print(i, end=" ")', opts: ['1 2 3', '0 1 2', '0 1 2 3', '1 2'], a: 1,
    why: 'range(3) даёт числа 0, 1, 2: счёт начинается с нуля, а число 3 не включается.' },
  { q: 'Что выведет код?', code: 'x = 7\nprint(x % 2)', opts: ['3', '3.5', '1', '0'], a: 2,
    why: 'Знак % — остаток от деления. 7 = 2 · 3 + 1, остаток равен 1.' },
  { q: 'Какое слово создаёт функцию?', opts: ['func', 'function', 'def', 'fn'], a: 2,
    why: 'Функция создаётся словом def (от английского define — «определить»).' },
  { q: 'Что выведет код?', code: 'print(10 // 3)', opts: ['3', '3.33', '1', '4'], a: 0,
    why: 'Оператор // — целочисленное деление: дробная часть отбрасывается.' },
  { q: 'Что делает функция input()?', opts: ['Выводит текст на экран', 'Считывает то, что ввёл пользователь', 'Удаляет переменную', 'Создаёт список'], a: 1,
    why: 'input() ждёт, пока пользователь что-то напечатает, и возвращает это как строку.' },
];

const CHEATS = [
  { cat: 'Основы', title: 'print — вывод', desc: 'Показывает значения. sep задаёт разделитель, end — окончание.',
    code: 'print("Привет!", 42)\nprint("a", "b", sep="-", end="!")' },
  { cat: 'Основы', title: 'input — ввод', desc: 'Считывает строку, которую вводит пользователь.',
    code: 'name = input("Имя: ")\nprint("Привет,", name)', stdin: 'Аня' },
  { cat: 'Основы', title: 'f-строки', desc: 'Подставляют значения переменных прямо в текст.',
    code: 'name = "Аня"\nage = 14\nprint(f"{name}, {age} лет")' },
  { cat: 'Основы', title: 'Преобразование типов', desc: 'int(), float() и str() превращают значения из одного типа в другой.',
    code: 'x = int("5") + 1\ny = float("2.5")\nz = str(10) + "!"\nprint(x, y, z)' },
  { cat: 'Основы', title: 'Арифметика', desc: '** — степень, // — целое деление, % — остаток.',
    code: 'print(2 ** 10, 17 // 5, 17 % 5, round(3.14159, 2))' },
  { cat: 'Строки', title: 'Методы строк', desc: 'upper, lower, strip и другие методы меняют текст. len считает символы.',
    code: 's = "  Python  "\nprint(s.strip().upper(), len(s.strip()))' },
  { cat: 'Строки', title: 'Срезы', desc: 'Достают часть строки: [от:до]. Отрицательные индексы считаются с конца.',
    code: 's = "Programming"\nprint(s[0:3], s[-1], s[::-1])' },
  { cat: 'Строки', title: 'split и join', desc: 'split разбивает строку на список, join склеивает список в строку.',
    code: 'words = "я люблю python".split()\nprint(words)\nprint("-".join(words))' },
  { cat: 'Коллекции', title: 'Списки', desc: 'append добавляет элемент, sorted сортирует, sum и max считают.',
    code: 'nums = [3, 1, 2]\nnums.append(5)\nprint(sorted(nums), sum(nums), max(nums))' },
  { cat: 'Коллекции', title: 'Генератор списка', desc: 'Короткий способ создать список по формуле.',
    code: 'squares = [x * x for x in range(1, 6)]\nprint(squares)' },
  { cat: 'Коллекции', title: 'Словари', desc: 'Хранят пары «ключ → значение». items() отдаёт пары по очереди.',
    code: 'd = {"name": "Аня", "age": 14}\nd["city"] = "Москва"\nfor key, value in d.items():\n    print(key, "→", value)' },
  { cat: 'Коллекции', title: 'enumerate', desc: 'Нумерует элементы в цикле. Второй аргумент — с какого числа начать.',
    code: 'games = ["шахматы", "го", "шашки"]\nfor i, g in enumerate(games, 1):\n    print(i, g)' },
  { cat: 'Логика', title: 'if / elif / else', desc: 'Ветвление: программа выбирает, какой блок выполнить.',
    code: 'x = 5\nif x > 0:\n    print("положительное")\nelif x == 0:\n    print("ноль")\nelse:\n    print("отрицательное")' },
  { cat: 'Логика', title: 'for и range', desc: 'range(старт, стоп, шаг) — стоп не включается.',
    code: 'for i in range(1, 11, 3):\n    print(i)' },
  { cat: 'Логика', title: 'while', desc: 'Повторяет блок, пока условие истинно.',
    code: 'n = 1\nwhile n < 100:\n    n *= 2\nprint(n)' },
  { cat: 'Логика', title: 'try / except', desc: 'Ловит ошибки, чтобы программа не падала.',
    code: 'try:\n    n = int(input("Число: "))\n    print("Квадрат:", n * n)\nexcept ValueError:\n    print("Это не число!")', stdin: 'abc' },
  { cat: 'Функции', title: 'def и return', desc: 'Функция принимает параметры и возвращает результат.',
    code: 'def add(a, b):\n    return a + b\n\nprint(add(2, 3))' },
  { cat: 'Функции', title: 'Модуль random', desc: 'Случайные числа и выбор — основа многих игр.',
    code: 'import random\nprint(random.randint(1, 6))\nprint(random.choice(["камень", "ножницы", "бумага"]))' },
];

const IDEAS = [
  { title: 'Шифр Цезаря', level: 'easy', text: 'Программа, которая шифрует и расшифровывает сообщения, сдвигая каждую букву на несколько позиций.', tools: ['строки', 'циклы', 'функции'] },
  { title: 'Викторина по любимой теме', level: 'easy', text: 'Задай вопросы про свой любимый предмет, считай баллы и выводи оценку в конце.', tools: ['списки', 'input', 'if'] },
  { title: 'Проверка надёжности пароля', level: 'easy', text: 'Проверяй длину, цифры и спецсимволы и подсказывай, как улучшить пароль.', tools: ['строки', 'условия'] },
  { title: 'Угадай число', level: 'easy', text: 'Компьютер загадывает число, а ты угадываешь с подсказками «больше» и «меньше».', tools: ['random', 'while'] },
  { title: 'Дневник оценок', level: 'easy', text: 'Записывай оценки по предметам и считай средний балл, лучший и худший предмет.', tools: ['словари', 'функции'] },
  { title: 'Текстовый квест «Побег из школы»', level: 'mid', text: 'Игрок выбирает пути и предметы, а история разветвляется. Отличная заготовка для будущей игры!', tools: ['словари', 'функции', 'циклы'] },
  { title: 'Крестики-нолики с компьютером', level: 'mid', text: 'Поле 3×3, ходы по очереди и простой «ум» у компьютера-соперника.', tools: ['списки', 'функции'] },
  { title: 'Telegram-бот напоминаний', level: 'mid', text: 'Бот, который напомнит о домашке или тренировке в нужное время.', tools: ['aiogram', 'время'] },
  { title: 'Анализ частоты слов', level: 'mid', text: 'Возьми текст и узнай, какие слова встречаются чаще всего. Можно построить график.', tools: ['словари', 'Matplotlib'] },
  { title: 'Змейка на Pygame', level: 'mid', text: 'Классическая игра: змейка растёт, когда съедает яблоко. Хороший шаг к «настоящей» разработке игр.', tools: ['Pygame', 'классы'] },
];

const PY_HINTS = {
  SyntaxError: 'Синтаксическая ошибка: проверь, все ли скобки и кавычки закрыты и стоит ли двоеточие после if, for, def.',
  IndentationError: 'Проблема с отступами: внутри if, for и def строки сдвигаются на 4 пробела.',
  TabError: 'Смешаны табуляция и пробелы — используй только пробелы.',
  NameError: 'Python не знает такого имени. Проверь опечатки и создана ли переменная выше.',
  TypeError: 'Несовместимые типы: например, нельзя сложить число и строку. Помогут str() и int().',
  ValueError: 'Значение не подходит: например, int("abc") превратить в число нельзя.',
  ZeroDivisionError: 'На ноль делить нельзя 🙂',
  IndexError: 'Такого индекса в списке нет. Помни: нумерация начинается с 0.',
  KeyError: 'В словаре нет такого ключа.',
  AttributeError: 'У этого значения нет такого метода или свойства. Проверь написание.',
  EOFError: 'Программа ждёт ввод. Добавь ответы в поле «Ввод для input()» — каждый с новой строки.',
  ModuleNotFoundError: 'Такой модуль недоступен в браузерной версии Python.',
};

/* ---------- 3. Подсветка кода ---------- */
const PY_KEYWORDS = new Set(['and', 'as', 'assert', 'async', 'await', 'break', 'class', 'continue', 'def', 'del', 'elif', 'else', 'except', 'finally', 'for', 'from', 'global', 'if', 'import', 'in', 'is', 'lambda', 'nonlocal', 'not', 'or', 'pass', 'raise', 'return', 'try', 'while', 'with', 'yield', 'True', 'False', 'None']);
const PY_BUILTINS = new Set(['print', 'input', 'len', 'range', 'int', 'float', 'str', 'bool', 'list', 'dict', 'set', 'tuple', 'type', 'sum', 'min', 'max', 'abs', 'round', 'sorted', 'enumerate', 'zip', 'map', 'filter', 'open']);
const TOKEN_SRC =
  '(#[^\\n]*)' +
  '|("""[\\s\\S]*?"""|\'\'\'[\\s\\S]*?\'\'\'|[fF]?"(?:\\\\.|[^"\\\\\\n])*"|[fF]?\'(?:\\\\.|[^\'\\\\\\n])*\'|[fF]?"[^"\\n]*|[fF]?\'[^\'\\n]*)' +
  '|(\\b\\d+(?:\\.\\d+)?\\b)' +
  '|([A-Za-z_\\u0400-\\u04FF][A-Za-z0-9_\\u0400-\\u04FF]*)';

function highlight(code) {
  const re = new RegExp(TOKEN_SRC, 'g');
  let out = '';
  let last = 0;
  let m;
  while ((m = re.exec(code))) {
    out += esc(code.slice(last, m.index));
    last = re.lastIndex;
    if (m[1]) out += `<span class="tok-com">${esc(m[1])}</span>`;
    else if (m[2]) out += `<span class="tok-str">${esc(m[2])}</span>`;
    else if (m[3]) out += `<span class="tok-num">${esc(m[3])}</span>`;
    else {
      const w = m[4];
      if (PY_KEYWORDS.has(w)) out += `<span class="tok-kw">${w}</span>`;
      else if (PY_BUILTINS.has(w)) out += `<span class="tok-bi">${w}</span>`;
      else if (code[last] === '(') out += `<span class="tok-fn">${w}</span>`;
      else out += w;
    }
  }
  return out + esc(code.slice(last));
}

function codeBlock(code, { title = 'python', run = true, stdin = '' } = {}) {
  return `
    <div class="code-block" data-stdin="${esc(stdin)}">
      <div class="code-head">
        <span class="dots"><i></i><i></i><i></i></span>
        <span class="code-title">${esc(title)}</span>
        <span class="code-actions">
          <button type="button" class="mini-btn" data-act="copy">Копировать</button>
          ${run ? '<button type="button" class="mini-btn run" data-act="run">▶ Запустить</button>' : ''}
        </span>
      </div>
      <pre><code>${highlight(code)}</code></pre>
    </div>`;
}

/* Копировать и запускать код можно в любом блоке на сайте */
document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-act]');
  if (!btn) return;
  const block = btn.closest('.code-block');
  if (!block) return;
  const code = block.querySelector('code').textContent;
  if (btn.dataset.act === 'copy') copyText(code);
  if (btn.dataset.act === 'run') Sandbox.runExternal(code, block.dataset.stdin || '');
});

/* ---------- 4. Интерфейс ---------- */
function initTheme() {
  const btn = $('#themeBtn');
  const apply = (t) => {
    document.documentElement.dataset.theme = t;
    btn.textContent = t === 'dark' ? '☀️' : '🌙';
    btn.setAttribute('aria-label', t === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему');
    const meta = $('meta[name="theme-color"]');
    if (meta) meta.content = t === 'dark' ? '#0a0f1f' : '#f5f7ff';
  };
  apply(document.documentElement.dataset.theme || 'dark');
  btn.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    apply(next);
    store.set('theme', next);
  });
}

function initNav() {
  const burger = $('#burger');
  const nav = $('#nav');
  const setOpen = (open) => {
    nav.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  };
  burger.addEventListener('click', () => setOpen(!nav.classList.contains('open')));
  $$('a', nav).forEach((a) => a.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });

  $('#toTop').addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  // полоса прокрутки
  const bar = $('#scrollProgress');
  const onScroll = () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${h > 0 ? Math.min(window.scrollY / h, 1) : 0})`;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // подсветка текущего раздела в меню
  const links = $$('a', nav);
  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            links.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id));
          }
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    links.forEach((a) => {
      const s = $(a.getAttribute('href'));
      if (s) spy.observe(s);
    });
  }
}

function initReveal() {
  const items = $$('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  items.forEach((el) => io.observe(el));
}

function countUp(el, target) {
  if (reduceMotion) { el.textContent = target; return; }
  const dur = 1000;
  const t0 = performance.now();
  (function step(t) {
    const p = Math.min((t - t0) / dur, 1);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(step);
  })(t0);
}

function initStats() {
  const values = { lessons: LESSONS.length, quiz: QUIZ.length, cheats: CHEATS.length };
  $$('[data-stat]').forEach((el) => countUp(el, values[el.dataset.stat] || 0));
}

async function heroTyping() {
  const pre = $('#heroCode');
  const out = $('#heroOut');
  if (reduceMotion) {
    pre.innerHTML = highlight(HERO_CODE);
    out.textContent = HERO_OUT.join('\n');
    return;
  }
  for (;;) {
    out.textContent = '';
    for (let i = 0; i <= HERO_CODE.length; i++) {
      pre.innerHTML = highlight(HERO_CODE.slice(0, i)) + '<span class="cursor"></span>';
      await sleep(HERO_CODE[i - 1] === '\n' ? 140 : 26);
    }
    await sleep(500);
    for (let k = 0; k < HERO_OUT.length; k++) {
      out.textContent = HERO_OUT.slice(0, k + 1).join('\n');
      await sleep(380);
    }
    await sleep(4500);
    pre.innerHTML = '<span class="cursor"></span>';
    await sleep(500);
  }
}

function renderWhy() {
  $('#whyCards').innerHTML = WHY.map(
    (w, i) => `
    <article class="card why-card reveal" style="--d:${i * 60}ms">
      <div class="why-icon">${w.icon}</div>
      <h3>${w.title}</h3>
      <p>${w.text}</p>
      <div class="tags">${w.tags.map((t) => `<span>${t}</span>`).join('')}</div>
    </article>`
  ).join('');

  // случайный факт
  let fi = Math.floor(Math.random() * FACTS.length);
  const factText = $('#factText');
  factText.textContent = FACTS[fi];
  $('#factBtn').addEventListener('click', () => {
    fi = (fi + 1 + Math.floor(Math.random() * (FACTS.length - 1))) % FACTS.length;
    factText.textContent = FACTS[fi];
  });

  // принцип дня
  const now = new Date();
  const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
  $('#zenText').textContent = '«' + ZEN[dayOfYear % ZEN.length] + '»';
  $('#zenDate').textContent = 'Сегодня, ' + now.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' }) + ' · из PEP 20';
}

/* ---------- 5. Уроки ---------- */
function getRank() {
  const done = store.get('done', []).filter((id) => LESSONS.some((l) => l.id === id)).length;
  const best = store.get('quizBest', 0) || 0;
  const pts = done * 10 + best * 5;
  if (pts >= 110) return '👑 Мастер Python';
  if (pts >= 80) return '⭐ Pythonista';
  if (pts >= 40) return '💻 Кодер';
  if (pts >= 10) return '🐍 Питонёнок';
  return '🥚 Новичок';
}

function updateProgress() {
  const done = store.get('done', []).filter((id) => LESSONS.some((l) => l.id === id));
  $('#progressText').textContent = `${done.length} из ${LESSONS.length} уроков пройдено`;
  $('#progressFill').style.width = (done.length / LESSONS.length) * 100 + '%';
  $('#rankText').textContent = 'Ранг: ' + getRank();
}

const Lessons = (() => {
  let cur = Math.min(store.get('lesson', 0), LESSONS.length - 1);
  const tabs = $('#lessonTabs');
  const view = $('#lessonView');

  const doneSet = () => new Set(store.get('done', []));

  function renderTabs() {
    const done = doneSet();
    tabs.innerHTML = LESSONS.map(
      (l, i) => `
      <button type="button" class="lesson-tab ${i === cur ? 'active' : ''} ${done.has(l.id) ? 'done' : ''}" data-i="${i}" ${i === cur ? 'aria-current="true"' : ''}>
        <span class="tab-num">${done.has(l.id) ? '✓' : i + 1}</span>
        <span class="tab-title">${l.title}</span>
      </button>`
    ).join('');
  }

  function renderLesson() {
    const l = LESSONS[cur];
    const isDone = doneSet().has(l.id);
    view.innerHTML = `
      <div class="lesson-head">
        <span class="lesson-icon">${l.icon}</span>
        <div>
          <span class="lesson-meta">Урок ${cur + 1} из ${LESSONS.length} · ${l.time}</span>
          <h3>${l.title}</h3>
        </div>
      </div>
      <p class="lesson-intro">${l.intro}</p>
      <ul class="points">${l.points.map((p) => `<li>${p}</li>`).join('')}</ul>
      ${codeBlock(l.code, { title: `lesson_${cur + 1}.py` })}
      <div class="task">
        <strong>🎯 Задание</strong>
        <p>${l.task}</p>
        <details><summary>Показать подсказку</summary><p>${l.hint}</p></details>
      </div>
      <div class="lesson-foot">
        <button type="button" class="btn btn-ghost btn-small" data-nav="-1" ${cur === 0 ? 'disabled' : ''}>← Назад</button>
        <button type="button" class="btn ${isDone ? 'btn-ghost' : 'btn-primary'} btn-small" id="doneBtn">${isDone ? '✓ Пройдено (снять отметку)' : 'Отметить пройденным'}</button>
        <button type="button" class="btn btn-ghost btn-small" data-nav="1" ${cur === LESSONS.length - 1 ? 'disabled' : ''}>Дальше →</button>
      </div>`;
  }

  function render() {
    renderTabs();
    renderLesson();
    updateProgress();
  }

  function go(i, scroll) {
    cur = Math.max(0, Math.min(LESSONS.length - 1, i));
    store.set('lesson', cur);
    render();
    if (scroll && window.innerWidth < 960) view.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  }

  function toggleDone() {
    const done = doneSet();
    const id = LESSONS[cur].id;
    if (done.has(id)) done.delete(id);
    else done.add(id);
    store.set('done', [...done]);
    render();
    if (done.has(id)) {
      if (done.size === LESSONS.length) {
        toast('🎉 Все уроки пройдены!');
        confetti();
      } else {
        toast('Урок пройден ✓');
      }
    }
  }

  function init() {
    render();
    tabs.addEventListener('click', (e) => {
      const t = e.target.closest('.lesson-tab');
      if (t) go(Number(t.dataset.i), true);
    });
    view.addEventListener('click', (e) => {
      const nav = e.target.closest('[data-nav]');
      if (nav) go(cur + Number(nav.dataset.nav), true);
      if (e.target.closest('#doneBtn')) toggleDone();
    });
    $('#resetProgress').addEventListener('click', () => {
      if (!confirm('Сбросить прогресс по урокам?')) return;
      store.set('done', []);
      render();
      toast('Прогресс сброшен');
    });
  }

  return { init };
})();

/* ---------- 6. Песочница ---------- */

/* Эта функция целиком уходит в Web Worker: там загружается Pyodide
   (Python, скомпилированный для браузера). Worker нужен, чтобы
   «зависший» код не замораживал страницу — его можно остановить. */
function pyWorkerMain() {
  const INDEX = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/';
  let pyodide = null;

  const PRELUDE = [
    'import builtins',
    '_lines = _stdin_text.splitlines() if _stdin_text else []',
    'def _input(prompt=""):',
    '    print(prompt, end="")',
    '    if not _lines:',
    '        raise EOFError("нет данных для input()")',
    '    value = _lines.pop(0)',
    '    print(value)',
    '    return value',
    'builtins.input = _input',
  ].join('\n');

  async function init() {
    importScripts(INDEX + 'pyodide.js');
    pyodide = await loadPyodide({ indexURL: INDEX });
    pyodide.setStdout({ batched: (s) => postMessage({ type: 'out', text: s + '\n' }) });
    pyodide.setStderr({ batched: (s) => postMessage({ type: 'out', text: s + '\n' }) });
  }

  const ready = init()
    .then(() => postMessage({ type: 'ready' }))
    .catch((e) => postMessage({ type: 'fatal', text: String(e && e.message ? e.message : e) }));

  onmessage = async (e) => {
    const { code, stdin } = e.data;
    let ns = null;
    try {
      await ready;
      if (!pyodide) return;
      pyodide.globals.set('_stdin_text', stdin);
      pyodide.runPython(PRELUDE);
      ns = pyodide.toPy({ __name__: '__main__' });
      await pyodide.runPythonAsync(code, { globals: ns });
    } catch (err) {
      postMessage({ type: 'error', text: String(err && err.message ? err.message : err) });
    } finally {
      try { pyodide.runPython('import sys\nsys.stdout.flush()\nsys.stderr.flush()'); } catch (_) { /* ничего */ }
      try { if (ns) ns.destroy(); } catch (_) { /* ничего */ }
      postMessage({ type: 'done' });
    }
  };
}

const Sandbox = (() => {
  const TIMEOUT_MS = 10000;
  const editor = $('#editor');
  const gutter = $('#gutter');
  const output = $('#output');
  const runBtn = $('#runBtn');
  const stopBtn = $('#stopBtn');
  const statusEl = $('#pyStatus');
  const info = $('#runInfo');
  const stdinEl = $('#stdin');
  const stdinBox = $('#stdinBox');
  const select = $('#exampleSelect');

  let worker = null;
  let loaded = false;
  let loading = false;
  let failed = false;
  let busy = false;
  let hadError = false;
  let pending = null;
  let timer = null;
  let t0 = 0;
  let noteEl = null;
  let lastLines = 0;

  /* --- интерфейс --- */
  function refresh() {
    let state = 'idle';
    let text = 'Python загрузится при первом запуске';
    if (failed) { state = 'error'; text = 'Не удалось загрузить Python'; }
    else if (loading) { state = 'loading'; text = 'Загружаю Python…'; }
    else if (busy) { state = 'running'; text = 'Выполняется…'; }
    else if (loaded) { state = 'ready'; text = 'Python готов'; }
    statusEl.dataset.state = state;
    $('span', statusEl).textContent = text;
    runBtn.disabled = busy;
    stopBtn.hidden = !busy;
  }

  function append(text, cls) {
    const span = document.createElement('span');
    if (cls) span.className = cls;
    span.textContent = text;
    output.appendChild(span);
    output.scrollTop = output.scrollHeight;
    return span;
  }

  function updateGutter() {
    const n = editor.value.split('\n').length;
    if (n !== lastLines) {
      lastLines = n;
      gutter.textContent = Array.from({ length: n }, (_, i) => i + 1).join('\n');
    }
    gutter.scrollTop = editor.scrollTop;
  }

  function loadCode(code, stdin) {
    editor.value = code;
    stdinEl.value = stdin || '';
    stdinBox.open = Boolean(stdin);
    updateGutter();
  }

  /* --- работа с worker --- */
  function spawn() {
    if (worker) return;
    try {
      const blob = new Blob(['(' + pyWorkerMain.toString() + ')()'], { type: 'text/javascript' });
      worker = new Worker(URL.createObjectURL(blob));
    } catch (err) {
      fail('Этот браузер не позволил запустить Python в фоновом потоке.');
      return;
    }
    loading = true;
    worker.onmessage = onMessage;
    worker.onerror = () => fail('Не удалось загрузить Python. Проверь интернет и попробуй ещё раз.');
    refresh();
  }

  function killWorker() {
    clearTimeout(timer);
    if (worker) worker.terminate();
    worker = null;
    loaded = false;
    loading = false;
  }

  function fail(message) {
    killWorker();
    failed = true;
    busy = false;
    pending = null;
    if (noteEl) { noteEl.remove(); noteEl = null; }
    append('⚠ ' + message + '\n', 'out-err');
    refresh();
  }

  function onMessage(e) {
    const m = e.data;
    if (m.type === 'ready') {
      loading = false;
      loaded = true;
      if (pending) send();
      refresh();
    } else if (m.type === 'out') {
      append(m.text);
    } else if (m.type === 'error') {
      showError(m.text);
    } else if (m.type === 'done') {
      finish();
    } else if (m.type === 'fatal') {
      fail('Не удалось загрузить Python (нужен интернет). ' + m.text);
    }
  }

  function send() {
    if (noteEl) { noteEl.remove(); noteEl = null; }
    worker.postMessage(pending);
    pending = null;
    t0 = performance.now();
    timer = setTimeout(onTimeout, TIMEOUT_MS);
    refresh();
  }

  function onTimeout() {
    killWorker();
    busy = false;
    append('\n⏱ Программа работала дольше 10 секунд и была остановлена. Возможно, в ней бесконечный цикл.\n', 'out-err');
    info.textContent = '';
    refresh();
  }

  function cleanTraceback(msg) {
    const lines = msg.split('\n');
    const first = lines.findIndex((l) => l.includes('File "<exec>"'));
    if (first === -1) return msg.trim();
    return ['Traceback (most recent call last):', ...lines.slice(first)].join('\n').trim();
  }

  function showError(msg) {
    hadError = true;
    const clean = cleanTraceback(msg);
    append((output.textContent && !output.textContent.endsWith('\n') ? '\n' : '') + clean + '\n', 'out-err');
    const lastLine = clean.split('\n').filter(Boolean).pop() || '';
    const name = lastLine.split(':')[0].trim();
    if (PY_HINTS[name]) append('\n💡 ' + PY_HINTS[name] + '\n', 'out-hint');
  }

  function finish() {
    clearTimeout(timer);
    busy = false;
    const sec = ((performance.now() - t0) / 1000).toFixed(2);
    info.textContent = hadError ? `Завершено с ошибкой · ${sec} с` : `Готово · ${sec} с`;
    info.style.color = hadError ? 'var(--bad)' : '';
    if (!output.textContent.trim()) append('(программа ничего не вывела)', 'out-info');
    refresh();
  }

  /* --- действия --- */
  function run() {
    if (busy) return;
    failed = false;
    output.textContent = '';
    info.textContent = '';
    hadError = false;
    busy = true;
    pending = { code: editor.value, stdin: stdinEl.value };
    if (!worker) spawn();
    if (!worker) return;
    refresh();
    if (loaded) send();
    else noteEl = append('Загружаю Python… в первый раз это займёт несколько секунд ⏳\n', 'out-info');
  }

  function stop() {
    if (!busy) return;
    killWorker();
    busy = false;
    pending = null;
    if (noteEl) { noteEl.remove(); noteEl = null; }
    append('\n■ Остановлено\n', 'out-info');
    info.textContent = '';
    refresh();
  }

  function runExternal(code, stdin) {
    if (busy) stop();
    select.value = '';
    loadCode(code, stdin);
    $('#sandbox').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    setTimeout(run, reduceMotion ? 0 : 350);
  }

  function preload() {
    if (!worker && !failed) spawn();
  }

  function insertText(text) {
    if (!document.execCommand('insertText', false, text)) {
      editor.setRangeText(text, editor.selectionStart, editor.selectionEnd, 'end');
      updateGutter();
    }
  }

  function init() {
    select.innerHTML =
      '<option value="">✍️ Мой код</option>' +
      EXAMPLES.map((ex) => `<option value="${ex.id}">${esc(ex.title)}</option>`).join('');
    select.value = EXAMPLES[0].id;
    loadCode(EXAMPLES[0].code, EXAMPLES[0].stdin);
    refresh();

    select.addEventListener('change', () => {
      const ex = EXAMPLES.find((x) => x.id === select.value);
      if (ex) loadCode(ex.code, ex.stdin);
      preload();
    });

    editor.addEventListener('input', updateGutter);
    editor.addEventListener('scroll', () => { gutter.scrollTop = editor.scrollTop; });
    editor.addEventListener('focus', preload, { once: true });
    runBtn.addEventListener('pointerenter', preload, { once: true });

    editor.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        run();
        return;
      }
      if (e.key === 'Tab' && !e.shiftKey) {
        e.preventDefault();
        insertText('    ');
        return;
      }
      if (e.key === 'Enter') {
        const pos = editor.selectionStart;
        const lineStart = pos === 0 ? 0 : editor.value.lastIndexOf('\n', pos - 1) + 1;
        const line = editor.value.slice(lineStart, pos);
        const indent = line.match(/^[ \t]*/)[0];
        const extra = /:\s*$/.test(line) ? '    ' : '';
        e.preventDefault();
        insertText('\n' + indent + extra);
      }
    });

    runBtn.addEventListener('click', run);
    stopBtn.addEventListener('click', stop);
    $('#copyCode').addEventListener('click', () => copyText(editor.value));
    $('#resetCode').addEventListener('click', () => {
      const ex = EXAMPLES.find((x) => x.id === select.value) || EXAMPLES[0];
      select.value = ex.id;
      loadCode(ex.code, ex.stdin);
      output.textContent = '';
      info.textContent = '';
    });
  }

  return { init, runExternal };
})();

/* ---------- 7. Викторина ---------- */
const Quiz = (() => {
  const box = $('#quizBox');
  const PER_GAME = 10;
  let qs = [];
  let i = 0;
  let score = 0;

  function renderStart() {
    const best = store.get('quizBest', null);
    box.classList.remove('answered');
    box.innerHTML = `
      <div class="quiz-start">
        <div class="quiz-emoji">🧠</div>
        <h3>Проверь, что ты запомнил</h3>
        <p>${PER_GAME} случайных вопросов из ${QUIZ.length}: теория и задачи «что выведет код?». После ответа — короткое объяснение.</p>
        ${best !== null ? `<p class="best">Лучший результат: <b>${best} из ${PER_GAME}</b></p>` : ''}
        <button type="button" class="btn btn-primary" data-q="start">Начать викторину</button>
      </div>`;
  }

  function start() {
    qs = shuffle(QUIZ)
      .slice(0, PER_GAME)
      .map((q) => ({ ...q, opts: shuffle(q.opts.map((t, k) => ({ t, ok: k === q.a }))) }));
    i = 0;
    score = 0;
    renderQuestion();
  }

  function renderQuestion() {
    const q = qs[i];
    box.classList.remove('answered');
    box.innerHTML = `
      <div class="quiz-top"><span>Вопрос ${i + 1} из ${qs.length}</span><span>Верно: ${score}</span></div>
      <div class="bar"><div class="bar-fill" style="width:${(i / qs.length) * 100}%"></div></div>
      <h3 class="q-title">${esc(q.q)}</h3>
      ${q.code ? codeBlock(q.code, { title: 'код', run: true }) : ''}
      <div class="options">
        ${q.opts.map((o, k) => `<button type="button" class="option" data-k="${k}"><span class="opt-key">${'ABCD'[k]}</span><span>${esc(o.t)}</span></button>`).join('')}
      </div>
      <div class="feedback" id="feedback" aria-live="polite"></div>
      <div class="quiz-nav"><button type="button" class="btn btn-primary" data-q="next" hidden>${i === qs.length - 1 ? 'Показать результат' : 'Дальше →'}</button></div>`;
  }

  function answer(k) {
    const q = qs[i];
    const optsEl = $('.options', box);
    if (optsEl.classList.contains('locked')) return;
    optsEl.classList.add('locked');
    const buttons = $$('.option', box);
    const ok = q.opts[k].ok;
    if (ok) score++;
    buttons[k].classList.add(ok ? 'correct' : 'wrong');
    buttons[q.opts.findIndex((o) => o.ok)].classList.add('correct');
    $('#feedback').innerHTML = `<strong>${ok ? '✅ Верно!' : '❌ Не совсем.'}</strong> ${esc(q.why)}`;
    $('[data-q="next"]', box).hidden = false;
    box.classList.add('answered');
  }

  function renderResult() {
    const best = store.get('quizBest', 0) || 0;
    if (score > best) store.set('quizBest', score);
    updateProgress();
    const msg =
      score === PER_GAME ? 'Идеально! Ты настоящий питонист 🏆' :
      score >= 8 ? 'Отлично! Совсем чуть-чуть до идеала 🚀' :
      score >= 5 ? 'Неплохо! Загляни в уроки, чтобы закрепить 📘' :
      'Это только начало — пройди уроки и возвращайся 💪';
    box.classList.remove('answered');
    box.innerHTML = `
      <div class="quiz-result">
        <div class="quiz-emoji">${score >= 8 ? '🏆' : score >= 5 ? '👍' : '🌱'}</div>
        <h3>Результат</h3>
        <div class="score-big">${score} / ${PER_GAME}</div>
        <p>${msg}</p>
        <p class="best">Твой ранг: <b>${getRank()}</b></p>
        <div class="result-actions">
          <button type="button" class="btn btn-primary" data-q="start">Ещё раз</button>
          <a class="btn btn-ghost" href="#lessons">К урокам</a>
        </div>
      </div>`;
    if (score >= 9) confetti();
  }

  function init() {
    renderStart();
    box.addEventListener('click', (e) => {
      const opt = e.target.closest('.option');
      if (opt) return answer(Number(opt.dataset.k));
      const act = e.target.closest('[data-q]');
      if (!act) return;
      if (act.dataset.q === 'start') start();
      if (act.dataset.q === 'next') {
        i++;
        if (i < qs.length) renderQuestion();
        else renderResult();
      }
    });
  }

  return { init };
})();

/* ---------- 8. Шпаргалка и идеи ---------- */
const Cheats = (() => {
  const grid = $('#cheatGrid');
  const empty = $('#cheatEmpty');
  const search = $('#cheatSearch');
  const chips = $('#cheatChips');
  const cats = ['Все', ...new Set(CHEATS.map((c) => c.cat))];
  let cat = 'Все';

  function render() {
    const q = search.value.trim().toLowerCase();
    const list = CHEATS.filter(
      (c) => (cat === 'Все' || c.cat === cat) && (!q || (c.title + ' ' + c.desc + ' ' + c.code + ' ' + c.cat).toLowerCase().includes(q))
    );
    grid.innerHTML = list
      .map(
        (c) => `
      <article class="card cheat-card">
        <span class="cheat-cat">${c.cat}</span>
        <h3>${c.title}</h3>
        <p>${c.desc}</p>
        ${codeBlock(c.code, { title: 'пример.py', stdin: c.stdin || '' })}
      </article>`
      )
      .join('');
    empty.hidden = list.length > 0;
  }

  function renderChips() {
    chips.innerHTML = cats.map((c) => `<button type="button" class="chip ${c === cat ? 'active' : ''}" data-cat="${c}">${c}</button>`).join('');
  }

  function init() {
    renderChips();
    render();
    search.addEventListener('input', render);
    chips.addEventListener('click', (e) => {
      const b = e.target.closest('.chip');
      if (!b) return;
      cat = b.dataset.cat;
      renderChips();
      render();
    });
  }
  return { init };
})();

const Ideas = (() => {
  let idx = -1;
  const body = $('#ideaBody');

  function show() {
    let n;
    do { n = Math.floor(Math.random() * IDEAS.length); } while (n === idx && IDEAS.length > 1);
    idx = n;
    const d = IDEAS[n];
    body.style.animation = 'none';
    void body.offsetWidth; // перезапуск анимации
    body.style.animation = '';
    body.innerHTML = `
      <div class="idea-title">${d.title}</div>
      <p class="idea-text">${d.text}</p>
      <span class="level ${d.level}">${d.level === 'easy' ? 'Лёгкий уровень' : 'Средний уровень'}</span>
      <span class="tags" style="display:inline-flex;margin:0">${d.tools.map((t) => `<span>${t}</span>`).join('')}</span>`;
  }

  function init() {
    show();
    $('#ideaBtn').addEventListener('click', show);
  }
  return { init };
})();

/* ---------- 9. Запуск ---------- */
initTheme();
initNav();
renderWhy();
Lessons.init();
Sandbox.init();
Quiz.init();
Cheats.init();
Ideas.init();
initReveal();
initStats();
heroTyping();
$('#year').textContent = new Date().getFullYear();
