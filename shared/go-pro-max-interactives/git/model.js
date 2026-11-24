(() => {
  'use strict';

  const remoteUrl = 'https://github.com/goshechka/station-board.git';
  const labs = {
    local: {
      title: 'Собери первый коммит',
      intro: 'В репозитории есть два изменения. Выбери, что попадёт в коммит, и посмотри историю.',
      files: ['README.md', 'main.go'],
      tasks: [
        ['Проверь состояние проекта.', 'Команда статуса показывает изменения в рабочей папке и индексе.'],
        ['Подготовь к коммиту только README.md.', 'Добавление одного файла помогает оставить несвязанные изменения за пределами коммита.'],
        ['Сохрани подготовленное изменение сообщением “Clarify project purpose”.', 'Коммит сохраняет подготовленные изменения. Проверь, что в индексе лежит именно нужный файл.'],
        ['Подготовь main.go к следующему коммиту.', 'Сначала выбери файл для индекса. README.md уже сохранён в истории.'],
        ['Сохрани main.go сообщением “Add entry point”.', 'У коммита есть сообщение, по которому его удобно найти в истории.'],
        ['Посмотри краткую историю коммитов.', 'История помогает проверить, что обе отдельные правки стали самостоятельными коммитами.']
      ],
      fresh: () => ({
        kind: 'local', branch: 'main', branches: { main: ['Initial project'] }, commits: ['Initial project'],
        files: { 'README.md': 'changed', 'main.go': 'untracked' }, staged: [], remotes: {}, remoteBranches: {},
        stage: 0, firstCommit: false, secondCommit: false, logViewed: false
      }),
      checks: [s => s.statusViewed, s => s.staged.includes('README.md') && !s.staged.includes('main.go'), s => s.firstCommit,
        s => s.staged.includes('main.go'), s => s.secondCommit, s => s.logViewed]
    },
    branches: {
      title: 'Ветка для отдельной правки',
      intro: 'Сделай изменение в feature-ветке, а затем объедини его в main. Граф покажет, куда передвинулся указатель каждой ветки.',
      files: ['banner.md'],
      tasks: [
        ['Посмотри список локальных веток.', 'Сначала узнай, на какой ветке находится HEAD и какие ветки уже созданы.'],
        ['Создай ветку feature-banner.', 'Создание имени ветки и переход на неё — разные действия.'],
        ['Переключись на feature-banner.', 'После переключения новые коммиты будут добавляться в выбранную ветку.'],
        ['Подготовь banner.md к коммиту.', 'Правка banner.md уже лежит в рабочей папке этой учебной задачи.'],
        ['Зафиксируй баннер сообщением “Add banner draft”.', 'Убедись, что нужный файл уже подготовлен в индексе.'],
        ['Вернись на main.', 'Перед слиянием выбери ветку, в которую должны попасть изменения.'],
        ['Влей feature-banner в текущую ветку.', 'Команда слияния берёт изменения из названной ветки и добавляет их в текущую.']
      ],
      fresh: () => ({
        kind: 'branches', branch: 'main', branches: { main: ['Initial project', 'README basics'] },
        commits: ['Initial project', 'README basics'], files: { 'banner.md': 'hidden' }, staged: [], remotes: {}, remoteBranches: {},
        stage: 0, bannerCommit: false, merged: false
      }),
      checks: [s => s.branchViewed, s => s.branches['feature-banner'], s => s.branch === 'feature-banner',
        s => s.staged.includes('banner.md'), s => s.bannerCommit, s => s.branch === 'main', s => s.merged]
    },
    remote: {
      title: 'Свяжи локальный проект с GitHub',
      intro: 'Локальный коммит пока не опубликован. Добавь адрес сервера и отправь туда две ветки.',
      files: ['main', 'feature-banner'],
      tasks: [
        ['Добавь удалённый репозиторий с именем origin.', 'У локального проекта должен появиться адрес сервера с коротким именем.'],
        ['Проверь, какой адрес сохранён для origin.', 'Команда просмотра удалённых репозиториев показывает адреса получения и отправки.'],
        ['Отправь main на сервер origin.', 'Отправка обновляет ветку на сервере; локальная история остаётся на месте.'],
        ['Отправь feature-banner на origin.', 'Укажи ветку, которую нужно опубликовать. Состояние main уже видно на схеме.']
      ],
      fresh: () => ({
        kind: 'remote', branch: 'main', branches: { main: ['Initial project', 'Station board'], 'feature-banner': ['Initial project', 'Station board', 'Add banner draft'] },
        commits: ['Initial project', 'Station board'], files: { 'README.md': 'clean' }, staged: [], remotes: {}, remoteBranches: {},
        stage: 0, remoteChecked: false
      }),
      checks: [s => Boolean(s.remotes.origin), s => s.remoteChecked, s => s.remoteBranches.main === 'Station board', s => s.remoteBranches['feature-banner'] === 'Add banner draft']
    },
    mission: {
      title: 'Миссия: клонируй и отправь правку',
      intro: 'Получен адрес репозитория Station Board. Забери проект, подготовь документацию и опубликуй отдельную ветку.',
      files: ['README.md', 'docs/guide.md'],
      tasks: [
        ['Склонируй репозиторий по указанному адресу.', 'Клонирование создаёт локальную копию вместе с историей и связью с origin.'],
        ['Проверь состояние новой копии.', 'У только что клонированного проекта рабочая папка обычно чистая.'],
        ['Создай ветку docs-guide и сразу перейди на неё.', 'Для этого есть команда, которая создаёт новую ветку и переключает HEAD одним действием.'],
        ['Подготовь docs/guide.md к коммиту.', 'Файл с инструкцией уже изменён в этой учебной задаче.'],
        ['Сохрани инструкцию сообщением “Document setup”.', 'Сначала добавь нужное изменение в индекс, затем зафиксируй его.'],
        ['Опубликуй ветку docs-guide на origin.', 'Отправь именно новую ветку. Ветку main эта правка менять не должна.']
      ],
      fresh: () => ({
        kind: 'mission', branch: null, branches: {}, commits: [], files: {}, staged: [], remotes: {}, remoteBranches: {},
        stage: 0, cloned: false, docsCommit: false
      }),
      checks: [s => s.cloned, s => s.statusViewed, s => s.branch === 'docs-guide', s => s.staged.includes('docs/guide.md'), s => s.docsCommit,
        s => s.remoteBranches['docs-guide'] === 'Document setup']
    }
  };

  const parse = line => {
    const words = [];
    const re = /"([^"\\]*(?:\\.[^"\\]*)*)"|'([^'\\]*(?:\\.[^'\\]*)*)'|(\S+)/g;
    let m;
    while ((m = re.exec(line))) words.push((m[1] ?? m[2] ?? m[3]).replace(/\\(["'\\])/g, '$1'));
    return words;
  };
  const last = values => values?.[values.length - 1];

  function output(s, raw) {
    const a = parse(raw);
    if (!a.length) return { ok: false, text: 'Введите команду из изученных в уроках Git.' };
    if (a[0] !== 'git') return { ok: false, text: 'В этой консоли доступны только команды Git.' };
    const cmd = a[1];
    if (cmd === 'status' && a.length === 2) {
      s.statusViewed = true;
      const changes = Object.entries(s.files).filter(([,v]) => v !== 'clean' && v !== 'hidden').map(([k,v]) => `${v === 'untracked' ? '??' : s.staged.includes(k) ? 'A ' : ' M'} ${k}`);
      const staged = s.staged.map(x => `${x === 'main.go' ? 'A ' : 'M '} ${x}`);
      const unique = [...new Set([...staged, ...changes.filter(x => !staged.some(st => st.endsWith(x.slice(3))))])];
      return { ok: true, text: `Ветка: ${s.branch || '(нет локальной копии)'}\n${unique.length ? unique.join('\n') : 'Рабочая папка чистая.'}` };
    }
    if (cmd === 'branch') {
      if (s.kind === 'branches' && a.length === 2) {
        s.branchViewed = true;
        return { ok: true, text: Object.keys(s.branches).map(b => `${b === s.branch ? '* ' : '  '}${b}`).join('\n') };
      }
      if (s.kind === 'branches' && a.length === 3 && !a[2].startsWith('-')) {
        const name = a[2];
        if (s.branches[name]) return { ok: false, text: `Ветка ${name} уже существует.` };
        s.branches[name] = [...s.branches[s.branch]];
        return { ok: true, text: `Ветка ${name} создана от ${s.branch}. HEAD всё ещё на ${s.branch}.` };
      }
      return { ok: false, text: 'Для этого шага нужна операция со списком или именем локальной ветки.' };
    }
    if (cmd === 'switch') {
      if (s.kind === 'mission' && a.length === 4 && a[2] === '-c' && a[3] === 'docs-guide' && s.cloned) {
        s.branches['docs-guide'] = [...s.branches.main]; s.branch = 'docs-guide'; s.files['docs/guide.md'] = 'changed';
        return { ok: true, text: 'Создана ветка docs-guide; HEAD переключён на неё.' };
      }
      if (s.kind === 'branches' && a.length === 3 && s.branches[a[2]]) {
        s.branch = a[2];
        if (a[2] === 'feature-banner') s.files['banner.md'] = 'changed';
        return { ok: true, text: `Теперь активна ветка ${a[2]}.` };
      }
      return { ok: false, text: 'Такой переход между ветками сейчас недоступен.' };
    }
    if (cmd === 'add' && (s.kind === 'local' || s.kind === 'branches' || s.kind === 'mission')) {
      const file = a[2];
      const expected = s.kind === 'local' ? ['README.md','main.go'] : s.kind === 'branches' ? ['banner.md'] : ['docs/guide.md'];
      if (a.length !== 3 || !expected.includes(file) || !['changed','untracked'].includes(s.files[file]))
        return { ok: false, text: 'Этот файл нельзя добавить на текущем шаге. Сверь цель и состояние рабочей папки.' };
      if (!s.staged.includes(file)) s.staged.push(file);
      s.files[file] = 'staged';
      return { ok: true, text: `Изменение ${file} подготовлено к коммиту.` };
    }
    if (cmd === 'commit' && (s.kind === 'local' || s.kind === 'branches' || s.kind === 'mission')) {
      const msg = a[2] === '-m' ? a[3] : null;
      if (a.length !== 4 || !msg || !s.staged.length) return { ok: false, text: 'Для коммита нужно подготовленное изменение и короткое сообщение.' };
      const accepted = s.kind === 'local'
        ? (s.staged[0] === 'README.md' && msg === 'Clarify project purpose') || (s.staged[0] === 'main.go' && msg === 'Add entry point')
        : s.kind === 'branches' ? s.staged[0] === 'banner.md' && msg === 'Add banner draft'
        : s.staged[0] === 'docs/guide.md' && msg === 'Document setup';
      if (!accepted) return { ok: false, text: 'Этот коммит пока не соответствует подготовленному изменению и цели шага.' };
      s.commits.push(msg); s.branches[s.branch].push(msg);
      s.staged.forEach(file => { s.files[file] = 'clean'; }); s.staged = [];
      if (s.kind === 'local' && msg === 'Clarify project purpose') s.firstCommit = true;
      if (s.kind === 'local' && msg === 'Add entry point') s.secondCommit = true;
      if (s.kind === 'branches') s.bannerCommit = true;
      if (s.kind === 'mission') s.docsCommit = true;
      return { ok: true, text: `Коммит сохранён: ${msg}` };
    }
    if (cmd === 'log' && (s.kind === 'local' || s.kind === 'mission')) {
      s.logViewed = true;
      return { ok: true, text: [...s.commits].reverse().map((c,i) => `${(i+1).toString(16).padStart(7,'0')} ${c}`).join('\n') || 'История пока пуста.' };
    }
    if (cmd === 'merge' && s.kind === 'branches' && a.length === 3 && a[2] === 'feature-banner' && s.branch === 'main' && s.bannerCommit) {
      s.merged = true; s.branches.main.push('Merge feature-banner'); s.commits.push('Merge feature-banner');
      return { ok: true, text: 'Ветка feature-banner объединена с main. Обе линии истории видны на схеме.' };
    }
    if (cmd === 'remote' && s.kind === 'remote') {
      if (a.length === 3 && a[2] === '-v') { s.remoteChecked = true; return { ok: true, text: Object.entries(s.remotes).map(([n,u]) => `${n}\t${u} (fetch)\n${n}\t${u} (push)`).join('\n') || 'Удалённые репозитории пока не настроены.' }; }
      if (a.length === 5 && a[2] === 'add' && a[3] === 'origin' && a[4] === remoteUrl) { s.remotes.origin = remoteUrl; return { ok: true, text: 'Удалённый репозиторий origin добавлен.' }; }
      return { ok: false, text: 'Эта консоль показывает только добавление и просмотр origin.' };
    }
    if (cmd === 'push' && s.kind === 'remote') {
      const branch = a[3];
      if (a.length === 4 && a[2] === 'origin' && s.remotes.origin === remoteUrl && s.branches[branch]) {
        s.remoteBranches[branch] = last(s.branches[branch]);
        return { ok: true, text: `origin/${branch} обновлена до коммита «${s.remoteBranches[branch]}».` };
      }
      return { ok: false, text: 'Проверь имя origin, локальную ветку и порядок аргументов.' };
    }
    if (cmd === 'clone' && s.kind === 'mission' && a.length === 3 && a[2] === remoteUrl && !s.cloned) {
      s.cloned = true; s.branch = 'main'; s.branches = { main: ['Initial project', 'Station Board'] };
      s.commits = ['Initial project', 'Station Board']; s.files = { 'README.md': 'clean' }; s.remotes.origin = remoteUrl;
      return { ok: true, text: 'Копия проекта создана. История main и адрес origin получены.' };
    }
    if (cmd === 'push' && s.kind === 'mission' && a.length === 4 && a[2] === 'origin' && a[3] === 'docs-guide' && s.docsCommit) {
      s.remoteBranches['docs-guide'] = 'Document setup';
      return { ok: true, text: 'Ветка docs-guide опубликована на origin. main не менялась.' };
    }
    if (cmd === 'help' && a.length === 2) return { ok: true, text: 'Команды этого этапа: git status · git add · git commit · git log · git branch · git switch · git merge · git remote · git push · git clone.' };
    return { ok: false, text: 'Команда или её аргументы не подошли к текущему шагу. Посмотри на состояние проекта и попробуй ещё раз.' };
  }

  function fresh(key) {
    if (!labs[key]) key = 'local';
    const lab = labs[key], state = lab.fresh(); state.stage = 0; state.logViewed = false; state.statusViewed = false;
    return { key, lab, state };
  }
  function execute(model, line) {
    const { state, lab } = model;
    const result = output(state, line);
    const check = lab.checks[state.stage];
    if (result.ok && check?.(state)) {
      const completed = state.stage;
      state.stage += 1;
      return { ...result, complete: true, completed, done: state.stage === lab.tasks.length };
    }
    return { ...result, complete: false, done: state.stage === lab.tasks.length };
  }
  function hint(model) { return model.lab.tasks[model.state.stage]?.[1] || 'Можно повторить шаг или начать заново.'; }
  window.GitLabModel = { labs, fresh, execute, hint, remoteUrl };
})();
