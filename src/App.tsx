import { useState } from 'react';
import type { FormEvent } from 'react';
import type { ReactNode } from 'react';
import { LayoutDashboard, Beef, ReceiptText, HeartPulse, Wheat, Tractor, ChartNoAxesCombined, Settings, Search, ChevronRight, Bell, Menu, X, ArrowUpRight, ShieldCheck, Cloud, Wifi, Download, CalendarDays, FileText } from 'lucide-react';
import { animals as demoAnimals, purchases, expenses, treatments, hayLots } from './demoData';
import type { Animal } from './demoData';
import cattleBrand from './assets/rh-cattle-brand.svg';

type Section = 'Overview' | 'Animals' | 'Purchases' | 'Health & Treatments' | 'Hay & Feed' | 'Equipment' | 'Expenses' | 'Reports' | 'Settings';
const nav = [
  { title: 'Overview' as Section, icon: LayoutDashboard }, { title: 'Animals' as Section, icon: Beef },
  { title: 'Purchases' as Section, icon: ReceiptText }, { title: 'Health & Treatments' as Section, icon: HeartPulse },
  { title: 'Hay & Feed' as Section, icon: Wheat }, { title: 'Equipment' as Section, icon: Tractor },
  { title: 'Expenses' as Section, icon: ChartNoAxesCombined }, { title: 'Reports' as Section, icon: FileText },
  { title: 'Settings' as Section, icon: Settings }
];
const currency = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
function Tag({ children, kind = 'neutral' }: { children: ReactNode; kind?: 'neutral' | 'green' | 'orange' }) { return <span className={`tag ${kind}`}>{children}</span> }
function Panel({ title, subtitle, children, action }: { title: string; subtitle?: string; children: ReactNode; action?: ReactNode }) { return <section className="panel"><div className="panel-head"><div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>{action}</div>{children}</section> }
function SimpleTable({ headers, rows }: { headers: string[]; rows: ReactNode[][] }) { return <div className="table-scroller"><table><thead><tr>{headers.map(h => <th key={h}>{h}</th>)}</tr></thead><tbody>{rows.map((r, i) => <tr key={i}>{r.map((v, j) => <td key={j}>{v}</td>)}</tr>)}</tbody></table></div> }
function Empty({ title }: { title: string }) { return <div className="empty"><p>{title}</p><small>Data entry and cloud connection are planned for the next milestone.</small></div> }
// This browser-only prototype deliberately stores test entries separately from demo fixtures.
// It does not sync or replace the iPhone SQLite database.
const STORAGE_KEY = 'herdkeeper-desktop-local-animals-v1';
function readLocalAnimals(): Animal[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const value: unknown = JSON.parse(raw);
    return Array.isArray(value) ? value.filter((a): a is Animal =>
      !!a && typeof a === 'object' && typeof a.id === 'string' &&
      typeof a.tag === 'string' && typeof a.className === 'string' &&
      typeof a.sex === 'string' && typeof a.breed === 'string' &&
      typeof a.source === 'string' && typeof a.weight === 'number' &&
      typeof a.acquired === 'string' && typeof a.status === 'string') : [];
  } catch { return []; }
}
const blankAnimal = () => ({ tag: '', className: 'Cow', sex: 'Female', breed: '', weight: '', acquired: new Date().toISOString().slice(0, 10), source: 'Existing herd' });

