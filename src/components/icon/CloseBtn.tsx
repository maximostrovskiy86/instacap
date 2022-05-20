
const CloseBtn = function () {
  return (
    <svg
      className={`absolute top-8 right-8 cursor-pointer hover:tw-bg-blue-500`}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 32 32"
      aria-labelledby="title"

    >
      <title id="icon-arrow-up">CloseButton</title>
      <path fill="#fff" d="M16 0c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16-7.163-16-16-16zM16 29c-7.18 0-13-5.82-13-13s5.82-13 13-13 13 5.82 13 13-5.82 13-13 13z" />
      <path fill="#fff" d="M21 8l-5 5-5-5-3 3 5 5-5 5 3 3 5-5 5 5 3-3-5-5 5-5z" />
    </svg>
  );
};

export default CloseBtn;
