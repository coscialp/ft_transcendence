export type User = {
	id: string,
	username: string,
	password: string | null,
	firstName: string,
	lastName: string,
	nickName: string,
	isLogged: boolean,
	profileImage: string,
	email: string,
}