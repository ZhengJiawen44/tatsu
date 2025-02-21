export interface RegisterFormProp {
  fname: string;
  lname?: string;
  email: string;
  password: string;
}
export interface LoginFormProp {
  email: string;
  password: string;
}

export interface NoteItemType {
  id: string;
  name: string;
  content?: string;
  createdAt: Date;
}

export interface TodoItemType {
  id: string;
  title: string;
  description?: string;
  pinned: boolean;
  createdAt: Date;
  completed: boolean;
}
