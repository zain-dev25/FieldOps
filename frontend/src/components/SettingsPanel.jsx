export  function SettingsPanel({ dark, onToggleDark }) {
  return (
    <div className={`rounded-2xl p-5 ${dark ? "bg-slate-800 border border-slate-700" : "bg-white border border-slate-100 shadow-sm"}`}>
      <h3 className={`text-sm font-bold mb-4 ${dark ? "text-white" : "text-slate-900"}`}>Settings</h3>
      <div className="space-y-4">
        <div className={`flex items-center justify-between p-3 rounded-xl ${dark ? "bg-slate-700" : "bg-slate-50"}`}>
          <div>
            <p className={`text-sm font-semibold ${dark ? "text-slate-200" : "text-slate-800"}`}>Dark Mode</p>
            <p className={`text-xs ${dark ? "text-slate-400" : "text-slate-500"}`}>Toggle interface theme</p>
          </div>
          <button onClick={onToggleDark} className={`w-12 h-6 rounded-full transition-colors relative ${dark ? "bg-indigo-600" : "bg-slate-300"}`}>
            <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${dark ? "left-7" : "left-1"}`} />
          </button>
        </div>
        {["Email Notifications", "Auto-refresh Data", "Compact View"].map(s => (
          <div key={s} className={`flex items-center justify-between p-3 rounded-xl ${dark ? "bg-slate-700" : "bg-slate-50"}`}>
            <p className={`text-sm font-semibold ${dark ? "text-slate-200" : "text-slate-800"}`}>{s}</p>
            <button className={`w-12 h-6 rounded-full bg-slate-300 relative`}>
              <span className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}