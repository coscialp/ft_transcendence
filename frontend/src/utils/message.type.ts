export type MessageType = {
	id: number;
	date: string;
	sender: string | undefined;
	content: string;
	avatar: string | undefined;
    receiver?: string | undefined;
}