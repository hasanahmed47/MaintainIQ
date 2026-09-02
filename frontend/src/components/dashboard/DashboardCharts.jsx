import { useEffect, useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  LabelList,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer,
} from 'recharts';
import { motion } from 'framer-motion';
import './DashboardCharts.css';

const STATUS_META = {
  Operational: { color: 'var(--color-success)', cls: 'dot-success' },
  'Issue Reported': { color: 'var(--color-danger)', cls: 'dot-danger' },
  'Under Inspection': { color: 'var(--color-warning)', cls: 'dot-warning' },
  'Under Maintenance': { color: 'var(--color-accent)', cls: 'dot-accent' },
  'Out of Service': { color: 'var(--color-primary)', cls: 'dot-primary' },
  Retired: { color: 'var(--color-muted)', cls: 'dot-muted' },
};

const PRIORITY_COLORS = {
  Critical: 'var(--color-danger)',
  High: 'var(--color-warning)',
  Medium: 'var(--color-accent)',
  Low: 'var(--color-muted)',
};

const useCountUp = (target, duration = 900, delay = 150) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let frame;
    let start = null;
    const timer = setTimeout(() => {
      const step = (timestamp) => {
        if (start === null) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        setValue(Math.round(progress * target));
        if (progress < 1) frame = requestAnimationFrame(step);
      };
      frame = requestAnimationFrame(step);
    }, delay);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(frame);
    };
  }, [target, duration, delay]);

  return value;
};

const RadialStat = ({ label, value, color }) => {
  const displayValue = useCountUp(value);

  return (
    <div className="radial-stat">
      <ResponsiveContainer width="100%" height={140}>
        <RadialBarChart
          innerRadius="72%"
          outerRadius="100%"
          data={[{ value }]}
          startAngle={90}
          endAngle={-270}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
          <RadialBar
            dataKey="value"
            cornerRadius={20}
            fill={color}
            background={{ fill: 'rgba(255, 255, 255, 0.05)' }}
            animationBegin={150}
            animationDuration={900}
            animationEasing="ease-out"
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="radial-stat-center">
        <span className="radial-stat-value">{displayValue}%</span>
      </div>
      <span className="radial-stat-label">{label}</span>
    </div>
  );
};

const DashboardCharts = ({ assets, issues }) => {
  const statusCounts = assets.reduce((acc, asset) => {
    acc[asset.status] = (acc[asset.status] || 0) + 1;
    return acc;
  }, {});

  const assetStatusData = Object.entries(statusCounts).map(([status, count]) => ({
    status,
    count,
    ...(STATUS_META[status] || { color: 'var(--color-muted)', cls: 'dot-muted' }),
  }));

  const totalAssets = useCountUp(assets.length);

  const operationalPct = assets.length
    ? Math.round(((statusCounts.Operational || 0) / assets.length) * 100)
    : 0;

  const resolvedCount = issues.filter((i) => ['Resolved', 'Closed'].includes(i.status)).length;
  const resolutionPct = issues.length ? Math.round((resolvedCount / issues.length) * 100) : 0;

  const priorityCounts = issues.reduce((acc, issue) => {
    acc[issue.priority] = (acc[issue.priority] || 0) + 1;
    return acc;
  }, {});

  const issuePriorityData = ['Critical', 'High', 'Medium', 'Low']
    .filter((p) => priorityCounts[p])
    .map((p) => ({ name: p, count: priorityCounts[p], color: PRIORITY_COLORS[p] }));

  return (
    <motion.div
      className="charts-grid"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <div className="chart-card">
        <h3>Assets by status</h3>
        {assets.length === 0 ? (
          <p className="empty-text">No assets registered yet.</p>
        ) : (
          <div className="donut-block">
            <div className="donut-wrapper">
              <ResponsiveContainer width="100%" height={190}>
                <PieChart>
                  <Pie
                    data={assetStatusData}
                    dataKey="count"
                    nameKey="status"
                    innerRadius={60}
                    outerRadius={88}
                    paddingAngle={3}
                    stroke="none"
                    animationBegin={150}
                    animationDuration={900}
                    animationEasing="ease-out"
                  >
                    {assetStatusData.map((entry) => (
                      <Cell key={entry.status} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="donut-center">
                <span className="donut-total">{totalAssets}</span>
                <span className="donut-total-label">Assets</span>
              </div>
            </div>

            <div className="donut-legend">
              {assetStatusData.map((entry) => (
                <div className="legend-row" key={entry.status}>
                  <span className={`legend-dot ${entry.cls}`} />
                  <span className="legend-label">{entry.status}</span>
                  <span className="legend-count">{entry.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="chart-card chart-card-radials">
        <RadialStat label="Operational" value={operationalPct} color="var(--color-success)" />
        <RadialStat label="Resolution" value={resolutionPct} color="var(--color-accent)" />
      </div>

      <div className="chart-card">
        <h3>Issues by priority</h3>
        {issuePriorityData.length === 0 ? (
          <p className="empty-text">No issues reported yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={issuePriorityData} layout="vertical" margin={{ top: 4, right: 26, bottom: 4, left: 4 }}>
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="name"
                width={64}
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'var(--color-muted)', fontSize: 12 }}
              />
              <Bar
                dataKey="count"
                radius={[0, 8, 8, 0]}
                barSize={20}
                animationBegin={150}
                animationDuration={700}
                animationEasing="ease-out"
              >
                {issuePriorityData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
                <LabelList dataKey="count" position="right" fill="var(--color-text)" fontSize={13} fontWeight={700} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  );
};

export default DashboardCharts;