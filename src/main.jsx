import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom';
import './styles.css';

const asset = (path) => `${import.meta.env.BASE_URL}${path}`;
const image = (name) => asset(`images/${name.replace(/\.png$/i, '.webp')}`);

const projects = [
  {
    slug: 'nuit', name: 'NUIT', number: '01', tone: 'Чёрный · Кино',
    description: 'Интернет-магазин локального бренда одежды. Атмосфера ночного города, выразительная подача первой коллекции и лаконичный каталог формируют цельный образ бренда.',
    tags: ['Интернет-магазин', 'Fashion', 'UI/UX', 'Frontend', 'Адаптивный дизайн'],
    liveUrl: 'https://nuit-store.ru',
    images: ['nuit-store-01.png', 'nuit-store-02.png', 'nuit-store-03.png'].map(image),
    about: 'Интернет-магазин первой коллекции локального бренда одежды NUIT.',
    task: 'Представить бренд, передать настроение коллекции и сделать переход к выбору товара максимально простым.',
    visual: 'Кинематографичные фотографии, чёрно-белая палитра и крупная типографика создают атмосферу ночного города.',
    result: 'Получился цельный digital-образ бренда: от первого знакомства с коллекцией до спокойного и понятного выбора товара.'
  },
  {
    slug: 'prestige-auto', name: 'Престиж Авто', number: '02', tone: 'Графит · Красный',
    description: 'Сайт автосервиса полного цикла в Одинцово. Тёмная индустриальная эстетика, понятная структура услуг и прямой сценарий записи на ремонт.',
    tags: ['Автосервис', 'Лендинг', 'UI/UX', 'Frontend', 'Локальный бизнес'],
    liveUrl: 'https://odintsovo-auto-prestige.ru',
    images: ['auto-prestige-01.png', 'auto-prestige-02.png', 'auto-prestige-03.png'].map(image),
    about: 'Корпоративный сайт автосервиса полного цикла в Одинцово.',
    task: 'Собрать услуги в понятную структуру и упростить запись клиентов на ремонт.',
    visual: 'Индустриальная тёмная стилистика, красные акценты и реальные фотографии мастерской подчёркивают характер бизнеса.',
    result: 'Сайт быстро знакомит с услугами и ведёт посетителя к записи без лишних шагов.'
  },
  {
    slug: 'oymari', name: 'Oymari', number: '03', tone: 'Свет · Воздух',
    description: 'Минималистичный сайт индивидуального обучения фотографии. Спокойная редакционная подача знакомит с автором, раскрывает программу и мягко подводит посетителя к заявке.',
    tags: ['Фотография', 'Обучение', 'Личный бренд', 'Лендинг', 'UI/UX'],
    liveUrl: 'https://oymari.ru',
    images: ['oymari-01.png', 'oymari-02.png', 'oymari-03.png'].map(image),
    about: 'Сайт индивидуального обучения фотографии с авторской программой.',
    task: 'Понятно представить формат занятий, программу, стоимость и личный подход наставника.',
    visual: 'Светлая редакционная композиция, спокойная типографика и большое количество воздуха поддерживают эстетику автора.',
    result: 'Личный стиль автора стал основой ясной страницы, которая последовательно раскрывает программу обучения.'
  },
  {
    slug: 'gunay', name: 'Gunay', number: '04', tone: 'Золото · Событие',
    description: 'Сайт свадебного организатора и декоратора из Москвы. Контрастная чёрно-золотая стилистика, эмоциональные фотографии мероприятий и понятный путь к обсуждению даты.',
    tags: ['Организатор', 'Свадьбы', 'Личный бренд', 'Лендинг', 'UI/UX'],
    liveUrl: 'https://gunay-weddingsevents.ru/',
    images: ['gunay-01.png', 'gunay-02.png', 'gunay-03.png'].map(image),
    about: 'Сайт свадебного организатора, декоратора и специалиста по мероприятиям.',
    task: 'Показать атмосферу реализованных событий и привести потенциального клиента к обсуждению даты.',
    visual: 'Чёрно-золотая палитра, выразительная типографика и коллажи из фотографий создают ощущение премиальной подачи.',
    result: 'Портфолио и услуги собраны в эмоциональный, но понятный сценарий знакомства со специалистом.'
  },
  {
    slug: 'sahiba', name: 'Сахиба Годжаева', number: '05', tone: 'Фотограф · Москва',
    description: 'Портфолио фотографа из Москвы. Выразительная редакционная композиция, крупные фотографии и спокойная навигация знакомят с автором и её съёмками — от свадеб до семейных историй.',
    tags: ['Фотограф', 'Портфолио', 'Личный бренд', 'Лендинг', 'Адаптивный дизайн'],
    liveUrl: 'https://paxanraul.github.io/sahiba-portfolio/',
    images: ['sahiba-01.png', 'sahiba-02.png', 'sahiba-03.png'].map(image),
    about: 'Портфолио московского фотографа Сахибы Годжаевой, созданное в рамках рекламного бартера.',
    task: 'Передать личный стиль фотографа, показать направления съёмки и привести посетителя к быстрому контакту.',
    visual: 'Светлая журнальная композиция, контрастная типографика и крупные фотографии оставляют главным героем кадр и эмоцию.',
    result: 'Получилась эмоциональная витрина работ с понятным переходом в Telegram для обсуждения съёмки.'
  },
  {
    slug: 'rafael-elvira', name: 'Rafael & Elvira', number: '06', tone: 'Плёнка · Тепло', wedding: true,
    description: 'Лаконичное свадебное приглашение с тёплой плёночной эстетикой. Спокойная типографика и личные фотографии создают ощущение камерной истории пары.',
    tags: ['Свадебное приглашение', 'Персональный сайт', 'Анимация', 'Mobile-first'],
    images: ['rafael-elvira-01.png', 'rafael-elvira-02.png', 'rafael-elvira-03.png'].map(image),
    about: 'Персональное приглашение, которое бережно рассказывает историю Рафаэля и Эльвиры.',
    task: 'Передать настроение камерного праздника и собрать всю важную информацию для гостей в одном месте.',
    visual: 'Тёплые плёночные оттенки, личные фотографии и деликатная типографика создают ощущение семейного фотоальбома.',
    result: 'Получилось искреннее цифровое приглашение, удобное для просмотра и отправки с телефона.'
  },
  {
    slug: 'emil-sevda', name: 'Emil & Sevda', number: '07', tone: 'Фото · Ритм', wedding: true,
    description: 'Современное свадебное приглашение, построенное вокруг крупных фотографий пары и выразительной типографики. Информация о событии подана как цельная визуальная история.',
    tags: ['Свадебное приглашение', 'Персональный сайт', 'Анимация', 'Mobile-first'],
    images: ['emil-sevda-01.png', 'emil-sevda-02.png', 'emil-sevda-03.png'].map(image),
    about: 'Современное приглашение для Эмиля и Севды с акцентом на фотографии пары.',
    task: 'Объединить историю, расписание и детали события в удобный мобильный сценарий.',
    visual: 'Крупные кадры и контрастная типографика задают эмоциональный ритм и связывают разделы в единое повествование.',
    result: 'Гости получают личное приглашение и всю практическую информацию в одном цельном формате.'
  },
  {
    slug: 'elgun-samina', name: 'Elgun & Samina', number: '08', tone: 'Два языка · Детали', wedding: true,
    description: 'Персональное свадебное приглашение на двух языках. История пары, программа мероприятия, обратный отсчёт, дресс-код и удобный переход к локации.',
    tags: ['Свадебное приглашение', 'Двуязычный сайт', 'Таймер', 'Анимация', 'Mobile-first'],
    liveUrl: 'https://www.elgunsamina.ru',
    images: ['elgun-samina-01.png', 'elgun-samina-02.png', 'elgun-samina-03.png'].map(image),
    about: 'Двуязычное приглашение на свадьбу Эльгуна и Самины.',
    task: 'Сделать насыщенную программу события понятной для всех гостей и сохранить личное настроение истории пары.',
    visual: 'Воздушная композиция, мягкие оттенки и плавные переходы объединяют два языка, таймер, дресс-код и маршрут.',
    result: 'Все детали события доступны гостям с телефона, а двуязычная подача остаётся лёгкой и цельной.'
  },
  {
    slug: 'ramik-mariam', name: 'Ramik & Mariam', number: '09', tone: 'Свет · Восток', wedding: true,
    description: 'Интерактивное свадебное приглашение с эффектом раскрывающегося занавеса. Светлая восточная эстетика, календарь, таймер, время сбора гостей и маршрут до площадки.',
    tags: ['Свадебное приглашение', 'Интерактивный сайт', 'Таймер', 'Анимация', 'Mobile-first'],
    liveUrl: 'https://ramikmariam.ru',
    images: ['ramik-mariam-01.png', 'ramik-mariam-02.png', 'ramik-mariam-03.png'].map(image),
    about: 'Интерактивное приглашение на свадьбу Рамика и Мариам.',
    task: 'Создать запоминающееся первое впечатление и помочь гостям быстро найти время, дату и локацию.',
    visual: 'Эффект занавеса открывает светлую восточную композицию с орнаментами, мягким золотом и выразительными деталями.',
    result: 'Торжественное вступление сочетается с практичной мобильной страницей для гостей.'
  }
];

