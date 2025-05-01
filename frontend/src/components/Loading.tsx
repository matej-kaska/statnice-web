type LoadingProps = {
	upper?: boolean;
	modal?: boolean;
	className?: string;
};

const Loading = ({ upper = false, modal = false, className = "" }: LoadingProps) => {
	const sectionBase = "flex justify-center items-center overflow-auto pt-0";
	const fullHeight = "h-[calc(100svh-142px)]";
	const upperHeight = "h-[100px]";
	const modalSize = "h-[40vh] w-[40vw]";

	return (
		<section className={[sectionBase, modal ? modalSize : fullHeight, upper ? upperHeight : "", className ? className : ""].filter(Boolean).join(" ")}>
			<span
				className="
          w-12 h-12
          border-[5px] border-main
          border-b-transparent
          rounded-full
          inline-block
          box-border
          animate-spin
        "
			/>
		</section>
	);
};

export default Loading;
