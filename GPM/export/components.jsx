// GPM — shared components (icons, sidebar, topbar, helpers)

const { useState, useEffect, useMemo, useRef } = React;

// Inline-SVG Lucide loader (matches Neon web platform UI kit)
function Icon({ name, size = 18, color = 'currentColor', stroke = 2, style }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || el.dataset.done === name) return;
    el.dataset.done = name;
    fetch(`https://unpkg.com/lucide-static@latest/icons/${name}.svg`)
      .then(r => r.text())
      .then(svg => {
        el.innerHTML = svg.replace(
          '<svg',
          `<svg style="width:${size}px;height:${size}px;stroke:${color};stroke-width:${stroke};fill:none"`
        );
      });
  }, [name, size, color, stroke]);
  return (
    <span
      ref={ref}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        color,
        flexShrink: 0,
        ...style,
      }}
    />
  );
}

function Avatar({ person, size = 26, className = '' }) {
  const s = { width: size, height: size, background: person.color, fontSize: Math.round(size * 0.42) };
  return (
    <div className={`avatar ${className}`} style={s} title={person.name}>
      {person.initials}
    </div>
  );
}

function AvatarStack({ people, max = 4, size = 26 }) {
  const visible = people.slice(0, max);
  const extra = people.length - visible.length;
  return (
    <div className="avatars">
      {visible.map(p => <Avatar key={p.id} person={p} size={size} />)}
      {extra > 0 && (
        <div className="avatar more" style={{ width: size, height: size, fontSize: Math.round(size * 0.42) }}>
          +{extra}
        </div>
      )}
    </div>
  );
}

function StatusPill({ status }) {
  return (
    <span className={`pill status-${status}`}>
      <span className="pill-dot" style={{ background: 'currentColor' }} />
      {STATUS_LABEL[status]}
    </span>
  );
}

// ---------- Sidebar ----------
function Sidebar({ active, onNav }) {
  const main = [
    ['home', 'Início', 'home', null],
    ['projects', 'Projetos', 'layout-grid', '11'],
    ['kanban', 'Tarefas', 'check-square', '52'],
    ['timeline', 'Timeline', 'gantt-chart', null],
    ['calendar', 'Calendário', 'calendar', null],
    ['team', 'Equipe', 'users', '7'],
    ['reports', 'Relatórios', 'bar-chart-3', null],
  ];
  const favs = [
    { id: 'p1',  name: 'POC: Entrevistas com IA',     dot: '#008fff' },
    { id: 'p3',  name: 'Farol de Vagas',              dot: '#00d6ce' },
    { id: 'p5',  name: 'Abertura de Vagas',           dot: '#ffb300' },
    { id: 'p11', name: 'Implantação Teamguide',       dot: '#b4ff3c' },
  ];
  return (
    <aside className="sidebar">
      <div className="sb-brand">
        <div className="sb-brand-logo">G</div>
        <div>
          <div className="sb-brand-name">GPM</div>
          <div className="sb-brand-sub">People Tech</div>
        </div>
      </div>

      <div className="sb-workspace">
        <div className="sb-ws-avatar">N</div>
        <div className="sb-ws-text">
          <div className="sb-ws-name">Neon · People</div>
          <div className="sb-ws-meta">7 pessoas · Q2 2026</div>
        </div>
        <Icon name="chevrons-up-down" size={14} color="rgba(255,255,255,.45)" style={{ marginLeft: 'auto' }} />
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {main.map(([k, l, ic, count]) => (
          <div key={k} className={`sb-item ${active === k ? 'active' : ''}`} onClick={() => onNav(k)}>
            <Icon name={ic} size={17} color="currentColor" />
            <span>{l}</span>
            {count && <span className="sb-count">{count}</span>}
          </div>
        ))}
      </nav>

      <div>
        <div className="sb-section">Favoritos</div>
        <div className="sb-favs">
          {favs.map(f => (
            <div key={f.id} className="sb-fav">
              <span className="sb-fav-dot" style={{ background: f.dot }} />
              <span>{f.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="sb-user">
        <div className="sb-user-avatar">VC</div>
        <div>
          <div className="sb-user-name">Vanessa C.</div>
          <div className="sb-user-meta">Líder de People Tech</div>
        </div>
        <Icon name="settings" size={15} color="rgba(255,255,255,.45)" style={{ marginLeft: 'auto' }} />
      </div>
    </aside>
  );
}

// ---------- Topbar ----------
function Topbar({ crumbs }) {
  return (
    <div className="topbar">
      <div className="crumbs">
        {crumbs.map((c, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="sep">/</span>}
            {i === crumbs.length - 1 ? <strong>{c}</strong> : <span>{c}</span>}
          </React.Fragment>
        ))}
      </div>
      <div className="search">
        <span className="ico"><Icon name="search" size={15} color="currentColor" /></span>
        <input placeholder="Buscar projetos, tarefas, pessoas..." />
        <span className="kbd">⌘K</span>
      </div>
      <button className="top-action"><Icon name="inbox" size={17} color="currentColor" /></button>
      <button className="top-action dot"><Icon name="bell" size={17} color="currentColor" /></button>
      <button className="top-action"><Icon name="help-circle" size={17} color="currentColor" /></button>
    </div>
  );
}

// ---------- Sparkline ----------
function Sparkline({ data, color = 'currentColor', height = 28 }) {
  const max = Math.max(...data);
  return (
    <div className="spark" style={{ color, height }}>
      {data.map((v, i) => (
        <span key={i} style={{ height: `${(v / max) * height}px` }} />
      ))}
    </div>
  );
}

Object.assign(window, { Icon, Avatar, AvatarStack, StatusPill, Sidebar, Topbar, Sparkline });