const Icon = ({ name }) => {
  const paths = {
    telegram: <path d="m21 3-7.7 18-4.4-6.7L3 11.8 21 3Zm-12.1 11.3L21 3 11.4 15.6" />,
    instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m4 7 8 6 8-6" /></>,
    sun: <><circle cx="12" cy="12" r="3.5" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
    moon: <path d="M20 15.5A8.5 8.5 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5Z" />,
    copy: <><rect x="8" y="8" width="11" height="11" rx="2" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></>
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
};

function useTheme() {
  const [theme, setTheme] = useState(() => localStorage.getItem('rm-theme') || 'dark');
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('rm-theme', theme);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0c0b09' : '#f4f0e8');
  }, [theme]);
  return [theme, () => setTheme((value) => value === 'dark' ? 'light' : 'dark')];
}

function ThemeToggle({ theme, toggle }) {
  return <button className="theme-toggle" onClick={toggle} aria-label={theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'}>
    <span className="theme-toggle__knob"><Icon name={theme === 'dark' ? 'moon' : 'sun'} /></span>
  </button>;
}

function Carousel({ project, large = false }) {
  const [index, setIndex] = useState(0);
  const startX = useRef(null);
  const move = (step) => setIndex((value) => (value + step + project.images.length) % project.images.length);
  const onTouchStart = (event) => { startX.current = event.touches[0].clientX; };
  const onTouchEnd = (event) => {
    if (startX.current == null) return;
    const delta = event.changedTouches[0].clientX - startX.current;
    if (Math.abs(delta) > 42) move(delta < 0 ? 1 : -1);
    startX.current = null;
  };
  return <div className={`carousel ${large ? 'carousel--large' : ''}`} role="region" aria-label={`Скриншоты проекта ${project.name}`} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} onKeyDown={(event) => {
    if (event.key === 'ArrowLeft') move(-1);
    if (event.key === 'ArrowRight') move(1);
  }} tabIndex="0">
    <div className="carousel__viewport">
      <div className="carousel__track" style={{ transform: `translateX(-${index * 100}%)` }}>
        {project.images.map((src, imageIndex) => <div className="carousel__slide" key={src} aria-hidden={imageIndex !== index}>
          <img src={src} alt={`${project.name} — экран ${imageIndex + 1}`} width="1280" height="720" loading={large && imageIndex === 0 ? 'eager' : 'lazy'} decoding="async" />
        </div>)}
      </div>
      <div className="carousel__wash" aria-hidden="true" />
      <span className="carousel__counter">{String(index + 1).padStart(2, '0')} / {String(project.images.length).padStart(2, '0')}</span>
      <button className="carousel__arrow carousel__arrow--prev" onClick={() => move(-1)} aria-label="Предыдущий скриншот">←</button>
      <button className="carousel__arrow carousel__arrow--next" onClick={() => move(1)} aria-label="Следующий скриншот">→</button>
    </div>
    <div className="carousel__dots">
      {project.images.map((_, dotIndex) => <button key={dotIndex} className={dotIndex === index ? 'is-active' : ''} onClick={() => setIndex(dotIndex)} aria-label={`Показать скриншот ${dotIndex + 1}`} aria-current={dotIndex === index ? 'true' : undefined} />)}
    </div>
  </div>;
}

