import { Link, ArrowLeft } from "lucide-react";
import React from "react";

const SongNotFound = () => {
  return (
    <>
    <Link
          href="/dashboard/songs"
          className='flex items-center mb-6 text-blue-500 hover:text-blue-600'
        >
          <ArrowLeft size={28} />
          <div className="text-xl text-black">Back to Songs</div>
        </Link>
      Song not found
    </>
  );
};

export default SongNotFound;
