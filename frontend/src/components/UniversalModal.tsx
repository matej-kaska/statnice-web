import { useModal } from "@/contexts/ModalContext";
import useWindowSize from "@/utils/useWindowSize";
import { type PropsWithChildren, useEffect, useRef, useState } from "react";

const UniversalModal = ({ children }: PropsWithChildren) => {
	const { closeModal } = useModal();
	const ref = useRef<HTMLDivElement>(null);
	const windowSize = useWindowSize();
	const [height, setHeight] = useState(0);

	const handleOutsideContentClick = () => {
		const active = document.activeElement;
		if (active?.tagName === "INPUT" || active?.tagName === "TEXTAREA") return;
		const saveBtn = document.querySelector<HTMLButtonElement>("#saveButton");
		if (saveBtn) saveBtn.click();
		closeModal();
	};

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") closeModal();
		};
		document.addEventListener("keydown", onKey);
		return () => document.removeEventListener("keydown", onKey);
	}, [closeModal]);

	useEffect(() => {
		const ro = new ResizeObserver((entries) => {
			for (const ent of entries) {
				setHeight(ent.contentRect.height);
			}
		});
		if (ref.current) ro.observe(ref.current);
		return () => {
			if (ref.current) ro.unobserve(ref.current);
		};
	}, []);

	return (
		<aside
			onClick={handleOutsideContentClick}
			className={`
        fixed inset-0 z-100
        w-full h-screen
        overflow-auto
        bg-black/40
        flex justify-center
        ${height > windowSize?.[1] ? "items-start" : "items-center"}
        scrollbar-thin
        scrollbar-track-gray-200
        scrollbar-thumb-gray-400
        hover:scrollbar-thumb-gray-500
      `}
		>
			<div
				ref={ref}
				onClick={(e) => e.stopPropagation()}
				className={`
          flex flex-col
          bg-white
          border border-[#777777]
          w-fit
          p-4
          rounded-md
          items-end
          justify-between
        `}
			>
				{children}
			</div>
		</aside>
	);
};

export default UniversalModal;