function Tags({ tags }) {
  return <ul className="tags" aria-label="Категории">{tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>;
}

function ProjectCard({ project }) {
  return <article className="project-card reveal">
    <Carousel project={project} />
    <div className="project-card__body">
      <div className="eyebrow"><span>Проект {project.number}</span><span>{project.tone}</span></div>
      <h3><Link to={`/project/${project.slug}`}>{project.name}</Link></h3>
      <p>{project.description}</p>
      <Tags tags={project.tags} />
      <div className="project-card__actions">
        {project.liveUrl && <a className="button button--primary" href={project.liveUrl} target="_blank" rel="noopener noreferrer">Посмотреть сайт <span>↗</span></a>}
        <Link className="button button--secondary" to={`/project/${project.slug}`}>Подробнее <span>→</span></Link>
      </div>
    </div>
  </article>;
}

function RevealController() {
  useEffect(() => {
    const nodes = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.08 });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);
  return null;
}

function PixelField() {
  return <div className="pixel-field" aria-hidden="true">
    <span className="pixel-field__layer pixel-field__layer--one" />
    <span className="pixel-field__layer pixel-field__layer--two" />
    <span className="pixel-field__layer pixel-field__layer--three" />
  </div>;
}

function Home({ theme, toggleTheme }) {
  useEffect(() => { document.title = 'Рауль Мамедов — веб-дизайнер и разработчик'; }, []);
  return <>
    <ThemeToggle theme={theme} toggle={toggleTheme} />
    <main>
      <section className="hero" aria-labelledby="hero-title">
        <div className="monogram">
          <span className="monogram__photo"><img src={asset('avatar.jpeg')} alt="Рауль Мамедов" width="320" height="320" /></span>
        </div>
        <p className="hero__overline">Портфолио · 2026</p>
        <h1 id="hero-title">Рауль Мамедов</h1>
        <p className="hero__role">Веб-дизайнер <i>и</i> разработчик</p>
        <p className="hero__intro">Создаю сайты для брендов, специалистов,<br className="desktop-break" /> локального бизнеса и личных событий.</p>
        <div className="socials">
          <a href="https://t.me/MamedovRaul" target="_blank" rel="noopener noreferrer"><Icon name="telegram" />Telegram</a>
          <a href="https://www.instagram.com/paxan_raul/" target="_blank" rel="noopener noreferrer"><Icon name="instagram" />Instagram</a>
        </div>
        <a className="scroll-cue" href="#projects" aria-label="Перейти к проектам"><span>Смотреть проекты</span><b>↓</b></a>
      </section>

      <section className="projects" id="projects" aria-labelledby="projects-title">
        <div className="section-heading reveal">
          <p>Избранные работы · {String(projects.length).padStart(2, '0')}</p>
          <h2 id="projects-title">Мои проекты</h2>
        </div>
        <div className="project-list">
          {projects.map((project, index) => <React.Fragment key={project.slug}>
            {index === 5 && <div className="collection-marker reveal"><span>Отдельная коллекция</span><div><h3>Серия свадебных приглашений</h3><p>Персональные сайты для особенных событий.</p></div></div>}
            <ProjectCard project={project} />
          </React.Fragment>)}
        </div>
      </section>

      <section className="contact reveal" aria-labelledby="contact-title">
        <p className="contact__label">Новый проект</p>
        <div><h2 id="contact-title">Есть задача?</h2><p>Расскажите, какой сайт вам нужен.<br />Я помогу подобрать формат и предложу идею.</p></div>
        <div className="contact__actions">
          <a className="button button--primary" href="https://t.me/MamedovRaul" target="_blank" rel="noopener noreferrer">Написать в Telegram <span>↗</span></a>
          <a className="button button--secondary" href="https://www.instagram.com/paxan_raul/" target="_blank" rel="noopener noreferrer">Открыть Instagram <span>↗</span></a>
        </div>
      </section>
    </main>
    <footer><span>Рауль Мамедов © 2026</span><a href="#top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Наверх ↑</a></footer>
    <RevealController />
  </>;
}

