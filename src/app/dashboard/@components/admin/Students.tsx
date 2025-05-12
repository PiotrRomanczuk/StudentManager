import { students } from "./data";
import Image from "next/image";

export const Students = () => {
  return (
    <div className="bg-white rounded-xl shadow p-5">
      <div className="font-bold text-lg mb-3">Recent Students</div>
      <ul className="divide-y divide-gray-100">
        {students.map((student) => (
          <li key={student.name} className="flex items-center gap-3 py-2">
            <Image
              src={student.avatar}
              alt={student.name}
              width={36}
              height={36}
              className="w-9 h-9 rounded-full object-cover border"
            />
            <div>
              <div className="font-semibold">{student.name}</div>
              <div className="text-xs text-gray-500">
                {student.instrument} • {student.level}
              </div>
            </div>
            <span className="ml-auto text-xs text-gray-400">
              {student.time}
            </span>
          </li>
        ))}
      </ul>
      <div className="text-right mt-2">
        <button className="text-blue-600 hover:underline text-sm font-semibold">
          View all students →
        </button>
      </div>
    </div>
  );
};
