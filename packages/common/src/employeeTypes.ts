export type CreateEmployee = {
  email: string;
  firstName: string;
  lastName: string;
};

export type UpdateEmployee = {
  email: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  department: string;
  birthday: Date;
  phoneNumber: string;
};
