import { stats } from "./data";

export const Stats = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-xl shadow p-4 flex flex-col gap-2"
        >
          <div className="text-gray-500 text-sm">{stat.label}</div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold">{stat.value}</span>
            <span className={`text-xs font-semibold ${stat.color}`}>
              {stat.change}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
