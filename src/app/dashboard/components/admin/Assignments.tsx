import { assignments } from "./data";

export const Assignments = () => {
  return (
    <div className="bg-white rounded-xl shadow p-5 mt-2">
      <div className="font-bold text-lg mb-3">Recent Assignments</div>
      <ul className="divide-y divide-gray-100">
        {assignments.map((a) => (
          <li key={a.title} className="flex items-center gap-3 py-2">
            <div className="flex-1">
              <div className="font-semibold">{a.title}</div>
              <div className="text-xs text-gray-500">
                {a.student} • Due {a.due}
              </div>
            </div>
            <span
              className={`text-xs font-bold px-2 py-1 rounded ${
                a.status === "Completed"
                  ? "bg-green-100 text-green-700"
                  : a.status === "In Progress"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
              }`}
            >
              {a.status}
            </span>
          </li>
        ))}
      </ul>
      <div className="text-right mt-2">
        <button className="text-blue-600 hover:underline text-sm font-semibold">
          View all assignments →
        </button>
      </div>
    </div>
  );
};
