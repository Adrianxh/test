import { useState, useEffect, useCallback } from 'react';
import {
  LayoutDashboard, Building2, FlaskConical, Microscope, FileText,
  Network, AlertTriangle, ClipboardCheck, Play, Pause, Square,
  Download, Upload, Plus, Settings, BarChart3, ExternalLink,
  Search, Filter, RefreshCw, FolderOpen, Shield, Clock,
  CheckCircle, XCircle, AlertCircle, Activity, Globe, Lock,
  ChevronRight, Database, Zap, Eye
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { loadState, saveState, getStats } from './store';
import type { ActivityEvent, Vendor, CrawlJob, ResearchFlag } from './types';

type AppState = ReturnType<typeof loadState>;

type ViewType = 'dashboard' | 'vendors' | 'products' | 'laboratories' | 'certificates' | 'relationships' | 'flags' | 'review' | 'crawl' | 'statistics' | 'export' | 'settings';

const NAV_ITEMS: { id: ViewType; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { id: 'vendors', label: 'Vendor Explorer', icon: <Building2 size={18} /> },
  { id: 'products', label: 'Product Explorer', icon: <FlaskConical size={18} /> },
  { id: 'laboratories', label: 'Laboratory Explorer', icon: <Microscope size={18} /> },
  { id: 'certificates', label: 'Certificate Explorer', icon: <FileText size={18} /> },
  { id: 'relationships', label: 'Relationship Explorer', icon: <Network size={18} /> },
  { id: 'flags', label: 'Research Flags', icon: <AlertTriangle size={18} /> },
  { id: 'review', label: 'Review Queue', icon: <ClipboardCheck size={18} /> },
  { id: 'crawl', label: 'Crawl Manager', icon: <Activity size={18} /> },
  { id: 'statistics', label: 'Statistics', icon: <BarChart3 size={18} /> },
  { id: 'export', label: 'Export Center', icon: <Download size={18} /> },
  { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
];

const COLORS = ['#22d3ee', '#2dd4bf', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#10b981'];

function formatTimestamp(ts: string): string {
  if (!ts || ts === 'Never') return ts;
  try {
    const d = new Date(ts);
    return d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch { return ts; }
}

function formatTime(ts: string): string {
  try {
    const d = new Date(ts);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  } catch { return ts; }
}

export default function App() {
  const [state, setState] = useState<AppState>(loadState);
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  useEffect(() => { saveState(state); }, [state]);

  const stats = getStats(state);

  const addEvent = useCallback((message: string, type: ActivityEvent['type'], vendor_id?: string) => {
    const event: ActivityEvent = {
      id: `e${Date.now()}`,
      timestamp: new Date().toISOString(),
      message,
      type,
      vendor_id,
    };
    setState(prev => ({
      ...prev,
      activity_events: [event, ...prev.activity_events].slice(0, 100),
    }));
  }, []);

  const startCrawl = () => {
    setState(prev => ({ ...prev, crawl_status: 'running' }));
    addEvent('Research job started — processing queued vendors', 'info');
    simulateCrawlProgress();
  };

  const pauseCrawl = () => {
    setState(prev => ({ ...prev, crawl_status: 'paused' }));
    addEvent('Research job paused — checkpointing progress', 'info');
  };

  const stopCrawl = () => {
    setState(prev => ({ ...prev, crawl_status: 'idle' }));
    addEvent('Research job stopped', 'warning');
  };

  const simulateCrawlProgress = () => {
    const messages = [
      { msg: 'Checking robots.txt compliance', type: 'info' as const },
      { msg: 'Discovered new product listing', type: 'discovery' as const },
      { msg: 'Certificate link found', type: 'discovery' as const },
      { msg: 'PDF downloaded successfully', type: 'success' as const },
      { msg: 'Laboratory name extracted', type: 'discovery' as const },
      { msg: 'Database checkpoint saved', type: 'info' as const },
    ];
    let i = 0;
    const interval = setInterval(() => {
      if (i >= 6) { clearInterval(interval); return; }
      const m = messages[i % messages.length];
      addEvent(m.msg, m.type);
      i++;
    }, 3000);
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <DashboardView state={state} stats={stats} />;
      case 'vendors': return <VendorView state={state} searchTerm={searchTerm} selectedVendor={selectedVendor} setSelectedVendor={setSelectedVendor} />;
      case 'products': return <ProductView state={state} searchTerm={searchTerm} />;
      case 'laboratories': return <LaboratoryView state={state} />;
      case 'certificates': return <CertificateView state={state} />;
      case 'relationships': return <RelationshipView state={state} />;
      case 'flags': return <FlagsView state={state} />;
      case 'review': return <ReviewView state={state} setState={setState} />;
      case 'crawl': return <CrawlView state={state} setState={setState} startCrawl={startCrawl} pauseCrawl={pauseCrawl} stopCrawl={stopCrawl} addEvent={addEvent} />;
      case 'statistics': return <StatisticsView state={state} stats={stats} />;
      case 'export': return <ExportView state={state} />;
      case 'settings': return <SettingsView state={state} setState={setState} />;
      default: return <DashboardView state={state} stats={stats} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-navy-900">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-navy-800 border-r border-slate-border flex flex-col">
        <div className="p-5 border-b border-slate-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-accent to-teal-accent flex items-center justify-center">
              <Zap size={18} className="text-navy-900" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white">Peptide Intelligence</h1>
              <p className="text-[10px] text-cyan-accent/70 uppercase tracking-wider">Atlas v1.0</p>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 mt-2">Nootroholic.com Research Platform</p>
        </div>

        <nav className="flex-1 py-3 overflow-y-auto">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => { setCurrentView(item.id); setSearchTerm(''); setSelectedVendor(null); }}
              className={`nav-item w-full flex items-center gap-3 px-5 py-2.5 text-sm text-left ${currentView === item.id ? 'active text-cyan-accent' : 'text-slate-300 hover:text-white'}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-border">
          <div className="flex items-center gap-2 text-xs">
            <div className={`w-2 h-2 rounded-full ${state.crawl_status === 'running' ? 'bg-success animate-pulse' : state.crawl_status === 'paused' ? 'bg-warning' : 'bg-slate-500'}`} />
            <span className="text-slate-400">
              {state.crawl_status === 'running' ? 'Collecting...' : state.crawl_status === 'paused' ? 'Paused' : 'Idle'}
            </span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">{stats.total_vendors} vendors • {stats.certificates_found} CoAs</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-14 flex-shrink-0 bg-navy-800/50 border-b border-slate-border flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-white">{NAV_ITEMS.find(n => n.id === currentView)?.label}</h2>
            {state.crawl_status === 'running' && (
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-success/10 border border-success/30">
                <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                <span className="text-xs text-success">Live Collection</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search records..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-1.5 text-sm bg-navy-700 border border-slate-border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-accent/50 w-64"
              />
            </div>
            <button onClick={startCrawl} disabled={state.crawl_status === 'running'} className="btn-primary px-3 py-1.5 rounded-lg text-xs font-medium text-white flex items-center gap-1.5 disabled:opacity-50">
              <Play size={12} /> Start Research
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {renderView()}
        </div>
      </main>
    </div>
  );
}

// ============ DASHBOARD VIEW ============
function DashboardView({ state, stats }: { state: AppState; stats: ReturnType<typeof getStats> }) {
  const statCards = [
    { label: 'Total Vendors', value: stats.total_vendors, icon: <Building2 size={20} />, color: 'text-cyan-accent' },
    { label: 'Investigated', value: stats.vendors_investigated, icon: <Eye size={20} />, color: 'text-teal-accent' },
    { label: 'Pending', value: stats.vendors_pending, icon: <Clock size={20} />, color: 'text-warning' },
    { label: 'Active Crawls', value: stats.active_crawls, icon: <Activity size={20} />, color: 'text-success' },
    { label: 'Products Found', value: stats.products_discovered, icon: <FlaskConical size={20} />, color: 'text-blue-400' },
    { label: 'Certificates', value: stats.certificates_found, icon: <FileText size={20} />, color: 'text-purple-400' },
    { label: 'Parsed CoAs', value: stats.certificates_parsed, icon: <CheckCircle size={20} />, color: 'text-teal-accent' },
    { label: 'Laboratories', value: stats.laboratories_identified, icon: <Microscope size={20} />, color: 'text-cyan-accent' },
    { label: 'Verified Reports', value: stats.verified_reports, icon: <Shield size={20} />, color: 'text-success' },
    { label: 'Unresolved Flags', value: stats.unresolved_flags, icon: <AlertTriangle size={20} />, color: 'text-danger' },
    { label: 'Download Failures', value: stats.download_failures, icon: <XCircle size={20} />, color: 'text-danger' },
    { label: 'Last Collection', value: formatTimestamp(stats.last_successful_collection), icon: <Clock size={20} />, color: 'text-slate-300', isText: true },
  ];

  const vendorByCategory = [
    { name: 'Retailer', value: state.vendors.filter(v => v.business_category === 'research_peptide_retailer').length },
    { name: 'Synthesis', value: state.vendors.filter(v => v.business_category === 'peptide_synthesis_company').length },
    { name: 'Manufacturer', value: state.vendors.filter(v => v.business_category === 'peptide_manufacturer').length },
    { name: 'Unknown', value: state.vendors.filter(v => v.business_category === 'unknown').length },
  ];

  const certByLab = state.laboratories.map(lab => ({
    name: lab.official_name.split(' ')[0],
    certificates: state.certificates.filter(c => c.issuing_laboratory_id === lab.id).length,
    verified: state.certificates.filter(c => c.issuing_laboratory_id === lab.id && (c.verification_status === 'officially_verified' || c.verification_status === 'directly_confirmed')).length,
  }));

  const testTypeData = [
    { name: 'Purity', count: state.test_results.filter(t => t.test_category === 'purity').length },
    { name: 'Identity', count: state.test_results.filter(t => t.test_category === 'molecular_identity').length },
    { name: 'Water', count: state.test_results.filter(t => t.test_category === 'water_content').length },
    { name: 'Endotoxin', count: state.test_results.filter(t => t.test_category === 'endotoxins').length },
  ];

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        {statCards.map((card, i) => (
          <div key={i} className="stat-card rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className={`${card.color}`}>{card.icon}</span>
            </div>
            <p className={`text-xl font-bold ${card.color} ${'isText' in card && card.isText ? 'text-sm' : ''}`}>
              {card.value}
            </p>
            <p className="text-xs text-slate-400 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Vendor Categories */}
        <div className="glass-panel rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Vendors by Category</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={vendorByCategory} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {vendorByCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#1a2236', border: '1px solid #2a3550', borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Certificates by Lab */}
        <div className="glass-panel rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Certificates by Laboratory</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={certByLab}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a3550" />
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#1a2236', border: '1px solid #2a3550', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="certificates" fill="#22d3ee" radius={[4, 4, 0, 0]} name="Total" />
              <Bar dataKey="verified" fill="#10b981" radius={[4, 4, 0, 0]} name="Verified" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Test Types */}
        <div className="glass-panel rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Analytical Test Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={testTypeData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#2a3550" />
              <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis dataKey="name" type="category" tick={{ fill: '#94a3b8', fontSize: 11 }} width={70} />
              <Tooltip contentStyle={{ background: '#1a2236', border: '1px solid #2a3550', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="count" fill="#2dd4bf" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="glass-panel rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Activity size={16} className="text-cyan-accent" />
            Live Activity Feed
          </h3>
          <span className="text-xs text-slate-400">{state.activity_events.length} events</span>
        </div>
        <div className="space-y-1.5 max-h-64 overflow-y-auto">
          {state.activity_events.slice(0, 15).map(event => (
            <div key={event.id} className="activity-feed-item flex items-start gap-3 py-1.5 px-2 rounded hover:bg-navy-700/30">
              <span className="text-[10px] text-slate-500 font-mono mt-0.5 whitespace-nowrap">{formatTime(event.timestamp)}</span>
              <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                event.type === 'success' ? 'bg-success' :
                event.type === 'warning' ? 'bg-warning' :
                event.type === 'error' ? 'bg-danger' :
                event.type === 'discovery' ? 'bg-cyan-accent' : 'bg-slate-400'
              }`} />
              <span className="text-xs text-slate-300">{event.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============ VENDOR VIEW ============
function VendorView({ state, searchTerm, selectedVendor, setSelectedVendor }: { state: AppState; searchTerm: string; selectedVendor: Vendor | null; setSelectedVendor: (v: Vendor | null) => void }) {
  const filtered = state.vendors.filter(v =>
    v.brand_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.canonical_url.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.claimed_country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (selectedVendor) {
    const vendorProducts = state.products.filter(p => p.vendor_id === selectedVendor.id);
    const vendorCerts = state.certificates.filter(c => c.vendor_id === selectedVendor.id);
    const vendorClaims = state.marketing_claims.filter(c => c.vendor_id === selectedVendor.id);
    const vendorJobs = state.crawl_jobs.filter(j => j.vendor_id === selectedVendor.id);

    return (
      <div className="space-y-4 animate-slide-in">
        <button onClick={() => setSelectedVendor(null)} className="text-xs text-cyan-accent hover:text-cyan-accent/80 flex items-center gap-1">
          ← Back to Vendor List
        </button>
        <div className="glass-panel rounded-xl p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">{selectedVendor.brand_name}</h2>
              <a href={selectedVendor.canonical_url} target="_blank" rel="noopener noreferrer" className="text-sm text-cyan-accent hover:underline flex items-center gap-1 mt-1">
                {selectedVendor.canonical_url} <ExternalLink size={12} />
              </a>
            </div>
            <div className="flex gap-2">
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                selectedVendor.access_type === 'public' ? 'bg-success/20 text-success' :
                selectedVendor.access_type === 'free_account_required' ? 'bg-warning/20 text-warning' :
                'bg-danger/20 text-danger'
              }`}>{selectedVendor.access_type.replace('_', ' ')}</span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                selectedVendor.evidence_status === 'verified' ? 'bg-success/20 text-success' :
                selectedVendor.evidence_status === 'documented' ? 'bg-teal-accent/20 text-teal-accent' :
                selectedVendor.evidence_status === 'partial' ? 'bg-warning/20 text-warning' :
                'bg-slate-500/20 text-slate-400'
              }`}>{selectedVendor.evidence_status}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <InfoField label="Country" value={selectedVendor.claimed_country} />
            <InfoField label="Category" value={selectedVendor.business_category.replace(/_/g, ' ')} />
            <InfoField label="Testing Claims" value={selectedVendor.testing_claims || 'None documented'} />
            <InfoField label="First Seen" value={selectedVendor.first_seen} />
            <InfoField label="Last Checked" value={selectedVendor.last_checked} />
            <InfoField label="Discovery Source" value={selectedVendor.discovery_source.replace(/_/g, ' ')} />
            <InfoField label="COA Access" value={selectedVendor.coa_access_status} />
            <InfoField label="Collection Method" value={selectedVendor.collection_method} />
          </div>
        </div>

        {/* Products */}
        <div className="glass-panel rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-3">Products ({vendorProducts.length})</h3>
          {vendorProducts.length > 0 ? (
            <table className="data-table w-full text-xs">
              <thead><tr><th className="text-left p-2 text-slate-400">Product</th><th className="text-left p-2 text-slate-400">Compound</th><th className="text-left p-2 text-slate-400">Strength</th><th className="text-left p-2 text-slate-400">Price</th><th className="text-left p-2 text-slate-400">Batch</th></tr></thead>
              <tbody>
                {vendorProducts.map(p => (
                  <tr key={p.id}><td className="p-2 text-white">{p.product_name}</td><td className="p-2 text-slate-300">{p.compound_name}</td><td className="p-2 text-slate-300">{p.labeled_strength} {p.labeled_unit}</td><td className="p-2 text-slate-300">${p.price}</td><td className="p-2 text-slate-400">{p.associated_batch || '—'}</td></tr>
                ))}
              </tbody>
            </table>
          ) : <p className="text-xs text-slate-500">No products discovered yet</p>}
        </div>

        {/* Certificates */}
        <div className="glass-panel rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-3">Certificates ({vendorCerts.length})</h3>
          {vendorCerts.length > 0 ? (
            <table className="data-table w-full text-xs">
              <thead><tr><th className="text-left p-2 text-slate-400">Report #</th><th className="text-left p-2 text-slate-400">Compound</th><th className="text-left p-2 text-slate-400">Lab</th><th className="text-left p-2 text-slate-400">Status</th><th className="text-left p-2 text-slate-400">Date</th></tr></thead>
              <tbody>
                {vendorCerts.map(c => {
                  const lab = state.laboratories.find(l => l.id === c.issuing_laboratory_id);
                  return (
                    <tr key={c.id}><td className="p-2 text-white font-mono">{c.report_number}</td><td className="p-2 text-slate-300">{c.compound}</td><td className="p-2 text-slate-300">{lab?.official_name || 'Unknown'}</td>
                    <td className="p-2"><span className={`px-1.5 py-0.5 rounded text-[10px] ${c.verification_status === 'officially_verified' ? 'bg-success/20 text-success' : c.verification_status === 'insufficient_identifiers' ? 'bg-warning/20 text-warning' : 'bg-slate-500/20 text-slate-400'}`}>{c.verification_status.replace(/_/g, ' ')}</span></td>
                    <td className="p-2 text-slate-400">{c.report_date}</td></tr>
                  );
                })}
              </tbody>
            </table>
          ) : <p className="text-xs text-slate-500">No certificates found</p>}
        </div>

        {/* Marketing Claims */}
        {vendorClaims.length > 0 && (
          <div className="glass-panel rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Marketing Claims</h3>
            <div className="space-y-2">
              {vendorClaims.map(cl => (
                <div key={cl.id} className="flex items-start justify-between p-2 rounded bg-navy-700/30">
                  <div>
                    <p className="text-xs text-white">"{cl.exact_original_text}"</p>
                    <p className="text-[10px] text-slate-400 mt-1">Category: {cl.claim_category} • {cl.source_url}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] whitespace-nowrap ${
                    cl.verification_status === 'verified' ? 'bg-success/20 text-success' :
                    cl.verification_status === 'documented_claim' ? 'bg-cyan-accent/20 text-cyan-accent' :
                    cl.verification_status === 'unverified' ? 'bg-warning/20 text-warning' :
                    'bg-slate-500/20 text-slate-400'
                  }`}>{cl.verification_status.replace(/_/g, ' ')}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Crawl Jobs */}
        {vendorJobs.length > 0 && (
          <div className="glass-panel rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Collection History</h3>
            <div className="space-y-2">
              {vendorJobs.map(j => (
                <div key={j.id} className="flex items-center justify-between p-2 rounded bg-navy-700/30">
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${j.status === 'completed' ? 'bg-success' : j.status === 'failed' ? 'bg-danger' : j.status === 'running' ? 'bg-cyan-accent animate-pulse' : 'bg-slate-500'}`} />
                    <span className="text-xs text-slate-300">{j.pages_examined} pages • {j.documents_downloaded} downloads • {j.records_extracted} records</span>
                  </div>
                  <span className="text-[10px] text-slate-400">{j.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-slide-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400">{filtered.length} vendors</span>
          <button className="btn-secondary px-3 py-1.5 rounded-lg text-xs text-slate-300 flex items-center gap-1.5">
            <Filter size={12} /> Filter
          </button>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary px-3 py-1.5 rounded-lg text-xs text-slate-300 flex items-center gap-1.5">
            <Upload size={12} /> Import Vendors
          </button>
          <button className="btn-primary px-3 py-1.5 rounded-lg text-xs text-white flex items-center gap-1.5">
            <Plus size={12} /> Add Vendor
          </button>
        </div>
      </div>

      <div className="glass-panel rounded-xl overflow-hidden">
        <table className="data-table w-full text-xs">
          <thead>
            <tr>
              <th className="text-left p-3 text-slate-400 font-medium">Vendor</th>
              <th className="text-left p-3 text-slate-400 font-medium">URL</th>
              <th className="text-left p-3 text-slate-400 font-medium">Country</th>
              <th className="text-left p-3 text-slate-400 font-medium">Access</th>
              <th className="text-left p-3 text-slate-400 font-medium">Status</th>
              <th className="text-left p-3 text-slate-400 font-medium">Evidence</th>
              <th className="text-left p-3 text-slate-400 font-medium">Last Checked</th>
              <th className="text-left p-3 text-slate-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(v => (
              <tr key={v.id} className="cursor-pointer" onClick={() => setSelectedVendor(v)}>
                <td className="p-3 text-white font-medium">{v.brand_name}</td>
                <td className="p-3 text-slate-400 max-w-[200px] truncate">{v.canonical_url}</td>
                <td className="p-3 text-slate-300">{v.claimed_country}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] ${v.access_type === 'public' ? 'bg-success/20 text-success' : v.access_type === 'free_account_required' ? 'bg-warning/20 text-warning' : 'bg-danger/20 text-danger'}`}>
                    {v.access_type === 'public' ? <><Globe size={10} className="inline mr-1" />Public</> : v.access_type === 'free_account_required' ? <><Lock size={10} className="inline mr-1" />Account</> : <><XCircle size={10} className="inline mr-1" />Restricted</>}
                  </span>
                </td>
                <td className="p-3 text-slate-300">{v.operating_status}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] ${v.evidence_status === 'verified' ? 'bg-success/20 text-success' : v.evidence_status === 'documented' ? 'bg-teal-accent/20 text-teal-accent' : v.evidence_status === 'partial' ? 'bg-warning/20 text-warning' : 'bg-slate-500/20 text-slate-400'}`}>{v.evidence_status}</span>
                </td>
                <td className="p-3 text-slate-400">{v.last_checked}</td>
                <td className="p-3">
                  <div className="flex gap-1">
                    <button onClick={e => { e.stopPropagation(); window.open(v.canonical_url, '_blank'); }} className="p-1 rounded hover:bg-navy-600 text-slate-400 hover:text-cyan-accent" title="Open Source">
                      <ExternalLink size={12} />
                    </button>
                    <button onClick={e => { e.stopPropagation(); setSelectedVendor(v); }} className="p-1 rounded hover:bg-navy-600 text-slate-400 hover:text-cyan-accent" title="Research">
                      <Eye size={12} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============ PRODUCT VIEW ============
function ProductView({ state, searchTerm }: { state: AppState; searchTerm: string }) {
  const filtered = state.products.filter(p =>
    p.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.compound_name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="space-y-4 animate-slide-in">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400">{filtered.length} products discovered</span>
      </div>
      <div className="glass-panel rounded-xl overflow-hidden">
        <table className="data-table w-full text-xs">
          <thead><tr>
            <th className="text-left p-3 text-slate-400">Product</th>
            <th className="text-left p-3 text-slate-400">Compound</th>
            <th className="text-left p-3 text-slate-400">Form</th>
            <th className="text-left p-3 text-slate-400">Strength</th>
            <th className="text-left p-3 text-slate-400">Price</th>
            <th className="text-left p-3 text-slate-400">Vendor</th>
            <th className="text-left p-3 text-slate-400">Batch</th>
            <th className="text-left p-3 text-slate-400">CoA</th>
          </tr></thead>
          <tbody>
            {filtered.map(p => {
              const vendor = state.vendors.find(v => v.id === p.vendor_id);
              return (
                <tr key={p.id}>
                  <td className="p-3 text-white">{p.product_name}</td>
                  <td className="p-3 text-cyan-accent">{p.compound_name}</td>
                  <td className="p-3 text-slate-300">{p.chemical_form.replace(/_/g, ' ')}</td>
                  <td className="p-3 text-slate-300">{p.labeled_strength} {p.labeled_unit}</td>
                  <td className="p-3 text-slate-300">${p.price} {p.currency}</td>
                  <td className="p-3 text-slate-300">{vendor?.brand_name || 'Unknown'}</td>
                  <td className="p-3 text-slate-400 font-mono">{p.associated_batch || '—'}</td>
                  <td className="p-3">{p.associated_certificate ? <span className="text-success text-[10px]">✓ Found</span> : <span className="text-slate-500 text-[10px]">—</span>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============ LABORATORY VIEW ============
function LaboratoryView({ state }: { state: AppState }) {
  return (
    <div className="space-y-4 animate-slide-in">
      <span className="text-xs text-slate-400">{state.laboratories.length} laboratories identified</span>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {state.laboratories.map(lab => {
          const labCerts = state.certificates.filter(c => c.issuing_laboratory_id === lab.id);
          const verifiedCount = labCerts.filter(c => c.verification_status === 'officially_verified' || c.verification_status === 'directly_confirmed').length;
          return (
            <div key={lab.id} className="glass-panel rounded-xl p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">{lab.official_name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{lab.legal_entity} • {lab.jurisdiction}</p>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] ${lab.accreditation_status === 'verified' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'}`}>
                  {lab.accreditation_status}
                </span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <InfoField label="Accreditation" value={lab.accreditation_claim} />
                <InfoField label="Body" value={lab.accreditation_body || 'Not documented'} />
                <InfoField label="Accreditation #" value={lab.accreditation_number || 'N/A'} />
                <InfoField label="Verification Portal" value={lab.report_verification_portal ? 'Available' : 'None'} />
              </div>
              <div className="mt-4 flex items-center gap-4 text-xs">
                <span className="text-slate-400">Services: {lab.testing_services.join(', ')}</span>
              </div>
              <div className="mt-3 flex items-center gap-4 pt-3 border-t border-slate-border">
                <span className="text-xs text-slate-400">{labCerts.length} certificates issued</span>
                <span className="text-xs text-success">{verifiedCount} verified</span>
                <span className="text-xs text-slate-500">Last verified: {lab.verification_date || 'Never'}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============ CERTIFICATE VIEW ============
function CertificateView({ state }: { state: AppState }) {
  return (
    <div className="space-y-4 animate-slide-in">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400">{state.certificates.length} certificates • {state.certificates.filter(c => c.extraction_status === 'complete').length} fully parsed</span>
      </div>
      <div className="glass-panel rounded-xl overflow-hidden">
        <table className="data-table w-full text-xs">
          <thead><tr>
            <th className="text-left p-3 text-slate-400">Report #</th>
            <th className="text-left p-3 text-slate-400">Compound</th>
            <th className="text-left p-3 text-slate-400">Batch</th>
            <th className="text-left p-3 text-slate-400">Laboratory</th>
            <th className="text-left p-3 text-slate-400">Methods</th>
            <th className="text-left p-3 text-slate-400">Verification</th>
            <th className="text-left p-3 text-slate-400">Extraction</th>
            <th className="text-left p-3 text-slate-400">Date</th>
          </tr></thead>
          <tbody>
            {state.certificates.map(c => {
              const lab = state.laboratories.find(l => l.id === c.issuing_laboratory_id);
              const vendor = state.vendors.find(v => v.id === c.vendor_id);
              return (
                <tr key={c.id}>
                  <td className="p-3 text-white font-mono">{c.report_number}</td>
                  <td className="p-3 text-slate-300">{c.compound}</td>
                  <td className="p-3 text-slate-400 font-mono">{c.batch_identifier}</td>
                  <td className="p-3 text-slate-300">{lab?.official_name || 'Unknown'}<br/><span className="text-[10px] text-slate-500">via {vendor?.brand_name}</span></td>
                  <td className="p-3"><div className="flex gap-1 flex-wrap">{c.reported_methods.map(m => <span key={m} className="px-1.5 py-0.5 bg-navy-600 rounded text-[10px] text-slate-300">{m}</span>)}</div></td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] ${c.verification_status === 'officially_verified' ? 'bg-success/20 text-success' : c.verification_status === 'insufficient_identifiers' ? 'bg-warning/20 text-warning' : c.verification_status === 'not_checked' ? 'bg-slate-500/20 text-slate-400' : 'bg-blue-500/20 text-blue-400'}`}>
                      {c.verification_status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] ${c.extraction_status === 'complete' ? 'bg-success/20 text-success' : c.extraction_status === 'partial' ? 'bg-warning/20 text-warning' : 'bg-danger/20 text-danger'}`}>
                      {c.extraction_status}
                    </span>
                  </td>
                  <td className="p-3 text-slate-400">{c.report_date}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Test Results */}
      <div className="glass-panel rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-3">Analytical Test Results ({state.test_results.length} measurements)</h3>
        <table className="data-table w-full text-xs">
          <thead><tr>
            <th className="text-left p-2 text-slate-400">Analyte</th>
            <th className="text-left p-2 text-slate-400">Test</th>
            <th className="text-left p-2 text-slate-400">Method</th>
            <th className="text-left p-2 text-slate-400">Value</th>
            <th className="text-left p-2 text-slate-400">Criteria</th>
            <th className="text-left p-2 text-slate-400">Result</th>
            <th className="text-left p-2 text-slate-400">Category</th>
          </tr></thead>
          <tbody>
            {state.test_results.map(tr => (
              <tr key={tr.id}>
                <td className="p-2 text-white">{tr.analyte}</td>
                <td className="p-2 text-slate-300">{tr.test_type}</td>
                <td className="p-2 text-slate-400">{tr.method}</td>
                <td className="p-2 text-cyan-accent font-mono">{tr.reported_value} {tr.original_unit}</td>
                <td className="p-2 text-slate-400">{tr.acceptance_criteria}</td>
                <td className="p-2">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] ${tr.reported_pass_fail === 'PASS' ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'}`}>{tr.reported_pass_fail}</span>
                </td>
                <td className="p-2 text-slate-400">{tr.test_category.replace(/_/g, ' ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============ RELATIONSHIP VIEW ============
function RelationshipView({ state }: { state: AppState }) {
  const relationships: { source: string; target: string; type: string; evidence: string }[] = [];
  
  state.certificates.forEach(c => {
    const vendor = state.vendors.find(v => v.id === c.vendor_id);
    const lab = state.laboratories.find(l => l.id === c.issuing_laboratory_id);
    if (vendor && lab) {
      relationships.push({ source: vendor.brand_name, target: lab.official_name, type: 'publishes_report_via', evidence: c.report_number });
    }
    if (vendor) {
      relationships.push({ source: vendor.brand_name, target: c.report_number, type: 'publishes_certificate', evidence: c.document_url });
    }
  });

  return (
    <div className="space-y-4 animate-slide-in">
      <span className="text-xs text-slate-400">{relationships.length} evidence-backed relationships documented</span>
      <div className="glass-panel rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-3">Vendor ↔ Laboratory Relationships</h3>
        <div className="space-y-2">
          {relationships.filter(r => r.type === 'publishes_report_via').map((r, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-navy-700/30">
              <span className="text-xs text-white font-medium px-2 py-1 rounded bg-cyan-accent/10 text-cyan-accent">{r.source}</span>
              <ChevronRight size={14} className="text-slate-500" />
              <span className="text-[10px] text-slate-400">{r.type.replace(/_/g, ' ')}</span>
              <ChevronRight size={14} className="text-slate-500" />
              <span className="text-xs text-white font-medium px-2 py-1 rounded bg-teal-accent/10 text-teal-accent">{r.target}</span>
              <span className="text-[10px] text-slate-500 ml-auto font-mono">Evidence: {r.evidence}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="glass-panel rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-3">Certificate → Batch Links</h3>
        <div className="space-y-2">
          {state.certificates.map(c => {
            const vendor = state.vendors.find(v => v.id === c.vendor_id);
            return (
              <div key={c.id} className="flex items-center gap-3 p-2 rounded bg-navy-700/30 text-xs">
                <span className="text-slate-300">{vendor?.brand_name}</span>
                <span className="text-slate-500">→</span>
                <span className="text-white font-mono">{c.report_number}</span>
                <span className="text-slate-500">→</span>
                <span className="text-slate-400 font-mono">{c.batch_identifier}</span>
                <span className={`ml-auto px-1.5 py-0.5 rounded text-[10px] ${c.verification_status === 'officially_verified' ? 'bg-success/20 text-success' : 'bg-slate-500/20 text-slate-400'}`}>{c.verification_status.replace(/_/g, ' ')}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============ FLAGS VIEW ============
function FlagsView({ state }: { state: AppState }) {
  return (
    <div className="space-y-4 animate-slide-in">
      <span className="text-xs text-slate-400">{state.research_flags.length} research flags • {state.research_flags.filter(f => f.human_review_status === 'open').length} open</span>
      <div className="space-y-3">
        {state.research_flags.map(flag => (
          <div key={flag.id} className="glass-panel rounded-xl p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <AlertTriangle size={16} className="text-warning mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold text-white">{flag.rule_id.replace(/_/g, ' ')}</h4>
                  <p className="text-xs text-slate-300 mt-1">{flag.exact_reason}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[10px] text-slate-500">Records: {flag.affected_record_ids.join(', ')}</span>
                    <span className="text-[10px] text-slate-500">Confidence: {(flag.extraction_confidence * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className={`px-2 py-0.5 rounded text-[10px] ${flag.human_review_status === 'open' ? 'bg-warning/20 text-warning' : flag.human_review_status === 'under_review' ? 'bg-blue-500/20 text-blue-400' : flag.human_review_status === 'resolved' ? 'bg-success/20 text-success' : 'bg-slate-500/20 text-slate-400'}`}>
                  {flag.human_review_status.replace(/_/g, ' ')}
                </span>
                <span className="text-[10px] text-slate-500">{formatTimestamp(flag.created_at)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ REVIEW QUEUE VIEW ============
function ReviewView({ state, setState }: { state: AppState; setState: React.Dispatch<React.SetStateAction<AppState>> }) {
  const pendingItems = state.test_results.filter(tr => tr.review_status === 'pending_review' || tr.review_status === 'flagged');
  
  const markReviewed = (id: string) => {
    setState(prev => ({
      ...prev,
      test_results: prev.test_results.map(tr => tr.id === id ? { ...tr, review_status: 'verified' } : tr),
    }));
  };

  return (
    <div className="space-y-4 animate-slide-in">
      <span className="text-xs text-slate-400">{pendingItems.length} items pending review</span>
      <div className="glass-panel rounded-xl overflow-hidden">
        <table className="data-table w-full text-xs">
          <thead><tr>
            <th className="text-left p-3 text-slate-400">Analyte</th>
            <th className="text-left p-3 text-slate-400">Test</th>
            <th className="text-left p-3 text-slate-400">Value</th>
            <th className="text-left p-3 text-slate-400">Source Excerpt</th>
            <th className="text-left p-3 text-slate-400">Status</th>
            <th className="text-left p-3 text-slate-400">Action</th>
          </tr></thead>
          <tbody>
            {pendingItems.map(tr => (
              <tr key={tr.id}>
                <td className="p-3 text-white">{tr.analyte}</td>
                <td className="p-3 text-slate-300">{tr.test_type} ({tr.method})</td>
                <td className="p-3 text-cyan-accent font-mono">{tr.reported_value} {tr.original_unit}</td>
                <td className="p-3 text-slate-400 italic">"{tr.source_excerpt}"</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] ${tr.review_status === 'flagged' ? 'bg-danger/20 text-danger' : 'bg-warning/20 text-warning'}`}>{tr.review_status.replace(/_/g, ' ')}</span>
                </td>
                <td className="p-3">
                  <button onClick={() => markReviewed(tr.id)} className="btn-primary px-2 py-1 rounded text-[10px] text-white">
                    Mark Verified
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pendingItems.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          <CheckCircle size={32} className="mx-auto mb-3 text-success/50" />
          <p className="text-sm">All items reviewed</p>
        </div>
      )}
    </div>
  );
}

// ============ CRAWL VIEW ============
function CrawlView({ state, setState, startCrawl, pauseCrawl, stopCrawl, addEvent }: { state: AppState; setState: React.Dispatch<React.SetStateAction<AppState>>; startCrawl: () => void; pauseCrawl: () => void; stopCrawl: () => void; addEvent: (msg: string, type: ActivityEvent['type'], vid?: string) => void }) {
  const totalJobs = state.crawl_jobs.length;
  const completedJobs = state.crawl_jobs.filter(j => j.status === 'completed').length;
  const progress = totalJobs > 0 ? (completedJobs / totalJobs) * 100 : 0;

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Controls */}
      <div className="glass-panel rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Research Job Controls</h3>
            <p className="text-xs text-slate-400 mt-1">Status: <span className={state.crawl_status === 'running' ? 'text-success' : state.crawl_status === 'paused' ? 'text-warning' : 'text-slate-400'}>{state.crawl_status.toUpperCase()}</span></p>
          </div>
          <div className="flex gap-2">
            {state.crawl_status === 'idle' && (
              <button onClick={startCrawl} className="btn-primary px-4 py-2 rounded-lg text-xs text-white flex items-center gap-1.5">
                <Play size={14} /> Start Research
              </button>
            )}
            {state.crawl_status === 'running' && (
              <>
                <button onClick={pauseCrawl} className="btn-secondary px-4 py-2 rounded-lg text-xs text-slate-300 flex items-center gap-1.5">
                  <Pause size={14} /> Pause
                </button>
                <button onClick={stopCrawl} className="btn-danger px-4 py-2 rounded-lg text-xs text-white flex items-center gap-1.5">
                  <Square size={14} /> Stop
                </button>
              </>
            )}
            {state.crawl_status === 'paused' && (
              <>
                <button onClick={startCrawl} className="btn-primary px-4 py-2 rounded-lg text-xs text-white flex items-center gap-1.5">
                  <Play size={14} /> Resume
                </button>
                <button onClick={stopCrawl} className="btn-danger px-4 py-2 rounded-lg text-xs text-white flex items-center gap-1.5">
                  <Square size={14} /> Stop
                </button>
              </>
            )}
            <button onClick={() => addEvent('Retry requested for failed jobs', 'info')} className="btn-secondary px-4 py-2 rounded-lg text-xs text-slate-300 flex items-center gap-1.5">
              <RefreshCw size={14} /> Retry Failed
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Queue Progress</span>
            <span className="text-white">{completedJobs}/{totalJobs} vendors ({progress.toFixed(0)}%)</span>
          </div>
          <div className="h-2 bg-navy-700 rounded-full overflow-hidden">
            <div className="progress-bar h-full rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Live Stats */}
        <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-slate-border">
          <div><p className="text-[10px] text-slate-500">Pages Examined</p><p className="text-sm font-bold text-white">{state.crawl_jobs.reduce((a, j) => a + j.pages_examined, 0)}</p></div>
          <div><p className="text-[10px] text-slate-500">Documents Downloaded</p><p className="text-sm font-bold text-white">{state.crawl_jobs.reduce((a, j) => a + j.documents_downloaded, 0)}</p></div>
          <div><p className="text-[10px] text-slate-500">Records Extracted</p><p className="text-sm font-bold text-cyan-accent">{state.crawl_jobs.reduce((a, j) => a + j.records_extracted, 0)}</p></div>
          <div><p className="text-[10px] text-slate-500">Errors</p><p className="text-sm font-bold text-danger">{state.crawl_jobs.reduce((a, j) => a + j.errors, 0)}</p></div>
        </div>
      </div>

      {/* Job List */}
      <div className="glass-panel rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-3">Crawl Jobs</h3>
        <div className="space-y-2">
          {state.crawl_jobs.map(job => {
            const vendor = state.vendors.find(v => v.id === job.vendor_id);
            return (
              <div key={job.id} className="flex items-center justify-between p-3 rounded-lg bg-navy-700/30">
                <div className="flex items-center gap-3">
                  <span className={`w-2.5 h-2.5 rounded-full ${job.status === 'completed' ? 'bg-success' : job.status === 'failed' ? 'bg-danger' : job.status === 'running' ? 'bg-cyan-accent animate-pulse' : job.status === 'paused' ? 'bg-warning' : 'bg-slate-500'}`} />
                  <div>
                    <p className="text-xs text-white font-medium">{vendor?.brand_name || job.vendor_id}</p>
                    <p className="text-[10px] text-slate-400">{vendor?.canonical_url}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400">{job.pages_examined} pages • {job.documents_downloaded} docs • {job.records_extracted} records</p>
                    {job.errors > 0 && <p className="text-[10px] text-danger">{job.errors} errors</p>}
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] ${job.status === 'completed' ? 'bg-success/20 text-success' : job.status === 'failed' ? 'bg-danger/20 text-danger' : job.status === 'running' ? 'bg-cyan-accent/20 text-cyan-accent' : job.status === 'paused' ? 'bg-warning/20 text-warning' : 'bg-slate-500/20 text-slate-400'}`}>
                    {job.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============ STATISTICS VIEW ============
function StatisticsView({ state, stats }: { state: AppState; stats: ReturnType<typeof getStats> }) {
  const verificationFunnel = [
    { stage: 'Total CoAs', count: state.certificates.length },
    { stage: 'Parsed', count: state.certificates.filter(c => c.extraction_status === 'complete').length },
    { stage: 'Lab Identified', count: state.certificates.filter(c => c.issuing_laboratory_id).length },
    { stage: 'Verification Attempted', count: state.certificates.filter(c => c.verification_status !== 'not_checked').length },
    { stage: 'Verified', count: state.certificates.filter(c => c.verification_status === 'officially_verified' || c.verification_status === 'directly_confirmed').length },
  ];

  const accessData = [
    { name: 'Public', value: state.vendors.filter(v => v.access_type === 'public').length },
    { name: 'Account Required', value: state.vendors.filter(v => v.access_type === 'free_account_required').length },
    { name: 'Restricted', value: state.vendors.filter(v => v.access_type === 'restricted' || v.access_type === 'inaccessible').length },
  ];

  const evidenceStatus = [
    { name: 'Verified', value: state.vendors.filter(v => v.evidence_status === 'verified').length },
    { name: 'Documented', value: state.vendors.filter(v => v.evidence_status === 'documented').length },
    { name: 'Partial', value: state.vendors.filter(v => v.evidence_status === 'partial').length },
    { name: 'Pending', value: state.vendors.filter(v => v.evidence_status === 'pending').length },
  ];

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Key Statistics Table */}
      <div className="glass-panel rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Key Research Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <StatRow label="Total unique qualifying vendors" value={stats.total_vendors} />
          <StatRow label="Public vendors" value={state.vendors.filter(v => v.access_type === 'public').length} />
          <StatRow label="Free-account vendors" value={state.vendors.filter(v => v.access_type === 'free_account_required').length} />
          <StatRow label="Successfully inspected" value={state.vendors.filter(v => v.evidence_status === 'documented' || v.evidence_status === 'verified').length} />
          <StatRow label="Partially inspected" value={state.vendors.filter(v => v.evidence_status === 'partial').length} />
          <StatRow label="Inaccessible" value={state.vendors.filter(v => v.access_type === 'inaccessible').length} />
          <StatRow label="Products discovered" value={stats.products_discovered} />
          <StatRow label="Vendors publishing accessible CoAs" value={new Set(state.certificates.map(c => c.vendor_id)).size} />
          <StatRow label="Certificates found" value={stats.certificates_found} />
          <StatRow label="Certificates successfully parsed" value={stats.certificates_parsed} />
          <StatRow label="Reports independently authenticated" value={stats.verified_reports} />
          <StatRow label="Reports with identifiable laboratories" value={state.certificates.filter(c => c.issuing_laboratory_id).length} />
          <StatRow label="Reports with purity results" value={new Set(state.test_results.filter(t => t.test_category === 'purity').map(t => t.certificate_id)).size} />
          <StatRow label="Reports with identity testing" value={new Set(state.test_results.filter(t => t.test_category === 'molecular_identity').map(t => t.certificate_id)).size} />
          <StatRow label="Reports with sterility results" value={0} note="No sterility tests found" />
          <StatRow label="Reports with endotoxin results" value={new Set(state.test_results.filter(t => t.test_category === 'endotoxins').map(t => t.certificate_id)).size} />
          <StatRow label="Laboratories independently identified" value={stats.laboratories_identified} />
          <StatRow label="Accreditations independently verified" value={state.laboratories.filter(l => l.accreditation_status === 'verified').length} />
          <StatRow label="Unresolved research flags" value={stats.unresolved_flags} />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-panel rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Verification Funnel</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={verificationFunnel} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#2a3550" />
              <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis dataKey="stage" type="category" tick={{ fill: '#94a3b8', fontSize: 10 }} width={120} />
              <Tooltip contentStyle={{ background: '#1a2236', border: '1px solid #2a3550', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="count" fill="#22d3ee" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-panel rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Vendor Access Types</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={accessData} cx="50%" cy="50%" innerRadius={40} outerRadius={75} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {accessData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#1a2236', border: '1px solid #2a3550', borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-panel rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Evidence Status Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={evidenceStatus}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a3550" />
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#1a2236', border: '1px solid #2a3550', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {evidenceStatus.map((_, i) => <Cell key={i} fill={COLORS[i + 2]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-panel rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Research Flags by Status</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Open', value: state.research_flags.filter(f => f.human_review_status === 'open').length },
                  { name: 'Under Review', value: state.research_flags.filter(f => f.human_review_status === 'under_review').length },
                  { name: 'Resolved', value: state.research_flags.filter(f => f.human_review_status === 'resolved').length },
                ]}
                cx="50%" cy="50%" innerRadius={40} outerRadius={75} dataKey="value" label={({ name, value }) => `${name}: ${value}`}
              >
                <Cell fill="#f59e0b" /><Cell fill="#3b82f6" /><Cell fill="#10b981" />
              </Pie>
              <Tooltip contentStyle={{ background: '#1a2236', border: '1px solid #2a3550', borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Coverage Note */}
      <div className="glass-panel rounded-xl p-4 border-l-2 border-warning/50">
        <p className="text-xs text-slate-300">
          <strong className="text-warning">Coverage Limitation:</strong> These statistics reflect only vendors and documents that were accessible through permitted public collection methods. 
          Vendors requiring accounts, blocking automated access, or with inactive domains are recorded but not fully investigated. 
          Do not extrapolate these findings to the entire peptide vendor market.
        </p>
      </div>
    </div>
  );
}

// ============ EXPORT VIEW ============
function ExportView({ state }: { state: AppState }) {
  const handleExport = (format: string) => {
    const exportData = {
      manifest: {
        research_date: new Date().toISOString(),
        application_version: '1.0.0',
        total_vendors: state.vendors.length,
        total_products: state.products.length,
        total_certificates: state.certificates.length,
        total_laboratories: state.laboratories.length,
        total_test_results: state.test_results.length,
        total_flags: state.research_flags.length,
      },
      vendors: state.vendors,
      products: state.products,
      certificates: state.certificates,
      laboratories: state.laboratories,
      test_results: state.test_results,
      research_flags: state.research_flags,
      marketing_claims: state.marketing_claims,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `peptide_atlas_export_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadProject = async () => {
    const { downloadProjectZip } = await import('./downloadUtils');
    await downloadProjectZip();
  };

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="glass-panel rounded-xl p-6">
        <h3 className="text-sm font-semibold text-white mb-2">Export for Astra 6</h3>
        <p className="text-xs text-slate-400 mb-6">Generate a complete, versioned research package with all collected data, evidence references, and metadata.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-lg bg-navy-700/30 border border-slate-border">
            <Database size={20} className="text-cyan-accent mb-2" />
            <p className="text-xs font-medium text-white">Full Research Package</p>
            <p className="text-[10px] text-slate-400 mt-1">Complete dataset with manifest, all entities, evidence, and quality report</p>
          </div>
          <div className="p-4 rounded-lg bg-navy-700/30 border border-slate-border">
            <FileText size={20} className="text-teal-accent mb-2" />
            <p className="text-xs font-medium text-white">CSV Export</p>
            <p className="text-[10px] text-slate-400 mt-1">Tabular exports for vendors, products, certificates, test results</p>
          </div>
          <div className="p-4 rounded-lg bg-navy-700/30 border border-slate-border">
            <Shield size={20} className="text-success mb-2" />
            <p className="text-xs font-medium text-white">Verification Report</p>
            <p className="text-[10px] text-slate-400 mt-1">Focused export of verification records and research flags</p>
          </div>
        </div>

        <div className="flex gap-3 flex-wrap">
          <button onClick={handleDownloadProject} className="px-5 py-2.5 rounded-lg text-sm text-white flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 border border-purple-400/30 hover:shadow-lg hover:shadow-purple-500/20 transition-all">
            <Download size={16} /> ⬇ Download Complete Project (ZIP)
          </button>
          <button onClick={() => handleExport('astra')} className="btn-primary px-5 py-2.5 rounded-lg text-sm text-white flex items-center gap-2">
            <Download size={16} /> Export Research Data
          </button>
          <button onClick={() => handleExport('csv')} className="btn-secondary px-5 py-2.5 rounded-lg text-sm text-slate-300 flex items-center gap-2">
            <Download size={16} /> Export CSV
          </button>
          <button className="btn-secondary px-5 py-2.5 rounded-lg text-sm text-slate-300 flex items-center gap-2">
            <FolderOpen size={16} /> Open Export Folder
          </button>
        </div>
      </div>

      {/* Export Contents Preview */}
      <div className="glass-panel rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-3">Package Contents</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {['manifest.json', 'vendors.csv', 'products.csv', 'certificates.csv', 'test_results.csv', 'laboratories.csv', 'research_flags.csv', 'claims.jsonl', 'sources.jsonl', 'statistics/', 'documents/', 'quality_report.json', 'methodology.md', 'data_dictionary.json'].map(file => (
            <div key={file} className="flex items-center gap-2 p-2 rounded bg-navy-700/30 text-xs text-slate-300">
              <FileText size={12} className="text-slate-500" />
              {file}
            </div>
          ))}
        </div>
      </div>

      {/* Data Summary */}
      <div className="glass-panel rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-3">Data Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div><p className="text-lg font-bold text-cyan-accent">{state.vendors.length}</p><p className="text-[10px] text-slate-400">Vendors</p></div>
          <div><p className="text-lg font-bold text-teal-accent">{state.products.length}</p><p className="text-[10px] text-slate-400">Products</p></div>
          <div><p className="text-lg font-bold text-purple-400">{state.certificates.length}</p><p className="text-[10px] text-slate-400">Certificates</p></div>
          <div><p className="text-lg font-bold text-success">{state.test_results.length}</p><p className="text-[10px] text-slate-400">Test Results</p></div>
          <div><p className="text-lg font-bold text-blue-400">{state.laboratories.length}</p><p className="text-[10px] text-slate-400">Laboratories</p></div>
          <div><p className="text-lg font-bold text-warning">{state.research_flags.length}</p><p className="text-[10px] text-slate-400">Flags</p></div>
          <div><p className="text-lg font-bold text-slate-300">{state.marketing_claims.length}</p><p className="text-[10px] text-slate-400">Claims</p></div>
          <div><p className="text-lg font-bold text-slate-300">{state.activity_events.length}</p><p className="text-[10px] text-slate-400">Events</p></div>
        </div>
      </div>

      <div className="glass-panel rounded-xl p-4 border-l-2 border-cyan-accent/50">
        <p className="text-xs text-slate-300">
          <strong className="text-cyan-accent">Security Note:</strong> Exports exclude session cookies, authentication tokens, passwords, and private account information. 
          Only permitted research data and evidence references are included in the export package.
        </p>
      </div>
    </div>
  );
}

// ============ SETTINGS VIEW ============
function SettingsView({ state, setState }: { state: AppState; setState: React.Dispatch<React.SetStateAction<AppState>> }) {
  const updateSetting = (key: keyof typeof state.settings, value: number | string | boolean) => {
    setState(prev => ({
      ...prev,
      settings: { ...prev.settings, [key]: value },
    }));
  };

  const s = state.settings;

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="glass-panel rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Crawl Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <SettingInput label="Max Concurrent Requests" value={s.max_concurrent_requests} onChange={v => updateSetting('max_concurrent_requests', v)} type="number" />
          <SettingInput label="Per-Domain Rate (req/sec)" value={s.per_domain_rate} onChange={v => updateSetting('per_domain_rate', v)} type="number" />
          <SettingInput label="Request Timeout (ms)" value={s.request_timeout_ms} onChange={v => updateSetting('request_timeout_ms', v)} type="number" />
          <SettingInput label="Retry Count" value={s.retry_count} onChange={v => updateSetting('retry_count', v)} type="number" />
          <SettingInput label="Max Pages per Vendor" value={s.max_pages_per_vendor} onChange={v => updateSetting('max_pages_per_vendor', v)} type="number" />
          <SettingInput label="Max Crawl Depth" value={s.max_crawl_depth} onChange={v => updateSetting('max_crawl_depth', v)} type="number" />
          <SettingInput label="Max PDF Size (MB)" value={s.max_pdf_size_mb} onChange={v => updateSetting('max_pdf_size_mb', v)} type="number" />
          <SettingInput label="Max Total Download (GB)" value={s.max_total_download_gb} onChange={v => updateSetting('max_total_download_gb', v)} type="number" />
        </div>
      </div>

      <div className="glass-panel rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Collection Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-navy-700/30">
            <span className="text-xs text-slate-300">Browser Visible (Playwright)</span>
            <button onClick={() => updateSetting('browser_visible', !s.browser_visible)} className={`w-10 h-5 rounded-full transition-colors ${s.browser_visible ? 'bg-cyan-accent' : 'bg-slate-600'}`}>
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${s.browser_visible ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-navy-700/30">
            <span className="text-xs text-slate-300">Auto-Download PDFs</span>
            <button onClick={() => updateSetting('auto_download_pdfs', !s.auto_download_pdfs)} className={`w-10 h-5 rounded-full transition-colors ${s.auto_download_pdfs ? 'bg-cyan-accent' : 'bg-slate-600'}`}>
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${s.auto_download_pdfs ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </div>
          <SettingInput label="Default Collection Mode" value={s.default_collection_mode} onChange={v => updateSetting('default_collection_mode', v as string)} type="text" />
          <SettingInput label="Backup Frequency (hours)" value={s.backup_frequency_hours} onChange={v => updateSetting('backup_frequency_hours', v)} type="number" />
          <SettingInput label="Export Destination" value={s.export_destination} onChange={v => updateSetting('export_destination', v as string)} type="text" />
          <SettingInput label="Research Scope" value={s.research_scope} onChange={v => updateSetting('research_scope', v as string)} type="text" />
        </div>
      </div>

      <div className="glass-panel rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Data Management</h3>
        <div className="flex gap-3">
          <button onClick={() => {
            const fresh = loadState();
            setState(fresh);
          }} className="btn-secondary px-4 py-2 rounded-lg text-xs text-slate-300 flex items-center gap-1.5">
            <RefreshCw size={12} /> Reset Demo Data
          </button>
          <button className="btn-secondary px-4 py-2 rounded-lg text-xs text-slate-300 flex items-center gap-1.5">
            <Database size={12} /> Backup Database
          </button>
          <button className="btn-secondary px-4 py-2 rounded-lg text-xs text-slate-300 flex items-center gap-1.5">
            <Database size={12} /> Run Integrity Check
          </button>
        </div>
      </div>

      <div className="glass-panel rounded-xl p-4 border-l-2 border-slate-border">
        <p className="text-xs text-slate-400">
          <strong>Hardware Note:</strong> These defaults are configured for a 16 GB RAM Windows laptop. 
          Adjust concurrent requests and download limits if you experience memory pressure during large collection jobs.
        </p>
      </div>
    </div>
  );
}

// ============ HELPER COMPONENTS ============
function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] text-slate-500 uppercase tracking-wider">{label}</p>
      <p className="text-xs text-slate-200 mt-0.5">{value || '—'}</p>
    </div>
  );
}

function StatRow({ label, value, note }: { label: string; value: number; note?: string }) {
  return (
    <div className="flex items-center justify-between p-2 rounded bg-navy-700/20">
      <span className="text-xs text-slate-300">{label}</span>
      <div className="text-right">
        <span className="text-xs font-bold text-white">{value}</span>
        {note && <p className="text-[9px] text-slate-500">{note}</p>}
      </div>
    </div>
  );
}

function SettingInput({ label, value, onChange, type }: { label: string; value: number | string; onChange: (v: number | string) => void; type: string }) {
  return (
    <div>
      <label className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
        className="w-full px-3 py-2 text-xs bg-navy-700 border border-slate-border rounded-lg text-white focus:outline-none focus:border-cyan-accent/50"
      />
    </div>
  );
}
