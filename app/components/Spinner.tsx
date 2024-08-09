const Spinner = ({ size = 5 }: { size: number }) => {
  const sizeClass = `w-${size} h-${size}`;

  return (
    <div className={`relative ${sizeClass}`}>
      <div
        className={`absolute top-0 left-0 bg-gray-500 opacity-75 rounded-full ${sizeClass} animate-bounce`}
      ></div>
      <div
        className={`absolute top-0 left-0 bg-gray-500 opacity-50 rounded-full ${sizeClass} animate-bounce delay-200`}
      ></div>
    </div>
  );
};

export default Spinner;
