// GPM — screens (dashboard, kanban, timeline, calendar, project detail, team)

// ---------- Stats row ----------
function StatsRow() {
  return (
    <div className="stat-row">
      <div className="stat-card feature">
        <div className="stat-lbl">Projetos ativos</div>
        <div className="stat-val">11<small>de 14</small></div>
        <div className="stat-delta up">
          <Icon name="trending-up" size={13} color="currentColor" />
          +2 este trimestre
        </div>
        <div className="stat-spark" style={{ color: '#00fff2' }}>
          <Sparkline data={[3, 4, 5, 5, 7, 8, 9, 10, 11]} color="#00fff2" />
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-lbl">Tarefas em andamento</div>
        <div className="stat-val">52</div>
        <div className="stat-delta up">
          <Icon name="trending-up" size={13} color="currentColor" />
          +12 vs. semana passada
        </div>
        <div className="stat-spark" style={{ color: 'var(--neon-azul-300)' }}>
          <Sparkline data={[28, 32, 30, 38, 40, 42, 45, 48, 52]} color="currentColor" />
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-lbl">Em risco · bloqueado</div>
        <div className="stat-val">3<small>projetos</small></div>
        <div className="stat-delta down">
          <Icon name="alert-triangle" size={13} color="currentColor" />
          requer atenção
        </div>
        <div className="stat-spark" style={{ color: '#ff3b5c' }}>
          <Sparkline data={[1, 1, 2, 2, 1, 2, 3, 3, 3]} color="currentColor" />
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-lbl">Velocidade</div>
        <div className="stat-val">11<small>tarefas/sem</small></div>
        <div className="stat-delta up">
          <Icon name="trending-up" size={13} color="currentColor" />
          +18% no mês
        </div>
        <div className="stat-spark" style={{ color: 'var(--neon-limao)' }}>
          <Sparkline data={[5, 6, 7, 7, 8, 9, 10, 11, 11]} color="currentColor" />
        </div>
      </div>
    </div>
  );
}

// ---------- Project card ----------
function ProjectCard({ p, onOpen }) {
  const progressClass =
    p.status === 'risk' ? 'risk' : p.status === 'blocked' ? 'blocked' : '';
  const dueClass = p.dueWarn === 'warn' ? 'warn' : p.dueWarn === 'late' ? 'late' : '';
  return (
    <div className="proj-card" onClick={() => onOpen && onOpen(p.id)}>
      <div className="pc-head">
        <div className="pc-icon" style={{ background: p.tint }}>{p.icon}</div>
        <div className="pc-meta">
          <h3 className="pc-name">{p.name}</h3>
          <div className="pc-sub">{p.sub}</div>
        </div>
        <StatusPill status={p.status} />
      </div>

      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6, fontSize: 12, color: 'var(--ink-2)' }}>
          <span style={{ fontWeight: 600 }}>{p.progress}%</span>
          <span>{p.tasks.done}/{p.tasks.total} tarefas{p.tasks.blocked ? ` · ${p.tasks.blocked} bloqueada${p.tasks.blocked > 1 ? 's' : ''}` : ''}</span>
        </div>
        <div className={`progress ${progressClass}`}><span style={{ width: `${p.progress}%` }} /></div>
      </div>

      <div className="pc-footer">
        <AvatarStack people={p.team} max={4} />
        <div className={`pc-due ${dueClass}`}>
          <Icon name="calendar" size={13} color="currentColor" />
          <span>{p.due}</span>
        </div>
      </div>
    </div>
  );
}

