(() => {
  'use strict';
  const app = document.querySelector('#app');
  const model = window.GitLabModel;
  const params = new URLSearchParams(location.search);
  const labKey = model.labs[params.get('lab')] ? params.get('lab') : 'local';
  const session = model.fresh(labKey);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let lastMessage = '';
  let messageType = '';
  let revealedHint = '';
  let state = session.state;
  let history = [], historyIndex = 0, draft = "";

  app.innerHTML = `<section class="task-card" aria-label="Текущая цель">
    <div class="task-line"><strong id="title"></strong><span id="progress" class="progress"></span></div>
    <p id="task" class="task-text"></p>
    <div id="hint-row" class="hint-row"><button id="hint-button" type="button">Небольшая подсказка</button><p id="hint" class="hint-text" role="status" aria-live="polite"></p></div>
  </section>
  <section class="board" aria-label="Состояние Git-проекта">
    <div class="board-head"><h2 id="board-title">Состояние проекта</h2><span id="branch-now" class="branch-now"></span></div>
    <div class="board-grid"><div id="graph" class="graph"></div><div id="state-list" class="state-list"></div></div>
    <div class="files"><h3>Рабочая папка и индекс</h3><div id="files" class="file-list"></div></div>
  </section>
  <form class="console" id="console-form">
    <span class="prompt" aria-hidden="true">$</span>
    <label class="command-label" for="command">Команда Git</label>
    <input class="command-input" id="command" name="command" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Введите команду Git">
    <button type="submit">Выполнить</button>
  </form>
  <p id="output" class="output" role="status" aria-live="polite"></p>
  <div class="bottom"><button type="button" id="reset">Начать заново</button></div>`;

  const $ = selector => app.querySelector(selector);
  const input = $('#command');
  function graphMarkup() {
    const commits = state.commits || [];
    if (!commits.length) return '<p class="graph-empty">Склонируй проект, чтобы увидеть его историю.</p>';
    if (session.key === 'branches') {
      const feature = state.branches['feature-banner'];
      if (state.merged) return `<svg viewBox="0 0 600 138" role="img" aria-label="Ветка feature-banner влита в main"><path class="edge" d="M72 76 L250 76 L490 76"/><path class="edge merge" d="M250 76 L372 28 L490 76"/><circle class="commit" cx="72" cy="76" r="8"/><circle class="commit" cx="250" cy="76" r="8"/><circle class="commit" cx="372" cy="28" r="8"/><circle class="commit" cx="490" cy="76" r="9"/><text class="commit-label" x="46" y="105">c1</text><text class="commit-label" x="223" y="105">c2</text><text class="commit-label" x="346" y="18">c3</text><text class="commit-label" x="468" y="105">merge</text><text class="ref-label" x="442" y="125">main</text><text class="ref-label" x="331" y="50">feature-banner</text></svg>`;
      if (feature?.length > 2) return `<svg viewBox="0 0 600 138" role="img" aria-label="Коммит feature-banner отделился от main"><path class="edge" d="M72 76 L250 76"/><path class="edge merge" d="M250 76 L385 30"/><circle class="commit" cx="72" cy="76" r="8"/><circle class="commit" cx="250" cy="76" r="8"/><circle class="commit" cx="385" cy="30" r="8"/><text class="commit-label" x="46" y="105">c1</text><text class="commit-label" x="223" y="105">c2</text><text class="commit-label" x="360" y="20">c3</text><text class="ref-label" x="225" y="55">main</text><text class="ref-label" x="338" y="58">feature-banner</text></svg>`;
      if (feature) return `<svg viewBox="0 0 600 138" role="img" aria-label="Две ветки указывают на общий коммит"><path class="edge" d="M72 76 L260 76"/><circle class="commit" cx="72" cy="76" r="8"/><circle class="commit" cx="260" cy="76" r="9"/><text class="commit-label" x="46" y="105">c1</text><text class="commit-label" x="233" y="105">c2</text><text class="ref-label" x="238" y="54">main · feature-banner</text></svg>`;
    }
    if (session.key === 'remote') {
      const branches = Object.keys(state.branches).map((branch,i)=>{
        const y=36+i*55, pushed=Boolean(state.remoteBranches[branch]), end=pushed?510:290;
        return `<path class="edge" d="M72 ${y} L${end} ${y}"/><circle class="commit" cx="72" cy="${y}" r="8"/><circle class="commit" cx="290" cy="${y}" r="8"/><text class="commit-label" x="52" y="${y+24}">local</text><text class="ref-label" x="120" y="${y-8}">${esc(branch)}</text>${pushed?`<circle class="commit remote" cx="510" cy="${y}" r="8"/><text class="commit-label" x="470" y="${y+24}">origin/${esc(branch)}</text>`:`<text class="commit-label" x="304" y="${y+5}">ещё не отправлена</text>`}`;
      }).join('');
      return `<svg viewBox="0 0 600 138" role="img" aria-label="Локальные и опубликованные ветки">${branches}</svg>`;
    }
    if (session.key === 'mission') {
      const cloned = state.cloned;
      const pushed = Boolean(state.remoteBranches['docs-guide']);
      return `<svg viewBox="0 0 600 138" role="img" aria-label="История клонированного проекта и опубликованной ветки"><path class="edge" d="M62 76 L220 76"/>${cloned?'<path class="edge merge" d="M220 76 L380 30 L520 30"/>':''}<circle class="commit remote" cx="62" cy="76" r="8"/><text class="commit-label" x="34" y="105">origin/main</text>${cloned?'<circle class="commit" cx="220" cy="76" r="8"/><text class="commit-label" x="188" y="105">clone</text><circle class="commit" cx="380" cy="30" r="8"/><text class="commit-label" x="348" y="20">docs commit</text>':''}${pushed?'<circle class="commit remote" cx="520" cy="30" r="8"/><text class="commit-label" x="466" y="18">origin/docs-guide</text>':''}</svg>`;
    }
    const labels = commits.map((c,i)=>`<text class="commit-label" x="${24+(i%4)*140}" y="${32+Math.floor(i/4)*42}">${esc(c)}</text>`).join('');
    return `<svg viewBox="0 0 600 100" role="img" aria-label="История локальных коммитов"><path class="edge" d="M28 20 H570"/>${commits.map((c,i)=>`<circle class="commit" cx="${34+i*105}" cy="20" r="7"/>`).join('')}${commits.map((c,i)=>`<text class="commit-label" x="${12+i*105}" y="49">${esc(c).slice(0,14)}</text>`).join('')}</svg>`;
  }
  function render() {
    const task = session.lab.tasks[state.stage];
    $('#title').textContent = task ? session.lab.title : 'Готово: цель выполнена';
    $('#progress').textContent = task ? `Задание ${state.stage+1} из ${session.lab.tasks.length}` : `${session.lab.tasks.length} из ${session.lab.tasks.length}`;
    $('#task').textContent = task ? task[0] : 'Можно повторить команды или начать опыт заново.';
    $('#branch-now').textContent = state.branch ? `HEAD → ${state.branch}` : 'локальной копии пока нет';
    $('#graph').innerHTML = graphMarkup();
    const rows = session.key === 'remote' || session.key === 'mission'
      ? [
          ['Удалённый адрес', state.remotes.origin || 'не настроен'],
          ['Локальные ветки', Object.keys(state.branches).join(', ') || 'нет'],
          ['На сервере', Object.keys(state.remoteBranches).join(', ') || 'пока пусто']
        ]
      : session.key === 'branches'
        ? [['Текущая ветка', state.branch], ['Создано веток', String(Object.keys(state.branches).length)], ['Слияние', state.merged ? 'выполнено' : 'ещё не было']]
        : [['Коммитов', String(state.commits.length)], ['Индекс', state.staged.length ? state.staged.join(', ') : 'пуст'], ['Состояние', state.statusViewed ? 'проверено' : 'не проверено']];
    $('#state-list').innerHTML = rows.map(([k,v],i)=>`<div class="state-row${(k==='Слияние'&&state.merged)||(k==='На сервере'&&state.remoteBranches.main)||(k==='Состояние'&&state.statusViewed)?' good':''}"><strong>${esc(k)}</strong><span>${esc(v)}</span></div>`).join('');
    const fileNames = session.lab.files;
    $('#files').innerHTML = fileNames.length ? fileNames.map(name=>{
      const v = state.files[name] || 'не изменён';
      const cl = v==='staged'?'staged':v==='changed'||v==='untracked'?'changed':'';
      const label = ({changed:'изменён',untracked:'новый файл',staged:'в индексе',clean:'чисто',hidden:'появится после перехода'})[v] || v;
      return `<span class="file-chip ${cl}">${esc(name)} · ${esc(label)}</span>`;
    }).join('') : '<span class="file-chip">Файлов пока нет</span>';
    $('#output').textContent = lastMessage;
    $('#output').className = `output ${messageType}`;
    $('#hint').textContent = revealedHint;
    $('#hint-button').disabled = !task;
    $('#hint-row').hidden = !task;
  }
  $('#hint-button').addEventListener('click',()=>{ revealedHint = model.hint(session); render(); });
  $('#console-form').addEventListener('submit',event=>{
    event.preventDefault();
    const line = input.value.trim();
    if (!line) return;
    history.push(line); historyIndex = history.length; draft = "";
    const result = model.execute(session,line);
    lastMessage = result.complete ? (result.done ? 'Цель достигнута. Состояние проекта обновлено.' : 'Шаг выполнен. Посмотри, что изменилось в проекте.') : result.text;
    messageType = result.complete ? 'success' : result.ok ? '' : 'error';
    if (result.complete) revealedHint = '';
    input.value = '';
    render();
    input.focus({preventScroll:true});
  });
  input.addEventListener('keydown',event=>{
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
    event.preventDefault();
    if (historyIndex === history.length) draft = input.value;
    if (event.key === 'ArrowUp') historyIndex = Math.max(0,historyIndex-1);
    else historyIndex = Math.min(history.length,historyIndex+1);
    input.value = historyIndex === history.length ? draft : history[historyIndex];
    input.setSelectionRange(input.value.length,input.value.length);
  });
  $('#reset').addEventListener('click',()=>{
    const fresh = model.fresh(labKey); session.state = fresh.state; state = session.state;
    history = []; historyIndex = 0; draft = "";
    lastMessage = ''; messageType = ''; revealedHint = '';
    render(); input.value = ''; input.focus({preventScroll:true});
  });
  render();
})();
