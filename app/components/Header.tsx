"use client";

import LevelProgress from "./LevelProgress";

const Header = ({ username }: { username: string }) => {
  return (
    <div>
      <div className=' text-white p-4'>
        <p className='text-sm'>
          Welcome {username}
          {/* <span className='font-bold'>{user?.first_name.toUpperCase()}</span>{" "} */}
        </p>

        {/* <LevelProgress
            currentLevel={level}
            levelNames={levelNames}
            progress={progress}
          /> */}
      </div>
    </div>
  );
};

export default Header;