// ---------- List view ----------
function ProjectList({ projects, onOpen }) {
  return (
    <div className="list-table">
      <div className="list-row head">
        <div>Projeto</div>
        <div>Status</div>
        <div>Responsável</div>
        <div>Equipe</div>
        <div>Progresso</div>
        <div>Prazo</div>
        <div></div>
      </div>
      {projects.map(p => {
        const dueClass = p.dueWarn === 'warn' ? 'warn' : p.dueWarn === 'late' ? 'late' : '';
        return (
          <div key={p.id} className="list-row" onClick={() => onOpen && onOpen(p.id)}>
            <div className="list-name">
              <div className="pc-icon" style={{ background: p.tint }}>{p.icon}</div>
              <div style={{ minWidth: 0 }}>
                <div className="nm">{p.name}</div>
                <div className="sub">{p.tag} · {p.quarter}</div>
              </div>
            </div>
            <div><StatusPill status={p.status} /></div>
            <div className="list-cell" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Avatar person={p.owner} size={22} />
              <span>{p.owner.name.split(' ')[0]}</span>
            </div>
            <div><AvatarStack people={p.team} max={4} size={22} /></div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-2)', marginBottom: 4 }}>{p.progress}%</div>
              <div className={`progress ${p.status === 'risk' ? 'risk' : p.status === 'blocked' ? 'blocked' : ''}`} style={{ width: 80 }}>
                <span style={{ width: `${p.progress}%` }} />
              </div>
            </div>
            <div className={`pc-due ${dueClass}`}>
              <Icon name="calendar" size={13} color="currentColor" />
              <span>{p.due}</span>
            </div>
            <button className="btn-quiet" style={{ background: 'transparent', border: 0, cursor: 'pointer', padding: 4, color: 'var(--ink-3)' }} onClick={(e) => e.stopPropagation()}>
              <Icon name="more-horizontal" size={16} color="currentColor" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

// ---------- Side panels ----------
function TeamWorkload() {
  const members = Object.values(TEAM);
  return (
    <div className="panel">
      <h3>Carga da equipe <span className="more">esta semana</span></h3>
      {members.map(m => (
        <div key={m.id} className="team-row">
          <Avatar person={m} size={30} />
          <div className="team-info">
            <div className="team-name">{m.name}</div>
            <div className="team-role">{m.role}</div>
          </div>
          <div className="team-bar">
            <div className={`progress ${m.load > 100 ? 'blocked' : m.load > 85 ? 'risk' : ''}`}>
              <span style={{ width: `${Math.min(m.load, 100)}%` }} />
            </div>
          </div>
          <div className={`team-load ${m.load > 100 ? 'over' : ''}`}>{m.load}%</div>
        </div>
      ))}
    </div>
  );
}

function ActivityFeed() {
  return (
    <div className="panel">
      <h3>Atividade <span className="more">ver tudo</span></h3>
      {ACTIVITY.map((a, i) => (
        <div key={i} className="act-row">
          <div className="act-avatar" style={{ background: a.who.color }}>{a.who.initials}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="act-text"><strong>{a.who.name.split(' ')[0]}</strong> {a.text}</div>
            <div className="act-time">{a.time}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function UpcomingDeliverables() {
  return (
    <div className="panel">
      <h3>Próximas entregas <span className="more">esta semana</span></h3>
      {UPCOMING.map((u, i) => (
        <div key={i} className="deliv">
          <div className={`deliv-check ${u.done ? 'done' : ''}`}>
            {u.done && <Icon name="check" size={12} color="currentColor" stroke={3} />}
          </div>
          <div className="deliv-body">
            <div className={`deliv-title ${u.done ? 'done' : ''}`}>{u.title}</div>
            <div className="deliv-meta">{u.proj} · {u.owner.name.split(' ')[0]}</div>
          </div>
          <div className={`deliv-due ${u.late ? 'late' : ''}`}>{u.due}</div>
        </div>
      ))}
    </div>
  );
}

// ---------- Kanban ----------
function Kanban() {
  return (
    <div className="kanban">
      {KANBAN_COLS.map(col => (
        <div key={col.id} className="kb-col">
          <div className="kb-col-head">
            <span>{col.title}</span>
            <span className="count">{col.count}</span>
          </div>
          {(KANBAN_TASKS[col.id] || []).map((t, i) => (
            <div key={i} className="kb-card">
              <span className="kb-tag" style={{ background: t.tagColor, color: t.tagFg }}>{t.tag}</span>
              <div className="kb-name">{t.name}</div>
              <div style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>{t.proj}</div>
              <div className="kb-foot">
                <Avatar person={t.owner} size={22} />
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  {t.comments > 0 && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                      <Icon name="message-circle" size={12} color="currentColor" />
                      {t.comments}
                    </span>
                  )}
                  {t.due && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, color: t.warn ? '#c47b00' : t.blocked ? '#c81444' : 'var(--ink-3)' }}>
                      <Icon name="calendar" size={12} color="currentColor" />
                      {t.due}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          <button className="btn-quiet" style={{ background: 'transparent', border: 0, cursor: 'pointer', padding: '6px 4px', color: 'var(--ink-3)', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 500 }}>
            <Icon name="plus" size={14} color="currentColor" /> Nova tarefa
          </button>
        </div>
      ))}
    </div>
  );
}

// ---------- Timeline (Gantt) ----------
function Timeline() {
  const months = ['Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out'];
  return (
    <div className="gantt">
      <div className="gantt-head">
        <div style={{ padding: '12px 14px', fontSize: 11.5, fontWeight: 600, color: 'var(--ink-3)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Projeto
        </div>
        <div className="gantt-months">
          {months.map(m => <div key={m} className="gantt-month">{m} · 2026</div>)}
        </div>
      </div>
      {PROJECTS.map(p => {
        const left = (p.start / 6) * 100;
        const width = ((p.end - p.start) / 6) * 100;
        const barClass =
          p.status === 'risk' ? 'risk'
          : p.status === 'blocked' ? 'blocked'
          : p.status === 'done' ? 'done'
          : p.status === 'discovery' ? 'discovery'
          : p.status === 'paused' || p.status === 'planning' ? 'paused'
          : '';
        return (
          <div key={p.id} className="gantt-row">
            <div className="gantt-label">
              <div className="pc-icon" style={{ background: p.tint, width: 26, height: 26, borderRadius: 7, fontSize: 13 }}>{p.icon}</div>
              <span>{p.name}</span>
            </div>
            <div className="gantt-track">
              <div className={`gantt-bar ${barClass}`} style={{ left: `${left}%`, width: `${width}%` }}>
                {p.progress}%
              </div>
              <div className="gantt-today" style={{ left: `${(0.7 / 6) * 100}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ---------- Calendar ----------
function Calendar() {
  // May 2026 — May 1 is Friday
  const startOffset = 4; // Sun=0 → first cell index for May 1
  const days = 31;
  const cells = [];
  // prev month tail (Apr 27–30)
  for (let i = 0; i < startOffset; i++) cells.push({ day: 27 + i, out: true });
  for (let d = 1; d <= days; d++) cells.push({ day: d, out: false });
  // next month head
  while (cells.length < 42) cells.push({ day: cells.length - startOffset - days + 1, out: true });
  const weeks = [];
  for (let i = 0; i < 6; i++) weeks.push(cells.slice(i * 7, i * 7 + 7));
  const today = 22;
  const dayLabels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  return (
    <div className="cal">
      <div className="cal-head">
        {dayLabels.map(d => <div key={d}>{d}</div>)}
      </div>
      {weeks.map((w, i) => (
        <div key={i} className="cal-row">
          {w.map((c, j) => {
            const evs = !c.out ? (CAL_EVENTS[c.day] || []) : [];
            return (
              <div key={j} className={`cell ${c.out ? 'out' : ''}`}>
                <span className={`cal-date ${!c.out && c.day === today ? 'today' : ''}`}>{c.day}</span>
                {evs.map((e, k) => (
                  <div key={k} className="cal-ev" style={{ background: e.color, color: e.fg }}>{e.name}</div>
                ))}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ---------- Project detail (auxiliary) ----------
function ProjectDetail({ projectId, onBack }) {
  const p = PROJECTS.find(x => x.id === projectId) || PROJECTS[0];
  const [tab, setTab] = useState('visao');
  return (
    <div className="content">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <button className="btn-quiet" onClick={onBack} style={{ background: 'transparent', border: 0, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--ink-2)', fontSize: 13.5, padding: '4px 8px' }}>
          <Icon name="arrow-left" size={15} color="currentColor" /> Projetos
        </button>
        <span style={{ color: 'var(--ink-3)' }}>/</span>
        <span style={{ fontSize: 13.5, color: 'var(--ink-2)' }}>{p.tag}</span>
      </div>

      <div className="proj-hero">
        <div className="pc-icon" style={{ background: p.tint }}>{p.icon}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <h1 className="page-title" style={{ fontSize: 22 }}>{p.name}</h1>
            <StatusPill status={p.status} />
          </div>
          <div style={{ fontSize: 14, color: 'var(--ink-2)' }}>{p.sub}</div>

          <div className="kpi-row">
            <div className="kpi">
              <div className="kpi-lbl">Progresso</div>
              <div className="kpi-val">{p.progress}%</div>
            </div>
            <div className="kpi">
              <div className="kpi-lbl">Tarefas</div>
              <div className="kpi-val">{p.tasks.done}<small style={{ fontSize: 14, color: 'var(--ink-3)', fontWeight: 500 }}>/{p.tasks.total}</small></div>
            </div>
            <div className="kpi">
              <div className="kpi-lbl">Entrega</div>
              <div className="kpi-val">{p.due}</div>
            </div>
            <div className="kpi">
              <div className="kpi-lbl">Bloqueios</div>
              <div className="kpi-val" style={{ color: p.tasks.blocked ? '#c81444' : 'var(--ink-1)' }}>{p.tasks.blocked}</div>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
          <button className="btn btn-primary"><Icon name="plus" size={14} color="currentColor" /> Nova tarefa</button>
          <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>Responsável</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Avatar person={p.owner} size={28} />
            <span style={{ fontSize: 13.5, fontWeight: 600 }}>{p.owner.name}</span>
          </div>
        </div>
      </div>

      <div className="tabs">
        {[['visao', 'Visão geral'], ['tarefas', 'Tarefas'], ['timeline', 'Timeline'], ['discussao', 'Discussão'], ['arquivos', 'Arquivos']].map(([k, l]) => (
          <div key={k} className={`tab ${tab === k ? 'active' : ''}`} onClick={() => setTab(k)}>{l}</div>
        ))}
      </div>

      <div className="dash-grid">
        <div>
          <div className="panel">
            <h3>Marcos</h3>
            {[
              { title: 'Discovery com líderes', meta: '5 entrevistas · concluído', done: true, due: '08 mai' },
              { title: 'Spike técnico de modelos', meta: 'Bruno · concluído', done: true, due: '15 mai' },
              { title: 'Apresentar POC pra liderança', meta: 'Bruno · esta semana', done: false, due: '27 mai' },
              { title: 'Decisão de Go/No-Go', meta: 'Comitê de People Tech', done: false, due: '12 jun' },
            ].map((m, i) => (
              <div key={i} className="deliv">
                <div className={`deliv-check ${m.done ? 'done' : ''}`}>
                  {m.done && <Icon name="check" size={12} color="currentColor" stroke={3} />}
                </div>
                <div className="deliv-body">
                  <div className={`deliv-title ${m.done ? 'done' : ''}`}>{m.title}</div>
                  <div className="deliv-meta">{m.meta}</div>
                </div>
                <div className="deliv-due">{m.due}</div>
              </div>
            ))}
          </div>

          <div className="panel">
            <h3>Tarefas recentes</h3>
            {[
              { name: 'Treinar modelo de scoring', who: TEAM.ba, status: 'progress', due: 'sex' },
              { name: 'Definir métricas de avaliação', who: TEAM.ro, status: 'progress', due: 'qua' },
              { name: 'Mockups da tela de feedback', who: TEAM.ls, status: 'progress', due: 'qui' },
              { name: 'Integração com Greenhouse', who: TEAM.df, status: 'progress', due: 'sex' },
              { name: 'Spike: modelos de avaliação', who: TEAM.ba, status: 'done', due: '—' },
            ].map((t, i) => (
              <div key={i} className="deliv">
                <div className={`deliv-check ${t.status === 'done' ? 'done' : ''}`}>
                  {t.status === 'done' && <Icon name="check" size={12} color="currentColor" stroke={3} />}
                </div>
                <div className="deliv-body">
                  <div className={`deliv-title ${t.status === 'done' ? 'done' : ''}`}>{t.name}</div>
                  <div className="deliv-meta">{t.who.name.split(' ')[0]} · {STATUS_LABEL[t.status] || t.status}</div>
                </div>
                <div className="deliv-due">{t.due}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="panel">
            <h3>Equipe</h3>
            {p.team.map(m => (
              <div key={m.id} className="team-row">
                <Avatar person={m} size={30} />
                <div className="team-info">
                  <div className="team-name">{m.name}</div>
                  <div className="team-role">{m.role}</div>
                </div>
              </div>
            ))}
          </div>
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
}

// ---------- Team page ----------
function TeamPage() {
  const members = Object.values(TEAM);
  return (
    <div className="content">
      <div className="page-head">
        <div>
          <h1 className="page-title">Equipe</h1>
          <div className="page-sub">7 pessoas · carga média 79% nesta semana</div>
        </div>
        <button className="btn btn-primary"><Icon name="user-plus" size={14} color="currentColor" /> Convidar pessoa</button>
      </div>
      <div className="proj-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {members.map(m => (
          <div key={m.id} className="proj-card">
            <div className="pc-head">
              <Avatar person={m} size={44} />
              <div className="pc-meta">
                <h3 className="pc-name">{m.name}</h3>
                <div className="pc-sub">{m.role}</div>
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--ink-2)', marginBottom: 6 }}>
                <span>Carga</span>
                <span style={{ fontWeight: 600, color: m.load > 100 ? '#c81444' : 'var(--ink-1)' }}>{m.load}%</span>
              </div>
              <div className={`progress ${m.load > 100 ? 'blocked' : m.load > 85 ? 'risk' : ''}`}>
                <span style={{ width: `${Math.min(m.load, 100)}%` }} />
              </div>
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--ink-2)' }}>
              <strong>{PROJECTS.filter(p => p.team.includes(m)).length}</strong> projetos · <strong>{Math.round(m.load / 9)}</strong> tarefas
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, {
  StatsRow, ProjectCard, ProjectList, TeamWorkload, ActivityFeed, UpcomingDeliverables,
  Kanban, Timeline, Calendar, ProjectDetail, TeamPage,
});