export default function App() {
  const [section, setSection] = useState<Section>('Overview'); const [query, setQuery] = useState(''); const [animal, setAnimal] = useState<Animal | null>(null); const [mobileMenu, setMobileMenu] = useState(false);
  const [localAnimals, setLocalAnimals] = useState<Animal[]>(readLocalAnimals);
  const [showAddAnimal, setShowAddAnimal] = useState(false);
  const [form, setForm] = useState(blankAnimal);
  const [saveError, setSaveError] = useState('');
  const animals = [...localAnimals, ...demoAnimals];
  function saveAnimal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const tag = form.tag.trim(), breed = form.breed.trim(), weight = Number(form.weight);
    if (!tag) { setSaveError('Enter an ear tag or identifying name.'); return; }
    if (animals.some(a => a.tag.toLowerCase() === tag.toLowerCase())) {
      setSaveError('That tag or name is already used in this test workspace.'); return;
    }
    if (form.weight && (!Number.isFinite(weight) || weight <= 0)) { setSaveError('Weight must be greater than zero.'); return; }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(form.acquired) || !Number.isFinite(Date.parse(form.acquired))) { setSaveError('Choose a valid acquisition date.'); return; }
    const newAnimal: Animal = {
      id: crypto.randomUUID(), tag, className: form.className, sex: form.sex,
      breed: breed || 'Not recorded', acquired: form.acquired, status: 'Active', weight: form.weight ? weight : 0, source: form.source
    };
    const next = [newAnimal, ...localAnimals];
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); }
    catch { setSaveError('Could not save in this browser. Check storage permissions and space.'); return; }
    setLocalAnimals(next); setForm(blankAnimal()); setSaveError(''); setShowAddAnimal(false); setAnimal(newAnimal);
  }

  const navigate = (s: Section) => { setSection(s); setAnimal(null); setShowAddAnimal(false); setQuery(''); setMobileMenu(false) };
  const filtered = animals.filter(a => [a.tag, a.className, a.breed, a.source, a.sex].some(v => v.toLowerCase().includes(query.toLowerCase())));
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  return <div className="shell">
    <aside className={`sidebar ${mobileMenu ? 'shown' : ''}`}>
      <div className="sidebar-brand"><div className="brand-icon"><Beef size={25} /></div><div><strong>HERDKEEPER</strong><span>FARM MANAGEMENT</span></div><button className="close-mobile" aria-label="Close menu" onClick={() => setMobileMenu(false)}><X /></button></div>
   <div className="farm-switch">
        <div className="farm-avatar farm-avatar-logo">
          <img
            src={cattleBrand}
            alt="R.H. Cattle Brand"
            className="farm-logo-image"
          />
        </div>

        <div>
          <strong>R.H. Cattle</strong>
          <span>Founding Farm · Demo</span>
        </div>

        <ChevronRight size={16} />
      </div>
      <div className="nav-label">WORKSPACE</div><nav aria-label="Main navigation">{nav.map(({ title, icon: Icon }) => <button key={title} onClick={() => navigate(title)} className={`nav-link ${section === title ? 'active' : ''}`}><Icon size={19} /><span>{title}</span>{section === title && <span className="nav-current" />}</button>)}</nav>
      <div className="sidebar-bottom"><div className="connection"><Cloud size={17} /><div><strong>Online desktop</strong><span>Cloud sync not connected</span></div></div><small>HerdKeeper desktop · Preview 0.1</small></div>
    </aside>
    {mobileMenu && <button className="scrim" onClick={() => setMobileMenu(false)} aria-label="Close navigation" />}
    <main className="main">
      <header className="topbar"><div className="topbar-left"><button className="menu-toggle" aria-label="Open navigation" onClick={() => setMobileMenu(true)}><Menu /></button><span>Workspace</span><ChevronRight size={15} /><strong>{section}</strong></div><div className="top-actions"><span className="demo-chip">DEMO DATA</span><button className="icon-button" aria-label="Notifications (not yet available)" title="Notifications coming later"><Bell size={20} /></button><div className="avatar">F</div></div></header>
      <div className="content">
        <div className="page-head"><div><div className="eyebrow">FARM OPERATIONS / {section.toUpperCase()}</div><h1>{section === 'Overview' ? 'Good morning, Farmer' : section}</h1><p>{section === 'Overview' ? 'Here’s a clear view of your farm today.' : section === 'Animals' ? 'Track animals, classifications, tags, and life history.' : 'Your farm records, all in one place.'}</p></div><div className="head-actions"><span className="date-pill"><CalendarDays size={16} /> Desktop preview</span></div></div>
        <div className="notice"><ShieldCheck size={20} /><div><strong>Preview mode — example records only.</strong><span>This desktop app does not access your iPhone database yet. New animal entries are saved only in this browser for testing. Cloud sync and login are not enabled; do not enter real farm records yet.</span></div></div>
        {section === 'Overview' && <>
          <div className="metrics">
            <div className="metric-card"><div className="metric-top"><span>Animals on farm</span><Beef /></div><strong>{animals.length}</strong><small><span className="dot" /> Includes browser test entries</small></div>
            <div className="metric-card"><div className="metric-top"><span>Livestock purchases</span><ReceiptText /></div><strong>{purchases.length}</strong><small>Example transactions</small></div>
            <div className="metric-card"><div className="metric-top"><span>Recorded expenses</span><ChartNoAxesCombined /></div><strong>{currency(totalExpenses)}</strong><small>Sample expense total</small></div>
            <div className="metric-card"><div className="metric-top"><span>Hay inventory</span><Wheat /></div><strong>{hayLots[0].quantity} <em>bales</em></strong><small>Purchased hay · demo</small></div>
          </div>
          <div className="main-grid"><Panel title="Recent animals" subtitle="Quickly open an animal’s profile" action={<button className="text-button" onClick={() => navigate('Animals')}>View all <ArrowUpRight size={15} /></button>}><div className="animal-list">{animals.slice(0, 4).map(a => <button key={a.id} className="animal-row" onClick={() => { setSection('Animals'); setAnimal(a) }}><span className="animal-initial"><Beef size={19} /></span><span><strong>{a.tag}</strong><small>{a.className} · {a.breed}</small></span><Tag kind="green">Active</Tag><ChevronRight size={17} /></button>)}</div></Panel>
            <Panel title="Recent expenses" subtitle="Example farm spending" action={<button className="text-button" onClick={() => navigate('Expenses')}>View all <ArrowUpRight size={15} /></button>}><div className="expense-list">{expenses.map(e => <div className="expense-row" key={e.id}><div className="expense-icon"><ReceiptText size={18} /></div><div><strong>{e.description}</strong><small>{e.category} · {e.date}</small></div><b>{currency(e.amount)}</b></div>)}</div></Panel></div>
          <div className="section-heading"><h2>Farm management</h2><p>Explore the desktop workspace</p></div>
          <div className="quick-grid">{[{ s: 'Animals' as Section, icon: Beef, txt: 'Livestock profiles & identifiers' }, { s: 'Health & Treatments' as Section, icon: HeartPulse, txt: 'Veterinary care & medication' }, { s: 'Hay & Feed' as Section, icon: Wheat, txt: 'Purchased feed inventory' }, { s: 'Reports' as Section, icon: ChartNoAxesCombined, txt: 'Accountant-ready reporting' }].map(({ s, icon: Icon, txt }) => <button className="quick-card" key={s} onClick={() => navigate(s)}><span><Icon size={21} /></span><strong>{s}</strong><small>{txt}</small><ChevronRight size={18} className="quick-arrow" /></button>)}</div>
        </>}
        {section === 'Animals' && <>{animal ? <><button className="back" onClick={() => setAnimal(null)}>← Back to animals</button><Panel title={`Animal ${animal.tag}`} subtitle="Example animal profile"><div className="detail-grid">{[['Classification', animal.className], ['Species', 'Cattle'], ['Sex', animal.sex], ['Breed', animal.breed], ['Current identifier', animal.tag], ['Weight', `${animal.weight} lb`], ['Acquired', animal.acquired], ['Source', animal.source], ['Mother', animal.mother || 'Not recorded']].map(([k, v]) => <div key={k}><small>{k}</small><strong>{v}</strong></div>)}</div><div className="detail-note"><HeartPulse size={19} /> Health records, identifiers and full history will appear here when connected to the farm API.</div></Panel></> : <Panel title="Animal registry" subtitle="Search animal records; new entries are saved in this browser only" action={<div className="registry-actions"><Tag>Demo + local test records</Tag><button className="primary-button" onClick={() => { setShowAddAnimal(!showAddAnimal); setSaveError('') }}>{showAddAnimal ? 'Cancel' : '+ Add animal'}</button></div>}>
          {showAddAnimal && <form className="animal-form" onSubmit={saveAnimal}>
            <div className="form-heading"><strong>Register a test animal</strong><span>Saved only in this browser, not the iPhone or cloud.</span></div>
            <div className="form-grid">
              <label>Ear tag / name *<input required maxLength={80} value={form.tag} onChange={e => setForm({ ...form, tag: e.target.value })} placeholder="e.g. HK-201" /></label>
              <label>Classification<select value={form.className} onChange={e => setForm({ ...form, className: e.target.value })}>{['Cow', 'Bull', 'Steer', 'Heifer', 'Heifer Calf', 'Bull Calf', 'Calf', 'Doe', 'Buck', 'Ewe', 'Ram', 'Other'].map(v => <option key={v}>{v}</option>)}</select></label>
              <label>Sex<select value={form.sex} onChange={e => setForm({ ...form, sex: e.target.value })}>{['Female', 'Male', 'Unknown'].map(v => <option key={v}>{v}</option>)}</select></label>
              <label>Breed<input value={form.breed} onChange={e => setForm({ ...form, breed: e.target.value })} placeholder="e.g. Angus" /></label>
              <label>Weight (lb, optional)<input type="number" min="0.01" step="0.01" value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })} placeholder="e.g. 760" /></label>
              <label>Acquired on *<input type="date" required value={form.acquired} onChange={e => setForm({ ...form, acquired: e.target.value })} /></label>
              <label>Source<select value={form.source} onChange={e => setForm({ ...form, source: e.target.value })}>{['Existing herd', 'Auction purchase', 'Farm birth', 'Private purchase', 'Other'].map(v => <option key={v}>{v}</option>)}</select></label>
            </div>
            {saveError && <p className="form-error" role="alert">{saveError}</p>}
            <div className="form-buttons"><button type="button" className="secondary-button" onClick={() => setShowAddAnimal(false)}>Cancel</button><button type="submit" className="primary-button">Save test animal</button></div>
          </form>}
          <div className="toolbar"><Search size={18} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search ear tag, breed, or classification" aria-label="Search animals" /></div><SimpleTable headers={['Ear tag', 'Classification', 'Breed', 'Weight', 'Source', 'Status', '']} rows={filtered.map(a => [<strong>{a.tag}</strong>, a.className, a.breed, `${a.weight} lb`, a.source, <Tag kind="green">{a.status}</Tag>, <button className="row-action" onClick={() => setAnimal(a)}>Open <ChevronRight size={14} /></button>])} />{filtered.length === 0 && <div className="empty">No matching animals.</div>}</Panel>}</>}
        {section === 'Purchases' && <Panel title="Auction purchases" subtitle="Purchases will link directly to animal profiles" action={<Tag>Demo</Tag>}><SimpleTable headers={['Invoice', 'Date', 'Seller', 'Animals', 'Total']} rows={purchases.map(p => [<strong>{p.id}</strong>, p.date, p.seller, p.animals, currency(p.total)])} /></Panel>}
        {section === 'Expenses' && <Panel title="Farm expenses" subtitle="Categorized expenses for bookkeeping and year-end reports" action={<Tag>Demo</Tag>}><SimpleTable headers={['Date', 'Category', 'Description', 'Amount']} rows={expenses.map(e => [e.date, <Tag>{e.category}</Tag>, e.description, <strong>{currency(e.amount)}</strong>])} /></Panel>}
        {section === 'Health & Treatments' && <Panel title="Animal health & treatments" subtitle="Each treatment will belong to an individual animal"><SimpleTable headers={['Date', 'Animal', 'Category', 'Notes', 'Status']} rows={treatments.map(t => [t.date, <strong>{t.animal}</strong>, t.type, t.detail, <Tag kind="green">{t.status}</Tag>])} /><div className="detail-note"><HeartPulse size={19} /> Planned: medication, dose, route, administrator, withdrawal dates, and treatment cost.</div></Panel>}
        {section === 'Hay & Feed' && <Panel title="Purchased hay inventory" subtitle="Keep track of purchased feed, quantity and costs"><SimpleTable headers={['Lot', 'Feed', 'Source', 'Quantity', 'Cost']} rows={hayLots.map(h => [h.id, <strong>{h.name}</strong>, h.source, `${h.quantity} ${h.unit}`, currency(h.cost)])} /></Panel>}
        {section === 'Equipment' && <Panel title="Equipment" subtitle="Manage machinery, purchase dates, maintenance and costs"><Empty title="No equipment examples yet" /></Panel>}
        {section === 'Reports' && <Panel title="Reports & exports" subtitle="Year-end accounting and farm performance"><div className="report-grid"><div><ChartNoAxesCombined size={24} /><strong>Expense summary</strong><span>By category and date</span><Tag>Planned</Tag></div><div><Download size={24} /><strong>Accountant export</strong><span>CSV and printable PDF</span><Tag>Planned</Tag></div><div><ReceiptText size={24} /><strong>Livestock purchases</strong><span>Animal acquisition ledger</span><Tag>Planned</Tag></div></div></Panel>}
        {section === 'Settings' && <Panel title="Desktop settings" subtitle="Farm setup, account access and synchronization"><div className="setting-line"><Wifi size={20} /><div><strong>Cloud connection</strong><span>Not configured. No farm data is being transmitted.</span></div><Tag kind="orange">Not connected</Tag></div><div className="setting-line"><ShieldCheck size={20} /><div><strong>Demo workspace</strong><span>Sample data is stored in the source code, not your farm records.</span></div><Tag kind="green">Safe preview</Tag></div></Panel>}
        <footer><span>HerdKeeper · Desktop prototype</span><span>Built for small family farms</span></footer>
      </div>
    </main>
  </div>
}
