import cn from 'classnames';
import React from 'react';
import { LiteralUnion, RegisterOptions, useFormContext } from 'react-hook-form';

type Validation = LiteralUnion<keyof RegisterOptions, string>;

interface ErrorMessageProps<T> {
  field: keyof T;
  messages: Partial<Record<Validation, string>>;
  className?: string;
}

export function ErrorMessage<T>({ field, messages, className }: ErrorMessageProps<T>) {
  const { formState } = useFormContext<T>();
  const error = formState.errors[field];

  if (!error) {
    return null;
  }

  return (
    <p className={cn('text-xs text-red-500', className)}>
      {messages[error.type as Validation]}
    </p>
  )
}