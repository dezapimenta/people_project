// GPM — App shell, dashboard composition, tweaks

const TWEAKS_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "accent": "azul",
  "density": "comfortable",
  "dashLayout": "cards",
  "defaultView": "cards"
}/*EDITMODE-END*/;

function Dashboard({ tweaks, onOpenProject }) {
  const [filter, setFilter] = useState('all');
  const [view, setView] = useState(tweaks.dashLayout || 'cards');
  // sync with tweaks
  useEffect(() => { setView(tweaks.dashLayout); }, [tweaks.dashLayout]);

  const filtered = useMemo(() => {
    if (filter === 'all') return PROJECTS;
    if (filter === 'mine') return PROJECTS.filter(p => p.owner.id === 'vc' || p.team.some(t => t.id === 'vc'));
    if (filter === 'risk') return PROJECTS.filter(p => p.status === 'risk' || p.status === 'blocked');
    if (filter === 'active') return PROJECTS.filter(p => ['progress','discovery','risk','blocked'].includes(p.status));
    if (filter === 'done') return PROJECTS.filter(p => p.status === 'done');
    return PROJECTS;
  }, [filter]);

  return (
    <div className="content">
      <div className="page-head">
        <div>
          <h1 className="page-title">Oi, Vanessa 👋</h1>
          <div className="page-sub">Panorama de People Tech · semana de 19 a 25 de maio</div>
        </div>
        <div className="page-head-actions">
          <button className="btn btn-ghost btn-sm">
            <Icon name="filter" size={14} color="currentColor" /> Filtros
          </button>
          <button className="btn btn-ghost btn-sm">
            <Icon name="download" size={14} color="currentColor" /> Exportar
          </button>
          <button className="btn btn-primary">
            <Icon name="plus" size={14} color="currentColor" /> Novo projeto
          </button>
        </div>
      </div>

      <StatsRow />

      <div className="filter-bar">
        {[
          ['all', 'Todos', PROJECTS.length],
          ['active', 'Ativos', PROJECTS.filter(p => ['progress','discovery','risk','blocked'].includes(p.status)).length],
          ['mine', 'Meus', PROJECTS.filter(p => p.team.some(t => t.id === 'vc') || p.owner.id === 'vc').length],
          ['risk', 'Em risco', PROJECTS.filter(p => p.status === 'risk' || p.status === 'blocked').length],
          ['done', 'Concluídos', PROJECTS.filter(p => p.status === 'done').length],
        ].map(([k, l, n]) => (
          <button key={k} className={`chip ${filter === k ? 'active' : ''}`} onClick={() => setFilter(k)}>
            {l} <span style={{ opacity: .6 }}>·</span> <span>{n}</span>
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 12.5, color: 'var(--ink-3)', marginRight: 4 }}>Ordenar por</span>
        <button className="chip" style={{ paddingRight: 8 }}>
          Prazo <Icon name="chevron-down" size={12} color="currentColor" />
        </button>
        <div className="view-switcher">
          <button className={`view-tab ${view === 'cards' ? 'active' : ''}`} onClick={() => setView('cards')}>
            <Icon name="layout-grid" size={13} color="currentColor" /> Cards
          </button>
          <button className={`view-tab ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')}>
            <Icon name="list" size={13} color="currentColor" /> Lista
          </button>
        </div>
      </div>

      <div className="dash-grid">
        <div>
          <div className="section-head">
            <h2 className="section-title">Projetos</h2>
            <span className="section-meta">{filtered.length} projetos</span>
          </div>
          {view === 'cards'
            ? <div className="proj-grid">{filtered.map(p => <ProjectCard key={p.id} p={p} onOpen={onOpenProject} />)}</div>
            : <ProjectList projects={filtered} onOpen={onOpenProject} />}
        </div>
        <div>
          <UpcomingDeliverables />
          <TeamWorkload />
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
}

// ---------- Page-only views (kanban, timeline, calendar) ----------
function PageShell({ title, sub, actions, children }) {
  return (
    <div className="content">
      <div className="page-head">
        <div>
          <h1 className="page-title">{title}</h1>
          <div className="page-sub">{sub}</div>
        </div>
        <div className="page-head-actions">{actions}</div>
      </div>
      {children}
    </div>
  );
}

function KanbanPage() {
  return (
    <PageShell
      title="Tarefas"
      sub="52 tarefas ativas em 11 projetos · agrupadas por status"
      actions={
        <>
          <button className="btn btn-ghost btn-sm"><Icon name="filter" size={14} color="currentColor" /> Filtros</button>
          <button className="btn btn-ghost btn-sm"><Icon name="users" size={14} color="currentColor" /> Por pessoa</button>
          <button className="btn btn-primary"><Icon name="plus" size={14} color="currentColor" /> Nova tarefa</button>
        </>
      }
    >
      <Kanban />
    </PageShell>
  );
}

function TimelinePage() {
  return (
    <PageShell
      title="Timeline"
      sub="11 projetos · de maio a outubro de 2026"
      actions={
        <>
          <div className="view-switcher">
            <button className="view-tab">Mês</button>
            <button className="view-tab active">Trimestre</button>
            <button className="view-tab">Ano</button>
          </div>
          <button className="btn btn-ghost btn-sm"><Icon name="download" size={14} color="currentColor" /> Exportar</button>
        </>
      }
    >
      <Timeline />
    </PageShell>
  );
}

function CalendarPage() {
  return (
    <PageShell
      title="Calendário"
      sub="Maio 2026"
      actions={
        <>
          <button className="btn btn-ghost btn-sm"><Icon name="chevron-left" size={14} color="currentColor" /></button>
          <button className="btn btn-ghost btn-sm">Hoje</button>
          <button className="btn btn-ghost btn-sm"><Icon name="chevron-right" size={14} color="currentColor" /></button>
          <button className="btn btn-primary"><Icon name="plus" size={14} color="currentColor" /> Evento</button>
        </>
      }
    >
      <Calendar />
    </PageShell>
  );
}

function ProjectsPage({ tweaks, onOpenProject }) {
  const [view, setView] = useState(tweaks.dashLayout || 'cards');
  useEffect(() => { setView(tweaks.dashLayout); }, [tweaks.dashLayout]);
  return (
    <PageShell
      title="Projetos"
      sub={`${PROJECTS.length} projetos · ${PROJECTS.filter(p => p.status !== 'done' && p.status !== 'paused').length} ativos`}
      actions={
        <>
          <div className="view-switcher">
            <button className={`view-tab ${view === 'cards' ? 'active' : ''}`} onClick={() => setView('cards')}>
              <Icon name="layout-grid" size={13} color="currentColor" /> Cards
            </button>
            <button className={`view-tab ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')}>
              <Icon name="list" size={13} color="currentColor" /> Lista
            </button>
            <button className={`view-tab ${view === 'kanban' ? 'active' : ''}`} onClick={() => setView('kanban')}>
              <Icon name="columns" size={13} color="currentColor" /> Kanban
            </button>
            <button className={`view-tab ${view === 'timeline' ? 'active' : ''}`} onClick={() => setView('timeline')}>
              <Icon name="gantt-chart" size={13} color="currentColor" /> Timeline
            </button>
          </div>
          <button className="btn btn-primary"><Icon name="plus" size={14} color="currentColor" /> Novo projeto</button>
        </>
      }
    >
      {view === 'cards' && <div className="proj-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>{PROJECTS.map(p => <ProjectCard key={p.id} p={p} onOpen={onOpenProject} />)}</div>}
      {view === 'list' && <ProjectList projects={PROJECTS} onOpen={onOpenProject} />}
      {view === 'kanban' && <Kanban />}
      {view === 'timeline' && <Timeline />}
    </PageShell>
  );
}

// ---------- App ----------
function App() {
  const [tweaks, setTweak] = useTweaks(TWEAKS_DEFAULTS);
  const [route, setRoute] = useState({ page: 'home', projectId: null });

  // apply theme + accent on body
  useEffect(() => {
    document.body.classList.toggle('dark', tweaks.theme === 'dark');
    document.body.classList.toggle('density-compact', tweaks.density === 'compact');
    document.body.setAttribute('data-accent', tweaks.accent);
  }, [tweaks.theme, tweaks.accent, tweaks.density]);

  // route hooks
  const onOpenProject = (id) => setRoute({ page: 'project', projectId: id });
  const onBackToProjects = () => setRoute({ page: 'projects', projectId: null });

  // crumbs per page
  const crumbs = useMemo(() => {
    switch (route.page) {
      case 'home': return ['Início'];
      case 'projects': return ['Projetos'];
      case 'kanban': return ['Tarefas'];
      case 'timeline': return ['Timeline'];
      case 'calendar': return ['Calendário'];
      case 'team': return ['Equipe'];
      case 'reports': return ['Relatórios'];
      case 'project': {
        const p = PROJECTS.find(x => x.id === route.projectId);
        return ['Projetos', p ? p.name : 'Projeto'];
      }
      default: return ['Início'];
    }
  }, [route]);

  // page body
  let pageEl;
  switch (route.page) {
    case 'home':     pageEl = <Dashboard tweaks={tweaks} onOpenProject={onOpenProject} />; break;
    case 'projects': pageEl = <ProjectsPage tweaks={tweaks} onOpenProject={onOpenProject} />; break;
    case 'kanban':   pageEl = <KanbanPage />; break;
    case 'timeline': pageEl = <TimelinePage />; break;
    case 'calendar': pageEl = <CalendarPage />; break;
    case 'team':     pageEl = <TeamPage />; break;
    case 'reports':  pageEl = <PageShell title="Relatórios" sub="Em construção"><div className="panel" style={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-3)' }}>Sem relatórios ainda — vamos plugar os dados do Farol aqui.</div></PageShell>; break;
    case 'project':  pageEl = <ProjectDetail projectId={route.projectId} onBack={onBackToProjects} />; break;
    default:         pageEl = <Dashboard tweaks={tweaks} onOpenProject={onOpenProject} />;
  }

  return (
    <div className="app">
      <Sidebar
        active={route.page === 'project' ? 'projects' : route.page}
        onNav={(k) => setRoute({ page: k, projectId: null })}
      />
      <div className="main">
        <Topbar crumbs={crumbs} />
        {pageEl}
      </div>
      <GPMTweaksPanel tweaks={tweaks} setTweak={setTweak} />
    </div>
  );
}

function AccentPicker({ value, onChange }) {
  const opts = [
    { id: 'azul',     color: '#008fff', label: 'Azul Neon' },
    { id: 'cobalto',  color: '#0000d3', label: 'Cobalto' },
    { id: 'turquesa', color: '#00d6ce', label: 'Turquesa' },
    { id: 'limao',    color: '#b4ff3c', label: 'Limão' },
  ];
  return (
    <div style={{ display: 'flex', gap: 10, padding: '4px 0 6px' }}>
      {opts.map(o => {
        const on = value === o.id;
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            title={o.label}
            style={{
              width: 32, height: 32, borderRadius: 10,
              background: o.color,
              border: on ? '2px solid #fff' : '2px solid transparent',
              boxShadow: on ? '0 0 0 2px #008fff' : 'none',
              cursor: 'pointer',
              padding: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            {on && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={o.id === 'limao' ? '#171e3d' : '#fff'} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </button>
        );
      })}
    </div>
  );
}

function GPMTweaksPanel({ tweaks, setTweak }) {
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Tema">
        <TweakRadio
          label="Aparência"
          value={tweaks.theme}
          onChange={v => setTweak('theme', v)}
          options={[
            { value: 'light', label: 'Claro' },
            { value: 'dark', label: 'Escuro' },
          ]}
        />
      </TweakSection>

      <TweakSection label="Cor de destaque">
        <AccentPicker value={tweaks.accent} onChange={v => setTweak('accent', v)} />
      </TweakSection>

      <TweakSection label="Layout do dashboard">
        <TweakRadio
          label="Visão de projetos"
          value={tweaks.dashLayout}
          onChange={v => setTweak('dashLayout', v)}
          options={[
            { value: 'cards', label: 'Cards' },
            { value: 'list', label: 'Lista' },
          ]}
        />
      </TweakSection>

      <TweakSection label="Densidade">
        <TweakRadio
          label="Espaçamento"
          value={tweaks.density}
          onChange={v => setTweak('density', v)}
          options={[
            { value: 'comfortable', label: 'Confortável' },
            { value: 'compact', label: 'Compacto' },
          ]}
        />
      </TweakSection>
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
