const StatusFilterTabs = ({ selected, onSelect, counts }) => {
  const tabs = [
    { key: "ALL", label: "All", count: counts.all },
    { key: "ACTIVE", label: "Active", count: counts.active },
    { key: "COMPLETED", label: "Completed", count: counts.completed },
    { key: "ON_HOLD", label: "On Hold", count: counts.onHold },
  ];

  return (
    <div className="mb-3">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className={`btn me-2 ${
            selected === tab.key ? "btn-primary" : "btn-outline-primary"
          }`}
          onClick={() => onSelect(tab.key)}
        >
          {tab.label}
          <span className="badge bg-secondary ms-1">
            {tab.count}
          </span>
        </button>
      ))}
    </div>
  );
};

export default StatusFilterTabs;