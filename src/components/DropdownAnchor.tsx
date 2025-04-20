import React, { useLayoutEffect, useRef, useState } from "react";

interface DropdownAnchorProps {
  inputRef: React.RefObject<HTMLInputElement | null>;
  children: React.ReactNode;
}

const DropdownAnchor: React.FC<DropdownAnchorProps> = ({ inputRef, children }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({ display: "none" });

  useLayoutEffect(() => {
    const updatePosition = () => {
      const input = inputRef.current;
      if (input) {
        const rect = input.getBoundingClientRect();
        setStyle({
          position: "fixed",
          left: rect.left,
          top: rect.bottom + 15, // 4px gap
          width: rect.width,
          zIndex: 1200,
          maxHeight: "18rem",
          overflowY: "auto",
        });
      } else {
        setStyle({ display: "none" });
      }
    };
    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [inputRef]);

  return (
    <div ref={dropdownRef} style={style} className="bg-white border border-gray-200 rounded-xl shadow-lg max-h-72 overflow-y-auto">
      {children}
    </div>
  );
};

export default DropdownAnchor;
