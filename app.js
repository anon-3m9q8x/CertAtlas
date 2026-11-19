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
  catch { toast('端末に保存できませんでした。ブラウザーの保存設定や空き容量を確認してください。'); return false; }
}
const index = typeof bankIndex === 'object' ? bankIndex : {};
const types = [...new Set(groups.map(group => group[0]))];
const icons = ['▤','☁','▣','⌘','◇','⬡','◉'];
const catalog = groups.flatMap(([type, issuer, url, names], gi) => names.map((name, ei) => ({
  id: 'c' + gi + '-' + ei, type, issuer, url, name
})));
const all = () => [...catalog, ...state.custom];
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
  ['Cisco Enterprise', ['CCNP Enterprise','CCIE Enterprise Infrastructure']],
  ['ORACLE MASTER', ['ORACLE MASTER Bronze DBA','ORACLE MASTER Silver DBA']]
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
// Question counts are known from the index on every page; full questions load only in the study room.
const countOf = item => (index[item.id]?.count || 0) + (state.questions[item.id] || []).length;
const countQuestions = item => (item.levels || [item]).reduce((n, level) => n + countOf(level), 0);
const inSchool = document.body.hasAttribute('data-school');
const bank = {};
function customQuestions(item) {
  return (state.questions[item.id] || []).map((t, i) => ({
    id: 'u' + i, set: '自作問題', type: 'single', q: t[0], code: '', choices: [t[1], t[2], t[3]], answer: [0],
    explanation: t[4], why: null, shuffle: true
  }));
}
const questionsOf = item => [...(bank[item.id] || []), ...customQuestions(item)];
async function loadBank(item) {
  if (bank[item.id] || !index[item.id]) return;
  try {
    const response = await fetch('/data/bank/' + item.id + '.json');
    if (!response.ok) throw new Error(response.status);
    bank[item.id] = await response.json();
  } catch {
    bank[item.id] = [];
    toast('問題データを読み込めませんでした。通信状況を確認して再読み込みしてください。');
  }
}
const attemptKey = (item, question) => item.id + ':' + question.id;
const recordOf = (item, question) => state.attempts[attemptKey(item, question)];
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
const pageNames = { catalog:'資格カタログ' };
let filter = { type:'すべて', query:'', material:'all' };
let quiz = null;
function toast(message) {
  let box = document.querySelector('#toast');
  if (!box) { box = document.createElement('div'); box.id = 'toast'; box.setAttribute('role', 'status'); document.body.append(box); }
  box.textContent = message; box.hidden = false;
  clearTimeout(toast.timer); toast.timer = setTimeout(() => { box.hidden = true; }, 5000);
}
function theme() { document.documentElement.dataset.theme = state.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'); }
theme();
document.querySelector('#theme').onclick = () => {
  state.theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  theme(); persist();
};
function card(item) {
  const size = countQuestions(item);
  return '<article class="card course-card"><a class="course-link" href="' + schoolURL(item) + '" aria-label="' + escapeHtml(item.name) + 'の専用サイトを開く"><div class="card-top"><span class="icon" aria-hidden="true">' +
    icons[types.indexOf(item.type)] + '</span><span class="badge ' + (size ? 'ready' : 'soon') + '">' +
    (size ? '演習 ' + size + '問' : '準備中') + '</span></div><h3>' +
    escapeHtml(item.name) + '</h3><p>' + escapeHtml(item.type) + ' / ' +
    escapeHtml(item.issuer || '追加した資格') + (item.levels ? ' ・ ' + item.levels.length + '段階' : '') + '</p><span class="course-cta">専用サイトで学ぶ</span></a></article>';
}
let lastRoute;
async function render() {
  const page = location.hash.slice(1);
  if (modal.open && page !== lastRoute) modal.close();
  if (page !== lastRoute) quiz = null;
  lastRoute = page;
  if (inSchool) {
    const item = selectedLevel();
    if (!item) {
      main.innerHTML = '<h1>資格が見つかりません</h1><a href="/#catalog">CertAtlasに戻る</a>';
      return;
    }
    if (!bank[item.id] && index[item.id]) {
      main.innerHTML = '<p class="box">問題データを読み込んでいます…</p>';
      await loadBank(item);
      if (selectedLevel() !== item) return;
    }
    const title = (familyOf.get(item.id)?.name || item.name) + ' 学習室';
    document.title = title + ' | CertAtlas';
    document.querySelector('#school-title').textContent = title;
    document.querySelectorAll('.school-nav a').forEach(link => {
      if (link.hash === ('#' + (page || 'home'))) link.setAttribute('aria-current','page');
      else link.removeAttribute('aria-current');
    });
    if (quiz) return renderQuiz();
    if (page === 'review') renderReview(item);
    else if (page === 'practice') renderPractice(item);
    else if (page === 'notes') {
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
  return renderCatalog();
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
    const mode = countOf(item) ? 'practice' : 'catalog';
    return (filter.type === 'すべて' || item.type === filter.type) &&
      (filter.material === 'all' || filter.material === mode) && parts.every(part => haystack.includes(part));
  });
  // 演習問題がある資格を先に、準備中の資格を後ろに並べる(各グループ内の順序は維持)。
  const items = grouped(matches).sort((a, b) => (countQuestions(b) > 0) - (countQuestions(a) > 0));
  main.querySelector('#count').textContent = items.length + '件の資格';
  main.querySelector('#results').innerHTML = items.length ? items.map(card).join('') : '<p class="box">条件に一致する資格がありません。</p>';
}
const missedOf = item => questionsOf(item).filter(question => recordOf(item, question)?.last === false);
function renderReview(item) {
  const missed = missedOf(item);
  main.innerHTML = '<h1>弱点復習</h1><p>' + escapeHtml(item.name) + '</p>' +
    (missed.length ? '<div class="box"><button class="primary" data-review>まとめて復習する（' + missed.length + '問）</button></div>' +
      missed.map(question => '<article class="box"><h3>' + escapeHtml(question.q) + '</h3></article>').join('') :
      '<p class="box">このレベルに復習対象の問題はありません。</p>');
}
// 「模擬」を含むセットは模擬試験として別枠に表示する。
const isMock = set => /模擬/.test(set);
const PRACTICE_ALL = '__practice';
const inSet = set => question => set === PRACTICE_ALL ? !isMock(question.set) : !set || question.set === set;
function renderPractice(item) {
  const questions = questionsOf(item);
  const sets = [...new Set(questions.map(question => question.set))];
  const drills = sets.filter(set => !isMock(set));
  const mocks = sets.filter(isMock).sort((a, b) => a.localeCompare(b, 'ja', { numeric: true }));
  const drillCount = questions.filter(inSet(PRACTICE_ALL)).length;
  const answered = questions.filter(question => recordOf(item, question)).length;
  main.innerHTML = '<h1>問題演習</h1><p>' + escapeHtml(item.name) + '</p>' +
    (questions.length ? '<p class="subtext">全' + questions.length + '問 ・ 回答済み ' + answered +
      '問。選択肢は 1〜5 キー、Enter で次へ、← → で問題を移動できます。</p>' +
      (drills.length ? '<section class="box"><h2>問題集</h2><p class="subtext">分野別・基本の演習問題です。</p><div class="set-list">' +
        (drills.length > 1 ? setButton(item, PRACTICE_ALL, '問題集をすべて', drillCount) : '') +
        drills.map(set => setButton(item, set, set, questions.filter(inSet(set)).length)).join('') + '</div></section>' : '') +
      (mocks.length ? '<section class="box mock-box"><h2>模擬試験</h2><p class="subtext">本番形式の模擬試験です。セットごとに通しで解いて実力を確認しましょう。</p><div class="set-list">' +
        mocks.map(set => setButton(item, set, set, questions.filter(inSet(set)).length)).join('') + '</div></section>' : '')
      : '<section class="box"><p><span class="badge soon">準備中</span> このレベルの演習問題は準備中です。自作問題は追加できます。</p></section>') +
    '<div class="actions"><button class="outline" data-question="' + item.id + '">問題を追加</button></div>';
}
function setButton(item, set, label, size) {
  const rows = questionsOf(item).filter(inSet(set)).map(question => recordOf(item, question)).filter(Boolean);
  const right = rows.filter(record => record.last).length;
  return '<button class="set-button" data-start="' + item.id + '" data-set="' + escapeHtml(set) + '"><span class="set-name"><strong>' + escapeHtml(label) +
    '</strong><small>' + (rows.length ? '回答 ' + rows.length + '/' + size + ' ・ 正解 ' + right + '問' : '未回答') + '</small></span><span>' + size + '問</span></button>';
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
  const answered = questions.filter(question => recordOf(item, question)).length;
  main.innerHTML = '<section class="hero course-hero"><div class="hero-inner"><div class="eyebrow">学習ホーム</div><h1>' + escapeHtml(family?.name || item.name) + '</h1><p>' + escapeHtml(item.type) + ' / ' + escapeHtml(item.issuer || '追加した資格') +
    '</p></div></section>' + levelSelector(family, item) + '<div class="box"><h3>' +
    (family ? escapeHtml(item.name) + ' の教材と進捗' : '教材と進捗') + '</h3><p>' + (questions.length ? '演習 ' + questions.length + '問 ・ 回答済み ' + answered + '問' :
      '<span class="badge soon">準備中</span> 演習問題は準備中です。公式教材を参照し、学習メモや自作問題を追加できます。') + '</p>' +
      (item.url ? '<a href="' + escapeHtml(item.url) + '" target="_blank" rel="noopener noreferrer">認定団体のサイトを開く</a>' : '') +
    '</div><div class="actions">' +
    (questions.length ? '<a class="button primary" href="#practice">演習を始める</a>' : '') +
    '<button class="outline" data-question="' + item.id + '">問題を追加</button></div>' +
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
    state.custom.push(item);
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

/* ---------- 演習画面 ---------- */
function start(item, questions, label) {
  if (!questions.length) return;
  quiz = {
    item, label, index: 0, finished: false,
    rows: questions.map(question => {
      const order = question.choices.map((_, i) => i);
      if (question.shuffle) for (let i = order.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
      }
      return { question, order, picked: [], done: false, right: null, text: '' };
    })
  };
  renderQuiz();
}
const needed = question => question.type === 'multiple' ? question.answer.length : 1;
function statusBar() {
  return '<ol class="q-status" aria-label="各問題の合否">' + quiz.rows.map((row, i) =>
    '<li><button data-goto="' + i + '" class="' + (row.done ? (row.right ? 'is-right' : 'is-wrong') : '') + (i === quiz.index && !quiz.finished ? ' is-current' : '') +
    '" aria-label="問' + (i + 1) + '：' + (row.done ? (row.right ? '正解' : '不正解') : '未回答') + '"' + (i === quiz.index && !quiz.finished ? ' aria-current="step"' : '') + '>' +
    (i + 1) + '</button></li>').join('') + '</ol>';
}
function marked(text, mark) {
  const at = mark ? text.indexOf(mark) : -1;
  if (at < 0) return escapeHtml(text);
  return escapeHtml(text.slice(0, at)) + '<mark class="miss">' + escapeHtml(mark) + '</mark>' + escapeHtml(text.slice(at + mark.length));
}
function renderQuiz() {
  if (quiz.finished) return renderResult();
  const row = quiz.rows[quiz.index];
  const question = row.question;
  const done = quiz.rows.filter(entry => entry.done);
  const score = done.filter(entry => entry.right).length;
  let body = '';
  if (question.type === 'fill' || question.type === 'written') {
    body = question.type === 'fill'
      ? '<form class="fill" id="fill"><label class="field">解答を入力<input name="answer" autocomplete="off" spellcheck="false" ' + (row.done ? 'disabled value="' + escapeHtml(row.text) + '"' : '') + '></label>' +
        (row.done ? '' : '<button class="primary">回答する（Enter）</button>') + '</form>'
      : (row.done ? '' : '<div class="actions"><button class="primary" data-reveal>模範解答を見る（Enter）</button></div>');
    if (question.type === 'written' && row.revealed && !row.done)
      body += '<div class="model"><h3>模範解答</h3><p>' + escapeHtml(question.model) + '</p></div><div class="actions"><button class="primary" data-self="1">1　書けた</button><button class="outline" data-self="0">2　書けなかった</button></div>';
  } else {
    body = '<div class="choices' + (row.done ? ' revealed' : '') + '">' + row.order.map((choiceIndex, position) => {
      const isAnswer = question.answer.includes(choiceIndex);
      const isPicked = row.picked.includes(choiceIndex);
      const why = question.why?.[choiceIndex];
      const state = row.done ? (isAnswer ? 'is-answer' : isPicked ? 'is-miss' : 'is-other') : (isPicked ? 'is-picked' : '');
      return '<div class="choice ' + state + '"><button class="option" data-pick="' + position + '"' + (row.done ? ' disabled' : '') + ' aria-pressed="' + isPicked + '">' +
        '<kbd>' + (position + 1) + '</kbd><span class="option-text">' + (row.done && !isAnswer ? marked(question.choices[choiceIndex], why?.mark) : escapeHtml(question.choices[choiceIndex])) + '</span>' +
        (row.done ? '<span class="verdict">' + (isAnswer ? '正解' : isPicked ? 'あなたの回答' : '誤り') + '</span>' : '') + '</button>' +
        (row.done && why ? '<p class="why"><span class="why-label">' + (isAnswer ? 'ここが正しい' : (why.mark ? '「' + escapeHtml(why.mark) + '」が誤り' : '誤り')) + '</span>' + escapeHtml(why.reason) + '</p>' : '') +
        '</div>';
    }).join('') + '</div>';
  }
  let feedback = '';
  if (row.done) {
    feedback = '<div class="feedback ' + (row.right ? 'ok' : 'ng') + '" role="status"><strong>' + (row.right ? '正解' : '不正解') + '</strong>' +
      (question.type === 'fill' ? '<p>正答：' + escapeHtml((question.accept || [question.model]).join(' ／ ')) + '</p>' : '') +
      (question.type === 'written' ? '<div class="model"><h3>模範解答</h3><p>' + escapeHtml(question.model) + '</p></div>' : '') +
      '<h3>解説</h3><p>' + escapeHtml(question.explanation) + '</p>' + (question.note ? '<p class="subtext">補足：' + escapeHtml(question.note) + '</p>' : '') + '</div>';
  }
  const last = quiz.index === quiz.rows.length - 1;
  main.innerHTML = '<section class="quiz" aria-labelledby="quiz-title">' +
    '<div class="quiz-head"><div><p class="subtext">' + escapeHtml(quiz.item.name) + ' ・ ' + escapeHtml(quiz.label) + '</p><h1 id="quiz-title">問題演習</h1></div>' +
    '<div class="quiz-score">' + score + ' / ' + done.length + ' 正解<button class="outline" data-quit>演習を終了</button></div></div>' +
    statusBar() +
    '<article class="question-card"><p class="q-meta"><span>問 ' + (quiz.index + 1) + ' / ' + quiz.rows.length + '</span><span class="tag">' + escapeHtml(question.set) + '</span>' +
    (question.type === 'multiple' ? '<span class="tag">' + needed(question) + 'つ選択</span>' : '') + '</p>' +
    '<h2 class="q-text">' + escapeHtml(question.q) + '</h2>' + (question.code ? '<pre class="q-code">' + escapeHtml(question.code) + '</pre>' : '') +
    body + feedback +
    '<div class="quiz-nav"><button class="outline" data-move="-1"' + (quiz.index ? '' : ' disabled') + '>← 前の問題</button>' +
    '<button class="primary" data-move="1"' + (row.done ? '' : ' hidden') + '>' + (last ? '結果を見る（Enter）' : '次の問題（Enter）→') + '</button>' +
    (row.done || last ? '' : '<button class="outline" data-move="1">スキップ →</button>') + '</div>' +
    '<p class="key-help subtext">キー操作：1〜' + Math.max(2, question.choices.length) + ' で選択 ／ Enter で次へ ／ ← → で問題を移動</p></article></section>';
  const input = main.querySelector('#fill input:not([disabled])');
  if (input) input.focus();
  else main.querySelector('.q-status .is-current')?.scrollIntoView({ block: 'nearest', inline: 'center' });
}
function grade(row, right) {
  row.done = true; row.right = right;
  const record = state.attempts[attemptKey(quiz.item, row.question)] ||= { total:0, correct:0, last:null };
  record.total++; record.last = right; if (right) record.correct++;
  persist();
  renderQuiz();
  main.querySelector('.feedback')?.scrollIntoView({ block: 'nearest', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
}
function pick(position) {
  const row = quiz.rows[quiz.index];
  const question = row.question;
  if (row.done || !['single', 'multiple'].includes(question.type)) return;
  const choiceIndex = row.order[position];
  if (choiceIndex === undefined) return;
  if (question.type === 'single') row.picked = [choiceIndex];
  else row.picked = row.picked.includes(choiceIndex) ? row.picked.filter(i => i !== choiceIndex) : [...row.picked, choiceIndex];
  // The answer appears as soon as the required number of choices is selected.
  if (row.picked.length === needed(question))
    grade(row, row.picked.length === question.answer.length && row.picked.every(i => question.answer.includes(i)));
  else renderQuiz();
}
const normalizeAnswer = value => value.normalize('NFKC').trim().replace(/\s+/g, ' ').replace(/(.)\/$/, '$1');
function submitFill(value) {
  const row = quiz.rows[quiz.index];
  if (row.done || !value.trim()) return;
  row.text = value;
  const accept = (row.question.accept?.length ? row.question.accept : [row.question.model]).map(normalizeAnswer);
  grade(row, accept.includes(normalizeAnswer(value)));
}
function move(step) {
  if (!quiz || quiz.finished) return;
  const next = quiz.index + step;
  if (next >= quiz.rows.length) { quiz.finished = true; return renderQuiz(); }
  if (next < 0) return;
  quiz.index = next; renderQuiz();
}
function renderResult() {
  const done = quiz.rows.filter(row => row.done);
  const right = done.filter(row => row.right).length;
  const wrong = quiz.rows.map((row, i) => ({ row, i })).filter(entry => entry.row.done && !entry.row.right);
  main.innerHTML = '<section class="quiz"><div class="quiz-head"><div><p class="subtext">' + escapeHtml(quiz.item.name) + ' ・ ' + escapeHtml(quiz.label) + '</p><h1>演習結果</h1></div></div>' +
    statusBar() + '<div class="box result"><p class="result-score"><strong>' + right + '</strong> / ' + quiz.rows.length + ' 問正解</p><p class="subtext">回答 ' + done.length + '問 ・ 未回答 ' + (quiz.rows.length - done.length) + '問</p>' +
    '<div class="actions">' + (wrong.length ? '<button class="primary" data-retry>間違えた ' + wrong.length + '問を解き直す</button>' : '') +
    '<button class="outline" data-goto="0">最初の問題から見直す</button><button class="outline" data-quit>出題セットに戻る</button></div></div>' +
    (wrong.length ? '<h2>間違えた問題</h2>' + wrong.map(entry => '<article class="box"><button class="link-like" data-goto="' + entry.i + '">問' + (entry.i + 1) + '：' + escapeHtml(entry.row.question.q) + '</button></article>').join('') : '') + '</section>';
}
document.addEventListener('keydown', event => {
  if (!quiz || modal.open || event.altKey || event.ctrlKey || event.metaKey) return;
  const typing = event.target.closest?.('input, textarea, select');
  const row = quiz.rows[quiz.index];
  if (typing) return; // 入力欄では Enter をフォーム送信に任せる
  if (quiz.finished) return;
  if (event.key === 'ArrowRight') { event.preventDefault(); move(1); }
  else if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); }
  else if (event.key === 'Enter') {
    if (event.target.closest?.('button') && !event.target.closest('.option')) return; // ボタンにフォーカスがある時はそのボタンを優先
    event.preventDefault();
    if (row.done) move(1);
    else if (row.question.type === 'written' && !row.revealed) { row.revealed = true; renderQuiz(); }
  } else if (/^[1-9]$/.test(event.key)) {
    if (row.question.type === 'written' && row.revealed && !row.done && (event.key === '1' || event.key === '2')) grade(row, event.key === '1');
    else pick(Number(event.key) - 1);
  }
});
document.addEventListener('submit', event => {
  if (event.target.id !== 'fill') return;
  event.preventDefault();
  submitFill(event.target.answer.value);
});
document.addEventListener('click', event => {
  const button = event.target.closest('button');
  if (!button) return;
  const action = button.dataset;
  if (action.type) { filter.type = action.type; renderResults(); [...main.querySelectorAll('button[data-type]')].find(btn => btn.dataset.type === action.type)?.focus(); }
  if (action.detail) detail(all().find(item => item.id === action.detail));
  if (action.question) addQuestion(all().find(item => item.id === action.question));
  if (action.start) {
    const item = all().find(entry => entry.id === action.start);
    const set = action.set || '';
    start(item, questionsOf(item).filter(inSet(set)), set === PRACTICE_ALL ? '問題集' : set || 'すべての問題');
  }
  if ('review' in action) { const item = selectedLevel(); start(item, missedOf(item), '弱点復習'); }
  if ('close' in action) modal.close();
  if (!quiz) return;
  if (action.pick !== undefined) pick(Number(action.pick));
  if (action.move) move(Number(action.move));
  if (action.goto !== undefined) { quiz.finished = false; quiz.index = Number(action.goto); renderQuiz(); }
  if ('reveal' in action) { quiz.rows[quiz.index].revealed = true; renderQuiz(); }
  if (action.self !== undefined) grade(quiz.rows[quiz.index], action.self === '1');
  if ('retry' in action) start(quiz.item, quiz.rows.filter(row => row.done && !row.right).map(row => row.question), quiz.label + '（解き直し）');
  if ('quit' in action) { quiz = null; render(); }
});
addEventListener('pageshow', event => {
  if (event.persisted) {
    try { state = { ...defaults, ...JSON.parse(localStorage.getItem(storageKey)) }; } catch {}
    render();
  }
});
addEventListener('hashchange', () => { render(); scrollTo(0, 0); });
render();
