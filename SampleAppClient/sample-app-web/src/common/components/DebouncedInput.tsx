import * as React from 'react';
import {
  HTMLInputProps,
  IInputGroupProps,
  InputGroup,
} from '@blueprintjs/core';
import { debounce } from 'lodash';

export interface IDebouncedInputProps {
  textValue: string;
  waitTime: number;
  onTextValueChanged: (textValue: string) => void;
  inputGroupProps: IInputGroupProps & HTMLInputProps;
}

interface IDebouncedInputLocalState {
  textValue: string;
}

export class DebouncedInput extends React.PureComponent<
  IDebouncedInputProps,
  IDebouncedInputLocalState
> {
  private debouncedOnTextValueChanged = debounce(
    this.props.onTextValueChanged,
    this.props.waitTime
  );

  constructor(props: IDebouncedInputProps) {
    super(props);
    this.state = {
      textValue: this.props.textValue,
    };
  }
  public render() {
    return (
      <InputGroup
        {...this.props.inputGroupProps}
        onChange={this.onInputGroupTextChanged}
      />
    );
  }

  private onInputGroupTextChanged = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const textValue = e.target.value;
    this.setState({ textValue });
    this.debouncedOnTextValueChanged(textValue);
  };
}
