import { lessons } from "./data";
import Image from "next/image";
export const Lessons = () => {
  return (
    <div className="grid md:grid-cols-3 gap-4 mb-8">
      {lessons.map((lesson) => (
        <div
          key={lesson.name}
          className={`rounded-xl shadow p-5 ${lesson.color} flex flex-col gap-2`}
        >
          <div className="flex items-center gap-3 mb-2">
            <Image
              src={lesson.avatar}
              alt={lesson.name}
              width={48}
              height={48}
              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
            />
            <div>
              <div className="font-semibold text-lg">{lesson.name}</div>
              <div className="text-gray-500 text-xs">
                {lesson.instrument} • {lesson.duration}
              </div>
            </div>
            <span
              className={`ml-auto px-2 py-1 rounded text-xs font-bold ${
                lesson.tag === "Beginner"
                  ? "bg-yellow-200 text-yellow-800"
                  : lesson.tag === "Intermediate"
                    ? "bg-blue-200 text-blue-800"
                    : "bg-purple-200 text-purple-800"
              }`}
            >
              {lesson.tag}
            </span>
          </div>
          <div className="text-xs text-gray-600 mb-1">
            <span className="font-semibold">Lesson Focus:</span> {lesson.focus}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded font-semibold">
              {lesson.time}
            </span>
            <button className="text-blue-600 hover:underline ml-auto">
              View Details
            </button>
            <button className="text-gray-500 hover:underline">
              Reschedule
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
