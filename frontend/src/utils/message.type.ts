export type MessageType = {
	id: number;
	sentAt: string;
	sender: string | undefined;
	body: string;
	avatar: string | undefined;
    receiver?: string | undefined;
}