import { gql } from '@apollo/client';

export const REGISTER_MUTATION = gql`
  mutation Register($data: CreateUserDto!) {
    register(data: $data) {
      id
      email
      fullName
      role
      universityId
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($data: LoginInput!) {
    login(data: $data) {
      accessToken
      email
      fullName
      role
    }
  }
`;

export const GET_ALL_USERS_QUERY = gql`
  query GetAllUsers {
    getAllUsers {
      id
      email
      fullName
      universityId
      role
      isEmailVerified
      createdAt
      updatedAt
    }
  }
`;

export const GET_USER_BY_EMAIL_QUERY = gql`
  query GetUserByEmail($email: String!) {
    getUserByEmail(email: $email) {
      id
      email
      fullName
      universityId
      role
      isEmailVerified
      createdAt
      updatedAt
    }
  }
`;

export const APPROVE_DRIVER_MUTATION = gql`
  mutation ApproveDriver($userId: String!) {
    approveDriver(userId: $userId)
  }
`;

export const REJECT_DRIVER_MUTATION = gql`
  mutation RejectDriver($userId: String!) {
    RejectDriver(userId: $userId)
  }
`;
