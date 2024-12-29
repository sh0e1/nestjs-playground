import { plainToInstance } from 'class-transformer';
import { IsEnum, IsPort, validateSync } from 'class-validator';

export const Environment = {
  Development: 'development',
  Production: 'production',
  Test: 'test',
};
export type Environment = (typeof Environment)[keyof typeof Environment];

class Configuration {
  @IsEnum(Environment)
  env: Environment;

  @IsPort()
  port: string;
}

export const isEnvDevelopment = (env: Environment): boolean => {
  return env === Environment.Development;
};

export const isEnvTest = (env: Environment): boolean => {
  return env === Environment.Test;
};

export const load = () => {
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

export default load;
