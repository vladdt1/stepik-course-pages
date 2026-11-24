# Страницы курса Go-шечка Pro MAX

Интерактивные страницы [курса 305734 на Stepik](https://stepik.org/course/305734).
Структура следует [образцу stepik-course-pages](https://github.com/Zak618/stepik-course-pages).

| Папка | Содержимое |
| --- | --- |
| `courses/305734-go-pro-max/introduction/` | Шесть страниц введения |
| `courses/305734-go-pro-max/promo/` | Оформление описания и анимация пути заказа |
| `courses/305734-go-pro-max/modules/` | Четыре тренажёра Git, девять Docker, 23 Vue — по модулям |
| `shared/go-pro-max-interactives/` | Общие модели, стили и собранные ресурсы лабораторий |
| `shared/go-pro-max-vue-source/` | Исходники Vue-лабораторий и зафиксированные зависимости |
| `shared/course-introductions/` | Шаблоны и оформление введения |
| `assets/course-covers/` | Обложки публичного каталога курсов |
| `scripts/go-pro-max-interactives/` | Сборка, проверка и локальный просмотр |
| `docs/` | Устройство страниц и порядок публикации |

## Сборка и просмотр

Используйте совместимую версию Node.js из `shared/go-pro-max-vue-source/package.json`.
Из корня репозитория:

```sh
npm ci --prefix shared/go-pro-max-vue-source
node scripts/go-pro-max-interactives/build.mjs
node scripts/go-pro-max-interactives/check.mjs
node scripts/go-pro-max-interactives/preview.mjs
```

Открыть <http://127.0.0.1:8804/stepik-course-pages/>.
Превью учитывает такой же префикс адреса, как GitHub Pages.
Готовые HTML лежат непосредственно в папках модулей. Для изменения поведения
редактируйте общую модель или Vue-исходник, затем пересоберите.

## Публикация

GitHub Pages: `main`, папка `/(root)`. Файл `.nojekyll` сохраняется.
Публичный адрес: <https://vladdt1.github.io/stepik-course-pages/>.
После изменения проверьте готовые страницы и сделайте обычный commit/push.
GitHub Pages обновляется из этой ветки. Ссылки Stepik меняются только после
проверки новых публичных страниц; описание и задания курса не пересоздаются.

Секреты, снимки Stepik и личные журналы не публикуются.
История и карта первоначального переноса хранятся в локальном проекте автора.
