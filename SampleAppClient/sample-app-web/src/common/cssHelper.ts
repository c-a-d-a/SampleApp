export function concatClassNames(
  className: string | undefined,
  ...rest: string[]
) {
  return [...(className ? [className] : []), ...rest].join(' ');
}
