const Spinner = ({ size }: { size: number }) => {
  return (
    <div className={`relative w-${size} h-${size} m-auto`}>
      <div
        className={`absolute inset-0 border-t-4 border-b-4 border-gray-200 rounded-full`}
      ></div>
      <div
        className={`absolute inset-0 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin`}
      ></div>
    </div>
  );
};

export default Spinner;
