export type MessageType = {
	id: number;
	date: string;
	sender: string | undefined;
	content: string;
	avatar: string | undefined;
    receiver?: string | undefined;
}

export type PrivateMessageType = {
	id: number;
	date: string;
	sender: string | undefined;
	body: string;
	avatar: string | undefined;
    receiver?: string | undefined;
}