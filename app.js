const main = document.querySelector('#main');
const modal = document.querySelector('#modal');
const modalTitle = document.querySelector('#modalTitle');
const modalContent = document.querySelector('#modalContent');
const storageKey = 'shikaku-atlas-v1';
const defaults = { custom: [], notes: {}, saved: [], attempts: {}, questions: {}, plans: {}, theme: '' };
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
    escapeHtml(item.issuer || '追加した資格') + (item.levels ? ' ・ ' + item.levels.length + '段階' : '') + '</p>' + plannedBadge(item) + '<span class="course-cta">専用サイトで学ぶ</span></a></article>';
}
let lastRoute;
async function render() {
  const page = location.hash.slice(1);
  if (modal.open && page !== lastRoute) modal.close();
  if (page !== lastRoute) { quiz = null; renderPlan.editing = false; }
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
    renderBookingLink(item);
    if (quiz) return renderQuiz();
    if (page === 'plan') renderPlan(item);
    else if (page === 'review') renderReview(item);
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
  // 高度試験の午前I は応用情報の午前問題を共用しているため、総数では重複して数えない。
  const total = items.reduce((sum, item) => sum + countQuestions(item) - (item.levels || [item]).reduce((n, level) => n + (index[level.id]?.shared || 0), 0), 0);
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
// 問題集は PRACTICE_ALL、試験区分ごとの問題集は PRACTICE_ALL + ':' + 区分名。
const inSet = set => question => {
  if (set.startsWith(PRACTICE_ALL)) {
    const part = set.slice(PRACTICE_ALL.length + 1);
    return !isMock(question.set) && (!part || question.part === part);
  }
  return !set || question.set === set;
};
const partsOf = item => index[item.id]?.parts || null;
function renderPractice(item) {
  const questions = questionsOf(item);
  const sets = [...new Set(questions.map(question => question.set))];
  const mocks = sets.filter(isMock).sort((a, b) => a.localeCompare(b, 'ja', { numeric: true }));
  const drillCount = questions.filter(inSet(PRACTICE_ALL)).length;
  const answered = questions.filter(question => recordOf(item, question)).length;
  main.innerHTML = '<h1>問題演習</h1><p>' + escapeHtml(item.name) + '</p>' +
    (questions.length ? '<p class="subtext">全' + questions.length + '問 ・ 回答済み ' + answered +
      '問。選択肢は 1〜5 キー、Enter で次へ、← → で問題を移動できます。</p>' +
      (drillCount ? '<section class="box"><h2>問題集</h2><p class="subtext">' + (partsOf(item) ? '試験区分ごとに分かれた問題集です。' : '分野別・基本の演習問題をまとめた問題集です。') + '</p><div class="set-list">' +
        (partsOf(item)
          ? partsOf(item).map(([part, size]) => size ? setButton(item, PRACTICE_ALL + ':' + part, part, size) :
              '<div class="set-button is-empty"><span class="set-name"><strong>' + escapeHtml(part) + '</strong><small>この区分の問題は準備中です</small></span><span class="badge soon">準備中</span></div>').join('')
          : setButton(item, PRACTICE_ALL, '問題集', drillCount)) + '</div></section>' : '') +
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
      '<div class="actions link-row">' + (item.url ? '<a href="' + escapeHtml(item.url) + '" target="_blank" rel="noopener noreferrer">認定団体のサイトを開く</a>' : '') +
      (bookingOf(item) ? '<a class="button outline booking-link" href="' + escapeHtml(bookingOf(item)[0]) + '" target="_blank" rel="noopener noreferrer">試験を予約する ↗</a>' : '') + '</div>' +
    '</div>' + planSummary(item) + '<div class="actions">' +
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

/* ---------- 試験予約サイト ---------- */
// data.js の bookingSites(資格名 → [URL, 表示名])。追加した資格は登録時の公式サイトURLを使う。
function bookingOf(item) {
  const site = typeof bookingSites === 'object' ? bookingSites[item.name] : null;
  if (site) return site;
  return item.url ? [item.url, '公式サイト'] : null;
}
function renderBookingLink(item) {
  const menu = document.querySelector('#workspace-nav');
  if (!menu) return;
  menu.querySelector('.booking-card')?.remove();
  const site = bookingOf(item);
  if (!site) return;
  const link = document.createElement('a');
  link.className = 'card booking-card';
  link.href = site[0]; link.target = '_blank'; link.rel = 'noopener noreferrer';
  link.innerHTML = '<span class="icon" aria-hidden="true">↗</span><span>試験を予約する<small>' + escapeHtml(site[1]) + '</small></span>';
  link.setAttribute('aria-label', item.name + 'の試験を予約する（' + site[1] + '・新しいタブで開く）');
  menu.append(link);
}

/* ---------- 学習計画（最短合格プラン） ---------- */
// AWS Architecture Academy の学習計画(#plan)と同じ考え方:
//  入力 … 1 日の学習時間・受験予定日(空 = 最短)・休みの曜日。CertAtlas は分野データの代わりに教材(インプット)の目安時間を加える
//  計算 … 教材インプット＋問題集の 1 周(誤答の復習を 2 割混ぜる) → 弱点復習(誤答 × 1.3) → 模擬試験 → 模試の復習 → 最終確認 → 受験日
//         受験日を指定した場合は、収まるまで 1 日の学習量を増やし、余った日は総合演習で埋める
//  保存 … state.plans[資格ID](localStorage の shikaku-atlas-v1)。日ごとの完了チェックも同じ場所に保存
const pad2 = n => String(n).padStart(2, '0');
const ymd = date => date.getFullYear() + '-' + pad2(date.getMonth() + 1) + '-' + pad2(date.getDate());
const todayStr = () => ymd(new Date());
const parseDay = text => new Date(text + 'T00:00:00');
const addDays = (text, n) => { const d = parseDay(text); d.setDate(d.getDate() + n); return ymd(d); };
const diffDays = (a, b) => Math.round((parseDay(b) - parseDay(a)) / 86400000);
const WEEK = ['日','月','火','水','木','金','土'];
const mdw = text => Number(text.slice(5, 7)) + '/' + Number(text.slice(8, 10)) + '(' + WEEK[parseDay(text).getDay()] + ')';
const hm = minutes => minutes >= 60 ? Math.floor(minutes / 60) + '時間' + (minutes % 60 ? ' ' + minutes % 60 + '分' : '') : minutes + '分';
const PHASES = {
  1: ['インプット＋問題集', '教材で基礎を固めながら、問題集を1周する'],
  2: ['弱点復習', '間違えた問題を正解できるまで解き直す'],
  3: ['総合演習', '全範囲を混ぜて解き、苦手を潰す'],
  4: ['模試・仕上げ', '本番形式の模擬試験 → 復習 → 最終確認'],
  0: ['休み', '計画上の休養日'],
  5: ['受験日', '']
};
const SET_ORDER = ['基本問題', '想定問題', '実践問題'];
// 公式教材・参考書でのインプットに必要な時間の目安(時間)。資格の難易度帯から概算する
function inputHours(item) {
  const name = item.name.normalize('NFKC');
  if (item.issuer === 'IPA') {
    if (/ITパスポート/.test(name)) return 40;
    if (/情報セキュリティマネジメント/.test(name)) return 40;
    if (/基本情報/.test(name)) return 100;
    if (/応用情報/.test(name)) return 180;
    return 220;
  }
  if (/CCIE|CCDE|JNCIE|LPIC-3|LinuC レベル3|LinuCシステムアーキテクト|CISSP|OSCP|SecurityX|CCSP|E資格|PgMP|GREM|SC-100|AZ-305|Professional Cloud Architect/.test(name)) return 150;
  if (/Professional|CCNP|JNCIP|JNCIS|LPIC-2|LinuC レベル2|RHCE|CISA|CISM|CRISC|CGEIT|CSSLP|CGRC|PMP|Gold|Advanced|Practitioner|CKA|CKS|CKAD|上位|Engineer|Architect|AZ-104|AZ-400|AZ-204|SC-200|SC-300|CySA|PenTest|CEH|GIAC|実践|データ分析|VCP|審査員/.test(name)) return 80;
  if (/Fundamentals|Foundations?|Essentials|Digital Leader|KCNA|KCSA|^CC|CAPM|G検定|Bronze|基礎|データサイエンティスト検定|個人情報保護士|JNCIA|A\+|Data\+|Project\+|Silver|Associate|SSCP|統計検定/.test(name)) return 35;
  return 50;
}
const secOf = question => question.type === 'written' ? 300 : question.type === 'multiple' || question.type === 'fill' ? 120 : 90;
function planInputs(item) {
  const questions = questionsOf(item);
  const drill = questions.filter(question => !isMock(question.set));
  const sets = [...new Set(drill.map(question => question.set))]
    .sort((a, b) => (SET_ORDER.indexOf(a) + 1 || 99) - (SET_ORDER.indexOf(b) + 1 || 99));
  const mocks = [...new Set(questions.filter(question => isMock(question.set)).map(question => question.set))]
    .sort((a, b) => a.localeCompare(b, 'ja', { numeric: true }));
  const records = questions.map(question => recordOf(item, question)).filter(Boolean);
  const correct = records.filter(record => record.last).length;
  const sec = questions.length ? questions.reduce((sum, question) => sum + secOf(question), 0) / questions.length : 90;
  return {
    questions, drill, sets, mocks, sec,
    unseen: sets.map(set => ({ set, left: drill.filter(question => question.set === set && !recordOf(item, question)).length })).filter(entry => entry.left),
    wrong: missedOf(item).length,
    // 1 周目で間違える割合の見込み(回答が少ないうちは 35% と仮定)
    wr: records.length >= 10 ? Math.min(0.6, Math.max(0.1, 1 - correct / records.length)) : 0.35
  };
}
// 1 日 minutes 分として、学習日の作業を順に並べる
function buildWork(info, minutes, inputMin) {
  const cap = Math.max(5, Math.floor(minutes * 60 / info.sec));
  const queue = info.unseen.map(entry => ({ ...entry }));
  let input = inputMin, pool = info.wrong;
  const work = [];
  // 問題集は教材インプットの期間全体に分散させる(分野を学んだ日に、その範囲の問題を解く)
  const totalNew = queue.reduce((sum, entry) => sum + entry.left, 0);
  const phaseDays = Math.max(1, Math.ceil((inputMin + totalNew * (1 + info.wr) * info.sec / 60) / minutes));
  const perDay = Math.max(1, Math.ceil(totalNew / phaseDays));
  while (input > 0 || queue.length) {
    const tasks = [];
    let qcap = queue.length ? (input > 0 ? Math.min(perDay, cap) : cap) : 0;
    const review = qcap && pool > 0 ? Math.min(pool, Math.max(1, Math.round(qcap * 0.2))) : 0;
    qcap = Math.max(0, qcap - review);
    const picked = [];
    let taken = 0;
    while (qcap > 0 && queue.length) {
      const head = queue[0], n = Math.min(qcap, head.left);
      picked.push({ k: 'new', set: head.set, n });
      head.left -= n; qcap -= n; taken += n;
      if (!head.left) queue.shift();
    }
    const used = Math.ceil((taken + review) * info.sec / 60);
    if (input > 0) {
      const use = Math.min(input, Math.max(Math.round(minutes * 0.3), minutes - used));
      tasks.push({ k: 'input', mins: use }); input -= use;
    }
    tasks.push(...picked);
    if (review) { tasks.push({ k: 'review', n: review }); pool -= review; }
    pool += Math.round(taken * info.wr);
    work.push({ ph: 1, tasks });
  }
  pool = Math.ceil(pool * 1.3);
  while (pool > 0) { const n = Math.min(cap, pool); work.push({ ph: 2, tasks: [{ k: 'review', n }] }); pool -= n; }
  const tail = [];
  const mockSets = info.mocks.length ? info.mocks : (info.drill.length ? [PRACTICE_ALL] : []);
  mockSets.forEach(set => {
    const n = set === PRACTICE_ALL ? info.drill.length : info.questions.filter(inSet(set)).length;
    tail.push({ ph: 4, tasks: [{ k: 'mock', set, n }] });
  });
  if (mockSets.length) tail.push({ ph: 4, tasks: [{ k: 'review', n: Math.max(5, Math.round(info.questions.length * info.wr / 2)) }] });
  tail.push({ ph: 4, tasks: [{ k: 'final' }] });
  return { work, tail, cap };
}
function studyDates(start, n, rest, end) {
  const out = [];
  for (let d = start, guard = 0; out.length < n && guard < 1500; d = addDays(d, 1), guard++) {
    if (end && d >= end) break;
    if (!rest.includes(parseDay(d).getDay())) out.push(d);
  }
  return out;
}
function makePlan(item, { min, rest, end, input }) {
  const info = planInputs(item);
  const start = todayStr();
  const inputMin = Math.round(input * 60);
  const shortest = (() => {
    const { work, tail } = buildWork(info, min, inputMin);
    const dates = studyDates(start, work.length + tail.length, rest);
    return { exam: addDays(dates[dates.length - 1] || start, 1), studyDays: dates.length };
  })();
  let minutes = min, work, tail, short = false;
  if (!end) {
    ({ work, tail } = buildWork(info, minutes, inputMin));
    end = shortest.exam;
  } else {
    const avail = studyDates(start, 9999, rest, end);
    // 受験日までに収まるまで 1 日の学習時間を増やす(上限 1 日 10 時間)
    for (; minutes <= 600; minutes += Math.max(5, Math.round(minutes * 0.05))) {
      ({ work, tail } = buildWork(info, minutes, inputMin));
      if (work.length + tail.length <= avail.length) break;
    }
    if (minutes > 600) minutes = 600;
    if (work.length + tail.length > avail.length) {
      // それでも足りない(受験日が近すぎる): 仕上げを優先し、入りきる分だけにする
      short = true;
      tail = tail.slice(-Math.min(tail.length, avail.length));
      work = work.slice(0, Math.max(0, avail.length - tail.length));
    }
    const extra = avail.length - work.length - tail.length;
    for (let i = 0; i < extra; i++) work.push({ ph: 3, tasks: [{ k: 'mix', n: Math.floor(minutes * 60 / info.sec) }] });
  }
  const seq = [...work, ...tail];
  const days = [];
  let k = 0;
  for (let d = start; d < end; d = addDays(d, 1)) {
    if (rest.includes(parseDay(d).getDay()) || k >= seq.length) days.push({ d, ph: 0, tasks: [{ k: 'rest' }] });
    else days.push({ d, ...seq[k++] });
  }
  days.push({ d: end, ph: 5, tasks: [{ k: 'exam' }] });
  const studyDays = days.filter(day => day.ph && day.ph !== 5).length;
  return { days, end, minutes, short, shortest, studyDays, inputMin };
}
function taskLabel(task) {
  if (task.k === 'input') return '教材インプット 約' + hm(task.mins) + '（公式教材・参考書で範囲を学習）';
  if (task.k === 'new') return task.set + 'を ' + task.n + '問 解く（新しい問題）';
  if (task.k === 'review') return '間違えた問題を ' + task.n + '問 解き直す';
  if (task.k === 'mix') return '問題集から ' + task.n + '問（全範囲を総合演習）';
  if (task.k === 'mock') return task.set === PRACTICE_ALL ? '問題集 ' + task.n + '問を本番形式で通し解き' : '模擬試験「' + task.set + '」' + task.n + '問を通しで解く';
  if (task.k === 'final') return '最終確認：学習メモと間違えた問題を見直す';
  if (task.k === 'exam') return '受験日';
  return '休養日';
}
function taskButton(item, task) {
  if (task.k === 'new') return '<button class="outline small" data-start="' + item.id + '" data-set="' + escapeHtml(task.set) + '">解く</button>';
  if (task.k === 'mix') return '<button class="outline small" data-start="' + item.id + '" data-set="' + PRACTICE_ALL + '">解く</button>';
  if (task.k === 'mock') return '<button class="outline small" data-start="' + item.id + '" data-set="' + escapeHtml(task.set) + '">解く</button>';
  if (task.k === 'review') return missedOf(item).length ? '<button class="outline small" data-review>復習</button>' : '';
  if (task.k === 'final') return '<a class="button outline small" href="#notes">メモ</a>';
  return '';
}
const planOf = item => state.plans[item.id];
const studyDaysOf = plan => plan.days.filter(day => day.ph && day.ph !== 5);
function plannedBadge(item) {
  const dates = (item.levels || [item]).map(level => state.plans[level.id]?.end).filter(end => end && end >= todayStr()).sort();
  return dates.length ? '<span class="badge plan-badge">受験予定 ' + mdw(dates[0]) + '</span>' : '';
}
function planSummary(item) {
  const plan = planOf(item);
  if (!plan) return '<section class="box plan-cta"><h3>最短合格プラン</h3><p class="subtext">1日に使える学習時間から、最短で受験できる日と日別の学習計画を作ります。</p><a class="button primary" href="#plan">学習計画を作る</a></section>';
  const today = plan.days.find(day => day.d === todayStr());
  const study = studyDaysOf(plan);
  const done = study.filter(day => plan.done[day.d]).length;
  return '<section class="box plan-cta"><h3>今日の学習計画</h3><p class="subtext">受験予定 ' + mdw(plan.end) + '（あと' + Math.max(0, diffDays(todayStr(), plan.end)) + '日）・ 達成 ' + done + ' / ' + study.length + '日</p>' +
    (today ? '<ul class="plan-tasks">' + today.tasks.map(task => '<li>' + escapeHtml(taskLabel(task)) + '</li>').join('') + '</ul>' : '<p>今日の予定はありません。</p>') +
    '<a class="button outline" href="#plan">学習計画を開く</a></section>';
}
function renderPlan(item) {
  const plan = planOf(item);
  main.innerHTML = '<div class="plan-page"><div><h1>学習計画</h1><p>' + escapeHtml(item.name) + ' を最短の日数で合格するための日別プランです。</p></div>' +
    (plan && !renderPlan.editing ? planView(item, plan) : planForm(item, plan)) + '</div>';
  if (!plan || renderPlan.editing) bindPlanForm(item, plan);
}
function planForm(item, plan) {
  const est = inputHours(item);
  const info = planInputs(item);
  const min = plan?.min || 90, rest = plan?.rest || [];
  const input = plan?.input ?? est;
  const end = plan?.fixed ? plan.end : '';
  return '<form class="box plan-form" id="plan-form"><h2>' + (plan ? '計画を作り直す' : '最短合格プランを作る') + '</h2>' +
    '<p class="subtext">1日に使える学習時間から、合格までの日別の計画を作ります。受験予定日を空にすると、最短で受験できる日程を提案します。収録問題 ' + info.questions.length + '問' +
    (info.mocks.length ? '（模擬試験 ' + info.mocks.length + 'セット）' : '') + 'と、これまでの回答結果を計画に反映します。</p>' +
    '<div class="plan-grid"><label class="field">1日の学習時間<select name="min">' + [30, 45, 60, 90, 120, 150, 180, 240, 300, 360, 480].map(m =>
      '<option value="' + m + '"' + (m === min ? ' selected' : '') + '>' + hm(m) + '</option>').join('') + '</select></label>' +
    '<label class="field">教材インプットの時間（目安 ' + est + '時間）<input type="number" name="input" min="0" max="500" step="1" value="' + input + '"></label>' +
    '<label class="field">受験予定日（空 = 最短）<input type="date" name="end" value="' + end + '" min="' + addDays(todayStr(), 2) + '"></label></div>' +
    '<fieldset class="plan-rest"><legend>休みの曜日（任意）</legend>' + [1, 2, 3, 4, 5, 6, 0].map(w =>
      '<label><input type="checkbox" name="rest" value="' + w + '"' + (rest.includes(w) ? ' checked' : '') + '><span>' + WEEK[w] + '</span></label>').join('') + '</fieldset>' +
    '<p class="plan-preview" role="status"></p><p class="subtext">インプット時間は資格の難易度からの目安です。すでに学習済みの範囲があれば減らしてください。</p>' +
    '<div class="actions">' + (plan ? '<button type="button" class="outline" data-plan-cancel>キャンセル</button>' : '') + '<button class="primary">この内容で計画を作る</button></div></form>';
}
function readPlanForm(form) {
  const data = new FormData(form);
  return {
    min: Number(data.get('min')) || 90,
    input: Math.min(500, Math.max(0, Number(data.get('input')) || 0)),
    end: data.get('end') || '',
    rest: data.getAll('rest').map(Number)
  };
}
function bindPlanForm(item, plan) {
  const form = main.querySelector('#plan-form');
  const preview = form.querySelector('.plan-preview');
  const update = () => {
    const options = readPlanForm(form);
    if (options.rest.length === 7) { preview.innerHTML = '<span class="plan-warn">すべての曜日を休みにはできません。</span>'; return null; }
    if (options.end && options.end <= todayStr()) { preview.innerHTML = '<span class="plan-warn">受験予定日は明日以降の日付にしてください。</span>'; return null; }
    const result = makePlan(item, options);
    const total = Math.round(result.studyDays * result.minutes / 60);
    preview.innerHTML = options.end
      ? '<b>' + mdw(result.end) + ' 受験 ・ 1日 約' + hm(result.minutes) + '</b> ・ 学習日 ' + result.studyDays + '日' +
        (result.minutes > options.min && !result.short ? '<br><span class="plan-warn">受験日に間に合わせるため、1日の学習時間を ' + hm(result.minutes) + ' に増やしています。</span>' : '') +
        (result.short ? '<br><span class="plan-warn">受験日までの日数が足りません。仕上げを優先した計画になります。' + mdw(result.shortest.exam) + ' 以降の受験なら全範囲を回せます（1日 ' + hm(options.min) + '）。</span>' : '')
      : '<b>最短の受験日：' + mdw(result.end) + '（' + diffDays(todayStr(), result.end) + '日後）</b> ・ 学習日 ' + result.studyDays + '日 ・ 総学習時間 約' + total + '時間';
    return { options, result };
  };
  form.oninput = update;
  update();
  form.onsubmit = event => {
    event.preventDefault();
    const made = update();
    if (!made) return;
    const { options, result } = made;
    const old = planOf(item);
    state.plans[item.id] = {
      v: 1, min: options.min, input: options.input, rest: options.rest, fixed: !!options.end,
      created: todayStr(), end: result.end, minutes: result.minutes, short: result.short,
      days: result.days, done: old?.done || {}
    };
    renderPlan.editing = false;
    if (persist()) toast('学習計画を作成しました。');
    render();
  };
}
function planView(item, plan) {
  const today = todayStr();
  const study = studyDaysOf(plan);
  const done = study.filter(day => plan.done[day.d]).length;
  const late = study.filter(day => day.d < today && !plan.done[day.d]).length;
  const left = Math.max(0, diffDays(today, plan.end));
  const phases = [1, 2, 3, 4].map(ph => ({ ph, n: plan.days.filter(day => day.ph === ph).length })).filter(entry => entry.n);
  const current = plan.days.find(day => day.d === today);
  const todayBox = current
    ? '<section class="box plan-today ph' + current.ph + '"><div class="plan-day-h"><h2>今日の学習 ' + mdw(today) + '</h2><span class="plan-chip">' + PHASES[current.ph][0] + '</span></div>' +
      (PHASES[current.ph][1] ? '<p class="subtext">' + PHASES[current.ph][1] + '</p>' : '') +
      '<ul class="plan-task-list">' + current.tasks.map(task => '<li><span>' + escapeHtml(taskLabel(task)) + '</span>' + taskButton(item, task) + '</li>').join('') + '</ul>' +
      (current.ph && current.ph !== 5 ? '<label class="plan-check"><input type="checkbox" data-plan-done="' + current.d + '"' + (plan.done[current.d] ? ' checked' : '') + '> 今日の学習を完了にする</label>' : '') + '</section>'
    : '<section class="box"><p>' + (today > plan.end ? '受験予定日を過ぎました。お疲れさまでした。次の目標に向けて計画を作り直せます。' : '計画は ' + mdw(plan.days[0].d) + ' から始まります。') + '</p></section>';
  return '<section class="box plan-summary"><div class="plan-day-h"><h2>' + (plan.fixed ? '受験日指定プラン' : '最短合格プラン') + '</h2>' +
    '<div class="actions"><button class="outline small" data-plan-edit>計画を作り直す</button><button class="outline small" data-plan-delete>計画を削除</button></div></div>' +
    '<div class="plan-kpis"><div class="plan-kpi"><span>受験予定日</span><strong>' + mdw(plan.end) + '</strong><small>あと ' + left + '日</small></div>' +
    '<div class="plan-kpi"><span>学習日</span><strong>' + done + ' / ' + study.length + '日</strong><small>' + (late ? '未完了の過去日 ' + late + '日' : '予定どおり') + '</small></div>' +
    '<div class="plan-kpi"><span>1日の学習時間</span><strong>約' + hm(plan.minutes) + '</strong><small>' + (plan.rest.length ? '休み：' + plan.rest.map(w => WEEK[w]).join('・') : '休みの曜日なし') + '</small></div>' +
    '<div class="plan-kpi"><span>総学習時間</span><strong>約' + Math.round(study.length * plan.minutes / 60) + '時間</strong><small>うち教材 ' + plan.input + '時間</small></div></div>' +
    '<div class="plan-phases" aria-label="フェーズの内訳">' + phases.map(entry => '<span class="plan-phase ph' + entry.ph + '" title="' + PHASES[entry.ph][0] + ' ' + entry.n + '日" style="flex-grow:' + entry.n + '"><b>' + PHASES[entry.ph][0] + '</b><small>' + entry.n + '日</small></span>').join('') + '</div>' +
    (plan.short ? '<p class="plan-warn">受験日までの日数が足りないため、仕上げを優先した計画です。</p>' : '') +
    (bookingOf(item) ? '<p class="subtext">受験日が決まったら、早めに予約しましょう。 <a href="' + escapeHtml(bookingOf(item)[0]) + '" target="_blank" rel="noopener noreferrer">試験を予約する（' + escapeHtml(bookingOf(item)[1]) + '）↗</a></p>' : '') + '</section>' +
    todayBox +
    '<section class="box"><h2>日別の計画</h2><ol class="plan-days">' + plan.days.map(day => {
      const isStudy = day.ph && day.ph !== 5;
      return '<li class="plan-row ph' + day.ph + (day.d === today ? ' is-today' : '') + (plan.done[day.d] ? ' is-done' : '') + (isStudy && day.d < today && !plan.done[day.d] ? ' is-late' : '') + '">' +
        '<span class="plan-date">' + mdw(day.d) + '</span><span class="plan-chip">' + PHASES[day.ph][0] + '</span>' +
        '<span class="plan-row-tasks">' + day.tasks.map(task => escapeHtml(taskLabel(task))).join('<br>') + '</span>' +
        (isStudy ? '<label class="plan-check"><input type="checkbox" data-plan-done="' + day.d + '"' + (plan.done[day.d] ? ' checked' : '') + ' aria-label="' + mdw(day.d) + ' を完了にする"> 完了</label>' : '<span></span>') + '</li>';
    }).join('') + '</ol></section>';
}
document.addEventListener('change', event => {
  const box = event.target.closest?.('[data-plan-done]');
  if (!box) return;
  const item = selectedLevel();
  const plan = item && planOf(item);
  if (!plan) return;
  if (box.checked) plan.done[box.dataset.planDone] = true; else delete plan.done[box.dataset.planDone];
  persist();
  render();
});
document.addEventListener('click', event => {
  const button = event.target.closest('button');
  if (!button || !inSchool) return;
  const item = selectedLevel();
  if (!item) return;
  if ('planEdit' in button.dataset) { renderPlan.editing = true; render(); }
  if ('planCancel' in button.dataset) { renderPlan.editing = false; render(); }
  if ('planDelete' in button.dataset && confirm('この資格の学習計画を削除しますか？（演習の記録は残ります）')) {
    delete state.plans[item.id]; renderPlan.editing = false; persist(); render();
  }
});

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
    '<article class="question-card"><p class="q-meta"><span>問 ' + (quiz.index + 1) + ' / ' + quiz.rows.length + '</span><span class="tag">' + escapeHtml(isMock(question.set) ? question.set : (question.part ? question.part + ' ・ ' : '') + '問題集') + '</span>' +
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
    start(item, questionsOf(item).filter(inSet(set)), set.startsWith(PRACTICE_ALL) ? ['問題集', set.slice(PRACTICE_ALL.length + 1)].filter(Boolean).join(' ・ ') : set || 'すべての問題');
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
