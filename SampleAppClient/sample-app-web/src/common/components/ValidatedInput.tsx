import * as React from 'react';
import {
  HTMLInputProps,
  IInputGroupProps,
  InputGroup,
  Intent,
} from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';

interface IProps {
  textValue: string;
  isTextValueValid: (textValue: string) => boolean;
  onTextValueChanged: (textValue: string) => void;
}
export type IRequiredInputProps = IProps & IInputGroupProps & HTMLInputProps;

export class ValidatedInput extends React.PureComponent<
  IRequiredInputProps,
  object
> {
  public render() {
    const {
      textValue,
      isTextValueValid,
      onTextValueChanged,
      ...inputGroupProps
    } = this.props;
    const isTextValid = isTextValueValid(textValue);
    return (
      <InputGroup
        value={textValue}
        leftIcon={isTextValid ? IconNames.TICK_CIRCLE : IconNames.ERROR}
        intent={isTextValid ? Intent.SUCCESS : Intent.DANGER}
        {...inputGroupProps}
        onChange={this.onInputGroupTextChanged}
      />
    );
  }

  private onInputGroupTextChanged = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const textValue = e.target.value;
    this.props.onTextValueChanged(textValue);
  };
}
