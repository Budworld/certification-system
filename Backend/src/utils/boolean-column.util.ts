import { ColumnOptions } from 'typeorm';

export declare class BooleanColumnOptionsOverride {
  nullable?: boolean;
  default?: boolean;
}

export const bitTransformer = {
  from: (v: Buffer) => !!v?.readInt8(0),
  to: (v: any) => v,
};

export const booleanColumn = (name: string, override?: BooleanColumnOptionsOverride): ColumnOptions => {
  const options = {
    type: 'bit',
    name: name,
    nullable: override ? override.nullable === true : false,
    transformer: bitTransformer,
  };

  if (override && override.default) {
    Object.assign(options, { default: override.default === true });
  }

  return options as ColumnOptions;
};
