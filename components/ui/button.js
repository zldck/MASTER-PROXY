// components/ui/button.js
export function Button({ children, ...props }) {
  return (
    <button className="px-4 py-2 rounded bg-white text-black hover:bg-gray-300 transition" {...props}>
      {children}
    </button>
  );
}
