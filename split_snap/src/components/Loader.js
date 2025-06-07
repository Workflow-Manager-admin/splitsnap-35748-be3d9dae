/**
 * Loader spinner for loading states.
 */
export default function Loader() {
  return (
    <div className="flex items-center justify-center w-full h-[60vh]">
      <div className="inline-block w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin" />
    </div>
  );
}
