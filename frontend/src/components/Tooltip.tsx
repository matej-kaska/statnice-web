import { Popover, PopoverButton, PopoverPanel, Transition } from "@headlessui/react";
import { Fragment, type PropsWithChildren } from "react";

type TooltipProps = PropsWithChildren<{
  text?: string;
}>;

const Tooltip = ({ text, children }: TooltipProps) => {
  return (
    <Popover className="relative flex">
      {({ open }) => (
        <>
          <PopoverButton
            className="p-0 hover:border-transparent focus:outline-none"
          >
            {children}
          </PopoverButton>

          <Transition
            show={open}
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <PopoverPanel
              className="
                absolute z-10
                bg-white rounded-md
                p-2
                select-none
                text-sm
                max-w-[16rem] min-w-[14rem]
                -top-1/2 left-1/2
                transform -translate-x-1/2 -translate-y-full
                shadow-[0px_0px_15px_3px_rgba(0,0,0,0.1)]
                whitespace-nowrap
              "
            >
              {text}
            </PopoverPanel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

export default Tooltip;
