// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

export type User = {
  userId?: string;
  username?: string;
  firstname?: string;
  lastname?: string;
};

export type AuthenticateRequest = {
  username: string;
  password: string;
};

export type AuthenticateResponse = {
  accessToken: string;
  userId: string;
};
