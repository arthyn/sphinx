import React, { Component, KeyboardEventHandler, useCallback, useState } from 'react';

import CreatableSelect from 'react-select/creatable';
import { ActionMeta, components, ControlProps, MultiValue, MultiValueGenericProps, MultiValueRemoveProps, OnChangeValue } from 'react-select';
import { XIcon } from '@heroicons/react/solid';

export interface Option {
  readonly label: string;
  readonly value: string;
}

const createOption = (label: string) => ({
  label,
  value: label,
});

function Control({ children, ...props }: ControlProps<Option, true>) {
  return (
    <components.Control
      {...props}
      className="flex items-center w-full py-1 px-2 bg-fawn/30 focus:outline-none focus:ring-2 ring-lavender rounded-lg border border-fawn/30 cursor-text text-mauve"
    >
      {children}
    </components.Control>
  );
}

function TagContainer({
  children,
  ...props
}: MultiValueGenericProps<Option, true>) {
  return (
    <components.MultiValueContainer {...props}>
      <div className="flex">{children}</div>
    </components.MultiValueContainer>
  );
}

function TagLabel({ data }: { data: Option }) {
  const { value, label } = data;
  return (
    <div className="flex h-6 items-center rounded-l bg-lavender text-linen">
      <span className="p-1 font-semibold">{label || value}</span>
    </div>
  );
}

function TagRemove(props: MultiValueRemoveProps<Option, true>) {
  return (
    <components.MultiValueRemove {...props}>
      <div className="flex h-full items-center rounded-r bg-lavender pr-1">
        <XIcon className="h-4 w-4 text-linen" />
      </div>
    </components.MultiValueRemove>
  );
}

interface TagFieldProps {
  tags: MultiValue<Option>;
  onTags: (tags: MultiValue<Option>) => void;
  className?: string;
}

export const TagField = ({ tags, onTags, className }: TagFieldProps) => {
  const [input, setInput] = useState('');

  const handleChange = useCallback((
    value: OnChangeValue<Option, true>,
    actionMeta: ActionMeta<Option>
  ) => {
    console.group('Value Changed');
    console.log(value);
    console.log(`action: ${actionMeta.action}`);
    console.groupEnd();
    onTags(value);
  }, []);

  const handleInputChange = useCallback((value) => {
    setInput(value);
  }, []);

  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = useCallback((event) => {
    if (!input) return;

    switch (event.key) {
      case 'Enter':
      case 'Tab':
        console.group('Value Added');
        console.log(tags);
        console.groupEnd();

        setInput('');
        onTags([...tags, createOption(input)])
        event.preventDefault();
    }
  }, [input, tags]);

  return (
    <CreatableSelect<Option, true>
      className={className}
      components={{
        ...components,
        Control,
        MultiValueContainer: TagContainer,
        MultiValueLabel: TagLabel,
        MultiValueRemove: TagRemove,
        DropdownIndicator: null
      }}
      styles={{
        control: (base) => ({}),
        input: (base) => ({
          ...base,
          padding: 0,
          margin: 0,
        }),
        clearIndicator: (base) => ({
          ...base,
          cursor: 'pointer',
          padding: 0
        }),
        multiValue: (base) => ({
          ...base,
          backgroundColor: '',
          margin: '0 2px',
        }),
        multiValueRemove: (base) => ({
          ...base,
          paddingRight: '',
          paddingLeft: '',
          '&:hover': {
            color: 'inherit',
            backgroundColor: 'inherit',
          },
        }),
        valueContainer: (base) => ({
          ...base,
          padding: 0
        })
      }}
      inputValue={input}
      isClearable
      isMulti
      menuIsOpen={false}
      onChange={handleChange}
      onInputChange={handleInputChange}
      onKeyDown={handleKeyDown}
      placeholder="Type something and press enter..."
      value={tags}
    />
  );
}