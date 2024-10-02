const ToastMessage = ({
  error = true,
  message,
}: {
  error?: boolean;
  message: string;
}) => {
  return (
    <div
      className={`flex align-middle px-4 ${error?"bg-red-200":"bg-teal-50"} rounded-full border-1 ${
        error ? "border-red-500" : "border-teal-primary"
      }`}
    >
      <p className={`py-3 m-0 ${error?"text-red-800":"text-teal-800"} font-book`}>{message}</p>
    </div>
  );
};

export default ToastMessage;
