import Button from "@/components/Button";
import { useModal } from "@/contexts/ModalContext";

type GeneralModalProps = {
	text: string;
	actionOnClick: () => void;
};

const GeneralModal = ({ text, actionOnClick }: GeneralModalProps) => {
	const { closeModal } = useModal();

	return (
		<div className="flex flex-col justify-start items-center min-w-16 gap-4 w-full max-w-[40rem]">
			<h1 className="font-semibold text-md">{text}</h1>
			<div className="flex justify-between items-center gap-4">
				<Button onClick={closeModal} color="blue">
					Cancel
				</Button>
				<Button
					onClick={() => {
						actionOnClick();
						closeModal();
					}}
					color="primary"
				>
					Accept
				</Button>
			</div>
		</div>
	);
};

export default GeneralModal;
