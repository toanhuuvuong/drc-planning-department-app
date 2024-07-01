/**
 * Generated by orval v6.31.0 🍺
 * Do not edit manually.
 * pkh-api
 * pkh api
 * OpenAPI spec version: 0.0.1
 */
import { useMutation } from '@tanstack/react-query';
import type { MutationFunction, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import type { AuthenticationControllerLogin200, CredentialsWithRelations } from '../../models';
import { drcInstance } from '../../../configs/mutator/drc-instance';
import type { ErrorType } from '../../../configs/mutator/drc-instance';

export const authenticationControllerLogin = (credentialsWithRelations: CredentialsWithRelations) => {
  return drcInstance<AuthenticationControllerLogin200>({
    url: `/users/login`,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: credentialsWithRelations,
  });
};

export const getAuthenticationControllerLoginMutationOptions = <
  TError = ErrorType<unknown>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof authenticationControllerLogin>>,
    TError,
    { data: CredentialsWithRelations },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof authenticationControllerLogin>>,
  TError,
  { data: CredentialsWithRelations },
  TContext
> => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof authenticationControllerLogin>>,
    { data: CredentialsWithRelations }
  > = (props) => {
    const { data } = props ?? {};

    return authenticationControllerLogin(data);
  };

  return { mutationFn, ...mutationOptions };
};

export type AuthenticationControllerLoginMutationResult = NonNullable<
  Awaited<ReturnType<typeof authenticationControllerLogin>>
>;
export type AuthenticationControllerLoginMutationBody = CredentialsWithRelations;
export type AuthenticationControllerLoginMutationError = ErrorType<unknown>;

export const useAuthenticationControllerLogin = <TError = ErrorType<unknown>, TContext = unknown>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof authenticationControllerLogin>>,
    TError,
    { data: CredentialsWithRelations },
    TContext
  >;
}): UseMutationResult<
  Awaited<ReturnType<typeof authenticationControllerLogin>>,
  TError,
  { data: CredentialsWithRelations },
  TContext
> => {
  const mutationOptions = getAuthenticationControllerLoginMutationOptions(options);

  return useMutation(mutationOptions);
};