function ProjectDetail({ theme, toggleTheme }) {
  const slug = window.location.pathname.split('/').filter(Boolean).pop();
  const project = projects.find((item) => item.slug === slug);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = project ? `${project.name} — проект Рауля Мамедова` : 'Проект не найден';
  }, [project]);
  if (!project) return <Navigate to="/" replace />;
  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };
  return <>
    <ThemeToggle theme={theme} toggle={toggleTheme} />
    <main className="detail">
      <header className="detail__header">
        <Link className="back-link" to="/">← Назад к проектам</Link>
        <p className="detail__number">Проект {project.number}</p>
        <h1>{project.name}</h1>
        <Tags tags={project.tags} />
        <div className="detail__actions">
          {project.liveUrl && <a className="button button--primary" href={project.liveUrl} target="_blank" rel="noopener noreferrer">Посмотреть сайт <span>↗</span></a>}
          <button className="button button--secondary" onClick={copyLink}><Icon name="copy" />{copied ? 'Ссылка скопирована' : 'Скопировать ссылку'}</button>
        </div>
      </header>
      <Carousel project={project} large />
      <div className="detail__grid">
        {[['О проекте', project.about], ['Задача', project.task], ['Визуальное решение', project.visual], ['Результат', project.result]].map(([title, text], index) => <section className="detail__section reveal" key={title}>
          <span>0{index + 1}</span><div><h2>{title}</h2><p>{text}</p></div>
        </section>)}
      </div>
      <nav className="next-project" aria-label="Следующий проект">
        <span>Следующий проект</span>
        {(() => { const next = projects[(projects.indexOf(project) + 1) % projects.length]; return <Link to={`/project/${next.slug}`}>{next.name} <b>→</b></Link>; })()}
      </nav>
    </main>
    <footer><span>Рауль Мамедов © 2026</span><Link to="/">Все проекты ↑</Link></footer>
    <RevealController />
  </>;
}

function App() {
  const [theme, toggleTheme] = useTheme();
  const basename = import.meta.env.BASE_URL === '/' ? undefined : import.meta.env.BASE_URL.replace(/\/$/, '');
  return <BrowserRouter basename={basename}>
    <PixelField />
    <Routes>
      <Route path="/" element={<Home theme={theme} toggleTheme={toggleTheme} />} />
      <Route path="/project/:slug" element={<ProjectDetail theme={theme} toggleTheme={toggleTheme} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);

export { projects };
