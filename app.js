const main = document.querySelector('#main');
const modal = document.querySelector('#modal');
const modalTitle = document.querySelector('#modalTitle');
const modalContent = document.querySelector('#modalContent');
const storageKey = 'shikaku-atlas-v1';
const defaults = { custom: [], notes: {}, saved: [], attempts: {}, questions: {}, theme: '' };
let state;
try {
  state = { ...defaults, ...JSON.parse(localStorage.getItem(storageKey)) };
} catch {
  state = { ...defaults };
}
function persist() {
  try { localStorage.setItem(storageKey, JSON.stringify(state)); return true; }
  catch { alert('端末に保存できませんでした。ブラウザーの保存設定や空き容量を確認してください。'); return false; }
}
const types = [...new Set(groups.map(group => group[0]))];
const icons = ['▤','☁','▣','⌘','◇','⬡','◉'];
const catalog = groups.flatMap(([type, issuer, url, entries], gi) => entries.map(([name, ...sample], ei) => ({
  id: 'c' + gi + '-' + ei, type, issuer, url, name,
  questions: sample.length ? [sample, ...(moreQuestions[name] || [])] : []
})));
const all = () => [...catalog, ...state.custom];
const questionsOf = item => [...(item.questions || []), ...(state.questions[item.id] || []), ...(levelExercises[item.name] && !item.id.startsWith('u') ? [levelExercises[item.name]] : [])];
// Keep each level's original ID for bookmarks, notes, questions and answer history.
const families = [
  ['LPIC', ['LPIC-1','LPIC-2','LPIC-3']],
  ['LinuC', ['LinuC レベル1','LinuC レベル2','LinuC レベル3','LinuCシステムアーキテクト']],
  ['OSS-DB', ['OSS-DB Silver','OSS-DB Gold']],
  ['Ruby技術者認定', ['Ruby技術者認定 Silver','Ruby技術者認定 Gold']],
  ['JSTQB', ['JSTQB Foundation','JSTQB Advanced']],
  ['PRINCE2', ['PRINCE2 Foundation','PRINCE2 Practitioner']],
  ['ITIL', ['ITIL Foundation','ITIL上位資格']],
  ['Juniper Enterprise', ['JNCIA-Junos','JNCIS-ENT','JNCIP-ENT','JNCIE-ENT']],
  ['Cisco Enterprise', ['CCNP Enterprise','CCIE Enterprise Infrastructure']]
].map(([name, names]) => ({name, levels: names.map(n => catalog.find(item => item.name === n))}));
const familyOf = new Map(families.flatMap(f => f.levels.map(level => [level.id, f])));
function grouped(items) {
  const seen = new Set();
  return items.flatMap(item => {
    const family = familyOf.get(item.id);
    if (!family) return [item];
    if (seen.has(family)) return [];
    seen.add(family);
    return [{ ...item, name:family.name, levels:family.levels }];
  });
}
const countQuestions = item => (item.levels || [item]).reduce((n, level) => n + questionsOf(level).length, 0);
const inSchool = document.body.hasAttribute('data-school');
if (inSchool) {
  const toggle = document.querySelector('#workspace-toggle');
  const menu = document.querySelector('#workspace-nav');
  function openMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('open', open);
  }
  toggle.onclick = () => openMenu(toggle.getAttribute('aria-expanded') !== 'true');
  menu.onclick = event => { if (event.target.closest('a')) openMenu(false); };
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.classList.contains('open')) { openMenu(false); toggle.focus(); }
  });
}
function schoolKey(item) {
  const family = familyOf.get(item.id);
  if (family) return {LPIC:'lpic', LinuC:'linuc'}[family.name] || family.levels[0].id;
  return item.id.startsWith('u') ? 'custom' : item.id;
}
function schoolURL(item, section = '') {
  return '/learn/' + schoolKey(item) + '.html?level=' + encodeURIComponent(item.id) + (section ? '#' + section : '');
}
function selectedLevel() {
  const key = document.body.dataset.school;
  const id = new URLSearchParams(location.search).get('level');
  return all().find(item => schoolKey(item) === key && (id ? item.id === id : key !== 'custom'));
}
function levelSelector(family, item) {
  if (!family) return '';
  return '<section class="box"><h2>学習レベルを選ぶ</h2><div class="level-links">' +
    family.levels.map(level => '<a href="' + schoolURL(level) + '"' +
      (level.id === item.id ? ' aria-current="page"' : '') + '>' + escapeHtml(level.name) + '</a>').join('') +
    '</div></section>';
}
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
const pageNames = { catalog:'資格カタログ', study:'マイ学習', review:'弱点復習' };
let filter = { type:'すべて', query:'', material:'all' };
let quiz;
function theme() { document.documentElement.dataset.theme = state.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'); }
theme();
document.querySelector('#theme').onclick = () => {
  state.theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  theme(); persist();
};
function card(item) {
  const size = countQuestions(item);
  return '<article class="card course-card"><a class="course-link" href="' + schoolURL(item) + '" aria-label="' + escapeHtml(item.name) + 'の専用サイトを開く"><div class="card-top"><span class="icon" aria-hidden="true">' +
    icons[types.indexOf(item.type)] + '</span><span class="badge ' + (size ? 'ready' : '') + '">' +
    (size ? '演習 ' + size + '問' : 'カタログのみ') + '</span></div><h3>' +
    escapeHtml(item.name) + '</h3><p>' + escapeHtml(item.type) + ' / ' +
    escapeHtml(item.issuer || '追加した資格') + (item.levels ? ' ・ ' + item.levels.length + '段階' : '') + '</p><span class="course-cta">専用サイトで学ぶ</span></a></article>';
}
let lastRoute;
function render() {
  const page = location.hash.slice(1);
  if (modal.open && page !== lastRoute) modal.close();
  lastRoute = page;
  if (inSchool) {
    const item = selectedLevel();
    if (!item) {
      main.innerHTML = '<h1>資格が見つかりません</h1><a href="/#catalog">CertAtlasに戻る</a>';
      return;
    }
    const title = (familyOf.get(item.id)?.name || item.name) + ' 学習室';
    document.title = title + ' | CertAtlas';
    document.querySelector('#school-title').textContent = title;
    document.querySelectorAll('.school-nav a').forEach(link => {
      if (link.hash === ('#' + (page || 'home'))) link.setAttribute('aria-current','page');
      else link.removeAttribute('aria-current');
    });
    if (page === 'review') renderReview(item);
    else if (page === 'practice') {
      const count = questionsOf(item).length;
      main.innerHTML = '<h1>問題演習</h1><p>' + escapeHtml(item.name) + '</p><section class="box"><p>' +
        (count ? count + '問の演習に取り組めます。' : 'このレベルの演習は未収録です。自作問題を追加できます。') +
        '</p><div class="actions">' + (count ? '<button class="primary" data-start="' + item.id + '">演習を始める</button>' : '') +
        '<button class="outline" data-question="' + item.id + '">問題を追加</button></div></section>';
    } else if (page === 'notes') {
      renderCourse(item);
      const note = main.querySelector('#note');
      main.innerHTML = '<h1>学習メモ</h1><p>' + escapeHtml(item.name) + '</p>';
      main.append(note);
    } else renderCourse(item);
    return;
  }
  if (page.startsWith('course/')) {
    const item = all().find(entry => entry.id === page.slice(7));
    if (item) { location.replace(schoolURL(item)); return; }
  }
  document.title = 'CertAtlas';
  const current = Object.hasOwn(pageNames, page) ? page : 'catalog';
  document.querySelector('#crumb').textContent = '学習 / ' + pageNames[current];
  document.querySelectorAll('nav a').forEach(link => {
    const active = link.dataset.page === current;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current');
  });
  if (current === 'catalog') return renderCatalog();
  if (current === 'study') return renderStudy();
  return renderReview();
}
function renderCatalog() {
  main.replaceChildren(document.querySelector('#catalog').content.cloneNode(true));
  const items = grouped(all());
  const total = items.reduce((sum, item) => sum + countQuestions(item), 0);
  const available = items.filter(item => countQuestions(item)).length;
  main.querySelector('#stats').innerHTML = '<span><strong>' + items.length + '</strong>掲載資格</span><span><strong>' + available +
    '</strong>演習対応資格</span><span><strong>' + total + '</strong>演習問題</span>';
  const search = main.querySelector('input');
  const material = main.querySelector('select');
  search.value = filter.query;
  material.value = filter.material;
  search.oninput = () => { filter.query = search.value; renderResults(); };
  material.onchange = () => { filter.material = material.value; renderResults(); };
  renderResults();
}
function renderResults() {
  main.querySelector('#filters').innerHTML = ['すべて', ...types].map(type =>
    '<button class="' + (filter.type === type ? 'active' : '') + '" data-type="' + type +
    '" aria-pressed="' + (filter.type === type) + '">' + type + '</button>').join('');
  const parts = filter.query.normalize('NFKC').trim().toLowerCase().split(/\s+/);
  const matches = all().filter(item => {
    const haystack = (item.name + ' ' + (familyOf.get(item.id)?.name || '') + ' ' + item.issuer + ' ' + item.type).normalize('NFKC').toLowerCase();
    const mode = questionsOf(item).length ? 'practice' : 'catalog';
    return (filter.type === 'すべて' || item.type === filter.type) &&
      (filter.material === 'all' || filter.material === mode) && parts.every(part => haystack.includes(part));
  });
  const items = grouped(matches);
  main.querySelector('#count').textContent = items.length + '件の資格';
  main.querySelector('#results').innerHTML = items.length ? items.map(card).join('') : '<p class="box">条件に一致する資格がありません。</p>';
}
function records() {
  return all().flatMap(item => questionsOf(item).map((question, index) => {
    const idx = question === levelExercises[item.name] ? 'level-intro' : index;
    return { item, question, idx, record: state.attempts[item.id + ':' + idx] };
  }));
}
function renderStudy() {
  const attempts = records().filter(row => row.record);
  const attemptsCount = attempts.reduce((sum, row) => sum + row.record.total, 0);
  const correct = attempts.reduce((sum, row) => sum + row.record.correct, 0);
  const saved = all().filter(item => state.saved.includes(item.id));
  main.innerHTML = '<h1>マイ学習</h1><p class="subtext">登録した資格、学習メモ、演習の成績をこのブラウザーに保存します。</p>' +
    '<div class="box">回答 ' + attemptsCount + '回　｜　累計正答率 ' + (attemptsCount ? Math.round(100 * correct / attemptsCount) + '%' : '未集計') +
    '</div><h2>学習中の資格</h2><div class="tiles stack">' + (saved.length ? grouped(saved).map(card).join('') :
      '<p class="box">資格の詳細から「マイ学習に登録」を選択してください。</p>') + '</div>' +
    '<div class="box"><h2>学習データ</h2><div class="actions stack"><button class="outline" data-export>JSONで書き出す</button></div></div>';
}
function renderReview(item = null) {
  const missed = records().filter(row => row.record?.last === false && (!item || row.item.id === item.id));
  if (!item) {
    const levels = [...new Set(missed.map(row => row.item))];
    main.innerHTML = '<h1>弱点復習</h1><p class="subtext">資格を選ぶと、専用サイトで間違えた問題を復習できます。</p>' +
      (levels.length ? levels.map(level => '<article class="box"><a href="' + schoolURL(level,'review') + '">' +
        escapeHtml(level.name) + ' の復習を開く</a></article>').join('') : '<p class="box">復習対象の問題はありません。</p>');
    return;
  }
  main.innerHTML = '<h1>弱点復習</h1><p>' + escapeHtml(item.name) + '</p>' +
    (missed.length ? '<div class="box"><button class="primary" data-review>まとめて復習する（' + missed.length + '問）</button></div>' +
      missed.map(row => '<article class="box"><h3>' + escapeHtml(row.question[0]) + '</h3></article>').join('') :
      '<p class="box">このレベルに復習対象の問題はありません。</p>');
}
function show(title, contents) {
  modalTitle.textContent = title;
  modalContent.innerHTML = contents;
  if (!modal.open) modal.showModal();
}
function detail(item) {
  if (modal.open) modal.close();
  if (inSchool && selectedLevel()?.id === item.id) render();
  else location.assign(schoolURL(item));
}
function renderCourse(item) {
  const questions = questionsOf(item);
  const family = familyOf.get(item.id);
  const history = records().filter(row => row.item.id === item.id && row.record);
  main.innerHTML = '<section class="hero course-hero"><div class="hero-inner"><div class="eyebrow">学習ホーム</div><h1>' + escapeHtml(family?.name || item.name) + '</h1><p>' + escapeHtml(item.type) + ' / ' + escapeHtml(item.issuer || '追加した資格') +
    '</p></div></section>' + levelSelector(family, item) + '<div class="box"><h3>' +
    (family ? escapeHtml(item.name) + ' の教材と進捗' : '教材と進捗') + '</h3><p>' + (questions.length ? '演習 ' + questions.length + '問 ・ 回答済み ' + history.length + '問' :
      'サイト内演習は未収録です。公式教材を参照し、学習メモや自作問題を追加できます。') + '</p>' +
      (item.url ? '<a href="' + escapeHtml(item.url) + '" target="_blank" rel="noopener noreferrer">認定団体のサイトを開く</a>' : '') +
    '</div><div class="actions">' +
    (questions.length ? '<button class="primary" data-start="' + item.id + '">演習を始める</button>' : '') +
    '<button class="outline" data-save="' + item.id + '">' + (state.saved.includes(item.id) ? 'マイ学習から外す' : 'マイ学習に登録') +
    '</button><button class="outline" data-question="' + item.id + '">問題を追加</button></div>' +
    '<form class="stack" id="note"><label class="field">学習メモ<textarea rows="4" maxlength="10000" placeholder="学習した内容や次回の復習ポイント">' +
    escapeHtml(state.notes[item.id]) + '</textarea></label><div><button class="outline">メモを保存</button> <span role="status"></span></div></form>';
  main.querySelector('#note').onsubmit = event => {
    event.preventDefault(); state.notes[item.id] = event.target.querySelector('textarea').value;
    if (persist()) event.target.querySelector('[role=status]').textContent = '保存しました';
  };
}
function field(name, label, optional = false, type = 'text') {
  return '<label class="field">' + label + '<input name="' + name + '" type="' + type + '" maxlength="500" ' + (optional ? '' : 'required') + '></label>';
}
if (!inSchool) document.querySelector('#add').onclick = () => {
  show('資格を追加', '<form id="custom" class="stack">' + field('name','資格名または試験コード') +
    '<label class="field">分野<select name="type">' + types.map(type => '<option>' + type + '</option>').join('') +
    '</select></label>' + field('issuer','認定団体（任意）',true) + field('url','公式サイトURL（任意）',true,'url') +
    '<div class="subtext" role="alert"></div><div><button class="primary">追加して学習を始める</button></div></form>');
  modalContent.querySelector('#custom').onsubmit = event => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target));
    Object.keys(data).forEach(key => data[key] = data[key].trim());
    const name = data.name.normalize('NFKC');
    const error = event.target.querySelector('[role=alert]');
    if (!name || /CCNA|AWS|Amazon Web Services/i.test(name + ' ' + data.issuer.normalize('NFKC')) ||
      (data.url && !/^https?:\/\//i.test(data.url))) {
      error.textContent = '対象資格名と、https:// または http:// で始まるURLを入力してください。';
      return;
    }
    if ([...all(), ...families].some(item => item.name.normalize('NFKC').toLowerCase() === name.toLowerCase())) {
      error.textContent = 'この資格はすでに登録されています。'; return;
    }
    const item = { ...data, id: 'u' + Date.now() + '-' + Math.random().toString(36).slice(2,8) };
    state.custom.push(item); state.saved.push(item.id);
    persist(); render(); detail(item);
  };
};
function addQuestion(item) {
  show('問題を追加', '<p class="subtext">' + escapeHtml(item.name) + '</p><form id="question" class="stack">' +
    field('prompt','問題文') + field('answer','正答') + field('wrong1','誤答の選択肢1') + field('wrong2','誤答の選択肢2') +
    '<label class="field">解説<textarea name="explanation" rows="3" maxlength="3000" required></textarea></label>' +
    '<div class="subtext" role="alert"></div><div><button class="outline" type="button" data-detail="' + item.id +
    '">資格詳細に戻る</button> <button class="primary">問題を保存</button></div></form>');
  modalContent.querySelector('#question').onsubmit = event => {
    event.preventDefault();
    const question = Array.from(new FormData(event.target).values(), value => value.trim());
    if (question.some(value => !value) || new Set(question.slice(1,4)).size !== 3) {
      event.target.querySelector('[role=alert]').textContent = 'すべての欄を入力し、選択肢はそれぞれ異なる内容にしてください。'; return;
    }
    (state.questions[item.id] ||= []).push(question); persist(); render(); detail(item);
  };
}
function start(rows, item = null) {
  quiz = { rows, item, index: 0, correct: 0, answered: false };
  nextQuestion();
}
function nextQuestion() {
  const row = quiz.rows[quiz.index];
  if (!row) {
    show('演習結果', '<div class="box"><h3>' + quiz.correct + ' / ' + quiz.rows.length + '問 正解</h3></div>' +
      (quiz.item ? '<button class="outline" data-detail="' + quiz.item.id + '">資格詳細に戻る</button>' : '<button class="outline" data-close>弱点復習に戻る</button>'));
    return;
  }
  quiz.answered = false;
  const [prompt, ...answers] = row.question;
  const order = [0, 1, 2];
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  show(row.item.name, '<p class="subtext">' + (quiz.index + 1) + ' / ' + quiz.rows.length + '問</p><h3>' +
    escapeHtml(prompt) + '</h3><div class="stack">' + order.map(i => '<button class="option" data-answer="' + i + '">' +
    escapeHtml(answers[i]) + '</button>').join('') + '<div id="feedback" class="feedback" role="status" hidden></div>' +
    '<div><button id="next" class="primary" data-next hidden>' + (quiz.index + 1 === quiz.rows.length ? '結果を見る' : '次の問題') +
    '</button></div></div>');
  modalContent.querySelector('.option').focus();
}
function answer(index) {
  if (!quiz || quiz.answered) return;
  quiz.answered = true;
  const row = quiz.rows[quiz.index];
  const key = row.item.id + ':' + row.idx;
  const record = state.attempts[key] ||= { total:0, correct:0, last:null };
  const right = index === 0;
  record.total++;
  record.last = right;
  if (right) { record.correct++; quiz.correct++; }
  persist();
  modalContent.querySelectorAll('.option').forEach(button => {
    button.disabled = true;
    if (button.dataset.answer === '0') button.classList.add('correct');
    else if (+button.dataset.answer === index) button.classList.add('wrong');
  });
  const feedback = modalContent.querySelector('#feedback');
  feedback.hidden = false;
  feedback.innerHTML = '<strong>' + (right ? '正解' : '不正解 ・ 正答は ' + escapeHtml(row.question[1])) + '</strong><p>' +
    escapeHtml(row.question[4]) + '</p>';
  const next = modalContent.querySelector('#next');
  next.hidden = false;
  next.focus();
  render();
}
document.addEventListener('click', event => {
  const button = event.target.closest('button');
  if (!button) return;
  const action = button.dataset;
  if (action.type) { filter.type = action.type; renderResults(); [...main.querySelectorAll('button[data-type]')].find(btn => btn.dataset.type === action.type)?.focus(); }
  if (action.detail) detail(all().find(item => item.id === action.detail));
  if (action.save) {
    state.saved = state.saved.includes(action.save) ? state.saved.filter(id => id !== action.save) : [...state.saved, action.save];
    persist(); render(); detail(all().find(item => item.id === action.save));
  }
  if (action.question) addQuestion(all().find(item => item.id === action.question));
  if (action.start) {
    const item = all().find(entry => entry.id === action.start);
    start(records().filter(row => row.item.id === item.id), item);
  }
  if ('review' in action) start(records().filter(row => row.record?.last === false && row.item.id === selectedLevel()?.id));
  if ('answer' in action) answer(+action.answer);
  if ('next' in action) { quiz.index++; nextQuestion(); }
  if ('close' in action) modal.close();
  if ('export' in action) {
    const url = URL.createObjectURL(new Blob([JSON.stringify(state, null, 2)], { type:'application/json' }));
    const link = document.createElement('a'); link.href = url; link.download = 'certatlas-progress.json'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
});
addEventListener('pageshow', event => {
  if (event.persisted) {
    try { state = { ...defaults, ...JSON.parse(localStorage.getItem(storageKey)) }; } catch {}
    render();
  }
});
addEventListener('hashchange', () => { render(); scrollTo(0, 0); });
render();
