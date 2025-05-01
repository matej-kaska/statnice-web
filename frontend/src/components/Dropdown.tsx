import Chevron from "@/assets/images/chevron.svg?react";
import { Popover, PopoverButton, PopoverPanel, Transition } from "@headlessui/react";
import type React from "react";
import { Fragment, type ReactNode } from "react";

type DropdownProps = {
	buttonChildren: ReactNode;
	panelChildren: (props: { close: () => void }) => ReactNode;
	buttonClassName?: string;
	panelClassName?: string;
	text?: string;
	className?: string;
	buttonDisabled?: boolean;
	buttonRef?: React.RefObject<HTMLButtonElement>;
};

const Dropdown = ({ className = "", buttonChildren, panelChildren, buttonClassName = "", panelClassName = "", buttonDisabled = false, buttonRef }: DropdownProps) => {
	return (
		<Popover className={`relative w-fit ${className}`}>
			{({ open, close }) => (
				<>
					<PopoverButton
						className={`pl-4 pr-2 py-1 rounded bg-main-gradient
              font-medium text-white
              outline-none hover:brightness-90 flex items-center align-middle gap-2 ${buttonDisabled ? "cursor-not-allowed text-gray-500" : ""} ${open ? "shadow rounded-b-none" : ""} focus: ${buttonClassName}`}
						disabled={buttonDisabled}
						type="button"
						ref={buttonRef}
					>
						{buttonChildren}
						<Chevron className={`ml-auto w-3 mt-[2px] transition ease-in-out duration-300 ${open ? "rotate-180" : ""}`} />
					</PopoverButton>

					<Transition show={open} as={Fragment} enter="transition ease-out duration-200" enterFrom="opacity-0 translate-y-1" enterTo="opacity-100 translate-y-0" leave="transition ease-in duration-150" leaveFrom="opacity-100 translate-y-0" leaveTo="opacity-0 translate-y-1">
						<PopoverPanel className={`flex font-medium flex-col shadow-md rounded-lg rounded-t-none absolute z-10 w-full select-none text-white ${panelClassName}`}>{panelChildren({ close })}</PopoverPanel>
					</Transition>
				</>
			)}
		</Popover>
	);
};

export default Dropdown;
