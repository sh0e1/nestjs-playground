import { plainToInstance } from 'class-transformer';
import { IsEnum, IsPort, validateSync } from 'class-validator';

const Environment = {
  Development: 'development',
  Production: 'production',
  Test: 'test',
};
type Environment = (typeof Environment)[keyof typeof Environment];

class Configuration {
  @IsEnum(Environment)
  env: Environment;

  @IsPort()
  port: string;
}

export default () => {
  const config = {
    env: process.env.NODE_ENV || Environment.Development,
    port: process.env.PORT || '3000',
  };

  const validateConfig = plainToInstance(Configuration, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validateConfig);
  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return config;
};
