import cn from 'classnames';
import React from 'react';
import { FieldValues, LiteralUnion, RegisterOptions, useFormContext } from 'react-hook-form';

type Validation = LiteralUnion<keyof RegisterOptions, string>;

interface ErrorMessageProps<T extends FieldValues> {
  field: keyof T;
  messages: Partial<Record<Validation, string>>;
  className?: string;
}

export function ErrorMessage<T extends FieldValues>({ field, messages, className }: ErrorMessageProps<T>) {
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